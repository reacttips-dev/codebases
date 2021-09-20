import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"UseAvailableWorkspaces"}}
export type UseAvailableWorkspacesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type UseAvailableWorkspacesQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'memberType'>
    & { organizations: Array<(
      { __typename: 'Organization' }
      & Pick<Types.Organization, 'id' | 'displayName' | 'idEnterprise' | 'products'>
      & { memberships: Array<(
        { __typename: 'Organization_Membership' }
        & Pick<Types.Organization_Membership, 'idMember' | 'memberType'>
      )>, prefs: (
        { __typename: 'Organization_Prefs' }
        & { boardVisibilityRestrict?: Types.Maybe<(
          { __typename: 'Organization_Prefs_BoardVisibilityRestrict' }
          & Pick<Types.Organization_Prefs_BoardVisibilityRestrict, 'private' | 'public' | 'org' | 'enterprise'>
        )> }
      ), limits: (
        { __typename: 'Organization_Limits' }
        & { orgs: (
          { __typename: 'Organization_Limits_Orgs' }
          & { freeBoardsPerOrg: (
            { __typename: 'Limit' }
            & Pick<Types.Limit, 'disableAt' | 'count'>
          ) }
        ) }
      ) }
    )> }
  )> }
);


export const UseAvailableWorkspacesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UseAvailableWorkspaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"products"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boardVisibilityRestrict"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"public"}},{"kind":"Field","name":{"kind":"Name","value":"org"}},{"kind":"Field","name":{"kind":"Name","value":"enterprise"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"limits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orgs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"freeBoardsPerOrg"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useUseAvailableWorkspacesQuery__
 *
 * To run a query within a React component, call `useUseAvailableWorkspacesQuery` and pass it any options that fit your needs.
 * When your component renders, `useUseAvailableWorkspacesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUseAvailableWorkspacesQuery({
 *   variables: {
 *   },
 * });
 */
export function useUseAvailableWorkspacesQuery(baseOptions?: Apollo.QueryHookOptions<UseAvailableWorkspacesQuery, UseAvailableWorkspacesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UseAvailableWorkspacesQuery, UseAvailableWorkspacesQueryVariables>(UseAvailableWorkspacesDocument, options);
      }
export function useUseAvailableWorkspacesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UseAvailableWorkspacesQuery, UseAvailableWorkspacesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UseAvailableWorkspacesQuery, UseAvailableWorkspacesQueryVariables>(UseAvailableWorkspacesDocument, options);
        }
export type UseAvailableWorkspacesQueryHookResult = ReturnType<typeof useUseAvailableWorkspacesQuery>;
export type UseAvailableWorkspacesLazyQueryHookResult = ReturnType<typeof useUseAvailableWorkspacesLazyQuery>;
export type UseAvailableWorkspacesQueryResult = Apollo.QueryResult<UseAvailableWorkspacesQuery, UseAvailableWorkspacesQueryVariables>;