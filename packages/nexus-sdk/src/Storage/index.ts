import { Observable } from '@bbp/nexus-link';
import { Fetchers } from '../types';
import {
  CreateStorageOptions,
  DeprecateStorageOptions,
  GetStorageOptions,
  ListStorageOptions,
  StorageList,
  StoragePayload,
  TagStorageOptions,
  UpdateStorageOptions,
} from './types';
import { NexusContext } from '../nexusSdk';
import { buildHeader, buildQueryParams, parseAsBuilder } from '../utils';
import { Resource } from '../Resource/types';

const Storage = (
  { httpGet, httpPut, httpDelete, httpPost, poll }: Fetchers,
  context: NexusContext,
) => {
  return {
    get: (
      orgLabel: string,
      projectLabel: string,
      storageId: string,
      options?: GetStorageOptions,
    ): Promise<Storage> => {
      const { as = 'json', ...opts } = options || {};
      const parseAs = parseAsBuilder(as);

      return httpGet({
        headers: { Accept: buildHeader(as) },
        path: `${
          context.uri
        }/storages/${orgLabel}/${projectLabel}/${storageId}${buildQueryParams(
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
      options?: ListStorageOptions,
    ): Promise<StorageList> => {
      const opts = buildQueryParams(options);
      return httpGet({
        path: `${context.uri}/storages/${orgLabel}/${projectLabel}${opts}`,
      });
    },
    create: (
      orgLabel: string,
      projectLabel: string,
      payload: StoragePayload,
      options: CreateStorageOptions = { execution: 'consistent' },
    ): Promise<Resource> => {
      const opts = buildQueryParams(options);
      return httpPost({
        path: `${context.uri}/storages/${orgLabel}/${projectLabel}${opts}`,
        body: JSON.stringify(payload),
      });
    },
    update: (
      orgLabel: string,
      projectLabel: string,
      storageId: string,
      rev: number,
      payload: StoragePayload,
      options: UpdateStorageOptions = { execution: 'consistent' },
    ): Promise<Resource> => {
      const opts = buildQueryParams({ ...options, rev });
      return httpPut({
        path: `${context.uri}/storages/${orgLabel}/${projectLabel}/${storageId}${opts}`,
        body: JSON.stringify(payload),
      });
    },
    tag: (
      orgLabel: string,
      projectLabel: string,
      storageId: string,
      rev: number,
      payload: {
        tag: string;
        rev: number;
      },
      options: TagStorageOptions = { execution: 'consistent' },
    ): Promise<Resource> => {
      const opts = buildQueryParams({ ...options, rev });
      return httpPost({
        path: `${context.uri}/storages/${orgLabel}/${projectLabel}/${storageId}${opts}`,
        body: JSON.stringify(payload),
      });
    },
    deprecate: (
      orgLabel: string,
      projectLabel: string,
      storageId: string,
      rev: number,
      options: DeprecateStorageOptions = { execution: 'consistent' },
    ): Promise<Resource> => {
      const opts = buildQueryParams({ ...options, rev });
      return httpDelete({
        path: `${context.uri}/storages/${orgLabel}/${projectLabel}/${storageId}${opts}`,
      });
    },
    poll: (
      orgLabel: string,
      projectLabel: string,
      storageId: string,
      options?: { pollTime: number },
    ): Observable<Storage> =>
      poll({
        path: `${context.uri}/storages/${orgLabel}/${projectLabel}/${storageId}`,
        context: { pollTime: options && options.pollTime | 1000 },
      }),
  };
};

export default Storage;
