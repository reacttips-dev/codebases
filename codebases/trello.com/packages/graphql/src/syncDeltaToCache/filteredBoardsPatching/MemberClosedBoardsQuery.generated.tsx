import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"MemberClosedBoards"}}
export type MemberClosedBoardsQueryVariables = Types.Exact<{
  parentId: Types.Scalars['ID'];
}>;


export type MemberClosedBoardsQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id'>
    & { boards: Array<(
      { __typename: 'Board' }
      & Pick<Types.Board, 'id'>
    )> }
  )> }
);


export const MemberClosedBoardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MemberClosedBoards"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"boards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"closed"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useMemberClosedBoardsQuery__
 *
 * To run a query within a React component, call `useMemberClosedBoardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMemberClosedBoardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMemberClosedBoardsQuery({
 *   variables: {
 *      parentId: // value for 'parentId'
 *   },
 * });
 */
export function useMemberClosedBoardsQuery(baseOptions: Apollo.QueryHookOptions<MemberClosedBoardsQuery, MemberClosedBoardsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MemberClosedBoardsQuery, MemberClosedBoardsQueryVariables>(MemberClosedBoardsDocument, options);
      }
export function useMemberClosedBoardsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MemberClosedBoardsQuery, MemberClosedBoardsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MemberClosedBoardsQuery, MemberClosedBoardsQueryVariables>(MemberClosedBoardsDocument, options);
        }
export type MemberClosedBoardsQueryHookResult = ReturnType<typeof useMemberClosedBoardsQuery>;
export type MemberClosedBoardsLazyQueryHookResult = ReturnType<typeof useMemberClosedBoardsLazyQuery>;
export type MemberClosedBoardsQueryResult = Apollo.QueryResult<MemberClosedBoardsQuery, MemberClosedBoardsQueryVariables>;