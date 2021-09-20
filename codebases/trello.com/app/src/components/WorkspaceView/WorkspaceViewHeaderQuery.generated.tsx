import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"WorkspaceViewHeader"}}
export type WorkspaceViewHeaderQueryVariables = Types.Exact<{
  orgId: Types.Scalars['ID'];
}>;


export type WorkspaceViewHeaderQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id' | 'products'>
  )> }
);


export const WorkspaceViewHeaderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WorkspaceViewHeader"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"products"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useWorkspaceViewHeaderQuery__
 *
 * To run a query within a React component, call `useWorkspaceViewHeaderQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceViewHeaderQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceViewHeaderQuery({
 *   variables: {
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useWorkspaceViewHeaderQuery(baseOptions: Apollo.QueryHookOptions<WorkspaceViewHeaderQuery, WorkspaceViewHeaderQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspaceViewHeaderQuery, WorkspaceViewHeaderQueryVariables>(WorkspaceViewHeaderDocument, options);
      }
export function useWorkspaceViewHeaderLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspaceViewHeaderQuery, WorkspaceViewHeaderQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspaceViewHeaderQuery, WorkspaceViewHeaderQueryVariables>(WorkspaceViewHeaderDocument, options);
        }
export type WorkspaceViewHeaderQueryHookResult = ReturnType<typeof useWorkspaceViewHeaderQuery>;
export type WorkspaceViewHeaderLazyQueryHookResult = ReturnType<typeof useWorkspaceViewHeaderLazyQuery>;
export type WorkspaceViewHeaderQueryResult = Apollo.QueryResult<WorkspaceViewHeaderQuery, WorkspaceViewHeaderQueryVariables>;