import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"CardTemplateMember"}}
export type CardTemplateMemberQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CardTemplateMemberQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id'>
    & { prefs?: Types.Maybe<(
      { __typename: 'Member_Prefs' }
      & Pick<Types.Member_Prefs, 'colorBlind'>
    )> }
  )> }
);


export const CardTemplateMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CardTemplateMember"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"colorBlind"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useCardTemplateMemberQuery__
 *
 * To run a query within a React component, call `useCardTemplateMemberQuery` and pass it any options that fit your needs.
 * When your component renders, `useCardTemplateMemberQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCardTemplateMemberQuery({
 *   variables: {
 *   },
 * });
 */
export function useCardTemplateMemberQuery(baseOptions?: Apollo.QueryHookOptions<CardTemplateMemberQuery, CardTemplateMemberQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CardTemplateMemberQuery, CardTemplateMemberQueryVariables>(CardTemplateMemberDocument, options);
      }
export function useCardTemplateMemberLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CardTemplateMemberQuery, CardTemplateMemberQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CardTemplateMemberQuery, CardTemplateMemberQueryVariables>(CardTemplateMemberDocument, options);
        }
export type CardTemplateMemberQueryHookResult = ReturnType<typeof useCardTemplateMemberQuery>;
export type CardTemplateMemberLazyQueryHookResult = ReturnType<typeof useCardTemplateMemberLazyQuery>;
export type CardTemplateMemberQueryResult = Apollo.QueryResult<CardTemplateMemberQuery, CardTemplateMemberQueryVariables>;