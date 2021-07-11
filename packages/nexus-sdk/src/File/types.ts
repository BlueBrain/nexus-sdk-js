import { Resource } from '../Resource/types';
import { ExecutionOption } from '../types';

export type NexusFile = Resource & {
  '@type': 'File';
  _bytes: number;
  _digest: {
    _algorithm: string;
    _value: string;
  };
  _filename: string;
  _mediaType: string;
};

export type GetFileOptions = {
  rev?: number;
  tag?: string;
  as?:
    | 'text'
    | 'blob'
    | 'document'
    | 'arraybuffer'
    | 'stream'
    | 'json'
    | 'vnd.graph-viz'
    | 'n-triples';
  [key: string]: any;
};

export type FilePayload = {
  '@id'?: string;
  storage?: string;
  file: FormData;
};

export type CreateFileOptions = ExecutionOption & {
  extraHeaders?: { [key: string]: string };
};

export type UpdateFileOptions = ExecutionOption & {
  extraHeaders?: { [key: string]: string };
};

export type DeprecateFileOptions = ExecutionOption & {};

export type TagFileOptions = ExecutionOption & {};

export type LinkFileOptions = ExecutionOption & {};

export type UpdateFilePayload = FilePayload & {
  '@id': string; // mandatory
  rev: number;
  [key: string]: any;
};

export type LinkFilePayload = {
  '@id'?: string;
  storage?: string;
  filename: string;
  path: string;
  mediaType: string;
};
