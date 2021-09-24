import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';

export const STACK = 'Stack';
export const STACK_APP = 'StackApp';

export const getAllStacks = gql`
  query getAllStacks($query: String) {
    searchTags(query: $query) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

export const replaceTags = gql`
  mutation replaceTags($id: ID!, $objectType: String!, $tags: [String!]!) {
    replaceTags(objectId: $id, objectType: $objectType, tags: $tags)
  }
`;

export const TaggingContext = React.createContext({});

export const AllTagsContext = React.createContext({});

const withAllTags = Component => props => {
  return (
    <Query query={getAllStacks} variables={{query: ''}}>
      {({data, loading, refetch}) => {
        const tags =
          data &&
          data.searchTags &&
          data.searchTags.edges &&
          data.searchTags.edges.map(tag => tag.node.name).sort();
        const value = {
          allTagsLoading: loading,
          allTags: tags,
          refetchTags: refetch
        };
        return (
          <AllTagsContext.Provider value={value}>
            <Component {...props} />
          </AllTagsContext.Provider>
        );
      }}
    </Query>
  );
};

export default withAllTags;
