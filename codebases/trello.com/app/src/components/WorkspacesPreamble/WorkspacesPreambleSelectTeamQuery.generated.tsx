import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"WorkspacesPreambleSelectTeam"}}
export type WorkspacesPreambleSelectTeamQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type WorkspacesPreambleSelectTeamQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & { organizations: Array<(
      { __typename: 'Organization' }
      & Pick<Types.Organization, 'id' | 'displayName'>
      & { limits: (
        { __typename: 'Organization_Limits' }
        & { orgs: (
          { __typename: 'Organization_Limits_Orgs' }
          & { freeBoardsPerOrg: (
            { __typename: 'Limit' }
            & Pick<Types.Limit, 'status'>
          ) }
        ) }
      ) }
    )> }
  )> }
);


export const WorkspacesPreambleSelectTeamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WorkspacesPreambleSelectTeam"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"limits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orgs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"freeBoardsPerOrg"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useWorkspacesPreambleSelectTeamQuery__
 *
 * To run a query within a React component, call `useWorkspacesPreambleSelectTeamQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspacesPreambleSelectTeamQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspacesPreambleSelectTeamQuery({
 *   variables: {
 *   },
 * });
 */
export function useWorkspacesPreambleSelectTeamQuery(baseOptions?: Apollo.QueryHookOptions<WorkspacesPreambleSelectTeamQuery, WorkspacesPreambleSelectTeamQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspacesPreambleSelectTeamQuery, WorkspacesPreambleSelectTeamQueryVariables>(WorkspacesPreambleSelectTeamDocument, options);
      }
export function useWorkspacesPreambleSelectTeamLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspacesPreambleSelectTeamQuery, WorkspacesPreambleSelectTeamQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspacesPreambleSelectTeamQuery, WorkspacesPreambleSelectTeamQueryVariables>(WorkspacesPreambleSelectTeamDocument, options);
        }
export type WorkspacesPreambleSelectTeamQueryHookResult = ReturnType<typeof useWorkspacesPreambleSelectTeamQuery>;
export type WorkspacesPreambleSelectTeamLazyQueryHookResult = ReturnType<typeof useWorkspacesPreambleSelectTeamLazyQuery>;
export type WorkspacesPreambleSelectTeamQueryResult = Apollo.QueryResult<WorkspacesPreambleSelectTeamQuery, WorkspacesPreambleSelectTeamQueryVariables>;