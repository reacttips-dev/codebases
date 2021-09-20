import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"MemberClosedCards"}}
export type MemberClosedCardsQueryVariables = Types.Exact<{
  parentId: Types.Scalars['ID'];
}>;


export type MemberClosedCardsQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id'>
    & { cards: Array<(
      { __typename: 'Card' }
      & Pick<Types.Card, 'id'>
    )> }
  )> }
);


export const MemberClosedCardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MemberClosedCards"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"closed"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useMemberClosedCardsQuery__
 *
 * To run a query within a React component, call `useMemberClosedCardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMemberClosedCardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMemberClosedCardsQuery({
 *   variables: {
 *      parentId: // value for 'parentId'
 *   },
 * });
 */
export function useMemberClosedCardsQuery(baseOptions: Apollo.QueryHookOptions<MemberClosedCardsQuery, MemberClosedCardsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MemberClosedCardsQuery, MemberClosedCardsQueryVariables>(MemberClosedCardsDocument, options);
      }
export function useMemberClosedCardsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MemberClosedCardsQuery, MemberClosedCardsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MemberClosedCardsQuery, MemberClosedCardsQueryVariables>(MemberClosedCardsDocument, options);
        }
export type MemberClosedCardsQueryHookResult = ReturnType<typeof useMemberClosedCardsQuery>;
export type MemberClosedCardsLazyQueryHookResult = ReturnType<typeof useMemberClosedCardsLazyQuery>;
export type MemberClosedCardsQueryResult = Apollo.QueryResult<MemberClosedCardsQuery, MemberClosedCardsQueryVariables>;