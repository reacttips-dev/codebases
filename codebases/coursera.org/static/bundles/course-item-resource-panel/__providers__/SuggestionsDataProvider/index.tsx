import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { QueryResultType, SuggestionLookupDataProps, Variables } from './__types__';

/* eslint-disable graphql/template-strings */
export const resourcePanelForumPostSuggestionsV1Query = gql`
  query resourcePanelForumPostSuggestionsV1Query($courseId: String!, $itemId: String!) {
    resourcePanelForumPostSuggestionsV1(courseId: $courseId, itemId: $itemId)
      @rest(
        type: "resourcePanelForumPostSuggestionsV1"
        path: "resourcePanelForumPostSuggestions.v1?q=byCourseItemId&courseId={args.courseId}&itemId={args.itemId}"
        method: "GET"
      ) {
      elements
    }
  }
`;

/* eslint-enable graphql/template-strings */

const SuggestionsDataProvider: React.FC<SuggestionLookupDataProps> = ({ courseId, itemId, children }) => (
  <Query<QueryResultType, Variables> query={resourcePanelForumPostSuggestionsV1Query} variables={{ courseId, itemId }}>
    {({ loading, error, data }) => {
      if (loading || error) return children({ loading, error });

      if (data && data.resourcePanelForumPostSuggestionsV1) {
        const elements = data.resourcePanelForumPostSuggestionsV1.elements;
        if (elements && Array.isArray(elements) && elements.length > 0) {
          return children({ loading: false, error, data: elements });
        }
      }

      return children({ loading: false, error, data: [] });
    }}
  </Query>
);

export default SuggestionsDataProvider;
