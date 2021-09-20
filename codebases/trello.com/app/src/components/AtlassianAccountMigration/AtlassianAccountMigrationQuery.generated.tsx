import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"AtlassianAccountMigration"}}
export type AtlassianAccountMigrationQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID'];
}>;


export type AtlassianAccountMigrationQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'email' | 'fullName' | 'isAaMastered' | 'aaBlockSyncUntil'>
    & { logins: Array<(
      { __typename: 'Login' }
      & Pick<Types.Login, 'claimable'>
    )>, prefs?: Types.Maybe<(
      { __typename: 'Member_Prefs' }
      & { twoFactor?: Types.Maybe<(
        { __typename: 'Member_Prefs_TwoFactor' }
        & Pick<Types.Member_Prefs_TwoFactor, 'enabled'>
      )> }
    )> }
  )> }
);


export const AtlassianAccountMigrationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AtlassianAccountMigration"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"isAaMastered"}},{"kind":"Field","name":{"kind":"Name","value":"aaBlockSyncUntil"}},{"kind":"Field","name":{"kind":"Name","value":"logins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"claimable"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"twoFactor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useAtlassianAccountMigrationQuery__
 *
 * To run a query within a React component, call `useAtlassianAccountMigrationQuery` and pass it any options that fit your needs.
 * When your component renders, `useAtlassianAccountMigrationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAtlassianAccountMigrationQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useAtlassianAccountMigrationQuery(baseOptions: Apollo.QueryHookOptions<AtlassianAccountMigrationQuery, AtlassianAccountMigrationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AtlassianAccountMigrationQuery, AtlassianAccountMigrationQueryVariables>(AtlassianAccountMigrationDocument, options);
      }
export function useAtlassianAccountMigrationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AtlassianAccountMigrationQuery, AtlassianAccountMigrationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AtlassianAccountMigrationQuery, AtlassianAccountMigrationQueryVariables>(AtlassianAccountMigrationDocument, options);
        }
export type AtlassianAccountMigrationQueryHookResult = ReturnType<typeof useAtlassianAccountMigrationQuery>;
export type AtlassianAccountMigrationLazyQueryHookResult = ReturnType<typeof useAtlassianAccountMigrationLazyQuery>;
export type AtlassianAccountMigrationQueryResult = Apollo.QueryResult<AtlassianAccountMigrationQuery, AtlassianAccountMigrationQueryVariables>;