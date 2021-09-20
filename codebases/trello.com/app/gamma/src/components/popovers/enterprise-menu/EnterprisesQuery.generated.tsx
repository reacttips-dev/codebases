import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"Enterprises"}}
export type EnterprisesQueryVariables = Types.Exact<{
  enterpriseIds: Array<Types.Scalars['ID']> | Types.Scalars['ID'];
}>;


export type EnterprisesQuery = (
  { __typename: 'Query' }
  & { enterprises: Array<(
    { __typename: 'Enterprise' }
    & Pick<Types.Enterprise, 'id' | 'name' | 'displayName'>
  )> }
);


export const EnterprisesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Enterprises"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"enterpriseIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enterprises"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"enterpriseIds"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useEnterprisesQuery__
 *
 * To run a query within a React component, call `useEnterprisesQuery` and pass it any options that fit your needs.
 * When your component renders, `useEnterprisesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEnterprisesQuery({
 *   variables: {
 *      enterpriseIds: // value for 'enterpriseIds'
 *   },
 * });
 */
export function useEnterprisesQuery(baseOptions: Apollo.QueryHookOptions<EnterprisesQuery, EnterprisesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EnterprisesQuery, EnterprisesQueryVariables>(EnterprisesDocument, options);
      }
export function useEnterprisesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EnterprisesQuery, EnterprisesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EnterprisesQuery, EnterprisesQueryVariables>(EnterprisesDocument, options);
        }
export type EnterprisesQueryHookResult = ReturnType<typeof useEnterprisesQuery>;
export type EnterprisesLazyQueryHookResult = ReturnType<typeof useEnterprisesLazyQuery>;
export type EnterprisesQueryResult = Apollo.QueryResult<EnterprisesQuery, EnterprisesQueryVariables>;