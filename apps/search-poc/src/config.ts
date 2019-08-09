export const SETTINGS = {
  preferredRealmKey: 'preferredRealm',
  bearerTokenKey: 'nexusToken',
  serviceAccountName: 'serviceaccounts',
  clientId: 'nexus-web',
  redirectUrl: window.location.origin,
  environment: 'https://staging.nexus.ocp.bbp.epfl.ch/v1',
};

export const emodelDataQuery = `
prefix nxs: <https://neuroshapes.org/>
prefix nxv: <https://bluebrain.github.io/nexus/vocabulary/>
prefix schema: <http://schema.org/>

SELECT ?total ?self ?name ?speciesLabel
     WITH {
      SELECT DISTINCT ?self ?name ?speciesLabel {
        Graph ?g {
            ?s rdf:type nxs:EModelCollection
        }
        Graph ?g {
          ?s nxs:brainLocation / nxs:brainRegion <http://purl.obolibrary.org/obo/UBERON_0004703>
        }
        Graph ?g {
          ?s nxv:self ?self    .
          OPTIONAL { ?s schema:name ?name }
          OPTIONAL { ?s nxs:species / rdf:label ?speciesLabel }
        }
      }
     } AS %resultSet

   WHERE {
        {
           SELECT (COUNT(?self) AS ?total)
           WHERE { INCLUDE %resultSet }
        }
        UNION
       {
           SELECT *
           WHERE { INCLUDE %resultSet }
           ORDER BY ?self
           LIMIT 20
           OFFSET 0
        }
     }
`;

export const morphologyDataQuery = `
prefix nxs: <https://neuroshapes.org/>
prefix nxv: <https://bluebrain.github.io/nexus/vocabulary/>
prefix schema: <http://schema.org/>

SELECT ?total ?self ?name ?speciesLabel
     WITH {
      SELECT DISTINCT ?self ?name ?speciesLabel {
        Graph ?g {
            ?s rdf:type nxs:ReconstructedNeuronMorphologyCollection
        }
        Graph ?g {
          ?s nxs:brainLocation / nxs:brainRegion <http://purl.obolibrary.org/obo/UBERON_0004703>
        }
        Graph ?g {
          ?s nxv:self ?self    .
          OPTIONAL { ?s schema:name ?name }
          OPTIONAL { ?s nxs:species / rdf:label ?speciesLabel }
        }
      }
     } AS %resultSet

   WHERE {
        {
           SELECT (COUNT(?self) AS ?total)
           WHERE { INCLUDE %resultSet }
        }
        UNION
       {
           SELECT *
           WHERE { INCLUDE %resultSet }
           ORDER BY ?self
           LIMIT 20
           OFFSET 0
        }
     }
`;

export const MORPH_CONVERTER_URL = 'http://morph-service.ocp.bbp.epfl.ch/converter/api';

// {
//   "@context": {},
//   "@id": "",
//   "@type": "AggregateSparqlView",
//   "views": [
//     {
//       "project": "pgetta-data/proj1",
//       "viewId": "nxv:defaultSparqlIndex"
//     },
//         {
//       "project": "pgetta-data/proj32",
//       "viewId": "nxv:defaultSparqlIndex"
//     },
//         {
//       "project": "pgetta-data/proj38",
//       "viewId": "nxv:defaultSparqlIndex"
//     },
//         {
//       "project": "pgetta-data/proj42",
//       "viewId": "nxv:defaultSparqlIndex"
//     },
//         {
//       "project": "pgetta-data/proj55",
//       "viewId": "nxv:defaultSparqlIndex"
//     }
//     ,
//         {
//       "project": "pgetta-data/proj59",
//       "viewId": "nxv:defaultSparqlIndex"
//     },
//         {
//       "project": "pgetta-data/proj64",
//       "viewId": "nxv:defaultSparqlIndex"
//     },
//         {
//       "project": "pgetta-data/proj66",
//       "viewId": "nxv:defaultSparqlIndex"
//     },
//         {
//       "project": "pgetta-data/proj68",
//       "viewId": "nxv:defaultSparqlIndex"
//     }
//   ]
// }
