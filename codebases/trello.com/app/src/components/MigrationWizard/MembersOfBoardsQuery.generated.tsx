import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"MembersOfBoards"}}
export type MembersOfBoardsQueryVariables = Types.Exact<{
  idBoards: Array<Types.Scalars['ID']> | Types.Scalars['ID'];
}>;


export type MembersOfBoardsQuery = (
  { __typename: 'Query' }
  & { boards: Array<(
    { __typename: 'Board' }
    & { members: Array<(
      { __typename: 'Member' }
      & Pick<Types.Member, 'id' | 'fullName' | 'username' | 'initials' | 'avatarUrl' | 'avatarSource' | 'products'>
      & { nonPublic?: Types.Maybe<(
        { __typename: 'Member_NonPublic' }
        & Pick<Types.Member_NonPublic, 'avatarUrl' | 'initials' | 'fullName'>
      )> }
    )> }
  )> }
);


export const MembersOfBoardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MembersOfBoards"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idBoards"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idBoards"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"initials"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"avatarSource"}},{"kind":"Field","name":{"kind":"Name","value":"products"}},{"kind":"Field","name":{"kind":"Name","value":"nonPublic"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"initials"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useMembersOfBoardsQuery__
 *
 * To run a query within a React component, call `useMembersOfBoardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMembersOfBoardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMembersOfBoardsQuery({
 *   variables: {
 *      idBoards: // value for 'idBoards'
 *   },
 * });
 */
export function useMembersOfBoardsQuery(baseOptions: Apollo.QueryHookOptions<MembersOfBoardsQuery, MembersOfBoardsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MembersOfBoardsQuery, MembersOfBoardsQueryVariables>(MembersOfBoardsDocument, options);
      }
export function useMembersOfBoardsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MembersOfBoardsQuery, MembersOfBoardsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MembersOfBoardsQuery, MembersOfBoardsQueryVariables>(MembersOfBoardsDocument, options);
        }
export type MembersOfBoardsQueryHookResult = ReturnType<typeof useMembersOfBoardsQuery>;
export type MembersOfBoardsLazyQueryHookResult = ReturnType<typeof useMembersOfBoardsLazyQuery>;
export type MembersOfBoardsQueryResult = Apollo.QueryResult<MembersOfBoardsQuery, MembersOfBoardsQueryVariables>;