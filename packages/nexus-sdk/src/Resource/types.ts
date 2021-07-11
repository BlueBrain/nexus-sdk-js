import { Context, Resource, PaginatedList, ExecutionOption } from '../types';

export type IncomingLink = Resource & {
  paths: string[];
};

export type OutgoingLink =
  | {
      '@id': string;
      '@type'?: Resource['@type'];
      paths: string[];
    }
  | Resource & {
      paths: string[];
    };

export type ResourceLink = IncomingLink | OutgoingLink;

export type ResourceListOptions = {
  q?: string; // full text search query
  from?: number;
  size?: number;
  deprecated?: boolean;
  rev?: number;
  type?: string;
  createdBy?: string;
  updatedBy?: string;
  schema?: string;
  sort?: string | string[];
  [key: string]: any;
};

export type ResourceCreateOptions = ExecutionOption & {};

export type ResourceUpdateOptions = ExecutionOption & {};

export type ResourceTagOptions = ExecutionOption & {};

export type ResourceDeprecateOptions = ExecutionOption & {};

export type ResourcePayload = {
  '@id'?: string;
  '@context'?: Context;
  '@type'?: Resource['@type'];
  [key: string]: any;
};

export type ExpandedValue = {
  value: string | number | boolean;
};

export type ExpandedResource<T = { [key: string]: any }> = T & {
  '@context'?: Context;
  '@type'?: string | string[];
  '@id': string;
  'https://bluebrain.github.io/nexus/vocabulary/incoming': ExpandedValue[];
  'https://bluebrain.github.io/nexus/vocabulary/outgoing': ExpandedValue[];
  'https://bluebrain.github.io/nexus/vocabulary/self': ExpandedValue[];
  'https://bluebrain.github.io/nexus/vocabulary/constrainedBy': ExpandedValue[];
  'https://bluebrain.github.io/nexus/vocabulary/project': ExpandedValue[];
  'https://bluebrain.github.io/nexus/vocabulary/rev': ExpandedValue[];
  'https://bluebrain.github.io/nexus/vocabulary/deprecated': ExpandedValue[];
  'https://bluebrain.github.io/nexus/vocabulary/createdAt': ExpandedValue[];
  'https://bluebrain.github.io/nexus/vocabulary/createdBy': ExpandedValue[];
  'https://bluebrain.github.io/nexus/vocabulary/updatedAt': ExpandedValue[];
  'https://bluebrain.github.io/nexus/vocabulary/updatedBy': ExpandedValue[];
};

export type Resource<T = { [key: string]: any }> = T & {
  '@context'?: Context;
  '@type'?: string | string[];
  '@id': string;
  _incoming: string;
  _outgoing: string;
  _self: string;
  _constrainedBy: string;
  _project: string;
  _rev: number;
  _deprecated: boolean;
  _createdAt: string;
  _createdBy: string;
  _updatedAt: string;
  _updatedBy: string;
};

export type PaginatedList<T = Resource> = {
  '@context': Context;
  _total: number;
  _results: T[];
  _next?: string;
};

export type ResourceList<T> = PaginatedList<Resource & T>;

export type GetResourceOptions = {
  rev?: number;
  tag?: string;
  format?: 'compacted' | 'expanded';
  as?: 'vnd.graph-viz' | 'n-triples' | 'json';
  [key: string]: any;
};

export type TagResourcePayload = {
  previousRev: number;
  tag: string;
  rev: number;
};

export type GetResourceSourceOptions = {
  rev?: number;
  tag?: string;
};

export type ResourceSource = {
  '@context'?: Context;
  '@type'?: string | string[];
  '@id': string;
};
