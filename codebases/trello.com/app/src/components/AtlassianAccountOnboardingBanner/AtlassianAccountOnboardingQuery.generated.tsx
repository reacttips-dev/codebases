import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"AtlassianAccountOnboarding"}}
export type AtlassianAccountOnboardingQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID'];
}>;


export type AtlassianAccountOnboardingQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'aaId' | 'email' | 'aaBlockSyncUntil' | 'aaEmail' | 'aaEnrolledDate' | 'credentialsRemovedCount' | 'domainClaimed' | 'isAaMastered' | 'fullName' | 'oneTimeMessagesDismissed' | 'loginTypes'>
    & { boards: Array<(
      { __typename: 'Board' }
      & Pick<Types.Board, 'id'>
    )>, enterprises: Array<(
      { __typename: 'Enterprise' }
      & Pick<Types.Enterprise, 'id' | 'displayName' | 'isAtlassianOrg'>
    )>, logins: Array<(
      { __typename: 'Login' }
      & Pick<Types.Login, 'id' | 'primary' | 'email'>
    )> }
  )> }
);


export const AtlassianAccountOnboardingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AtlassianAccountOnboarding"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"aaId"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"aaBlockSyncUntil"}},{"kind":"Field","name":{"kind":"Name","value":"aaEmail"}},{"kind":"Field","name":{"kind":"Name","value":"aaEnrolledDate"}},{"kind":"Field","name":{"kind":"Name","value":"boards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"credentialsRemovedCount"}},{"kind":"Field","name":{"kind":"Name","value":"domainClaimed"}},{"kind":"Field","name":{"kind":"Name","value":"isAaMastered"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}},{"kind":"Field","name":{"kind":"Name","value":"enterprises"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"owned"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"isAtlassianOrg"}}]}},{"kind":"Field","name":{"kind":"Name","value":"logins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"loginTypes"}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useAtlassianAccountOnboardingQuery__
 *
 * To run a query within a React component, call `useAtlassianAccountOnboardingQuery` and pass it any options that fit your needs.
 * When your component renders, `useAtlassianAccountOnboardingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAtlassianAccountOnboardingQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useAtlassianAccountOnboardingQuery(baseOptions: Apollo.QueryHookOptions<AtlassianAccountOnboardingQuery, AtlassianAccountOnboardingQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AtlassianAccountOnboardingQuery, AtlassianAccountOnboardingQueryVariables>(AtlassianAccountOnboardingDocument, options);
      }
export function useAtlassianAccountOnboardingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AtlassianAccountOnboardingQuery, AtlassianAccountOnboardingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AtlassianAccountOnboardingQuery, AtlassianAccountOnboardingQueryVariables>(AtlassianAccountOnboardingDocument, options);
        }
export type AtlassianAccountOnboardingQueryHookResult = ReturnType<typeof useAtlassianAccountOnboardingQuery>;
export type AtlassianAccountOnboardingLazyQueryHookResult = ReturnType<typeof useAtlassianAccountOnboardingLazyQuery>;
export type AtlassianAccountOnboardingQueryResult = Apollo.QueryResult<AtlassianAccountOnboardingQuery, AtlassianAccountOnboardingQueryVariables>;