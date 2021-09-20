import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"PushTouchpointsOneTimeMessage"}}
export type PushTouchpointsOneTimeMessageQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type PushTouchpointsOneTimeMessageQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'oneTimeMessagesDismissed'>
  )> }
);


export const PushTouchpointsOneTimeMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PushTouchpointsOneTimeMessage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __usePushTouchpointsOneTimeMessageQuery__
 *
 * To run a query within a React component, call `usePushTouchpointsOneTimeMessageQuery` and pass it any options that fit your needs.
 * When your component renders, `usePushTouchpointsOneTimeMessageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePushTouchpointsOneTimeMessageQuery({
 *   variables: {
 *   },
 * });
 */
export function usePushTouchpointsOneTimeMessageQuery(baseOptions?: Apollo.QueryHookOptions<PushTouchpointsOneTimeMessageQuery, PushTouchpointsOneTimeMessageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PushTouchpointsOneTimeMessageQuery, PushTouchpointsOneTimeMessageQueryVariables>(PushTouchpointsOneTimeMessageDocument, options);
      }
export function usePushTouchpointsOneTimeMessageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PushTouchpointsOneTimeMessageQuery, PushTouchpointsOneTimeMessageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PushTouchpointsOneTimeMessageQuery, PushTouchpointsOneTimeMessageQueryVariables>(PushTouchpointsOneTimeMessageDocument, options);
        }
export type PushTouchpointsOneTimeMessageQueryHookResult = ReturnType<typeof usePushTouchpointsOneTimeMessageQuery>;
export type PushTouchpointsOneTimeMessageLazyQueryHookResult = ReturnType<typeof usePushTouchpointsOneTimeMessageLazyQuery>;
export type PushTouchpointsOneTimeMessageQueryResult = Apollo.QueryResult<PushTouchpointsOneTimeMessageQuery, PushTouchpointsOneTimeMessageQueryVariables>;