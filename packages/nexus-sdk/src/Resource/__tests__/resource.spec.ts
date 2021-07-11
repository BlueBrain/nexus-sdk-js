import Resource from '..';
import { mockFetchers } from '../../testUtils';

const resource = Resource(mockFetchers, { uri: 'http://api.url/v1' });

describe('Resource', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  describe('get', () => {
    it('should make httpGet call to the resources api with the right url and headers', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '' }));
      await resource.get('org', 'project', 'myId');
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(
        'http://api.url/v1/resources/org/project/_/myId',
      );
      expect(fetchMock.mock.calls[0][1].method).toEqual('GET');
      expect(fetchMock.mock.calls[0][1].headers).toEqual({
        Accept: 'application/ld+json',
      });
    });

    it('should make httpGet call to the resources api with the right url and query params', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '' }));
      await resource.get('org', 'project', 'myId', {
        rev: 1,
        q: 'myTextString',
        format: 'expanded',
        as: 'json',
      });
      await resource.get('org', 'project', 'myId', {
        rev: 2,
        as: 'n-triples',
      });
      await resource.get('org', 'project', 'myId', {
        rev: 3,
        as: 'vnd.graph-viz',
      });
      expect(fetchMock.mock.calls.length).toEqual(3);
      expect(fetchMock.mock.calls[0][0]).toEqual(
        'http://api.url/v1/resources/org/project/_/myId?format=expanded&q=myTextString&rev=1',
      );
      expect(fetchMock.mock.calls[0][1].method).toEqual('GET');
      expect(fetchMock.mock.calls[0][1].headers).toEqual({
        Accept: 'application/ld+json',
      });

      expect(fetchMock.mock.calls[1][0]).toEqual(
        'http://api.url/v1/resources/org/project/_/myId?rev=2',
      );
      expect(fetchMock.mock.calls[1][1].method).toEqual('GET');
      expect(fetchMock.mock.calls[1][1].headers).toEqual({
        Accept: 'application/n-triples',
      });

      expect(fetchMock.mock.calls[2][0]).toEqual(
        'http://api.url/v1/resources/org/project/_/myId?rev=3',
      );
      expect(fetchMock.mock.calls[2][1].method).toEqual('GET');
      expect(fetchMock.mock.calls[2][1].headers).toEqual({
        Accept: 'text/vnd.graphviz',
      });
    });

    it('should call httpGet with the correct parseAs context property', async () => {
      const mockHttpGet = jest.fn();

      const resource = Resource(
        {
          ...mockFetchers,
          httpGet: mockHttpGet,
        },
        {
          uri: 'http://api.url/v1',
        },
      );

      await resource.get('org', 'project', 'myId', { as: 'json' });
      await resource.get('org', 'project', 'myId', { as: 'n-triples' });
      await resource.get('org', 'project', 'myId', { as: 'vnd.graph-viz' });
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
    it('should make httpGet call to the resources api', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '' }));
      await resource.list('org', 'project');
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(
        'http://api.url/v1/resources/org/project',
      );
      expect(fetchMock.mock.calls[0][1].method).toEqual('GET');
    });

    it('should make httpGet with query params', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '' }));
      await resource.list('org', 'project', {
        createdBy: 'me',
        type: 'View',
      });
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(
        'http://api.url/v1/resources/org/project?createdBy=me&type=View',
      );
      expect(fetchMock.mock.calls[0][1].method).toEqual('GET');
    });

    it('should make httpGet with sort params', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '' }));
      await resource.list('org', 'project', {
        sort: ['-_createdAt', '-@id'],
      });
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(
        'http://api.url/v1/resources/org/project?sort=-_createdAt&sort=-%40id',
      );
      expect(fetchMock.mock.calls[0][1].method).toEqual('GET');
    });
  });

  describe('links', () => {
    it('should make httpGet call to the resources api', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '' }));
      await resource.links('org', 'project', 'myID', 'incoming');
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(
        'http://api.url/v1/resources/org/project/_/myID/incoming',
      );
      expect(fetchMock.mock.calls[0][1].method).toEqual('GET');
    });

    it('should make the right call with outgoing as well', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '' }));
      await resource.links('org', 'project', 'myID', 'outgoing');
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(
        'http://api.url/v1/resources/org/project/_/myID/outgoing',
      );
      expect(fetchMock.mock.calls[0][1].method).toEqual('GET');
    });

    it('should make httpGet with query params', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '' }));
      await resource.links('org', 'project', 'myID', 'incoming', {
        from: 0,
        size: 20,
      });
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(
        'http://api.url/v1/resources/org/project/_/myID/incoming?from=0&size=20',
      );
      expect(fetchMock.mock.calls[0][1].method).toEqual('GET');
    });
  });

  describe('create', () => {
    it('should make httpPost call to the resources api', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '' }));
      const payload = {
        '@id': 'myResource',
        '@context': {
          label: {
            '@id': 'http://www.w3.org/2000/01/rdf-schema#label',
          },
        },
        something: 'hello!',
      };
      await resource.create('org', 'project', payload);
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(
        'http://api.url/v1/resources/org/project?execution=consistent',
      );
      expect(fetchMock.mock.calls[0][1].body).toEqual(JSON.stringify(payload));
      expect(fetchMock.mock.calls[0][1].method).toEqual('POST');
    });
    it('should make httpPost call to the resources api with execution flag set to performant', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '' }));
      const payload = {
        '@id': 'myResource',
        '@context': {
          label: {
            '@id': 'http://www.w3.org/2000/01/rdf-schema#label',
          },
        },
        something: 'hello!',
      };
      await resource.create('org', 'project', payload, undefined, undefined, {
        execution: 'performant',
      });
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(
        'http://api.url/v1/resources/org/project?execution=performant',
      );
      expect(fetchMock.mock.calls[0][1].body).toEqual(JSON.stringify(payload));
      expect(fetchMock.mock.calls[0][1].method).toEqual('POST');
    });
    it('should make httpPost call with schemaId  to the resources api, when schemaId is present', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '' }));
      const payload = {
        '@id': 'myResource',
        '@context': 'something',
        something: 'hello!',
      };
      await resource.create('org', 'project', payload, 'schemaId');
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(
        'http://api.url/v1/resources/org/project/schemaId?execution=consistent',
      );
      expect(fetchMock.mock.calls[0][1].body).toEqual(JSON.stringify(payload));
      expect(fetchMock.mock.calls[0][1].method).toEqual('POST');
    });

    it('should make httpPut call  with ResourceId to the resources api, when ResourceId is present', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '' }));
      const payload = {
        '@id': 'resourceId',
        '@context': 'something',
        something: 'hello!',
      };
      await resource.create('org', 'project', payload, undefined, 'resourceId');
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(
        'http://api.url/v1/resources/org/project/_/resourceId?execution=consistent',
      );
      expect(fetchMock.mock.calls[0][1].body).toEqual(JSON.stringify(payload));
      expect(fetchMock.mock.calls[0][1].method).toEqual('PUT');
    });

    it('should make httpPut call with schemaId and ResourceId to the resources api, when schemaId and ResourceId is present', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '' }));
      const payload = {
        '@id': 'resourceId',
        '@context': 'something',
        something: 'hello!',
      };
      await resource.create(
        'org',
        'project',
        payload,
        'schemaId',
        'resourceId',
      );
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(
        'http://api.url/v1/resources/org/project/schemaId/resourceId?execution=consistent',
      );
      expect(fetchMock.mock.calls[0][1].body).toEqual(JSON.stringify(payload));
      expect(fetchMock.mock.calls[0][1].method).toEqual('PUT');
    });
  });

  describe('update', () => {
    it('should make httpPut call to the resources api', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '' }));
      const payload = {
        '@id': 'myResource',
        '@context': {
          label: {
            '@id': 'http://www.w3.org/2000/01/rdf-schema#label',
          },
        },
        something: 'hello!',
      };
      await resource.update('org', 'project', 'myResourceId', 1, payload);
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(
        'http://api.url/v1/resources/org/project/_/myResourceId?execution=consistent&rev=1',
      );
      expect(fetchMock.mock.calls[0][1].body).toEqual(JSON.stringify(payload));
      expect(fetchMock.mock.calls[0][1].method).toEqual('PUT');
    });
  });

  describe('tag', () => {
    it('should make httpPost call to the resources api', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '' }));
      const payload = {
        rev: 1,
        tag: 'whatever',
      };
      await resource.tag('org', 'project', 'myResourceId', 1, payload);
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(
        'http://api.url/v1/resources/org/project/myResourceId?execution=consistent&rev=1',
      );
      expect(fetchMock.mock.calls[0][1].body).toEqual(JSON.stringify(payload));
      expect(fetchMock.mock.calls[0][1].method).toEqual('POST');
    });
  });

  describe('deprecate', () => {
    it('should make httpDELETE call to the resources api', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '' }));
      await resource.deprecate('org', 'project', 'myResourceId', 1);
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(
        'http://api.url/v1/resources/org/project/_/myResourceId?execution=consistent&rev=1',
      );
      expect(fetchMock.mock.calls[0][1].method).toEqual('DELETE');
    });
  });

  describe('poll', () => {
    it('should make httpGet call to the resources api', () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '' }));
      jest.useFakeTimers();
      const myPoll = resource
        .poll('org', 'project', 'myViewId', { pollIntervalMs: 50 })
        .subscribe(val => {});
      jest.advanceTimersByTime(150);
      myPoll.unsubscribe();
      expect(fetchMock.mock.calls.length).toEqual(3);
      expect(fetchMock.mock.calls[0][0]).toEqual(
        'http://api.url/v1/resources/org/project/_/myViewId',
      );
      expect(fetchMock.mock.calls[0][1].method).toEqual('GET');
    });
  });

  describe('getSource', () => {
    it('should make httpGet call to the resources api', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '' }));
      const options = {
        rev: 2,
        tag: 'randomTag',
      };
      await resource.getSource(
        'orgLabel',
        'projectLabel',
        'resourceId',
        'schemaId',
        options,
      );
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(
        'http://api.url/v1/resources/orgLabel/projectLabel/schemaId/resourceId/source?rev=2&tag=randomTag',
      );
      expect(fetchMock.mock.calls[0][1].method).toEqual('GET');
    });
  });
});
