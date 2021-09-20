import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"VeryHeavyUsage"}}
export type VeryHeavyUsageQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type VeryHeavyUsageQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'oneTimeMessagesDismissed'>
  )> }
);


export const VeryHeavyUsageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"VeryHeavyUsage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useVeryHeavyUsageQuery__
 *
 * To run a query within a React component, call `useVeryHeavyUsageQuery` and pass it any options that fit your needs.
 * When your component renders, `useVeryHeavyUsageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVeryHeavyUsageQuery({
 *   variables: {
 *   },
 * });
 */
export function useVeryHeavyUsageQuery(baseOptions?: Apollo.QueryHookOptions<VeryHeavyUsageQuery, VeryHeavyUsageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<VeryHeavyUsageQuery, VeryHeavyUsageQueryVariables>(VeryHeavyUsageDocument, options);
      }
export function useVeryHeavyUsageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<VeryHeavyUsageQuery, VeryHeavyUsageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<VeryHeavyUsageQuery, VeryHeavyUsageQueryVariables>(VeryHeavyUsageDocument, options);
        }
export type VeryHeavyUsageQueryHookResult = ReturnType<typeof useVeryHeavyUsageQuery>;
export type VeryHeavyUsageLazyQueryHookResult = ReturnType<typeof useVeryHeavyUsageLazyQuery>;
export type VeryHeavyUsageQueryResult = Apollo.QueryResult<VeryHeavyUsageQuery, VeryHeavyUsageQueryVariables>;