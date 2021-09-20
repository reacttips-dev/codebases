import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"TeamOnboardingEligibility"}}
export type TeamOnboardingEligibilityQueryVariables = Types.Exact<{
  orgNameOrId: Types.Scalars['ID'];
}>;


export type TeamOnboardingEligibilityQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'oneTimeMessagesDismissed' | 'idPremOrgsAdmin' | 'memberType' | 'idEnterprise' | 'confirmed'>
  )>, organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id' | 'name' | 'products' | 'idEnterprise'>
    & { credits: Array<(
      { __typename: 'Credit' }
      & Pick<Types.Credit, 'id' | 'type' | 'count'>
    )>, paidAccount?: Types.Maybe<(
      { __typename: 'PaidAccount' }
      & Pick<Types.PaidAccount, 'dateFirstSubscription' | 'trialExpiration'>
    )>, memberships: Array<(
      { __typename: 'Organization_Membership' }
      & Pick<Types.Organization_Membership, 'id' | 'idMember' | 'memberType'>
    )> }
  )> }
);


export const TeamOnboardingEligibilityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TeamOnboardingEligibility"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgNameOrId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}},{"kind":"Field","name":{"kind":"Name","value":"idPremOrgsAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"confirmed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgNameOrId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"products"}},{"kind":"Field","name":{"kind":"Name","value":"credits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"paidAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateFirstSubscription"}},{"kind":"Field","name":{"kind":"Name","value":"trialExpiration"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useTeamOnboardingEligibilityQuery__
 *
 * To run a query within a React component, call `useTeamOnboardingEligibilityQuery` and pass it any options that fit your needs.
 * When your component renders, `useTeamOnboardingEligibilityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTeamOnboardingEligibilityQuery({
 *   variables: {
 *      orgNameOrId: // value for 'orgNameOrId'
 *   },
 * });
 */
export function useTeamOnboardingEligibilityQuery(baseOptions: Apollo.QueryHookOptions<TeamOnboardingEligibilityQuery, TeamOnboardingEligibilityQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TeamOnboardingEligibilityQuery, TeamOnboardingEligibilityQueryVariables>(TeamOnboardingEligibilityDocument, options);
      }
export function useTeamOnboardingEligibilityLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TeamOnboardingEligibilityQuery, TeamOnboardingEligibilityQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TeamOnboardingEligibilityQuery, TeamOnboardingEligibilityQueryVariables>(TeamOnboardingEligibilityDocument, options);
        }
export type TeamOnboardingEligibilityQueryHookResult = ReturnType<typeof useTeamOnboardingEligibilityQuery>;
export type TeamOnboardingEligibilityLazyQueryHookResult = ReturnType<typeof useTeamOnboardingEligibilityLazyQuery>;
export type TeamOnboardingEligibilityQueryResult = Apollo.QueryResult<TeamOnboardingEligibilityQuery, TeamOnboardingEligibilityQueryVariables>;