import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"Sidebar"}}
export type SidebarQueryVariables = Types.Exact<{
  idCard: Types.Scalars['ID'];
}>;


export type SidebarQuery = (
  { __typename: 'Query' }
  & { card?: Types.Maybe<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'id' | 'closed' | 'cardRole'>
  )> }
);


export const SidebarDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Sidebar"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"cardRole"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useSidebarQuery__
 *
 * To run a query within a React component, call `useSidebarQuery` and pass it any options that fit your needs.
 * When your component renders, `useSidebarQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSidebarQuery({
 *   variables: {
 *      idCard: // value for 'idCard'
 *   },
 * });
 */
export function useSidebarQuery(baseOptions: Apollo.QueryHookOptions<SidebarQuery, SidebarQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SidebarQuery, SidebarQueryVariables>(SidebarDocument, options);
      }
export function useSidebarLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SidebarQuery, SidebarQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SidebarQuery, SidebarQueryVariables>(SidebarDocument, options);
        }
export type SidebarQueryHookResult = ReturnType<typeof useSidebarQuery>;
export type SidebarLazyQueryHookResult = ReturnType<typeof useSidebarLazyQuery>;
export type SidebarQueryResult = Apollo.QueryResult<SidebarQuery, SidebarQueryVariables>;