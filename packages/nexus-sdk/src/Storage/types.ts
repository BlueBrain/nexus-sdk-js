import { Resource, PaginatedList, ExecutionOption } from '../types';

export type StorageType = 'DiskStorage' | 'RemoteDiskStorage' | 'S3Storage';

export type Storage = DiskStorage | RemoteDiskStorage | S3Storage;
export type DiskStorage = Resource & {
  '@type': ['DiskStorage', 'Storage'];
  volume: string;
  default: boolean;
  readPermissions?: string[];
  writePermissions?: string[];
  _algorithm: string;
};
export type RemoteDiskStorage = Resource & {
  '@type': ['RemoteStorage', 'Storage'];
  folder: string;
  default: boolean;
  endpoint?: string;
  readPermissions?: string[];
  writePermissions?: string[];
  _algorithm: string;
};
export type S3Storage = Resource & {
  '@type': ['S3Storage', 'Storage'];
  default: boolean;
  readPermissions?: string[];
  writePermissions?: string[];
  bucket: string;
  _algorithm: string;
};
export type StorageList = PaginatedList<Storage>;

export type GetStorageOptions = {
  rev?: number;
  tag?: string;
  as?: 'vnd.graph-viz' | 'n-triples' | 'json';
  [key: string]: string | number | boolean;
};

export type ListStorageOptions = {
  from?: number;
  size?: number;
  deprecated?: boolean;
  rev?: number;
  type?: StorageType;
  createdBy?: string;
  updatedBy?: string;
};
export type CreateStorageOptions = ExecutionOption & {};
export type UpdateStorageOptions = ExecutionOption & {};
export type TagStorageOptions = ExecutionOption & {};
export type DeprecateStorageOptions = ExecutionOption & {};

export type StoragePayload =
  | DiskStoragePayload
  | RemoteDiskStoragePayload
  | S3StoragePayload;

export type DiskStoragePayload = {
  '@id'?: string;
  '@type': ['DiskStorage'];
  volume: string;
  default?: boolean;
  readPermissions?: string[];
  writePermissions?: string[];
};

export type RemoteDiskStoragePayload = {
  '@id'?: string;
  '@type': ['RemoteDiskStorage'];
  folder: string;
  default?: boolean;
  endpoint?: string;
  credentials: string;
  readPermissions?: string[];
  writePermissions?: string[];
};

export type S3StoragePayload = {
  '@id'?: string;
  '@type': ['S3Storage'];
  bucket: string;
  default?: boolean;
  endpoint?: string;
  accessKey?: string;
  secretKey?: string;
  readPermissions?: string[];
  writePermissions?: string[];
};
