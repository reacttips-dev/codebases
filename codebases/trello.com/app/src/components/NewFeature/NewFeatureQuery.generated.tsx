import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"NewFeature"}}
export type NewFeatureQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type NewFeatureQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'oneTimeMessagesDismissed'>
  )> }
);


export const NewFeatureDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NewFeature"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useNewFeatureQuery__
 *
 * To run a query within a React component, call `useNewFeatureQuery` and pass it any options that fit your needs.
 * When your component renders, `useNewFeatureQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewFeatureQuery({
 *   variables: {
 *   },
 * });
 */
export function useNewFeatureQuery(baseOptions?: Apollo.QueryHookOptions<NewFeatureQuery, NewFeatureQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NewFeatureQuery, NewFeatureQueryVariables>(NewFeatureDocument, options);
      }
export function useNewFeatureLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NewFeatureQuery, NewFeatureQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NewFeatureQuery, NewFeatureQueryVariables>(NewFeatureDocument, options);
        }
export type NewFeatureQueryHookResult = ReturnType<typeof useNewFeatureQuery>;
export type NewFeatureLazyQueryHookResult = ReturnType<typeof useNewFeatureLazyQuery>;
export type NewFeatureQueryResult = Apollo.QueryResult<NewFeatureQuery, NewFeatureQueryVariables>;