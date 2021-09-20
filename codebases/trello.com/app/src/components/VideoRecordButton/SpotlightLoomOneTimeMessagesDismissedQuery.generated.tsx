import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"SpotlightLoomOneTimeMessagesDismissed"}}
export type SpotlightLoomOneTimeMessagesDismissedQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type SpotlightLoomOneTimeMessagesDismissedQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'oneTimeMessagesDismissed'>
  )> }
);


export const SpotlightLoomOneTimeMessagesDismissedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SpotlightLoomOneTimeMessagesDismissed"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useSpotlightLoomOneTimeMessagesDismissedQuery__
 *
 * To run a query within a React component, call `useSpotlightLoomOneTimeMessagesDismissedQuery` and pass it any options that fit your needs.
 * When your component renders, `useSpotlightLoomOneTimeMessagesDismissedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSpotlightLoomOneTimeMessagesDismissedQuery({
 *   variables: {
 *   },
 * });
 */
export function useSpotlightLoomOneTimeMessagesDismissedQuery(baseOptions?: Apollo.QueryHookOptions<SpotlightLoomOneTimeMessagesDismissedQuery, SpotlightLoomOneTimeMessagesDismissedQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SpotlightLoomOneTimeMessagesDismissedQuery, SpotlightLoomOneTimeMessagesDismissedQueryVariables>(SpotlightLoomOneTimeMessagesDismissedDocument, options);
      }
export function useSpotlightLoomOneTimeMessagesDismissedLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SpotlightLoomOneTimeMessagesDismissedQuery, SpotlightLoomOneTimeMessagesDismissedQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SpotlightLoomOneTimeMessagesDismissedQuery, SpotlightLoomOneTimeMessagesDismissedQueryVariables>(SpotlightLoomOneTimeMessagesDismissedDocument, options);
        }
export type SpotlightLoomOneTimeMessagesDismissedQueryHookResult = ReturnType<typeof useSpotlightLoomOneTimeMessagesDismissedQuery>;
export type SpotlightLoomOneTimeMessagesDismissedLazyQueryHookResult = ReturnType<typeof useSpotlightLoomOneTimeMessagesDismissedLazyQuery>;
export type SpotlightLoomOneTimeMessagesDismissedQueryResult = Apollo.QueryResult<SpotlightLoomOneTimeMessagesDismissedQuery, SpotlightLoomOneTimeMessagesDismissedQueryVariables>;