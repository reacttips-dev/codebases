import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"MemberOpenBoards"}}
export type MemberOpenBoardsQueryVariables = Types.Exact<{
  parentId: Types.Scalars['ID'];
}>;


export type MemberOpenBoardsQuery = (
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


export const MemberOpenBoardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MemberOpenBoards"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"boards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"open"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useMemberOpenBoardsQuery__
 *
 * To run a query within a React component, call `useMemberOpenBoardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMemberOpenBoardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMemberOpenBoardsQuery({
 *   variables: {
 *      parentId: // value for 'parentId'
 *   },
 * });
 */
export function useMemberOpenBoardsQuery(baseOptions: Apollo.QueryHookOptions<MemberOpenBoardsQuery, MemberOpenBoardsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MemberOpenBoardsQuery, MemberOpenBoardsQueryVariables>(MemberOpenBoardsDocument, options);
      }
export function useMemberOpenBoardsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MemberOpenBoardsQuery, MemberOpenBoardsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MemberOpenBoardsQuery, MemberOpenBoardsQueryVariables>(MemberOpenBoardsDocument, options);
        }
export type MemberOpenBoardsQueryHookResult = ReturnType<typeof useMemberOpenBoardsQuery>;
export type MemberOpenBoardsLazyQueryHookResult = ReturnType<typeof useMemberOpenBoardsLazyQuery>;
export type MemberOpenBoardsQueryResult = Apollo.QueryResult<MemberOpenBoardsQuery, MemberOpenBoardsQueryVariables>;