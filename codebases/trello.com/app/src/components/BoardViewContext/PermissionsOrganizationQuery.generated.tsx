import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"PermissionsOrganization"}}
export type PermissionsOrganizationQueryVariables = Types.Exact<{
  orgId: Types.Scalars['ID'];
  memberId: Types.Scalars['ID'];
}>;


export type PermissionsOrganizationQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id'>
    & { enterprise?: Types.Maybe<(
      { __typename: 'Enterprise' }
      & Pick<Types.Enterprise, 'id' | 'idAdmins'>
    )>, memberships: Array<(
      { __typename: 'Organization_Membership' }
      & Pick<Types.Organization_Membership, 'idMember' | 'memberType' | 'deactivated' | 'unconfirmed'>
    )> }
  )>, member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'idEnterprisesAdmin' | 'memberType' | 'idPremOrgsAdmin'>
  )> }
);


export const PermissionsOrganizationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PermissionsOrganization"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"enterprise"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idAdmins"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"deactivated"}},{"kind":"Field","name":{"kind":"Name","value":"unconfirmed"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprisesAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"idPremOrgsAdmin"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __usePermissionsOrganizationQuery__
 *
 * To run a query within a React component, call `usePermissionsOrganizationQuery` and pass it any options that fit your needs.
 * When your component renders, `usePermissionsOrganizationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePermissionsOrganizationQuery({
 *   variables: {
 *      orgId: // value for 'orgId'
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function usePermissionsOrganizationQuery(baseOptions: Apollo.QueryHookOptions<PermissionsOrganizationQuery, PermissionsOrganizationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PermissionsOrganizationQuery, PermissionsOrganizationQueryVariables>(PermissionsOrganizationDocument, options);
      }
export function usePermissionsOrganizationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PermissionsOrganizationQuery, PermissionsOrganizationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PermissionsOrganizationQuery, PermissionsOrganizationQueryVariables>(PermissionsOrganizationDocument, options);
        }
export type PermissionsOrganizationQueryHookResult = ReturnType<typeof usePermissionsOrganizationQuery>;
export type PermissionsOrganizationLazyQueryHookResult = ReturnType<typeof usePermissionsOrganizationLazyQuery>;
export type PermissionsOrganizationQueryResult = Apollo.QueryResult<PermissionsOrganizationQuery, PermissionsOrganizationQueryVariables>;