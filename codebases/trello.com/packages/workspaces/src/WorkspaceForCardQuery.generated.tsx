import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"WorkspaceForCard"}}
export type WorkspaceForCardQueryVariables = Types.Exact<{
  idCard: Types.Scalars['ID'];
}>;


export type WorkspaceForCardQuery = (
  { __typename: 'Query' }
  & { card?: Types.Maybe<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'id'>
    & { board: (
      { __typename: 'Board' }
      & Pick<Types.Board, 'id' | 'idOrganization'>
    ) }
  )> }
);


export const WorkspaceForCardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WorkspaceForCard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"board"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useWorkspaceForCardQuery__
 *
 * To run a query within a React component, call `useWorkspaceForCardQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceForCardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceForCardQuery({
 *   variables: {
 *      idCard: // value for 'idCard'
 *   },
 * });
 */
export function useWorkspaceForCardQuery(baseOptions: Apollo.QueryHookOptions<WorkspaceForCardQuery, WorkspaceForCardQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspaceForCardQuery, WorkspaceForCardQueryVariables>(WorkspaceForCardDocument, options);
      }
export function useWorkspaceForCardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspaceForCardQuery, WorkspaceForCardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspaceForCardQuery, WorkspaceForCardQueryVariables>(WorkspaceForCardDocument, options);
        }
export type WorkspaceForCardQueryHookResult = ReturnType<typeof useWorkspaceForCardQuery>;
export type WorkspaceForCardLazyQueryHookResult = ReturnType<typeof useWorkspaceForCardLazyQuery>;
export type WorkspaceForCardQueryResult = Apollo.QueryResult<WorkspaceForCardQuery, WorkspaceForCardQueryVariables>;