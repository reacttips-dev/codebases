import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"FreeTrialEligibilityRules"}}
export type FreeTrialEligibilityRulesQueryVariables = Types.Exact<{
  orgId: Types.Scalars['ID'];
}>;


export type FreeTrialEligibilityRulesQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'confirmed' | 'idEnterprise'>
    & { enterprises: Array<(
      { __typename: 'Enterprise' }
      & Pick<Types.Enterprise, 'id' | 'isRealEnterprise'>
    )> }
  )>, organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id' | 'name' | 'products'>
    & { paidAccount?: Types.Maybe<(
      { __typename: 'PaidAccount' }
      & Pick<Types.PaidAccount, 'standing' | 'trialExpiration'>
    )>, credits: Array<(
      { __typename: 'Credit' }
      & Pick<Types.Credit, 'id' | 'count' | 'type'>
    )>, memberships: Array<(
      { __typename: 'Organization_Membership' }
      & Pick<Types.Organization_Membership, 'idMember' | 'memberType'>
    )>, boards: Array<(
      { __typename: 'Board' }
      & Pick<Types.Board, 'id'>
    )> }
  )> }
);


export const FreeTrialEligibilityRulesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FreeTrialEligibilityRules"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"confirmed"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"enterprises"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isRealEnterprise"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"products"}},{"kind":"Field","name":{"kind":"Name","value":"paidAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"standing"}},{"kind":"Field","name":{"kind":"Name","value":"trialExpiration"}}]}},{"kind":"Field","name":{"kind":"Name","value":"credits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"boards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"open"}},{"kind":"Argument","name":{"kind":"Name","value":"count"},"value":{"kind":"IntValue","value":"11"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useFreeTrialEligibilityRulesQuery__
 *
 * To run a query within a React component, call `useFreeTrialEligibilityRulesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFreeTrialEligibilityRulesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFreeTrialEligibilityRulesQuery({
 *   variables: {
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useFreeTrialEligibilityRulesQuery(baseOptions: Apollo.QueryHookOptions<FreeTrialEligibilityRulesQuery, FreeTrialEligibilityRulesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FreeTrialEligibilityRulesQuery, FreeTrialEligibilityRulesQueryVariables>(FreeTrialEligibilityRulesDocument, options);
      }
export function useFreeTrialEligibilityRulesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FreeTrialEligibilityRulesQuery, FreeTrialEligibilityRulesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FreeTrialEligibilityRulesQuery, FreeTrialEligibilityRulesQueryVariables>(FreeTrialEligibilityRulesDocument, options);
        }
export type FreeTrialEligibilityRulesQueryHookResult = ReturnType<typeof useFreeTrialEligibilityRulesQuery>;
export type FreeTrialEligibilityRulesLazyQueryHookResult = ReturnType<typeof useFreeTrialEligibilityRulesLazyQuery>;
export type FreeTrialEligibilityRulesQueryResult = Apollo.QueryResult<FreeTrialEligibilityRulesQuery, FreeTrialEligibilityRulesQueryVariables>;