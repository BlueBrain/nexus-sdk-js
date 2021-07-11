import { Resource, PaginatedList, Context, ExecutionOption } from '../types';

export type Property = {
  datatype: string;
  minCount: number;
  path: string;
};

export type Shape = {
  '@id': string;
  '@type': string;
  nodeKind: string;
  property: Property[];
  targetClass: string;
};

export type Schema = Resource & {
  '@type': 'Schema';
  shapes: Shape[];
};

export type SchemaList = PaginatedList<Schema>;

export type GetSchemaOptions = {
  rev?: number;
  tag?: string;
  as?: 'vnd.graph-viz' | 'n-triples' | 'json';
  [key: string]: string | number | boolean;
};

export type ListSchemaOptions = {
  from?: number;
  size?: number;
  deprecated?: boolean;
  rev?: number;
  type?: string;
  createdBy?: string;
  updatedBy?: string;
};

export type SchemaPayload = {
  '@id'?: string;
  '@context'?: Context;
  shapes: Shape[];
};

export type SchemaOptions = ExecutionOption & {};
