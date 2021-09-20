import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"CardStaticMap"}}
export type CardStaticMapQueryVariables = Types.Exact<{
  cardId: Types.Scalars['ID'];
}>;


export type CardStaticMapQuery = (
  { __typename: 'Query' }
  & { card?: Types.Maybe<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'staticMapUrl'>
  )> }
);


export const CardStaticMapDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CardStaticMap"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"staticMapUrl"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useCardStaticMapQuery__
 *
 * To run a query within a React component, call `useCardStaticMapQuery` and pass it any options that fit your needs.
 * When your component renders, `useCardStaticMapQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCardStaticMapQuery({
 *   variables: {
 *      cardId: // value for 'cardId'
 *   },
 * });
 */
export function useCardStaticMapQuery(baseOptions: Apollo.QueryHookOptions<CardStaticMapQuery, CardStaticMapQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CardStaticMapQuery, CardStaticMapQueryVariables>(CardStaticMapDocument, options);
      }
export function useCardStaticMapLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CardStaticMapQuery, CardStaticMapQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CardStaticMapQuery, CardStaticMapQueryVariables>(CardStaticMapDocument, options);
        }
export type CardStaticMapQueryHookResult = ReturnType<typeof useCardStaticMapQuery>;
export type CardStaticMapLazyQueryHookResult = ReturnType<typeof useCardStaticMapLazyQuery>;
export type CardStaticMapQueryResult = Apollo.QueryResult<CardStaticMapQuery, CardStaticMapQueryVariables>;