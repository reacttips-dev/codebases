import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { tupleToStringKey } from 'js/lib/stringKeyTuple';
import { ResourcePanelTabsV1, TabsDataLookupProps } from './__types__';

/* eslint-disable graphql/template-strings */
export const ResoursePanelTabsQuery = gql`
  query ResoursePanelTabsQuery($courseItemId: String!) {
    ResourcePanelTabsV1(courseItemId: $courseItemId)
      @rest(type: "ResourcePanelTabs", path: "resourcePanelTabs.v1/{args.courseItemId}", method: "GET") {
      elements @type(name: "ResourcePanelTabs") {
        tabs
      }
    }
  }
`;
/* eslint-enable graphql/template-strings */

type QueryResponse = {
  ResourcePanelTabsV1: {
    elements?: [
      {
        tabs?: ResourcePanelTabsV1;
      }
    ];
  };
};

const parseTabsApiResponse = (response: QueryResponse) => {
  if (!response || (response && !('ResourcePanelTabsV1' in response))) {
    return [];
  }
  const elements = response.ResourcePanelTabsV1.elements;
  if (
    elements &&
    Array.isArray(elements) &&
    elements.length > 0 &&
    typeof elements[0] === 'object' &&
    'tabs' in elements[0]
  ) {
    const [{ tabs }] = elements;
    return tabs;
  } else {
    return [];
  }
};

const TabsDataProvider: React.FC<TabsDataLookupProps> = ({ courseId, itemId, children }) => (
  <Query<QueryResponse, { courseItemId: string }>
    query={ResoursePanelTabsQuery}
    variables={{ courseItemId: tupleToStringKey([courseId, itemId]) }}
  >
    {({ loading, error, data }) => {
      if (loading || error) return children({ loading, error });

      if (data) {
        const resourcePanelTabs = parseTabsApiResponse(data);
        return children({ loading: false, error, data: resourcePanelTabs });
      } else {
        return null;
      }
    }}
  </Query>
);

export default TabsDataProvider;
