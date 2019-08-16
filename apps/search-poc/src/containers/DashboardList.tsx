import * as React from 'react';
import { withRouter, History } from 'react-router-dom';
import queryString from 'query-string';
import TabList from '../components/TabList';

function getDashBoardConfig(
  id: string,
  configs: DashboardConfig[],
): DashboardConfig {
  return configs.find(config => config.dashboard['@id'] === id) || configs[0];
}

type DashboardConfig = { dashboard: DashboardContainer; view: View };

type DashboardContainer = {
  '@id': string;
  '@type': string;
  label: string;
  description?: string;
  dataQuery: string;
};

type View = {
  '@id': string;
  org: string;
  project: string;
};

const DashboardListContainer: React.FunctionComponent<{
  dashboardConfig: DashboardConfig[];
  onDashboardSelected: (
    orgLabel: string,
    projectLabel: string,
    viewId: string,
    dataQuery: string,
  ) => void;
  history: History;
}> = ({ dashboardConfig, onDashboardSelected, history }) => {
  const queryStringDashboardId =
    queryString.parse(history.location.search).dashboard || '';
  const activeDashboardId = getDashBoardConfig(
    queryStringDashboardId.toString(),
    dashboardConfig,
  ).dashboard['@id'];

  // format dashboard data for TabList component
  const dashboardConfigData = dashboardConfig.map(config => ({
    id: config.dashboard['@id'],
    label: config.dashboard.label,
    description: config.dashboard.description,
  }));

  return (
    <TabList
      items={dashboardConfigData}
      onSelected={dashboardId => {
        const activeDashboard = dashboardId
          ? getDashBoardConfig(dashboardId.toString(), dashboardConfig)
          : dashboardConfig[0];
        onDashboardSelected(
          activeDashboard.view.org,
          activeDashboard.view.project,
          activeDashboard.view['@id'],
          activeDashboard.dashboard.dataQuery,
        );
        history.push({ search: `?dashboard=${dashboardId}` });
      }}
      defaultActiveId={activeDashboardId}
    />
  );
};

export default withRouter(DashboardListContainer);