import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"GoldPromoFreeTrialEligibility"}}
export type GoldPromoFreeTrialEligibilityQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID'];
}>;


export type GoldPromoFreeTrialEligibilityQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'confirmed' | 'idEnterprise' | 'goldSunsetFreeTrialIdOrganization' | 'products'>
    & { boards: Array<(
      { __typename: 'Board' }
      & Pick<Types.Board, 'id' | 'enterpriseOwned' | 'idOrganization'>
      & { memberships: Array<(
        { __typename: 'Board_Membership' }
        & Pick<Types.Board_Membership, 'idMember' | 'memberType'>
      )> }
    )>, enterprises: Array<(
      { __typename: 'Enterprise' }
      & Pick<Types.Enterprise, 'id' | 'isRealEnterprise'>
    )>, organizations: Array<(
      { __typename: 'Organization' }
      & Pick<Types.Organization, 'id' | 'displayName' | 'logoHash' | 'name' | 'premiumFeatures'>
      & { boards: Array<(
        { __typename: 'Board' }
        & Pick<Types.Board, 'id'>
        & { memberships: Array<(
          { __typename: 'Board_Membership' }
          & Pick<Types.Board_Membership, 'idMember'>
        )> }
      )>, credits: Array<(
        { __typename: 'Credit' }
        & Pick<Types.Credit, 'id' | 'count' | 'type'>
      )>, memberships: Array<(
        { __typename: 'Organization_Membership' }
        & Pick<Types.Organization_Membership, 'idMember' | 'memberType'>
      )>, paidAccount?: Types.Maybe<(
        { __typename: 'PaidAccount' }
        & Pick<Types.PaidAccount, 'standing'>
      )> }
    )> }
  )> }
);


export const GoldPromoFreeTrialEligibilityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GoldPromoFreeTrialEligibility"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"boards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"open"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"enterpriseOwned"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"confirmed"}},{"kind":"Field","name":{"kind":"Name","value":"enterprises"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isRealEnterprise"}}]}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"goldSunsetFreeTrialIdOrganization"}},{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"boards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"open"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idMember"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"credits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"logoHash"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"paidAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"standing"}}]}},{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}}]}},{"kind":"Field","name":{"kind":"Name","value":"products"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useGoldPromoFreeTrialEligibilityQuery__
 *
 * To run a query within a React component, call `useGoldPromoFreeTrialEligibilityQuery` and pass it any options that fit your needs.
 * When your component renders, `useGoldPromoFreeTrialEligibilityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGoldPromoFreeTrialEligibilityQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useGoldPromoFreeTrialEligibilityQuery(baseOptions: Apollo.QueryHookOptions<GoldPromoFreeTrialEligibilityQuery, GoldPromoFreeTrialEligibilityQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GoldPromoFreeTrialEligibilityQuery, GoldPromoFreeTrialEligibilityQueryVariables>(GoldPromoFreeTrialEligibilityDocument, options);
      }
export function useGoldPromoFreeTrialEligibilityLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GoldPromoFreeTrialEligibilityQuery, GoldPromoFreeTrialEligibilityQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GoldPromoFreeTrialEligibilityQuery, GoldPromoFreeTrialEligibilityQueryVariables>(GoldPromoFreeTrialEligibilityDocument, options);
        }
export type GoldPromoFreeTrialEligibilityQueryHookResult = ReturnType<typeof useGoldPromoFreeTrialEligibilityQuery>;
export type GoldPromoFreeTrialEligibilityLazyQueryHookResult = ReturnType<typeof useGoldPromoFreeTrialEligibilityLazyQuery>;
export type GoldPromoFreeTrialEligibilityQueryResult = Apollo.QueryResult<GoldPromoFreeTrialEligibilityQuery, GoldPromoFreeTrialEligibilityQueryVariables>;