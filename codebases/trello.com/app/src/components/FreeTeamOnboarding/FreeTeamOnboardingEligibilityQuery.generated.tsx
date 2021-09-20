import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"FreeTeamOnboardingEligibility"}}
export type FreeTeamOnboardingEligibilityQueryVariables = Types.Exact<{
  orgNameOrId: Types.Scalars['ID'];
}>;


export type FreeTeamOnboardingEligibilityQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'oneTimeMessagesDismissed' | 'memberType' | 'confirmed'>
    & { organizations: Array<(
      { __typename: 'Organization' }
      & Pick<Types.Organization, 'id' | 'products'>
    )> }
  )>, organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id' | 'name' | 'products'>
    & { memberships: Array<(
      { __typename: 'Organization_Membership' }
      & Pick<Types.Organization_Membership, 'id' | 'idMember' | 'memberType'>
    )> }
  )> }
);


export const FreeTeamOnboardingEligibilityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FreeTeamOnboardingEligibility"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgNameOrId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"confirmed"}},{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"products"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgNameOrId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"products"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useFreeTeamOnboardingEligibilityQuery__
 *
 * To run a query within a React component, call `useFreeTeamOnboardingEligibilityQuery` and pass it any options that fit your needs.
 * When your component renders, `useFreeTeamOnboardingEligibilityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFreeTeamOnboardingEligibilityQuery({
 *   variables: {
 *      orgNameOrId: // value for 'orgNameOrId'
 *   },
 * });
 */
export function useFreeTeamOnboardingEligibilityQuery(baseOptions: Apollo.QueryHookOptions<FreeTeamOnboardingEligibilityQuery, FreeTeamOnboardingEligibilityQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FreeTeamOnboardingEligibilityQuery, FreeTeamOnboardingEligibilityQueryVariables>(FreeTeamOnboardingEligibilityDocument, options);
      }
export function useFreeTeamOnboardingEligibilityLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FreeTeamOnboardingEligibilityQuery, FreeTeamOnboardingEligibilityQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FreeTeamOnboardingEligibilityQuery, FreeTeamOnboardingEligibilityQueryVariables>(FreeTeamOnboardingEligibilityDocument, options);
        }
export type FreeTeamOnboardingEligibilityQueryHookResult = ReturnType<typeof useFreeTeamOnboardingEligibilityQuery>;
export type FreeTeamOnboardingEligibilityLazyQueryHookResult = ReturnType<typeof useFreeTeamOnboardingEligibilityLazyQuery>;
export type FreeTeamOnboardingEligibilityQueryResult = Apollo.QueryResult<FreeTeamOnboardingEligibilityQuery, FreeTeamOnboardingEligibilityQueryVariables>;