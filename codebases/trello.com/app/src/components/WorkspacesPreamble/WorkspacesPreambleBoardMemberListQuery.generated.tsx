import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"WorkspacesPreambleBoardMemberList"}}
export type WorkspacesPreambleBoardMemberListQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID'];
}>;


export type WorkspacesPreambleBoardMemberListQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id'>
    & { members: Array<(
      { __typename: 'Member' }
      & Pick<Types.Member, 'confirmed' | 'fullName' | 'id'>
      & { nonPublic?: Types.Maybe<(
        { __typename: 'Member_NonPublic' }
        & Pick<Types.Member_NonPublic, 'fullName'>
      )> }
    )> }
  )> }
);


export const WorkspacesPreambleBoardMemberListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WorkspacesPreambleBoardMemberList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"confirmed"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nonPublic"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useWorkspacesPreambleBoardMemberListQuery__
 *
 * To run a query within a React component, call `useWorkspacesPreambleBoardMemberListQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspacesPreambleBoardMemberListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspacesPreambleBoardMemberListQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *   },
 * });
 */
export function useWorkspacesPreambleBoardMemberListQuery(baseOptions: Apollo.QueryHookOptions<WorkspacesPreambleBoardMemberListQuery, WorkspacesPreambleBoardMemberListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspacesPreambleBoardMemberListQuery, WorkspacesPreambleBoardMemberListQueryVariables>(WorkspacesPreambleBoardMemberListDocument, options);
      }
export function useWorkspacesPreambleBoardMemberListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspacesPreambleBoardMemberListQuery, WorkspacesPreambleBoardMemberListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspacesPreambleBoardMemberListQuery, WorkspacesPreambleBoardMemberListQueryVariables>(WorkspacesPreambleBoardMemberListDocument, options);
        }
export type WorkspacesPreambleBoardMemberListQueryHookResult = ReturnType<typeof useWorkspacesPreambleBoardMemberListQuery>;
export type WorkspacesPreambleBoardMemberListLazyQueryHookResult = ReturnType<typeof useWorkspacesPreambleBoardMemberListLazyQuery>;
export type WorkspacesPreambleBoardMemberListQueryResult = Apollo.QueryResult<WorkspacesPreambleBoardMemberListQuery, WorkspacesPreambleBoardMemberListQueryVariables>;