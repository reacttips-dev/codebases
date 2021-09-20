import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"FreeTeamOnboardingChecklist"}}
export type FreeTeamOnboardingChecklistQueryVariables = Types.Exact<{
  orgId: Types.Scalars['ID'];
}>;


export type FreeTeamOnboardingChecklistQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'oneTimeMessagesDismissed'>
  )>, organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id' | 'name' | 'idMemberCreator'>
    & { boards: Array<(
      { __typename: 'Board' }
      & Pick<Types.Board, 'closed' | 'id' | 'dateLastActivity' | 'url'>
    )> }
  )> }
);


export const FreeTeamOnboardingChecklistDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FreeTeamOnboardingChecklist"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"idMemberCreator"}},{"kind":"Field","name":{"kind":"Name","value":"boards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"dateLastActivity"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useFreeTeamOnboardingChecklistQuery__
 *
 * To run a query within a React component, call `useFreeTeamOnboardingChecklistQuery` and pass it any options that fit your needs.
 * When your component renders, `useFreeTeamOnboardingChecklistQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFreeTeamOnboardingChecklistQuery({
 *   variables: {
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useFreeTeamOnboardingChecklistQuery(baseOptions: Apollo.QueryHookOptions<FreeTeamOnboardingChecklistQuery, FreeTeamOnboardingChecklistQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FreeTeamOnboardingChecklistQuery, FreeTeamOnboardingChecklistQueryVariables>(FreeTeamOnboardingChecklistDocument, options);
      }
export function useFreeTeamOnboardingChecklistLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FreeTeamOnboardingChecklistQuery, FreeTeamOnboardingChecklistQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FreeTeamOnboardingChecklistQuery, FreeTeamOnboardingChecklistQueryVariables>(FreeTeamOnboardingChecklistDocument, options);
        }
export type FreeTeamOnboardingChecklistQueryHookResult = ReturnType<typeof useFreeTeamOnboardingChecklistQuery>;
export type FreeTeamOnboardingChecklistLazyQueryHookResult = ReturnType<typeof useFreeTeamOnboardingChecklistLazyQuery>;
export type FreeTeamOnboardingChecklistQueryResult = Apollo.QueryResult<FreeTeamOnboardingChecklistQuery, FreeTeamOnboardingChecklistQueryVariables>;