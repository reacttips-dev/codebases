import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"QuickFilterTableMember"}}
export type QuickFilterTableMemberQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type QuickFilterTableMemberQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & { prefs?: Types.Maybe<(
      { __typename: 'Member_Prefs' }
      & Pick<Types.Member_Prefs, 'colorBlind'>
    )> }
  )> }
);


export const QuickFilterTableMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"QuickFilterTableMember"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"colorBlind"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useQuickFilterTableMemberQuery__
 *
 * To run a query within a React component, call `useQuickFilterTableMemberQuery` and pass it any options that fit your needs.
 * When your component renders, `useQuickFilterTableMemberQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQuickFilterTableMemberQuery({
 *   variables: {
 *   },
 * });
 */
export function useQuickFilterTableMemberQuery(baseOptions?: Apollo.QueryHookOptions<QuickFilterTableMemberQuery, QuickFilterTableMemberQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<QuickFilterTableMemberQuery, QuickFilterTableMemberQueryVariables>(QuickFilterTableMemberDocument, options);
      }
export function useQuickFilterTableMemberLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<QuickFilterTableMemberQuery, QuickFilterTableMemberQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<QuickFilterTableMemberQuery, QuickFilterTableMemberQueryVariables>(QuickFilterTableMemberDocument, options);
        }
export type QuickFilterTableMemberQueryHookResult = ReturnType<typeof useQuickFilterTableMemberQuery>;
export type QuickFilterTableMemberLazyQueryHookResult = ReturnType<typeof useQuickFilterTableMemberLazyQuery>;
export type QuickFilterTableMemberQueryResult = Apollo.QueryResult<QuickFilterTableMemberQuery, QuickFilterTableMemberQueryVariables>;