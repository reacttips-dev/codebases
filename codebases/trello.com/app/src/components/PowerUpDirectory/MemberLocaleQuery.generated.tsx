import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"MemberLocale"}}
export type MemberLocaleQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type MemberLocaleQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & { prefs?: Types.Maybe<(
      { __typename: 'Member_Prefs' }
      & Pick<Types.Member_Prefs, 'locale'>
    )> }
  )> }
);


export const MemberLocaleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MemberLocale"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useMemberLocaleQuery__
 *
 * To run a query within a React component, call `useMemberLocaleQuery` and pass it any options that fit your needs.
 * When your component renders, `useMemberLocaleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMemberLocaleQuery({
 *   variables: {
 *   },
 * });
 */
export function useMemberLocaleQuery(baseOptions?: Apollo.QueryHookOptions<MemberLocaleQuery, MemberLocaleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MemberLocaleQuery, MemberLocaleQueryVariables>(MemberLocaleDocument, options);
      }
export function useMemberLocaleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MemberLocaleQuery, MemberLocaleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MemberLocaleQuery, MemberLocaleQueryVariables>(MemberLocaleDocument, options);
        }
export type MemberLocaleQueryHookResult = ReturnType<typeof useMemberLocaleQuery>;
export type MemberLocaleLazyQueryHookResult = ReturnType<typeof useMemberLocaleLazyQuery>;
export type MemberLocaleQueryResult = Apollo.QueryResult<MemberLocaleQuery, MemberLocaleQueryVariables>;