import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"MemberOpenCards"}}
export type MemberOpenCardsQueryVariables = Types.Exact<{
  parentId: Types.Scalars['ID'];
}>;


export type MemberOpenCardsQuery = (
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


export const MemberOpenCardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MemberOpenCards"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"open"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useMemberOpenCardsQuery__
 *
 * To run a query within a React component, call `useMemberOpenCardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMemberOpenCardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMemberOpenCardsQuery({
 *   variables: {
 *      parentId: // value for 'parentId'
 *   },
 * });
 */
export function useMemberOpenCardsQuery(baseOptions: Apollo.QueryHookOptions<MemberOpenCardsQuery, MemberOpenCardsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MemberOpenCardsQuery, MemberOpenCardsQueryVariables>(MemberOpenCardsDocument, options);
      }
export function useMemberOpenCardsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MemberOpenCardsQuery, MemberOpenCardsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MemberOpenCardsQuery, MemberOpenCardsQueryVariables>(MemberOpenCardsDocument, options);
        }
export type MemberOpenCardsQueryHookResult = ReturnType<typeof useMemberOpenCardsQuery>;
export type MemberOpenCardsLazyQueryHookResult = ReturnType<typeof useMemberOpenCardsLazyQuery>;
export type MemberOpenCardsQueryResult = Apollo.QueryResult<MemberOpenCardsQuery, MemberOpenCardsQueryVariables>;