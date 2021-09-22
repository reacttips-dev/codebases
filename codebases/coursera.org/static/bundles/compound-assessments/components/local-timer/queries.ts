import gql from 'graphql-tag';

/* eslint-disable graphql/template-strings */
export const localTimerFragment = gql`
  fragment LocalTimerFragment on LocalTimerState {
    id
    expiresAt
  }
`;

export const localTimerQuery = gql`
  query GetLocalTimerQuery($id: String!) {
    LocalTimer @client {
      get(id: $id) @client {
        ...LocalTimerFragment
      }
    }
  }
  ${localTimerFragment}
`;
/* eslint-enable graphql/template-strings */
