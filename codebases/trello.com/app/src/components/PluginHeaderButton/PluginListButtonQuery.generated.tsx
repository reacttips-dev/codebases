import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"PluginListButton"}}
export type PluginListButtonQueryVariables = Types.Exact<{
  idBoard: Types.Scalars['ID'];
}>;


export type PluginListButtonQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & { prefs?: Types.Maybe<(
      { __typename: 'Board_Prefs' }
      & Pick<Types.Board_Prefs, 'backgroundBrightness'>
    )> }
  )> }
);


export const PluginListButtonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PluginListButton"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backgroundBrightness"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __usePluginListButtonQuery__
 *
 * To run a query within a React component, call `usePluginListButtonQuery` and pass it any options that fit your needs.
 * When your component renders, `usePluginListButtonQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePluginListButtonQuery({
 *   variables: {
 *      idBoard: // value for 'idBoard'
 *   },
 * });
 */
export function usePluginListButtonQuery(baseOptions: Apollo.QueryHookOptions<PluginListButtonQuery, PluginListButtonQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PluginListButtonQuery, PluginListButtonQueryVariables>(PluginListButtonDocument, options);
      }
export function usePluginListButtonLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PluginListButtonQuery, PluginListButtonQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PluginListButtonQuery, PluginListButtonQueryVariables>(PluginListButtonDocument, options);
        }
export type PluginListButtonQueryHookResult = ReturnType<typeof usePluginListButtonQuery>;
export type PluginListButtonLazyQueryHookResult = ReturnType<typeof usePluginListButtonLazyQuery>;
export type PluginListButtonQueryResult = Apollo.QueryResult<PluginListButtonQuery, PluginListButtonQueryVariables>;