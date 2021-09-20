import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"OrganizationContextData"}}
export type OrganizationContextDataQueryVariables = Types.Exact<{
  orgId: Types.Scalars['ID'];
}>;


export type OrganizationContextDataQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'billableCollaboratorCount' | 'billableMemberCount' | 'id' | 'premiumFeatures' | 'products' | 'teamType'>
  )> }
);


export const OrganizationContextDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrganizationContextData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"billableCollaboratorCount"}},{"kind":"Field","name":{"kind":"Name","value":"billableMemberCount"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}},{"kind":"Field","name":{"kind":"Name","value":"products"}},{"kind":"Field","name":{"kind":"Name","value":"teamType"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useOrganizationContextDataQuery__
 *
 * To run a query within a React component, call `useOrganizationContextDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrganizationContextDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrganizationContextDataQuery({
 *   variables: {
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useOrganizationContextDataQuery(baseOptions: Apollo.QueryHookOptions<OrganizationContextDataQuery, OrganizationContextDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrganizationContextDataQuery, OrganizationContextDataQueryVariables>(OrganizationContextDataDocument, options);
      }
export function useOrganizationContextDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrganizationContextDataQuery, OrganizationContextDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrganizationContextDataQuery, OrganizationContextDataQueryVariables>(OrganizationContextDataDocument, options);
        }
export type OrganizationContextDataQueryHookResult = ReturnType<typeof useOrganizationContextDataQuery>;
export type OrganizationContextDataLazyQueryHookResult = ReturnType<typeof useOrganizationContextDataLazyQuery>;
export type OrganizationContextDataQueryResult = Apollo.QueryResult<OrganizationContextDataQuery, OrganizationContextDataQueryVariables>;