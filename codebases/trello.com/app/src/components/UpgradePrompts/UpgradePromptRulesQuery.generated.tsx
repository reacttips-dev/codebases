import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"UpgradePromptRules"}}
export type UpgradePromptRulesQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID'];
  orgId: Types.Scalars['ID'];
}>;


export type UpgradePromptRulesQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'oneTimeMessagesDismissed' | 'idEnterprise' | 'confirmed'>
    & { enterprises: Array<(
      { __typename: 'Enterprise' }
      & Pick<Types.Enterprise, 'id' | 'isRealEnterprise'>
    )> }
  )>, organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'idEnterprise' | 'name' | 'id' | 'products'>
    & { memberships: Array<(
      { __typename: 'Organization_Membership' }
      & Pick<Types.Organization_Membership, 'idMember'>
    )>, limits: (
      { __typename: 'Organization_Limits' }
      & { orgs: (
        { __typename: 'Organization_Limits_Orgs' }
        & { freeBoardsPerOrg: (
          { __typename: 'Limit' }
          & Pick<Types.Limit, 'count'>
        ) }
      ) }
    ) }
  )> }
);


export const UpgradePromptRulesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UpgradePromptRules"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"enterprises"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isRealEnterprise"}}]}},{"kind":"Field","name":{"kind":"Name","value":"confirmed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idMember"}}]}},{"kind":"Field","name":{"kind":"Name","value":"limits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orgs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"freeBoardsPerOrg"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"products"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useUpgradePromptRulesQuery__
 *
 * To run a query within a React component, call `useUpgradePromptRulesQuery` and pass it any options that fit your needs.
 * When your component renders, `useUpgradePromptRulesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUpgradePromptRulesQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useUpgradePromptRulesQuery(baseOptions: Apollo.QueryHookOptions<UpgradePromptRulesQuery, UpgradePromptRulesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UpgradePromptRulesQuery, UpgradePromptRulesQueryVariables>(UpgradePromptRulesDocument, options);
      }
export function useUpgradePromptRulesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UpgradePromptRulesQuery, UpgradePromptRulesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UpgradePromptRulesQuery, UpgradePromptRulesQueryVariables>(UpgradePromptRulesDocument, options);
        }
export type UpgradePromptRulesQueryHookResult = ReturnType<typeof useUpgradePromptRulesQuery>;
export type UpgradePromptRulesLazyQueryHookResult = ReturnType<typeof useUpgradePromptRulesLazyQuery>;
export type UpgradePromptRulesQueryResult = Apollo.QueryResult<UpgradePromptRulesQuery, UpgradePromptRulesQueryVariables>;