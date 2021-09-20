import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"GetBoardMemberIds"}}
export type GetBoardMemberIdsQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID'];
}>;


export type GetBoardMemberIdsQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & { members: Array<(
      { __typename: 'Member' }
      & Pick<Types.Member, 'id'>
    )> }
  )> }
);


export const GetBoardMemberIdsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBoardMemberIds"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useGetBoardMemberIdsQuery__
 *
 * To run a query within a React component, call `useGetBoardMemberIdsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBoardMemberIdsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBoardMemberIdsQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *   },
 * });
 */
export function useGetBoardMemberIdsQuery(baseOptions: Apollo.QueryHookOptions<GetBoardMemberIdsQuery, GetBoardMemberIdsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBoardMemberIdsQuery, GetBoardMemberIdsQueryVariables>(GetBoardMemberIdsDocument, options);
      }
export function useGetBoardMemberIdsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBoardMemberIdsQuery, GetBoardMemberIdsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBoardMemberIdsQuery, GetBoardMemberIdsQueryVariables>(GetBoardMemberIdsDocument, options);
        }
export type GetBoardMemberIdsQueryHookResult = ReturnType<typeof useGetBoardMemberIdsQuery>;
export type GetBoardMemberIdsLazyQueryHookResult = ReturnType<typeof useGetBoardMemberIdsLazyQuery>;
export type GetBoardMemberIdsQueryResult = Apollo.QueryResult<GetBoardMemberIdsQuery, GetBoardMemberIdsQueryVariables>;