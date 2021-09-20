import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"MemberContextData"}}
export type MemberContextDataQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type MemberContextDataQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'products'>
    & { logins: Array<(
      { __typename: 'Login' }
      & Pick<Types.Login, 'claimable'>
    )>, organizations: Array<(
      { __typename: 'Organization' }
      & Pick<Types.Organization, 'premiumFeatures' | 'products'>
    )> }
  )> }
);


export const MemberContextDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MemberContextData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"logins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"claimable"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}},{"kind":"Field","name":{"kind":"Name","value":"products"}}]}},{"kind":"Field","name":{"kind":"Name","value":"products"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useMemberContextDataQuery__
 *
 * To run a query within a React component, call `useMemberContextDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useMemberContextDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMemberContextDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useMemberContextDataQuery(baseOptions?: Apollo.QueryHookOptions<MemberContextDataQuery, MemberContextDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MemberContextDataQuery, MemberContextDataQueryVariables>(MemberContextDataDocument, options);
      }
export function useMemberContextDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MemberContextDataQuery, MemberContextDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MemberContextDataQuery, MemberContextDataQueryVariables>(MemberContextDataDocument, options);
        }
export type MemberContextDataQueryHookResult = ReturnType<typeof useMemberContextDataQuery>;
export type MemberContextDataLazyQueryHookResult = ReturnType<typeof useMemberContextDataLazyQuery>;
export type MemberContextDataQueryResult = Apollo.QueryResult<MemberContextDataQuery, MemberContextDataQueryVariables>;