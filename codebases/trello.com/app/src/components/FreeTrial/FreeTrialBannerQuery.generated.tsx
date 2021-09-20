import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"FreeTrialBanner"}}
export type FreeTrialBannerQueryVariables = Types.Exact<{
  orgId: Types.Scalars['ID'];
}>;


export type FreeTrialBannerQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'oneTimeMessagesDismissed'>
    & { paidAccount?: Types.Maybe<(
      { __typename: 'PaidAccount' }
      & Pick<Types.PaidAccount, 'products' | 'expirationDates'>
    )> }
  )>, organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id' | 'displayName' | 'name' | 'url' | 'idEnterprise' | 'products'>
    & { paidAccount?: Types.Maybe<(
      { __typename: 'PaidAccount' }
      & Pick<Types.PaidAccount, 'cardType'>
    )> }
  )> }
);


export const FreeTrialBannerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FreeTrialBanner"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}},{"kind":"Field","name":{"kind":"Name","value":"paidAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"products"}},{"kind":"Field","name":{"kind":"Name","value":"expirationDates"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"products"}},{"kind":"Field","name":{"kind":"Name","value":"paidAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cardType"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useFreeTrialBannerQuery__
 *
 * To run a query within a React component, call `useFreeTrialBannerQuery` and pass it any options that fit your needs.
 * When your component renders, `useFreeTrialBannerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFreeTrialBannerQuery({
 *   variables: {
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useFreeTrialBannerQuery(baseOptions: Apollo.QueryHookOptions<FreeTrialBannerQuery, FreeTrialBannerQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FreeTrialBannerQuery, FreeTrialBannerQueryVariables>(FreeTrialBannerDocument, options);
      }
export function useFreeTrialBannerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FreeTrialBannerQuery, FreeTrialBannerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FreeTrialBannerQuery, FreeTrialBannerQueryVariables>(FreeTrialBannerDocument, options);
        }
export type FreeTrialBannerQueryHookResult = ReturnType<typeof useFreeTrialBannerQuery>;
export type FreeTrialBannerLazyQueryHookResult = ReturnType<typeof useFreeTrialBannerLazyQuery>;
export type FreeTrialBannerQueryResult = Apollo.QueryResult<FreeTrialBannerQuery, FreeTrialBannerQueryVariables>;