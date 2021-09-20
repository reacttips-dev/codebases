import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"WorkspacesPreamblePrompt"}}
export type WorkspacesPreamblePromptQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID'];
}>;


export type WorkspacesPreamblePromptQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & { members: Array<(
      { __typename: 'Member' }
      & Pick<Types.Member, 'id'>
    )> }
  )>, member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'idOrganizations'>
  )> }
);


export const WorkspacesPreamblePromptDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WorkspacesPreamblePrompt"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idOrganizations"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useWorkspacesPreamblePromptQuery__
 *
 * To run a query within a React component, call `useWorkspacesPreamblePromptQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspacesPreamblePromptQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspacesPreamblePromptQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *   },
 * });
 */
export function useWorkspacesPreamblePromptQuery(baseOptions: Apollo.QueryHookOptions<WorkspacesPreamblePromptQuery, WorkspacesPreamblePromptQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspacesPreamblePromptQuery, WorkspacesPreamblePromptQueryVariables>(WorkspacesPreamblePromptDocument, options);
      }
export function useWorkspacesPreamblePromptLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspacesPreamblePromptQuery, WorkspacesPreamblePromptQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspacesPreamblePromptQuery, WorkspacesPreamblePromptQueryVariables>(WorkspacesPreamblePromptDocument, options);
        }
export type WorkspacesPreamblePromptQueryHookResult = ReturnType<typeof useWorkspacesPreamblePromptQuery>;
export type WorkspacesPreamblePromptLazyQueryHookResult = ReturnType<typeof useWorkspacesPreamblePromptLazyQuery>;
export type WorkspacesPreamblePromptQueryResult = Apollo.QueryResult<WorkspacesPreamblePromptQuery, WorkspacesPreamblePromptQueryVariables>;