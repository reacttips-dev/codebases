import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"ButlerPluginData"}}
export type ButlerPluginDataQueryVariables = Types.Exact<{
  idBoard: Types.Scalars['ID'];
}>;


export type ButlerPluginDataQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & { prefs?: Types.Maybe<(
      { __typename: 'Board_Prefs' }
      & Pick<Types.Board_Prefs, 'backgroundBrightness'>
    )>, pluginData: Array<(
      { __typename: 'PluginData' }
      & Pick<Types.PluginData, 'id' | 'idPlugin' | 'value' | 'scope' | 'access'>
    )> }
  )> }
);


export const ButlerPluginDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ButlerPluginData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backgroundBrightness"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pluginData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idPlugin"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"access"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useButlerPluginDataQuery__
 *
 * To run a query within a React component, call `useButlerPluginDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useButlerPluginDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useButlerPluginDataQuery({
 *   variables: {
 *      idBoard: // value for 'idBoard'
 *   },
 * });
 */
export function useButlerPluginDataQuery(baseOptions: Apollo.QueryHookOptions<ButlerPluginDataQuery, ButlerPluginDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ButlerPluginDataQuery, ButlerPluginDataQueryVariables>(ButlerPluginDataDocument, options);
      }
export function useButlerPluginDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ButlerPluginDataQuery, ButlerPluginDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ButlerPluginDataQuery, ButlerPluginDataQueryVariables>(ButlerPluginDataDocument, options);
        }
export type ButlerPluginDataQueryHookResult = ReturnType<typeof useButlerPluginDataQuery>;
export type ButlerPluginDataLazyQueryHookResult = ReturnType<typeof useButlerPluginDataLazyQuery>;
export type ButlerPluginDataQueryResult = Apollo.QueryResult<ButlerPluginDataQuery, ButlerPluginDataQueryVariables>;