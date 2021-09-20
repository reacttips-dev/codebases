import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"Card"}}
export type CardQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type CardQuery = (
  { __typename: 'Query' }
  & { card?: Types.Maybe<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'idBoard'>
  )> }
);


export const CardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Card"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idBoard"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useCardQuery__
 *
 * To run a query within a React component, call `useCardQuery` and pass it any options that fit your needs.
 * When your component renders, `useCardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCardQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCardQuery(baseOptions: Apollo.QueryHookOptions<CardQuery, CardQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CardQuery, CardQueryVariables>(CardDocument, options);
      }
export function useCardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CardQuery, CardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CardQuery, CardQueryVariables>(CardDocument, options);
        }
export type CardQueryHookResult = ReturnType<typeof useCardQuery>;
export type CardLazyQueryHookResult = ReturnType<typeof useCardLazyQuery>;
export type CardQueryResult = Apollo.QueryResult<CardQuery, CardQueryVariables>;