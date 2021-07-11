import { Observable } from '@bbp/nexus-link';
import {
  GetFileOptions,
  NexusFile,
  FilePayload,
  LinkFilePayload,
  UpdateFilePayload,
  CreateFileOptions,
  LinkFileOptions,
  UpdateFileOptions,
  DeprecateFileOptions,
  TagFileOptions,
} from './types';
import { buildHeader, buildQueryParams, parseAsBuilder } from '../utils';
import {
  PaginatedList,
  ResourceListOptions,
  TagResourcePayload,
  GetResourceOptions,
} from '../Resource/types';
import { Fetchers } from '../types';
import { NexusContext } from '../nexusSdk';

const NexusFile = (
  { httpGet, httpPost, httpPut, httpDelete, poll }: Fetchers,
  context: NexusContext,
) => {
  return {
    get: (
      orgLabel: string,
      projectLabel: string,
      fileId: string,
      options?: GetFileOptions,
    ): Promise<NexusFile | Blob | string | FormData> => {
      const { as = 'json', ...opts } = options || {};
      const parseAs = parseAsBuilder(as);
      const headers =
        as === 'json' || as === 'vnd.graph-viz' || as === 'n-triples'
          ? { Accept: buildHeader(as) }
          : {};

      return httpGet({
        headers,
        path: `${
          context.uri
        }/files/${orgLabel}/${projectLabel}/${fileId}${buildQueryParams(opts)}`,
        context: {
          parseAs,
        },
      });
    },

    list: (
      orgLabel: string,
      projectLabel: string,
      options?: ResourceListOptions,
    ): Promise<PaginatedList<NexusFile>> => {
      const opts = buildQueryParams(options);
      return httpGet({
        path: `${context.uri}/files/${orgLabel}/${projectLabel}${opts}`,
      });
    },

    create: (
      orgLabel: string,
      projectLabel: string,
      payload: FilePayload,
      options: CreateFileOptions = { execution: 'consistent' },
    ): Promise<NexusFile> => {
      const { '@id': fileId, file: body, storage } = payload;
      const opts = buildQueryParams({ storage, execution: options.execution });
      const headers = (options && options.extraHeaders) || {};

      return fileId
        ? httpPut({
            headers,
            body,
            path: `${context.uri}/files/${orgLabel}/${projectLabel}/${fileId}${opts}`,
            context: {
              noDefaultHeader: true,
            },
          })
        : httpPost({
            headers,
            body,
            path: `${context.uri}/files/${orgLabel}/${projectLabel}${opts}`,
            context: {
              noDefaultHeader: true,
            },
          });
    },

    link: (
      orgLabel: string,
      projectLabel: string,
      payload: LinkFilePayload,
      options: LinkFileOptions = { execution: 'consistent' },
    ): Promise<NexusFile> => {
      const { '@id': fileId, storage, ...body } = payload;
      const opts = buildQueryParams({ storage, ...options });
      return fileId
        ? httpPut({
            body: JSON.stringify(body),
            path: `${context.uri}/files/${orgLabel}/${projectLabel}/${fileId}${opts}`,
          })
        : httpPost({
            body: JSON.stringify(body),
            path: `${context.uri}/files/${orgLabel}/${projectLabel}${opts}`,
          });
    },

    update: (
      orgLabel: string,
      projectLabel: string,
      payload: UpdateFilePayload,
      options: UpdateFileOptions = { execution: 'consistent' },
    ): Promise<NexusFile> => {
      const { '@id': fileId, file: body, storage, rev } = payload;
      const opts = buildQueryParams({
        rev,
        storage,
        execution: options.execution,
      });
      const headers = (options && options.extraHeaders) || {};
      return httpPut({
        headers,
        body,
        path: `${context.uri}/files/${orgLabel}/${projectLabel}/${fileId}${opts}`,
      });
    },
    deprecate: (
      orgLabel: string,
      projectLabel: string,
      fileId: string,
      rev: number,
      options: DeprecateFileOptions = { execution: 'consistent' },
    ): Promise<NexusFile> => {
      const opts = buildQueryParams({ ...options, rev });
      return httpDelete({
        path: `${context.uri}/files/${orgLabel}/${projectLabel}/${fileId}${opts}`,
      });
    },
    tag: (
      orgLabel: string,
      projectLabel: string,
      fileId: string,
      payload: TagResourcePayload,
      options: TagFileOptions = { execution: 'consistent' },
    ): Promise<NexusFile> => {
      const { previousRev, ...body } = payload;
      const opts = buildQueryParams({ ...options, rev: previousRev });
      return httpPost({
        body: JSON.stringify(body),
        path: `${context.uri}/files/${orgLabel}/${projectLabel}/${fileId}/tags${opts}`,
      });
    },
    poll: (
      orgLabel: string,
      projectLabel: string,
      fileId: string,
      options?: GetResourceOptions & { pollIntervalMs: number },
    ): Observable<NexusFile> => {
      const { pollIntervalMs, ...getResourceOptions } = options;
      return poll({
        path: `${
          context.uri
        }/files/${orgLabel}/${projectLabel}/${fileId}${buildQueryParams(
          getResourceOptions,
        )}`,
        context: { pollIntervalMs: pollIntervalMs || 1000 },
      });
    },
  };
};

export default NexusFile;
