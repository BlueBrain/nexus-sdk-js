import { httpPost } from '../../utils/http';
import { PaginatedList, PaginationSettings } from '../../utils/types';
import Resource, { ResourceResponseCommon } from '../../Resource';

// This is an Elastic Search Mapping
// https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping.html
export interface Mapping {
  dynamic?: boolean;
  properties: {
    [key: string]: any;
  };
}

// List of SingleElasticSearchViews aggregated into an AggregateElasticSearchView
export type ViewsInAggregate = {
    project: string;
    viewId: string;
}[];

// When getting a ESView by ID.
export interface ElasticSearchViewResponse {
  '@id': string;
  '@type': string[];
  _uuid: string;
  _rev: number;
  _deprecated: boolean;
}

export interface SingleElasticSearchViewResponse extends ElasticSearchViewResponse {
  includeMetadata: boolean;
  mapping: Mapping;
  sourceAsText: boolean;
}

export interface AggregateElasticSearchViewResponse extends ElasticSearchViewResponse {
  views: ViewsInAggregate;
}

// Original Source is an optional setting from Elastic Search Views configured with
// the 'sourceInText' field set to true, which is the default behavior
export interface ElasticSearchResourceResponse extends ResourceResponseCommon {
  _original_source?: string;
}

export interface ElasticSearchHit {
  _score: number;
  _id: string;
  _index: string;
  _source: ElasticSearchResourceResponse;
  _type: string;
}

export class ViewQueryError extends Error {}

// This represents the vanilla Elastic Search response
export interface ElasticSearchViewQueryResponse {
  _shards: {
    failed: number;
    skipped: number;
    successful: number;
    total: number;
  };
  hits: {
    hits: ElasticSearchHit[];
    max_score: number;
    total: number;
  };
  timed_out: boolean;
  took: number;
}

export interface Bucket {
  key: string;
  doc_count: number;
}

export interface ElasticSearchViewAggregationResponse {
  aggregations: {
    [key: string]: {
      doc_count_error_upper_bound: number;
      sum_other_doc_count: number;
      buckets: Bucket[];
    };
  };
}

export default class ElasticSearchView {
  id: string;
  type: string[];
  uuid: string;
  rev: number;
  deprecated: boolean;
  orgLabel: string;
  projectLabel: string;
  queryURL: string;
  constructor(
    orgLabel: string,
    projectLabel: string,
    elasticSearchViewResponse: ElasticSearchViewResponse,
  ) {
    this.orgLabel = orgLabel;
    this.projectLabel = projectLabel;
    this.id = elasticSearchViewResponse['@id'];
    this.type = elasticSearchViewResponse['@type'];
    this.uuid = elasticSearchViewResponse['_uuid'];
    this.rev = elasticSearchViewResponse['_rev'];
    this.deprecated = elasticSearchViewResponse['_deprecated'];
    this.queryURL = `/views/${this.orgLabel}/${this.projectLabel}/${
      this.id
    }/_search`;
  }

  /**
   * Convenience method to help in filtering a project by @Types
   *
   * @param {string[]} types
   * @param {PaginationSettings} [pagination]
   * @returns {Promise<PaginatedList<Resource>>}
   * @memberof ElasticSearchView
   */
  async filterByTypes(
    types: string[],
    pagination?: PaginationSettings,
  ): Promise<PaginatedList<Resource>> {
    const query = {
      query: {
        bool: {
          filter: types.map(type => ({ term: { '@type': type } })),
        },
      },
    };
    return await this.query(query, pagination);
  }

  /**
   * Convenience method to help in filtering a project by what
   * Schema that the resources are conforming to
   *
   * @param {string} constrainedBy
   * @param {PaginationSettings} [pagination]
   * @returns {Promise<PaginatedList<Resource>>}
   * @memberof ElasticSearchView
   */
  async filterByConstrainedBy(
    constrainedBy: string,
    pagination?: PaginationSettings,
  ): Promise<PaginatedList<Resource>> {
    const query = {
      query: {
        term: { _constrainedBy: constrainedBy },
      },
    };
    return await this.query(query, pagination);
  }

  /**
   * Search for resources located in a project
   * using an elastic search Query (as a JS Object) as input
   * https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html
   *
   * @param {Object} elasticSearchQuery
   * @param {PaginationSettings} [pagination]
   * @returns {Promise<PaginatedList<Resource>>}
   * @memberof ElasticSearchView
   */
  async query(
    elasticSearchQuery: Object,
    pagination?: PaginationSettings,
  ): Promise<PaginatedList<Resource>> {
    try {
      const requestURL = pagination
        ? `${this.queryURL}?from=${pagination.from}&size=${pagination.size}`
        : this.queryURL;

      const response: ElasticSearchViewQueryResponse = await httpPost(
        requestURL,
        elasticSearchQuery,
      );

      const total: number = response.hits.total;

      // Expand the data for each item in the list
      // By fetching each item by ID
      const results: Resource[] = await Promise.all(
        response.hits.hits.map(async resource => {
          return await Resource.getSelf(
            resource._source['_self'],
            this.orgLabel,
            this.projectLabel,
          );
        }),
      );

      return {
        total,
        results,
      };
    } catch (error) {
      throw new ViewQueryError(error.message);
    }
  }

  /**
   * Query aggregations in elastic search
   * using an elastic search Aggregation Query (as a JS Object) as input
   * https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-terms-aggregation.html
   *
   * @param {Object} ElasticSearchAggregationQuery
   * @returns {Promise<ElasticSearchViewAggregationResponse>}
   * @memberof ElasticSearchView
   */
  async aggregation(
    elasticSearchAggregationQuery: Object,
  ): Promise<ElasticSearchViewAggregationResponse> {
    try {
      // Aggregations don't have pagination, so we simply use the queryURL
      // unlike in the query method
      const requestURL = this.queryURL;

      const response: ElasticSearchViewAggregationResponse = await httpPost(
        requestURL,
        elasticSearchAggregationQuery,
      );
      return response;
    } catch (error) {
      throw new ViewQueryError(error.message);
    }
  }
}

export class SingleElasticSearchView extends ElasticSearchView {
  includeMetadata: boolean;
  mapping: Mapping;
  sourceAsText: boolean;
  constructor(
    orgLabel: string,
    projectLabel: string,
    elasticSearchViewResponse: SingleElasticSearchViewResponse,
  ) {
    super(orgLabel, projectLabel, elasticSearchViewResponse);
    this.includeMetadata = elasticSearchViewResponse['includeMetadata'];
    this.mapping = elasticSearchViewResponse['mapping'];
    this.sourceAsText = elasticSearchViewResponse['sourceAsText'];
  }
}

export class AggregateElasticSearchView extends ElasticSearchView {
  views: ViewsInAggregate;
  constructor(
    orgLabel: string,
    projectLabel: string,
    elasticSearchViewResponse: AggregateElasticSearchViewResponse,
  ) {
    super(orgLabel, projectLabel, elasticSearchViewResponse)
    this.views = elasticSearchViewResponse['views'];
  }
}
