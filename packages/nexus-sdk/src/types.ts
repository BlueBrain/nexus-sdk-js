import { Link, Operation } from '@bbp/nexus-link';
import { createNexusClient } from './nexusSdk';

export type Fetchers = {
  httpGet: (operation: Operation) => Promise<any>;
  httpPost: (operation: Operation) => Promise<any>;
  httpPut: (operation: Operation) => Promise<any>;
  httpPatch: (operation: Operation) => Promise<any>;
  httpDelete: (operation: Operation) => Promise<any>;
  poll: Link;
};

export type ExecutionOption = { execution?: 'consistent' | 'performant' };

export type Context =
  | string
  | (string | { [key: string]: any })[]
  | { [key: string]: any };

export type NexusClient = ReturnType<typeof createNexusClient>;
export * from './Resource/types';
export * from './File/types';
export * from './Identity/types';
export * from './Organization/types';
export * from './Project/types';
export * from './Resolver/types';
export * from './Schema/types';
export * from './Storage/types';
export * from './View/types';
export * from './Realm/types';
export * from './Permissions/types';
export * from './ACL/types';
export * from './Archive/types';
