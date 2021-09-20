import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"ClosedBoards"}}
export type ClosedBoardsQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type ClosedBoardsQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & { boards: Array<(
      { __typename: 'Board' }
      & Pick<Types.Board, 'closed' | 'id' | 'idOrganization' | 'name' | 'shortLink'>
      & { memberships: Array<(
        { __typename: 'Board_Membership' }
        & Pick<Types.Board_Membership, 'id' | 'idMember' | 'memberType' | 'unconfirmed' | 'deactivated'>
      )> }
    )> }
  )> }
);


export const ClosedBoardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ClosedBoards"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"closed"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"unconfirmed"}},{"kind":"Field","name":{"kind":"Name","value":"deactivated"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shortLink"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useClosedBoardsQuery__
 *
 * To run a query within a React component, call `useClosedBoardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useClosedBoardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClosedBoardsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useClosedBoardsQuery(baseOptions: Apollo.QueryHookOptions<ClosedBoardsQuery, ClosedBoardsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ClosedBoardsQuery, ClosedBoardsQueryVariables>(ClosedBoardsDocument, options);
      }
export function useClosedBoardsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ClosedBoardsQuery, ClosedBoardsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ClosedBoardsQuery, ClosedBoardsQueryVariables>(ClosedBoardsDocument, options);
        }
export type ClosedBoardsQueryHookResult = ReturnType<typeof useClosedBoardsQuery>;
export type ClosedBoardsLazyQueryHookResult = ReturnType<typeof useClosedBoardsLazyQuery>;
export type ClosedBoardsQueryResult = Apollo.QueryResult<ClosedBoardsQuery, ClosedBoardsQueryVariables>;