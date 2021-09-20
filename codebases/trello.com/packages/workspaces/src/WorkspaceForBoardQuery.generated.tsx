import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"WorkspaceForBoard"}}
export type WorkspaceForBoardQueryVariables = Types.Exact<{
  idBoard: Types.Scalars['ID'];
}>;


export type WorkspaceForBoardQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id' | 'idOrganization'>
  )> }
);


export const WorkspaceForBoardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WorkspaceForBoard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useWorkspaceForBoardQuery__
 *
 * To run a query within a React component, call `useWorkspaceForBoardQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceForBoardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceForBoardQuery({
 *   variables: {
 *      idBoard: // value for 'idBoard'
 *   },
 * });
 */
export function useWorkspaceForBoardQuery(baseOptions: Apollo.QueryHookOptions<WorkspaceForBoardQuery, WorkspaceForBoardQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspaceForBoardQuery, WorkspaceForBoardQueryVariables>(WorkspaceForBoardDocument, options);
      }
export function useWorkspaceForBoardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspaceForBoardQuery, WorkspaceForBoardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspaceForBoardQuery, WorkspaceForBoardQueryVariables>(WorkspaceForBoardDocument, options);
        }
export type WorkspaceForBoardQueryHookResult = ReturnType<typeof useWorkspaceForBoardQuery>;
export type WorkspaceForBoardLazyQueryHookResult = ReturnType<typeof useWorkspaceForBoardLazyQuery>;
export type WorkspaceForBoardQueryResult = Apollo.QueryResult<WorkspaceForBoardQuery, WorkspaceForBoardQueryVariables>;