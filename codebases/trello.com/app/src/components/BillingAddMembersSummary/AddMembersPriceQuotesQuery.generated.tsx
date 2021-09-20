import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"AddMembersPriceQuotes"}}
export type AddMembersPriceQuotesQueryVariables = Types.Exact<{
  accountId: Types.Scalars['ID'];
  members: Array<Types.Scalars['String']> | Types.Scalars['String'];
}>;


export type AddMembersPriceQuotesQuery = (
  { __typename: 'Query' }
  & { addMembersPriceQuotes: (
    { __typename: 'AddMembersPriceQuotes' }
    & { prorated: (
      { __typename: 'PriceQuote' }
      & Pick<Types.PriceQuote, 'dtBilling' | 'ixSubscriptionProduct' | 'nSubscriptionPeriodMonths' | 'ixSubscriptionDiscountType' | 'nPricingAdjustment' | 'dtPricingAdjustmentExpiration' | 'cTeamMembers' | 'cBillableCollaborators' | 'cBillableCollaboratorConversions' | 'nTaxRate' | 'sTaxRegion' | 'nSubtotal' | 'nSubtotalPerUser' | 'nTax' | 'nTaxPerUser' | 'nTotal' | 'nTotalPerUser'>
    ), renewal: (
      { __typename: 'PriceQuote' }
      & Pick<Types.PriceQuote, 'dtBilling' | 'ixSubscriptionProduct' | 'nSubscriptionPeriodMonths' | 'ixSubscriptionDiscountType' | 'nPricingAdjustment' | 'dtPricingAdjustmentExpiration' | 'cTeamMembers' | 'cBillableCollaborators' | 'cBillableCollaboratorConversions' | 'nTaxRate' | 'sTaxRegion' | 'nSubtotal' | 'nSubtotalPerUser' | 'nTax' | 'nTaxPerUser' | 'nTotal' | 'nTotalPerUser'>
    ) }
  ) }
);


export const AddMembersPriceQuotesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AddMembersPriceQuotes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"members"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addMembersPriceQuotes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"accountId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}}},{"kind":"Argument","name":{"kind":"Name","value":"members"},"value":{"kind":"Variable","name":{"kind":"Name","value":"members"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"prorated"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dtBilling"}},{"kind":"Field","name":{"kind":"Name","value":"ixSubscriptionProduct"}},{"kind":"Field","name":{"kind":"Name","value":"nSubscriptionPeriodMonths"}},{"kind":"Field","name":{"kind":"Name","value":"ixSubscriptionDiscountType"}},{"kind":"Field","name":{"kind":"Name","value":"nPricingAdjustment"}},{"kind":"Field","name":{"kind":"Name","value":"dtPricingAdjustmentExpiration"}},{"kind":"Field","name":{"kind":"Name","value":"cTeamMembers"}},{"kind":"Field","name":{"kind":"Name","value":"cBillableCollaborators"}},{"kind":"Field","name":{"kind":"Name","value":"cBillableCollaboratorConversions"}},{"kind":"Field","name":{"kind":"Name","value":"nTaxRate"}},{"kind":"Field","name":{"kind":"Name","value":"sTaxRegion"}},{"kind":"Field","name":{"kind":"Name","value":"nSubtotal"}},{"kind":"Field","name":{"kind":"Name","value":"nSubtotalPerUser"}},{"kind":"Field","name":{"kind":"Name","value":"nTax"}},{"kind":"Field","name":{"kind":"Name","value":"nTaxPerUser"}},{"kind":"Field","name":{"kind":"Name","value":"nTotal"}},{"kind":"Field","name":{"kind":"Name","value":"nTotalPerUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"renewal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dtBilling"}},{"kind":"Field","name":{"kind":"Name","value":"ixSubscriptionProduct"}},{"kind":"Field","name":{"kind":"Name","value":"nSubscriptionPeriodMonths"}},{"kind":"Field","name":{"kind":"Name","value":"ixSubscriptionDiscountType"}},{"kind":"Field","name":{"kind":"Name","value":"nPricingAdjustment"}},{"kind":"Field","name":{"kind":"Name","value":"dtPricingAdjustmentExpiration"}},{"kind":"Field","name":{"kind":"Name","value":"cTeamMembers"}},{"kind":"Field","name":{"kind":"Name","value":"cBillableCollaborators"}},{"kind":"Field","name":{"kind":"Name","value":"cBillableCollaboratorConversions"}},{"kind":"Field","name":{"kind":"Name","value":"nTaxRate"}},{"kind":"Field","name":{"kind":"Name","value":"sTaxRegion"}},{"kind":"Field","name":{"kind":"Name","value":"nSubtotal"}},{"kind":"Field","name":{"kind":"Name","value":"nSubtotalPerUser"}},{"kind":"Field","name":{"kind":"Name","value":"nTax"}},{"kind":"Field","name":{"kind":"Name","value":"nTaxPerUser"}},{"kind":"Field","name":{"kind":"Name","value":"nTotal"}},{"kind":"Field","name":{"kind":"Name","value":"nTotalPerUser"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useAddMembersPriceQuotesQuery__
 *
 * To run a query within a React component, call `useAddMembersPriceQuotesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAddMembersPriceQuotesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAddMembersPriceQuotesQuery({
 *   variables: {
 *      accountId: // value for 'accountId'
 *      members: // value for 'members'
 *   },
 * });
 */
export function useAddMembersPriceQuotesQuery(baseOptions: Apollo.QueryHookOptions<AddMembersPriceQuotesQuery, AddMembersPriceQuotesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AddMembersPriceQuotesQuery, AddMembersPriceQuotesQueryVariables>(AddMembersPriceQuotesDocument, options);
      }
export function useAddMembersPriceQuotesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AddMembersPriceQuotesQuery, AddMembersPriceQuotesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AddMembersPriceQuotesQuery, AddMembersPriceQuotesQueryVariables>(AddMembersPriceQuotesDocument, options);
        }
export type AddMembersPriceQuotesQueryHookResult = ReturnType<typeof useAddMembersPriceQuotesQuery>;
export type AddMembersPriceQuotesLazyQueryHookResult = ReturnType<typeof useAddMembersPriceQuotesLazyQuery>;
export type AddMembersPriceQuotesQueryResult = Apollo.QueryResult<AddMembersPriceQuotesQuery, AddMembersPriceQuotesQueryVariables>;