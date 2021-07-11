import { Observable } from '@bbp/nexus-link';
import { Fetchers, Resource } from '../types';
import { NexusContext } from '../nexusSdk';
import {
  CreateViewOptions,
  DeprecateViewOptions,
  RestartProjectionOptions,
  RestartViewOptions,
  SparqlViewQueryResponse,
  Statistics,
  TagViewOptions,
  UpdateViewOptions,
  View,
  ViewList,
  ViewPayload,
} from './types';
import { buildHeader, buildQueryParams, parseAsBuilder } from '../utils';
import {
  GetResourceOptions,
  ResourceListOptions,
  PaginatedList,
} from '../Resource/types';

const View = (
  { httpGet, httpPost, httpPut, httpDelete, poll }: Fetchers,
  context: NexusContext,
) => {
  return {
    get: (
      orgLabel: string,
      projectLabel: string,
      viewId: string,
      options?: GetResourceOptions,
    ): Promise<View> => {
      const { as = 'json', ...opts } = options || {};
      const parseAs = parseAsBuilder(as);

      return httpGet({
        headers: { Accept: buildHeader(as) },
        path: `${
          context.uri
        }/views/${orgLabel}/${projectLabel}/${viewId}${buildQueryParams(opts)}`,
        context: {
          parseAs,
        },
      });
    },
    list: (
      orgLabel: string,
      projectLabel: string,
      options?: ResourceListOptions,
    ): Promise<ViewList> =>
      httpGet({
        path: `${
          context.uri
        }/views/${orgLabel}/${projectLabel}${buildQueryParams(options)}`,
      }),
    create: (
      orgLabel: string,
      projectLabel: string,
      payload: ViewPayload,
      options: CreateViewOptions = { execution: 'consistent' },
    ): Promise<Resource> => {
      const opts = buildQueryParams(options);
      return httpPost({
        path: `${context.uri}/views/${orgLabel}/${projectLabel}${opts}`,
        body: JSON.stringify(payload),
      });
    },
    update: (
      orgLabel: string,
      projectLabel: string,
      viewId: string,
      rev: number,
      payload: ViewPayload,
      options: UpdateViewOptions = { execution: 'consistent' },
    ): Promise<Resource> => {
      const opts = buildQueryParams({ ...options, rev });
      return httpPut({
        path: `${context.uri}/views/${orgLabel}/${projectLabel}/${viewId}${opts}`,
        body: JSON.stringify(payload),
      });
    },
    tag: (
      orgLabel: string,
      projectLabel: string,
      viewId: string,
      rev: number,
      payload: {
        tag: string;
        rev: number;
      },
      options: TagViewOptions = { execution: 'consistent' },
    ): Promise<Resource> => {
      const opts = buildQueryParams({ ...options, rev });
      return httpPost({
        path: `${context.uri}/views/${orgLabel}/${projectLabel}/${viewId}${opts}`,
        body: JSON.stringify(payload),
      });
    },
    deprecate: (
      orgLabel: string,
      projectLabel: string,
      viewId: string,
      rev: number,
      options: DeprecateViewOptions = { execution: 'consistent' },
    ): Promise<Resource> => {
      const opts = buildQueryParams({ ...options, rev });
      return httpDelete({
        path: `${context.uri}/views/${orgLabel}/${projectLabel}/${viewId}${opts}`,
      });
    },
    poll: (
      orgLabel: string,
      projectLabel: string,
      viewId: string,
      options?: GetResourceOptions & { pollIntervalMs: number },
    ): Observable<View> => {
      const { pollIntervalMs, ...getViewOptions } = options;
      return poll({
        path: `${
          context.uri
        }/views/${orgLabel}/${projectLabel}/${viewId}${buildQueryParams(
          getViewOptions,
        )}`,
        context: { pollIntervalMs: options && options.pollIntervalMs | 1000 },
      });
    },
    elasticSearchQuery: <T = any>(
      orgLabel: string,
      projectLabel: string,
      viewId: string,
      query: {},
      options?: {
        from: number;
        size: number;
      },
    ): Promise<T> => {
      const opts = buildQueryParams(options);
      return httpPost({
        path: `${context.uri}/views/${orgLabel}/${projectLabel}/${viewId}/_search${opts}`,
        body: JSON.stringify(query),
      });
    },
    sparqlQuery: (
      orgLabel: string,
      projectLabel: string,
      viewId: string,
      query: string,
    ): Promise<SparqlViewQueryResponse> => {
      return httpPost({
        path: `${context.uri}/views/${orgLabel}/${projectLabel}/${viewId}/sparql`,
        body: query,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    },
    restart: (
      orgLabel: string,
      projectLabel: string,
      viewId: string,
      options: RestartViewOptions = {
        execution: 'consistent',
      },
    ) => {
      const opts = buildQueryParams(options);
      return httpDelete({
        path: `${context.uri}/views/${orgLabel}/${projectLabel}/${viewId}/progress${opts}`,
      });
    },
    compositeElasticSearchQuery: <T = any>(
      orgLabel: string,
      projectLabel: string,
      viewId: string,
      projection_id: string,
      query: {},
      options?: {
        from: number;
        size: number;
      },
    ): Promise<T> => {
      const opts = buildQueryParams(options);
      return httpPost({
        path: `${context.uri}/views/${orgLabel}/${projectLabel}/${viewId}/projections/${projection_id}/_search${opts}`,
        body: JSON.stringify(query),
      });
    },
    compositeSparqlQuery: (
      orgLabel: string,
      projectLabel: string,
      viewId: string,
      projection_id: string,
      query: string,
    ): Promise<SparqlViewQueryResponse> => {
      return httpPost({
        path: `${context.uri}/views/${orgLabel}/${projectLabel}/${viewId}/projections/${projection_id}/sparql`,
        body: query,
        headers: {
          'Content-Type': 'application/sparql-query',
        },
      });
    },
    statistics: (
      orgLabel: string,
      projectLabel: string,
      viewId: string,
    ): Promise<PaginatedList<Statistics>> =>
      httpGet({
        path: `${context.uri}/views/${orgLabel}/${projectLabel}/${viewId}/statistics`,
      }),
    projectionStatistics: (
      orgLabel: string,
      projectLabel: string,
      viewId: string,
      projectionId: string,
    ): Promise<Statistics> =>
      httpGet({
        path: `${context.uri}/views/${orgLabel}/${projectLabel}/${viewId}/${projectionId}/statistics`,
      }),
    pollStatistics: (
      orgLabel: string,
      projectLabel: string,
      viewId: string,
      options?: { pollIntervalMs: number },
    ): Observable<Statistics> =>
      poll({
        path: `${context.uri}/views/${orgLabel}/${projectLabel}/${viewId}/statistics`,
        context: { pollIntervalMs: options && options.pollIntervalMs | 1000 },
      }),
    restartProjection: (
      orgLabel: string,
      projectLabel: string,
      viewId: string,
      projectionId: string,
      options: RestartProjectionOptions = { execution: 'consistent' },
    ): Promise<Resource> =>
      httpDelete({
        path: `${
          context.uri
        }/views/${orgLabel}/${projectLabel}/${viewId}/projections/${projectionId}${buildQueryParams(
          options,
        )}`,
      }),
  };
};

export default View;
