import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"WorkspacesPreambleCreateTeam"}}
export type WorkspacesPreambleCreateTeamQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID'];
}>;


export type WorkspacesPreambleCreateTeamQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id'>
    & { members: Array<(
      { __typename: 'Member' }
      & Pick<Types.Member, 'confirmed' | 'id'>
    )>, prefs?: Types.Maybe<(
      { __typename: 'Board_Prefs' }
      & Pick<Types.Board_Prefs, 'isTemplate' | 'permissionLevel'>
    )> }
  )> }
);


export const WorkspacesPreambleCreateTeamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WorkspacesPreambleCreateTeam"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"confirmed"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"permissionLevel"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useWorkspacesPreambleCreateTeamQuery__
 *
 * To run a query within a React component, call `useWorkspacesPreambleCreateTeamQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspacesPreambleCreateTeamQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspacesPreambleCreateTeamQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *   },
 * });
 */
export function useWorkspacesPreambleCreateTeamQuery(baseOptions: Apollo.QueryHookOptions<WorkspacesPreambleCreateTeamQuery, WorkspacesPreambleCreateTeamQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspacesPreambleCreateTeamQuery, WorkspacesPreambleCreateTeamQueryVariables>(WorkspacesPreambleCreateTeamDocument, options);
      }
export function useWorkspacesPreambleCreateTeamLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspacesPreambleCreateTeamQuery, WorkspacesPreambleCreateTeamQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspacesPreambleCreateTeamQuery, WorkspacesPreambleCreateTeamQueryVariables>(WorkspacesPreambleCreateTeamDocument, options);
        }
export type WorkspacesPreambleCreateTeamQueryHookResult = ReturnType<typeof useWorkspacesPreambleCreateTeamQuery>;
export type WorkspacesPreambleCreateTeamLazyQueryHookResult = ReturnType<typeof useWorkspacesPreambleCreateTeamLazyQuery>;
export type WorkspacesPreambleCreateTeamQueryResult = Apollo.QueryResult<WorkspacesPreambleCreateTeamQuery, WorkspacesPreambleCreateTeamQueryVariables>;