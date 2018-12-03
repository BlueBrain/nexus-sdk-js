import Project, { ProjectResponse } from '../Project';

/* tslint:disable */
const mockResponse: ProjectResponse = {
  '@context': 'https://bluebrain.github.io/nexus/contexts/project',
  '@id': 'https://nexus.example.com/v1/projects/myorg/myproject',
  '@type': 'nxv:Project',
  name: 'example project creation',
  label: 'example',
  base: 'https://nexus.example.com/v1/myorg/myproject/',
  prefixMappings: [
    {
      prefix: 'person',
      namespace: 'http://example.com/some/person',
    },
    {
      prefix: 'schemas',
      namespace: 'https://bluebrain.github.io/nexus/schemas/',
    },
    {
      prefix: 'ex',
      namespace: 'http://example.com/',
    },
  ],
  _label: 'myproject',
  _uuid: '968ad034-268a-4b07-aedd-219e3b2d8940',
  _self: 'https://nexus.example.com/v1/projects/myorg/myproject',
  _constrainedBy: 'nxs:project',
  _createdAt: '2018-09-18T09:58:00.801Z',
  _createdBy:
    'https://nexus.example.com/v1/realms/myrealm/users/f:ad46ddd6-134e-44d6-ab70-bdf00f48dfce:someone',
  _updatedAt: '2018-09-18T10:30:00.801Z',
  _updatedBy:
    'https://nexus.example.com/v1/realms/myrealm/users/f:ad46ddd6-134e-44d6-ab70-bdf00f48dfce:someone',
  _rev: 4,
  _deprecated: true,
};
/* tslint:enable */

describe('Project class', () => {
  it('Should create an Project instance', () => {
    const p = new Project('my-org', mockResponse);
    expect(p.id).toEqual(mockResponse['@id']);
    expect(p.name).toEqual(mockResponse.name);
    expect(p.base).toEqual(mockResponse.base);
    expect(p.version).toEqual(mockResponse._rev);
    expect(p.deprecated).toEqual(mockResponse._deprecated);
    expect(p.createdAt.toISOString()).toEqual(mockResponse._createdAt);
    expect(p.updatedAt.toISOString()).toEqual(mockResponse._updatedAt);
  });
});
