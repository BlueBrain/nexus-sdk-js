import { Observable } from '@bbp/nexus-link';
import { Fetchers, Resource } from '../types';
import {
  GetSchemaOptions,
  ListSchemaOptions,
  SchemaList,
  SchemaOptions,
  SchemaPayload,
} from './types';
import { NexusContext } from '../nexusSdk';
import { buildHeader, buildQueryParams, parseAsBuilder } from '../utils';

const Schema = (
  { httpGet, httpPost, httpPut, httpDelete, poll }: Fetchers,
  context: NexusContext,
) => {
  return {
    get: (
      orgLabel: string,
      projectLabel: string,
      schemaId: string,
      options?: GetSchemaOptions,
    ): Promise<Resource> => {
      const { as = 'json', ...opts } = options || {};
      const parseAs = parseAsBuilder(as);

      return httpGet({
        headers: { Accept: buildHeader(as) },
        path: `${
          context.uri
        }/schemas/${orgLabel}/${projectLabel}/${schemaId}${buildQueryParams(
          opts,
        )}`,
        context: {
          parseAs,
        },
      });
    },
    list: (
      orgLabel: string,
      projectLabel: string,
      options?: ListSchemaOptions,
    ): Promise<SchemaList> => {
      const opts = buildQueryParams(options);
      return httpGet({
        path: `${context.uri}/schemas/${orgLabel}/${projectLabel}${opts}`,
      });
    },
    create: (
      orgLabel: string,
      projectLabel: string,
      payload: SchemaPayload,
      options: SchemaOptions = { execution: 'consistent' },
    ): Promise<Resource> => {
      const opts = buildQueryParams(options);
      return httpPost({
        path: `${context.uri}/schemas/${orgLabel}/${projectLabel}${opts}`,
        body: JSON.stringify(payload),
      });
    },
    update: (
      orgLabel: string,
      projectLabel: string,
      schemaId: string,
      rev: number,
      payload: SchemaPayload,
      options: SchemaOptions = { execution: 'consistent' },
    ): Promise<Resource> => {
      const opts = buildQueryParams({ ...options, rev });
      return httpPut({
        path: `${context.uri}/schemas/${orgLabel}/${projectLabel}/${schemaId}${opts}`,
        body: JSON.stringify(payload),
      });
    },
    tag: (
      orgLabel: string,
      projectLabel: string,
      schemaId: string,
      rev: number,
      payload: {
        tag: string;
        rev: number;
      },
      options: SchemaOptions = { execution: 'consistent' },
    ): Promise<Resource> => {
      const opts = buildQueryParams({ ...options, rev });
      return httpPost({
        path: `${context.uri}/schemas/${orgLabel}/${projectLabel}/${schemaId}${opts}`,
        body: JSON.stringify(payload),
      });
    },
    deprecate: (
      orgLabel: string,
      projectLabel: string,
      schemaId: string,
      rev: number,
      options: SchemaOptions = { execution: 'consistent' },
    ): Promise<Resource> => {
      const opts = buildQueryParams({ ...options, rev });
      return httpDelete({
        path: `${context.uri}/schemas/${orgLabel}/${projectLabel}/${schemaId}${opts}`,
      });
    },
    poll: (
      orgLabel: string,
      projectLabel: string,
      schemaId: string,
      options?: GetSchemaOptions & { pollIntervalMs: number },
    ): Observable<Resource> => {
      const { pollIntervalMs, ...getSchemaOptions } = options;
      return poll({
        path: `${
          context.uri
        }/schemas/${orgLabel}/${projectLabel}/${schemaId}${buildQueryParams(
          getSchemaOptions,
        )}`,
        context: { pollIntervalMs: options && options.pollIntervalMs | 1000 },
      });
    },
  };
};

export default Schema;
