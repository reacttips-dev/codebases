import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"AtlassianAccounts"}}
export type AtlassianAccountsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type AtlassianAccountsQuery = (
  { __typename: 'Query' }
  & { atlassianAccounts: Array<(
    { __typename: 'AtlassianAccount' }
    & Pick<Types.AtlassianAccount, 'email'>
  )> }
);


export const AtlassianAccountsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AtlassianAccounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"atlassianAccounts"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useAtlassianAccountsQuery__
 *
 * To run a query within a React component, call `useAtlassianAccountsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAtlassianAccountsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAtlassianAccountsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAtlassianAccountsQuery(baseOptions?: Apollo.QueryHookOptions<AtlassianAccountsQuery, AtlassianAccountsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AtlassianAccountsQuery, AtlassianAccountsQueryVariables>(AtlassianAccountsDocument, options);
      }
export function useAtlassianAccountsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AtlassianAccountsQuery, AtlassianAccountsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AtlassianAccountsQuery, AtlassianAccountsQueryVariables>(AtlassianAccountsDocument, options);
        }
export type AtlassianAccountsQueryHookResult = ReturnType<typeof useAtlassianAccountsQuery>;
export type AtlassianAccountsLazyQueryHookResult = ReturnType<typeof useAtlassianAccountsLazyQuery>;
export type AtlassianAccountsQueryResult = Apollo.QueryResult<AtlassianAccountsQuery, AtlassianAccountsQueryVariables>;