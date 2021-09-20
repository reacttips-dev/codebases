import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"EnterpriseAdminIds"}}
export type EnterpriseAdminIdsQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID'];
}>;


export type EnterpriseAdminIdsQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'idEnterprisesAdmin'>
  )> }
);


export const EnterpriseAdminIdsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EnterpriseAdminIds"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idEnterprisesAdmin"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useEnterpriseAdminIdsQuery__
 *
 * To run a query within a React component, call `useEnterpriseAdminIdsQuery` and pass it any options that fit your needs.
 * When your component renders, `useEnterpriseAdminIdsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEnterpriseAdminIdsQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useEnterpriseAdminIdsQuery(baseOptions: Apollo.QueryHookOptions<EnterpriseAdminIdsQuery, EnterpriseAdminIdsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EnterpriseAdminIdsQuery, EnterpriseAdminIdsQueryVariables>(EnterpriseAdminIdsDocument, options);
      }
export function useEnterpriseAdminIdsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EnterpriseAdminIdsQuery, EnterpriseAdminIdsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EnterpriseAdminIdsQuery, EnterpriseAdminIdsQueryVariables>(EnterpriseAdminIdsDocument, options);
        }
export type EnterpriseAdminIdsQueryHookResult = ReturnType<typeof useEnterpriseAdminIdsQuery>;
export type EnterpriseAdminIdsLazyQueryHookResult = ReturnType<typeof useEnterpriseAdminIdsLazyQuery>;
export type EnterpriseAdminIdsQueryResult = Apollo.QueryResult<EnterpriseAdminIdsQuery, EnterpriseAdminIdsQueryVariables>;