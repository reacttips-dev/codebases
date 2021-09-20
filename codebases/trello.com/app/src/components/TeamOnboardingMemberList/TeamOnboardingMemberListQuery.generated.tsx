import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"TeamOnboardingMemberList"}}
export type TeamOnboardingMemberListQueryVariables = Types.Exact<{
  orgId: Types.Scalars['ID'];
}>;


export type TeamOnboardingMemberListQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & { members: Array<(
      { __typename: 'Member' }
      & Pick<Types.Member, 'id'>
    )> }
  )> }
);


export const TeamOnboardingMemberListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TeamOnboardingMemberList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useTeamOnboardingMemberListQuery__
 *
 * To run a query within a React component, call `useTeamOnboardingMemberListQuery` and pass it any options that fit your needs.
 * When your component renders, `useTeamOnboardingMemberListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTeamOnboardingMemberListQuery({
 *   variables: {
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useTeamOnboardingMemberListQuery(baseOptions: Apollo.QueryHookOptions<TeamOnboardingMemberListQuery, TeamOnboardingMemberListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TeamOnboardingMemberListQuery, TeamOnboardingMemberListQueryVariables>(TeamOnboardingMemberListDocument, options);
      }
export function useTeamOnboardingMemberListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TeamOnboardingMemberListQuery, TeamOnboardingMemberListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TeamOnboardingMemberListQuery, TeamOnboardingMemberListQueryVariables>(TeamOnboardingMemberListDocument, options);
        }
export type TeamOnboardingMemberListQueryHookResult = ReturnType<typeof useTeamOnboardingMemberListQuery>;
export type TeamOnboardingMemberListLazyQueryHookResult = ReturnType<typeof useTeamOnboardingMemberListLazyQuery>;
export type TeamOnboardingMemberListQueryResult = Apollo.QueryResult<TeamOnboardingMemberListQuery, TeamOnboardingMemberListQueryVariables>;