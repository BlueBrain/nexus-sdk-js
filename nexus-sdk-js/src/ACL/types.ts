export type Context = string | string[];

export type IdentityType = 'User' | 'Group' | 'Authenticated' | 'Anonymous';

export interface Identity {
  '@id': string;
  '@type': IdentityType;
  subject?: string;
  realm?: string;
  group?: string;
}

export interface ACLResponseCommon {
  '@id': string;
  '@type': IdentityType;
  _path: string;
  acl: {
    permissions: string[];
    identity: Identity;
  }[];
  _createdAt: string;
  _createdBy: string;
  _updatedAt: string;
  _updatedBy: string;
  _rev: number;
}

export interface ACLResponse extends ACLResponseCommon {
  '@context': Context;
}

export interface ListACLResponse {
  '@context': Context;
  _total: number;
  _results: ACLResponseCommon[];
}

export interface ListRealmOption {}