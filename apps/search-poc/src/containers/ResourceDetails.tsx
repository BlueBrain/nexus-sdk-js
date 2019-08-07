import * as React from 'react';
import get from 'lodash/get';
import { useNexus } from '@bbp/react-nexus';
import { Spin } from 'antd';

import ResourceDetails from '../components/ResourceDetails';
import { Resource } from '@bbp/nexus-sdk';
import { SETTINGS } from '../config';
import customComponentsDictionary from '../components/customComponents';

export interface BrainRegion {
  '@id': string;
  label: string;
}

export interface BrainLocation {
  brainRegion: BrainRegion;
}

export interface MINDSResource {
  brainLocation: BrainLocation;
  name: string;
  description: string;
}

const getCustomComponents = (typeList: string[]) => {
  const componentListWithDuplicates = typeList.reduce(
    (customComponentsList, currentTypeKey) => {
      const configList = SETTINGS.customComponentsByType[currentTypeKey];
      return configList
        ? [...customComponentsList, ...configList]
        : customComponentsList;
    },
    [],
  );
  const componentListWithoutDuplicates = Array.from(
    new Set(componentListWithDuplicates),
  );
  return componentListWithoutDuplicates
    .map(componentName => customComponentsDictionary[componentName])
    .filter(Boolean);
};

const ResourceDetailsContainer: React.FunctionComponent<{
  selfUrl: string;
}> = props => {
  const { data, loading, error } = useNexus<Resource & MINDSResource>(nexus =>
    nexus.httpGet({ path: props.selfUrl }),
  );

  const id = get(data, '@id');
  const name = get(data, 'name');
  const description = get(data, 'description');

  const brainRegionId = get(data, 'brainLocation.brainRegion.@id');
  const brainRegionLabel = get(data, 'brainLocation.brainRegion.label');
  const brainRegion = {
    id: brainRegionId,
    label: brainRegionLabel,
  };
  const typeList = get(data, '@type', []);
  if (loading) {
    return <Spin></Spin>;
  }

  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <ResourceDetails
      id={id}
      name={name}
      description={description}
      brainRegion={brainRegion}
      types={typeList}
    >
      {getCustomComponents(typeList).map(Component => Component({ data }))}
    </ResourceDetails>
  );
};

export default ResourceDetailsContainer;
