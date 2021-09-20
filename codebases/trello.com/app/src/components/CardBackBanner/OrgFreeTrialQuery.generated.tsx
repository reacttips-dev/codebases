import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"OrgFreeTrial"}}
export type OrgFreeTrialQueryVariables = Types.Exact<{
  orgId: Types.Scalars['ID'];
}>;


export type OrgFreeTrialQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'products'>
    & { credits: Array<(
      { __typename: 'Credit' }
      & Pick<Types.Credit, 'count' | 'type' | 'id'>
    )>, paidAccount?: Types.Maybe<(
      { __typename: 'PaidAccount' }
      & Pick<Types.PaidAccount, 'trialExpiration'>
    )> }
  )> }
);


export const OrgFreeTrialDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrgFreeTrial"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"credits"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"freeTrial"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"products"}},{"kind":"Field","name":{"kind":"Name","value":"paidAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trialExpiration"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useOrgFreeTrialQuery__
 *
 * To run a query within a React component, call `useOrgFreeTrialQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrgFreeTrialQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrgFreeTrialQuery({
 *   variables: {
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useOrgFreeTrialQuery(baseOptions: Apollo.QueryHookOptions<OrgFreeTrialQuery, OrgFreeTrialQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrgFreeTrialQuery, OrgFreeTrialQueryVariables>(OrgFreeTrialDocument, options);
      }
export function useOrgFreeTrialLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrgFreeTrialQuery, OrgFreeTrialQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrgFreeTrialQuery, OrgFreeTrialQueryVariables>(OrgFreeTrialDocument, options);
        }
export type OrgFreeTrialQueryHookResult = ReturnType<typeof useOrgFreeTrialQuery>;
export type OrgFreeTrialLazyQueryHookResult = ReturnType<typeof useOrgFreeTrialLazyQuery>;
export type OrgFreeTrialQueryResult = Apollo.QueryResult<OrgFreeTrialQuery, OrgFreeTrialQueryVariables>;