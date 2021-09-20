import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"WorkspaceNavigationOneTimeMessagesDismissed"}}
export type WorkspaceNavigationOneTimeMessagesDismissedQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type WorkspaceNavigationOneTimeMessagesDismissedQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'oneTimeMessagesDismissed'>
  )> }
);


export const WorkspaceNavigationOneTimeMessagesDismissedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WorkspaceNavigationOneTimeMessagesDismissed"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useWorkspaceNavigationOneTimeMessagesDismissedQuery__
 *
 * To run a query within a React component, call `useWorkspaceNavigationOneTimeMessagesDismissedQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceNavigationOneTimeMessagesDismissedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceNavigationOneTimeMessagesDismissedQuery({
 *   variables: {
 *   },
 * });
 */
export function useWorkspaceNavigationOneTimeMessagesDismissedQuery(baseOptions?: Apollo.QueryHookOptions<WorkspaceNavigationOneTimeMessagesDismissedQuery, WorkspaceNavigationOneTimeMessagesDismissedQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspaceNavigationOneTimeMessagesDismissedQuery, WorkspaceNavigationOneTimeMessagesDismissedQueryVariables>(WorkspaceNavigationOneTimeMessagesDismissedDocument, options);
      }
export function useWorkspaceNavigationOneTimeMessagesDismissedLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspaceNavigationOneTimeMessagesDismissedQuery, WorkspaceNavigationOneTimeMessagesDismissedQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspaceNavigationOneTimeMessagesDismissedQuery, WorkspaceNavigationOneTimeMessagesDismissedQueryVariables>(WorkspaceNavigationOneTimeMessagesDismissedDocument, options);
        }
export type WorkspaceNavigationOneTimeMessagesDismissedQueryHookResult = ReturnType<typeof useWorkspaceNavigationOneTimeMessagesDismissedQuery>;
export type WorkspaceNavigationOneTimeMessagesDismissedLazyQueryHookResult = ReturnType<typeof useWorkspaceNavigationOneTimeMessagesDismissedLazyQuery>;
export type WorkspaceNavigationOneTimeMessagesDismissedQueryResult = Apollo.QueryResult<WorkspaceNavigationOneTimeMessagesDismissedQuery, WorkspaceNavigationOneTimeMessagesDismissedQueryVariables>;