import Schema from '..';
import { mockFetchers } from '../../testUtils';
import { SchemaPayload } from '../types';

const schema = Schema(mockFetchers, { uri: 'http://api.url/v1' });

describe('Views', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  describe('get', () => {
    it('should make httpGet call to the schema api with the right url', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '' }));
      await schema.get('org', 'project', 'myId');
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(
        'http://api.url/v1/schemas/org/project/myId',
      );
      expect(fetchMock.mock.calls[0][1].headers).toEqual({
        Accept: 'application/ld+json',
      });
      expect(fetchMock.mock.calls[0][1].method).toEqual('GET');
    });

    it('should make httpGet call to the schema api with the right header', async () => {
      fetchMock.mockResponseOnce('response');
      const result = await schema.get('org', 'project', 'myId', {
        as: 'n-triples',
      });
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][1].headers).toEqual({
        Accept: 'application/n-triples',
      });
      expect(fetchMock.mock.calls[0][1].method).toEqual('GET');
      expect(result.body).toEqual('response');
    });

    it('should make httpGet call to the schema api with the right url and query params', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '' }));
      await schema.get('org', 'project', 'myId', { rev: 1 });
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(
        'http://api.url/v1/schemas/org/project/myId?rev=1',
      );
      expect(fetchMock.mock.calls[0][1].method).toEqual('GET');
    });

    it('should call httpGet with the correct parseAs context property', async () => {
      const mockHttpGet = jest.fn();

      const schema = Schema(
        {
          ...mockFetchers,
          httpGet: mockHttpGet,
        },
        {
          uri: 'http://api.url/v1',
        },
      );

      await schema.get('org', 'project', 'myId', { as: 'json' });
      await schema.get('org', 'project', 'myId', { as: 'n-triples' });
      await schema.get('org', 'project', 'myId', { as: 'vnd.graph-viz' });
      expect(mockHttpGet.mock.calls[0][0].context).toHaveProperty(
        'parseAs',
        'json',
      );
      expect(mockHttpGet.mock.calls[1][0].context).toHaveProperty(
        'parseAs',
        'text',
      );
      expect(mockHttpGet.mock.calls[2][0].context).toHaveProperty(
        'parseAs',
        'text',
      );
    });
  });

  describe('list', () => {
    it('should make httpGet call to the schema api', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '' }));
      await schema.list('org', 'project');
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(
        'http://api.url/v1/schemas/org/project',
      );
      expect(fetchMock.mock.calls[0][1].method).toEqual('GET');
    });

    it('should make httpGet with query params', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '' }));
      await schema.list('org', 'project', {
        createdBy: 'me',
        type: 'ElasticSearchView',
      });
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(
        'http://api.url/v1/schemas/org/project?createdBy=me&type=ElasticSearchView',
      );
      expect(fetchMock.mock.calls[0][1].method).toEqual('GET');
    });
  });

  describe('create', () => {
    it('should make httpPost call to the schema api', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '' }));
      const payload: SchemaPayload = {
        '@context': {
          this:
            'https://nexus.example.com/v1/schemas/myorg/myproj/e1729302-35b8-4d80-97b2-d63c984e2b5c/shapes',
          ex: 'http://example.com/',
        },
        shapes: [
          {
            '@id': 'this:MyShape',
            '@type': 'sh:NodeShape',
            nodeKind: 'sh:BlankNodeOrIRI',
            targetClass: 'ex:Custom',
            property: [
              {
                path: 'ex:name',
                datatype: 'xsd:string',
                minCount: 1,
              },
              {
                path: 'ex:number',
                datatype: 'xsd:integer',
                minCount: 1,
              },
              {
                path: 'ex:bool',
                datatype: 'xsd:boolean',
                minCount: 1,
              },
            ],
          },
        ],
      };
      await schema.create('org', 'project', payload);
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(
        'http://api.url/v1/schemas/org/project?execution=consistent',
      );
      expect(fetchMock.mock.calls[0][1].body).toEqual(JSON.stringify(payload));
      expect(fetchMock.mock.calls[0][1].method).toEqual('POST');
    });
  });

  describe('update', () => {
    it('should make httpPut call to the schema api', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '' }));
      const payload: SchemaPayload = {
        '@context': {
          this:
            'https://nexus.example.com/v1/schemas/myorg/myproj/e1729302-35b8-4d80-97b2-d63c984e2b5c/shapes',
          ex: 'http://example.com/',
        },
        shapes: [
          {
            '@id': 'this:MyShape',
            '@type': 'sh:NodeShape',
            nodeKind: 'sh:BlankNodeOrIRI',
            targetClass: 'ex:Custom',
            property: [
              {
                path: 'ex:name',
                datatype: 'xsd:string',
                minCount: 1,
              },
              {
                path: 'ex:number',
                datatype: 'xsd:integer',
                minCount: 1,
              },
              {
                path: 'ex:bool',
                datatype: 'xsd:boolean',
                minCount: 1,
              },
            ],
          },
        ],
      };
      await schema.update('org', 'project', 'myViewId', 1, payload);
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(
        'http://api.url/v1/schemas/org/project/myViewId?execution=consistent&rev=1',
      );
      expect(fetchMock.mock.calls[0][1].body).toEqual(JSON.stringify(payload));
      expect(fetchMock.mock.calls[0][1].method).toEqual('PUT');
    });
  });

  describe('tag', () => {
    it('should make httpPost call to the schema api', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '' }));
      const payload = {
        rev: 1,
        tag: 'whatever',
      };
      await schema.tag('org', 'project', 'myViewId', 1, payload);
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(
        'http://api.url/v1/schemas/org/project/myViewId?execution=consistent&rev=1',
      );
      expect(fetchMock.mock.calls[0][1].body).toEqual(JSON.stringify(payload));
      expect(fetchMock.mock.calls[0][1].method).toEqual('POST');
    });
  });

  describe('deprecate', () => {
    it('should make httpDELETE call to the schema api', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '' }));
      await schema.deprecate('org', 'project', 'myViewId', 1);
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(
        'http://api.url/v1/schemas/org/project/myViewId?execution=consistent&rev=1',
      );
      expect(fetchMock.mock.calls[0][1].method).toEqual('DELETE');
    });
  });
});
