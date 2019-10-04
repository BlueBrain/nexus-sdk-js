
import React from 'react';
import { Spin, Empty } from 'antd';
import { Resource, DEFAULT_SPARQL_VIEW_ID } from '@bbp/nexus-sdk';
import { useNexus } from '@bbp/react-nexus';
import { MINDSResource } from './types';
import { getCollectionReconstructedCellsQuery, getCollectionReconstructedCellsFilesQuery } from '../../config';
import { parseProjectUrl, getLabel, camelCaseToLabelString } from '../../utils';
import ResultTable from '../../components/ResultTable';
import { HandleClickParams } from '../../types';

const RecNrnMorphologyCollectionContainer: React.FunctionComponent<{
  resource: Resource & MINDSResource;
  handleClick: (params: HandleClickParams) => void;
  isDownload: boolean;
  OnFileSelect: (fileId: string[]) => void;
  selectedFileIds?: string[];
}> = props => {
  const query = props.isDownload ? getCollectionReconstructedCellsFilesQuery(props.resource['@id']) 
    : getCollectionReconstructedCellsQuery(props.resource['@id']);
  const [org, proj] = parseProjectUrl(props.resource._project);



  
  const { data, loading, error } = useNexus<any>(nexus =>
    nexus.View.sparqlQuery(org, proj, DEFAULT_SPARQL_VIEW_ID, query), [props.isDownload]
  );
  
  const headerProperties: {
    title: string;
    dataIndex: string;
  }[] =
    data &&
    data.head.vars
      .filter(
        // we don't want to display total or self url in result table
        (headVar: string) => !(headVar === 'self'),
      )
      .map((headVar: string) => ({
        title: camelCaseToLabelString(headVar), // TODO: get the matching title from somewhere?
        dataIndex: headVar,
      }));
       
  // build items
  const items =
    data &&
    data.results.bindings
      // we only want resources
      .filter((binding: any) => binding.self)
      .map((binding: any, index: number) => {
        // let's get the value for each headerProperties
        const properties = headerProperties.reduce(
          (prev, curr) => ({
            ...prev,
            [curr.dataIndex]:
              (binding[curr.dataIndex] && binding[curr.dataIndex].value) ||
              undefined,
          }),
          {},
        );

        // return item data
        return {
          ...properties, // our properties
          id: getLabel(decodeURIComponent(binding.self.value)), // id is used by antd component
          self: binding.self.value, // used in order to load details or resource once selected
          key: `${binding.self.value}-${index}`, // used by react component (unique key)
        };
      });

  return (
    <Spin spinning={loading}>
      {error && !data && <Empty>{error.message}</Empty>}
      {data && (
        <>
          <ResultTable
            headerProperties={headerProperties}
            items={items}
            handleClick={props.handleClick}
            handleFileSelect={props.OnFileSelect}
            selectedFileIds={props.selectedFileIds}
          />
        </>
      )}
    </Spin>
  );
};


export default RecNrnMorphologyCollectionContainer;
