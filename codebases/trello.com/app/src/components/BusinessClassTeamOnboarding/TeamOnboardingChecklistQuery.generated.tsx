import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"TeamOnboardingChecklist"}}
export type TeamOnboardingChecklistQueryVariables = Types.Exact<{
  orgId: Types.Scalars['ID'];
}>;


export type TeamOnboardingChecklistQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'oneTimeMessagesDismissed'>
  )>, organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id' | 'name' | 'products'>
    & { credits: Array<(
      { __typename: 'Credit' }
      & Pick<Types.Credit, 'id' | 'type' | 'count'>
    )>, memberships: Array<(
      { __typename: 'Organization_Membership' }
      & Pick<Types.Organization_Membership, 'idMember' | 'deactivated'>
    )>, boards: Array<(
      { __typename: 'Board' }
      & Pick<Types.Board, 'id' | 'dateLastView' | 'closed' | 'url'>
    )>, members: Array<(
      { __typename: 'Member' }
      & Pick<Types.Member, 'id'>
    )>, paidAccount?: Types.Maybe<(
      { __typename: 'PaidAccount' }
      & Pick<Types.PaidAccount, 'trialExpiration'>
    )> }
  )> }
);


export const TeamOnboardingChecklistDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TeamOnboardingChecklist"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"credits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"products"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"deactivated"}}]}},{"kind":"Field","name":{"kind":"Name","value":"boards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"dateLastView"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paidAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trialExpiration"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useTeamOnboardingChecklistQuery__
 *
 * To run a query within a React component, call `useTeamOnboardingChecklistQuery` and pass it any options that fit your needs.
 * When your component renders, `useTeamOnboardingChecklistQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTeamOnboardingChecklistQuery({
 *   variables: {
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useTeamOnboardingChecklistQuery(baseOptions: Apollo.QueryHookOptions<TeamOnboardingChecklistQuery, TeamOnboardingChecklistQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TeamOnboardingChecklistQuery, TeamOnboardingChecklistQueryVariables>(TeamOnboardingChecklistDocument, options);
      }
export function useTeamOnboardingChecklistLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TeamOnboardingChecklistQuery, TeamOnboardingChecklistQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TeamOnboardingChecklistQuery, TeamOnboardingChecklistQueryVariables>(TeamOnboardingChecklistDocument, options);
        }
export type TeamOnboardingChecklistQueryHookResult = ReturnType<typeof useTeamOnboardingChecklistQuery>;
export type TeamOnboardingChecklistLazyQueryHookResult = ReturnType<typeof useTeamOnboardingChecklistLazyQuery>;
export type TeamOnboardingChecklistQueryResult = Apollo.QueryResult<TeamOnboardingChecklistQuery, TeamOnboardingChecklistQueryVariables>;