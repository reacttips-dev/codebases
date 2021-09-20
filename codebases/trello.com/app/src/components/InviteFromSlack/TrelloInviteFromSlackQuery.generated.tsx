import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"TrelloInviteFromSlack"}}
export type TrelloInviteFromSlackQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID'];
  idBoard: Types.Scalars['ID'];
}>;


export type TrelloInviteFromSlackQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'oneTimeMessagesDismissed'>
  )>, board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'shortLink'>
  )> }
);


export const TrelloInviteFromSlackDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TrelloInviteFromSlack"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shortLink"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useTrelloInviteFromSlackQuery__
 *
 * To run a query within a React component, call `useTrelloInviteFromSlackQuery` and pass it any options that fit your needs.
 * When your component renders, `useTrelloInviteFromSlackQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTrelloInviteFromSlackQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *      idBoard: // value for 'idBoard'
 *   },
 * });
 */
export function useTrelloInviteFromSlackQuery(baseOptions: Apollo.QueryHookOptions<TrelloInviteFromSlackQuery, TrelloInviteFromSlackQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TrelloInviteFromSlackQuery, TrelloInviteFromSlackQueryVariables>(TrelloInviteFromSlackDocument, options);
      }
export function useTrelloInviteFromSlackLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TrelloInviteFromSlackQuery, TrelloInviteFromSlackQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TrelloInviteFromSlackQuery, TrelloInviteFromSlackQueryVariables>(TrelloInviteFromSlackDocument, options);
        }
export type TrelloInviteFromSlackQueryHookResult = ReturnType<typeof useTrelloInviteFromSlackQuery>;
export type TrelloInviteFromSlackLazyQueryHookResult = ReturnType<typeof useTrelloInviteFromSlackLazyQuery>;
export type TrelloInviteFromSlackQueryResult = Apollo.QueryResult<TrelloInviteFromSlackQuery, TrelloInviteFromSlackQueryVariables>;