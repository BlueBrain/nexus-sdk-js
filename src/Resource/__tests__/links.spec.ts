import Resource from '..';
import { resetMocks, mock, mockResponses } from 'jest-fetch-mock';
import {
  mockGetByIDResourceResponse,
  mockProjectResponse,
  mockSparqlViewResponse,
  mockResourceResponse,
} from '../../__mocks__/helpers';
import { SparqlViewQueryResponse } from '../../View/SparqlView/types';
import { PaginatedList } from '../../utils/types';
import { ResourceLink } from '../types';
import { getIncomingLinks, getOutgoingLinks } from '../utils';

const mockIncomingLinksQueryResponse: SparqlViewQueryResponse = {
  head: { vars: ['total', 's', 'p', 'self'] },
  results: {
    bindings: [
      {
        total: {
          datatype: 'http://www.w3.org/2001/XMLSchema#integer',
          type: 'literal',
          value: '2',
        },
      },
      {
        p: {
          type: 'uri',
          value:
            'https://mynexusinstance.io/vocabs/Kenny/What-A-Project/favoriteBuddy',
        },
        s: {
          type: 'uri',
          value:
            'https://mynexusinstance.io/resources/Kenny/What-A-Project/_/fred',
        },
        self: {
          type: 'literal',
          value:
            'https://mynexusinstance.io/resources/Kenny/What-A-Project/_/fred',
        },
      },
      {
        p: {
          type: 'uri',
          value:
            'https://mynexusinstance.io/vocabs/Kenny/What-A-Project/favoriteBuddy',
        },
        s: {
          type: 'uri',
          value:
            'https://mynexusinstance.io/resources/Kenny/What-A-Project/_/jeff',
        },
        self: {
          type: 'literal',
          value:
            'https://mynexusinstance.io/resources/Kenny/What-A-Project/_/jeff',
        },
      },
    ],
  },
};

const mockOutgoingLinksQueryResponse: SparqlViewQueryResponse = {
  head: { vars: ['total', 'o', 'p', 'self'] },
  results: {
    bindings: [
      {
        total: {
          datatype: 'http://www.w3.org/2001/XMLSchema#integer',
          type: 'literal',
          value: '6',
        },
      },
      {
        o: {
          type: 'uri',
          value:
            'https://bbp-nexus.epfl.ch/staging/v1/resources/Kenny/What-A-Project/_/defaultSparqlIndex',
        },
        p: {
          type: 'uri',
          value:
            'https://bbp-nexus.epfl.ch/staging/v1/vocabs/Kenny/What-A-Project/favoriteView',
        },
      },
      {
        o: {
          type: 'uri',
          value:
            'https://bbp-nexus.epfl.ch/staging/v1/resources/Kenny/What-A-Project/_/fred',
        },
        p: {
          type: 'uri',
          value:
            'https://bbp-nexus.epfl.ch/staging/v1/vocabs/Kenny/What-A-Project/anotherFavoriteBuddy',
        },
        self: {
          type: 'literal',
          value:
            'https://bbp-nexus.epfl.ch/staging/v1/resources/Kenny/What-A-Project/_/fred',
        },
      },
      {
        o: {
          type: 'uri',
          value:
            'https://bbp-nexus.epfl.ch/staging/v1/resources/Kenny/What-A-Project/_/fred',
        },
        p: {
          type: 'uri',
          value:
            'https://bbp-nexus.epfl.ch/staging/v1/vocabs/Kenny/What-A-Project/favoriteBuddy',
        },
        self: {
          type: 'literal',
          value:
            'https://bbp-nexus.epfl.ch/staging/v1/resources/Kenny/What-A-Project/_/fred',
        },
      },
      {
        o: {
          type: 'uri',
          value:
            'https://bbp-nexus.epfl.ch/staging/v1/resources/Kenny/What-A-Project/_/jeff',
        },
        p: {
          type: 'uri',
          value:
            'https://bbp-nexus.epfl.ch/staging/v1/vocabs/Kenny/What-A-Project/favoriteBuddy',
        },
        self: {
          type: 'literal',
          value:
            'https://bbp-nexus.epfl.ch/staging/v1/resources/Kenny/What-A-Project/_/jeff',
        },
      },
      {
        o: { type: 'uri', value: 'https://google.com' },
        p: {
          type: 'uri',
          value:
            'https://bbp-nexus.epfl.ch/staging/v1/vocabs/Kenny/What-A-Project/favoriteBuddy',
        },
      },
      {
        o: { type: 'uri', value: 'https://wildmagic.io' },
        p: {
          type: 'uri',
          value:
            'https://bbp-nexus.epfl.ch/staging/v1/vocabs/Kenny/What-A-Project/favoriteExternalEndpoint',
        },
      },
    ],
  },
};

describe('Incoming / Outgoing Links behavior', () => {
  describe('getIncomingLinks()', () => {
    it('should fetch a PaginatedList of ResourceLinks using the proper SPAQRL queries as instance method', async () => {
      const resource = new Resource<{
        subject: string;
      }>('testOrg', 'testProject', mockGetByIDResourceResponse);

      mockResponses(
        [JSON.stringify(mockSparqlViewResponse)],
        [JSON.stringify(mockIncomingLinksQueryResponse)],
        [JSON.stringify(mockResourceResponse)],
        [JSON.stringify(mockResourceResponse)],
      );
      const links: PaginatedList<
        ResourceLink
      > = await resource.getIncomingLinks({
        from: 0,
        size: 20,
      });

      expect(mock.calls[1][1].body).toMatchSnapshot();
      expect(links.results[0]).toHaveProperty('predicate');
      expect(links.results[0]).toHaveProperty('link');
      expect(links.results[0].link).toBeInstanceOf(Resource);
      resetMocks();
    });

    it('should work as a static method', async () => {
      mockResponses(
        [JSON.stringify(mockSparqlViewResponse)],
        [JSON.stringify(mockIncomingLinksQueryResponse)],
        [JSON.stringify(mockResourceResponse)],
        [JSON.stringify(mockResourceResponse)],
      );
      const links: PaginatedList<
        ResourceLink
      > = await Resource.getIncomingLinks(
        'myorg',
        'myproject',
        'http://blah.com/resourceSelfID',
        {
          from: 0,
          size: 20,
        },
      );

      expect(mock.calls[1][1].body).toMatchSnapshot();
      expect(links.results[0]).toHaveProperty('predicate');
      expect(links.results[0]).toHaveProperty('link');
      expect(links.results[0].link).toBeInstanceOf(Resource);
      resetMocks();
    });
  });

  describe('getOutgoingLinks()', () => {
    it('should fetch a PaginatedList of ResourceLinks using the proper SPAQRL queries as instance method', async () => {
      const resource = new Resource<{
        subject: string;
      }>('testOrg', 'testProject', mockGetByIDResourceResponse);

      mockResponses(
        [JSON.stringify(mockSparqlViewResponse)],
        [JSON.stringify(mockOutgoingLinksQueryResponse)],
        [JSON.stringify(mockResourceResponse)],
        [JSON.stringify(mockResourceResponse)],
        [JSON.stringify(mockResourceResponse)],
      );
      const links: PaginatedList<
        ResourceLink
      > = await resource.getOutgoingLinks({
        from: 0,
        size: 20,
      });

      expect(mock.calls[1][1].body).toMatchSnapshot();
      expect(links.results[0]).toHaveProperty('predicate');
      expect(links.results[0]).toHaveProperty('link');
      expect(links.results[1].link).toBeInstanceOf(Resource);
      resetMocks();
    });

    it('should work just as well as a static method', async () => {
      mockResponses(
        [JSON.stringify(mockSparqlViewResponse)],
        [JSON.stringify(mockOutgoingLinksQueryResponse)],
        [JSON.stringify(mockResourceResponse)],
        [JSON.stringify(mockResourceResponse)],
        [JSON.stringify(mockResourceResponse)],
      );
      const links: PaginatedList<ResourceLink> = await getOutgoingLinks(
        'myorg',
        'myproject',
        'http://blah.com/resourceSelfID',
        {
          from: 0,
          size: 20,
        },
      );

      expect(mock.calls[1][1].body).toMatchSnapshot();
      expect(links.results[0]).toHaveProperty('predicate');
      expect(links.results[0]).toHaveProperty('link');
      expect(links.results[1].link).toBeInstanceOf(Resource);
      resetMocks();
    });
  });
});
