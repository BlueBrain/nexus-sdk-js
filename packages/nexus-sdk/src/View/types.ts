import { Resource, PaginatedList, Context, ExecutionOption } from '../types';

export type SparqlView = Resource & {
  '@id': ['SparqlView', 'View'];
  _uuid: string;
};
export type ElasticSearchView = Resource & {
  '@type': ['ElasticSearchView', 'View'];
  _uuid: string;
  mapping: {};
  sourceAsText?: boolean;
  includeMetadata?: boolean;
  includeDeprecated?: boolean;
  resourceSchemas?: string[];
  resourceTypes?: string[];
};
export type AggregatedElasticSearchView = Resource & {
  '@id': ['AggregatedElasticSearchView', 'View'];
  _uuid: string;
  views: { project: string; viewId: string }[];
};

export type AggregatedSparqlView = Resource & {
  '@id': ['AggregatedSparqlView', 'View'];
  _uuid: string;
  views: { project: string; viewId: string }[];
};

export type View =
  | SparqlView
  | ElasticSearchView
  | CompositeView
  | AggregatedElasticSearchView
  | AggregatedSparqlView;
export type ViewList = PaginatedList<View>;

export type ElasticSearchExplanation = {
  value: number;
  description: string;
  details: ElasticSearchExplanation[];
};

export type CreateViewOptions = ExecutionOption & {};
export type UpdateViewOptions = ExecutionOption & {};
export type TagViewOptions = ExecutionOption & {};
export type DeprecateViewOptions = ExecutionOption & {};
export type RestartViewOptions = ExecutionOption & {};
export type RestartProjectionOptions = ExecutionOption & {};

export type ElasticSearchViewQueryResponse<T> = {
  hits: {
    max_score: number;
    total?: {
      relation: 'eq' | 'gte';
      value: number;
    };
    hits: {
      _score: number;
      _id: string;
      _index: string;
      _source: T;
      _type: string;
      _version?: number;
      _explanation?: ElasticSearchExplanation[];
      fields?: any;
      highlight?: any;
      inner_hits?: any;
      matched_queries?: string[];
      sort?: string[];
    }[];
  };
  timed_out: boolean;
  took: number;
  _shards: {
    failed: number;
    skipped: number;
    successful: number;
    total: number;
  };
  aggregations?: any;
  _scroll_id?: string;
};

export type Binding = {
  [key: string]: {
    type: 'uri' | 'litteral' | 'bnode';
    value: string;
    datatype?: string;
    'xml:lang'?: string;
  };
};

export type AskQueryResponse = {
  head: {
    link?: string[];
  };
  boolean: boolean;
};

export type SelectQueryResponse = {
  head: {
    vars: string[];
    link?: string[];
  };
  results: {
    bindings: Binding[];
  };
};

export type SparqlViewQueryResponse = SelectQueryResponse | AskQueryResponse;

export type ElasticSearchViewPayload = {
  '@id'?: string;
  '@type': ['ElasticSearchView'];
  mapping: {};
  sourceAsText?: boolean;
  includeMetadata?: boolean;
  includeDeprecated?: boolean;
  resourceSchemas?: string | string[];
  resourceTypes?: string | string[];
};

export type AggregatedElasticSearchViewPayload = {
  '@context'?: Context;
  '@id'?: string;
  '@type': ['AggregatedElasticSearchView'];
  views: { project: string; viewId: string }[];
};

export type SparqlViewPayload = {
  '@id'?: string;
  '@type': ['SparqlView'];
  includeMetadata?: boolean;
  includeDeprecated?: boolean;
  resourceSchemas?: string[];
  resourceTypes?: string[];
  resourceTag?: string[];
};

export type AggregatedSparqlViewPayload = {
  '@context'?: Context;
  '@id?': string;
  '@type': ['AggregatedSparqlView'];
  views: { project: string; viewId: string }[];
};

type RebuildStrategyType = {
  '@type': 'Interval';
  value: {};
};

export type CompositeView = Resource & {
  '@type': ['CompositeView', 'Beta', 'View'];
  _uuid: string;
  sources: (
    | ProjectEventStreamSource
    | CrossProjectEventStreamSource
    | RemoteProjectEventStreamSource)[];
  projections: (Projection | ElasticSearchProjection)[];
  rebuildStrategy?: RebuildStrategyType;
};

export type CrossProjectEventStreamSource = Source & {
  '@type': 'CrossProjectEventStream';
  project: string;
  identities: {}[];
};

export type RemoteProjectEventStreamSource = Source & {
  '@type': 'RemoteProjectEventStream';
  endpoint: string;
  project: string;
  token?: string;
};

export type ProjectEventStreamSource = Source & {
  '@type': 'ProjectEventStream';
};

export type Source = {
  '@id': string;
  includeDeprecated?: boolean;
  resourceSchemas?: string[];
  resourceTypes?: string[];
  resourceTag?: string;
};

export type ElasticSearchProjection = Projection & {
  mapping: {};
  context: Context;
};

export type Projection = {
  '@id': string;
  '@type': 'ElasticSearchProjection' | 'SparqlProjection';
  query: string;
  resourceSchemas?: string[];
  resourceTypes?: string[];
  resourceTag?: string;
  includeMetadata?: boolean;
  includeDeprecated?: boolean;
};

export type CompositeViewPayload = {
  '@id'?: string;
  '@type': ['CompositeView', 'Beta'];
  sources: (
    | ProjectEventStreamSource
    | CrossProjectEventStreamSource
    | RemoteProjectEventStreamSource)[];
  projections: (Projection | ElasticSearchProjection)[];
  rebuildStrategy?: RebuildStrategyType;
};

export type ViewPayload =
  | ElasticSearchViewPayload
  | AggregatedElasticSearchViewPayload
  | CompositeViewPayload
  | SparqlViewPayload
  | AggregatedSparqlViewPayload;

export type Statistics = {
  '@context': string;
  delayInSeconds: number;
  discardedEvents: number;
  evaluatedEvents: number;
  lastEventDateTime: string;
  lastProcessedEventDateTime: string;
  processedEvents: number;
  remainingEvents: number;
  totalEvents: number;
  values?: {
    '@type': 'ViewStatistics';
    sourceId: string;
    projectionId: string;
    totalEvents: number;
    processedEvents: number;
    evaluatedEvents: number;
    remainingEvents: number;
    discardedEvents: number;
    failedEvents: number;
    delayInSeconds: number;
    lastEventDateTime: Date;
    lastProcessedEventDateTime: Date;
  }[];
};
