import gql from 'graphql-tag';

/* eslint-disable graphql/template-strings */
export const changedResponseFragment = gql`
  fragment ChangedResponseFragment on LocalChangedResponse {
    id
    response
  }
`;

export const changedResponseQuery = gql`
  query ChangedResponseQuery($id: String!) {
    ChangedResponse @client {
      get(id: $id) @client {
        id
        response
      }
    }
  }
`;

export const changedResponsesQuery = gql`
  query ChangedResponsesQuery($ids: [String]!) {
    ChangedResponse @client {
      multiGet(ids: $ids) @client {
        responses {
          id
          response
        }
      }
    }
  }
`;
/* eslint-enable graphql/template-strings */
