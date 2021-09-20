import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"AtlassianAccountMigrationStage"}}
export type AtlassianAccountMigrationStageQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID'];
}>;


export type AtlassianAccountMigrationStageQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'aaBlockSyncUntil' | 'aaEnrolledDate' | 'confirmed' | 'domainClaimed' | 'idEnterprise' | 'isAaMastered' | 'loginTypes' | 'oneTimeMessagesDismissed'>
    & { enterprises: Array<(
      { __typename: 'Enterprise' }
      & Pick<Types.Enterprise, 'isAtlassianOrg'>
    )> }
  )> }
);


export const AtlassianAccountMigrationStageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AtlassianAccountMigrationStage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aaBlockSyncUntil"}},{"kind":"Field","name":{"kind":"Name","value":"aaEnrolledDate"}},{"kind":"Field","name":{"kind":"Name","value":"confirmed"}},{"kind":"Field","name":{"kind":"Name","value":"domainClaimed"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"isAaMastered"}},{"kind":"Field","name":{"kind":"Name","value":"loginTypes"}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}},{"kind":"Field","name":{"kind":"Name","value":"enterprises"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"owned"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isAtlassianOrg"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useAtlassianAccountMigrationStageQuery__
 *
 * To run a query within a React component, call `useAtlassianAccountMigrationStageQuery` and pass it any options that fit your needs.
 * When your component renders, `useAtlassianAccountMigrationStageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAtlassianAccountMigrationStageQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useAtlassianAccountMigrationStageQuery(baseOptions: Apollo.QueryHookOptions<AtlassianAccountMigrationStageQuery, AtlassianAccountMigrationStageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AtlassianAccountMigrationStageQuery, AtlassianAccountMigrationStageQueryVariables>(AtlassianAccountMigrationStageDocument, options);
      }
export function useAtlassianAccountMigrationStageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AtlassianAccountMigrationStageQuery, AtlassianAccountMigrationStageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AtlassianAccountMigrationStageQuery, AtlassianAccountMigrationStageQueryVariables>(AtlassianAccountMigrationStageDocument, options);
        }
export type AtlassianAccountMigrationStageQueryHookResult = ReturnType<typeof useAtlassianAccountMigrationStageQuery>;
export type AtlassianAccountMigrationStageLazyQueryHookResult = ReturnType<typeof useAtlassianAccountMigrationStageLazyQuery>;
export type AtlassianAccountMigrationStageQueryResult = Apollo.QueryResult<AtlassianAccountMigrationStageQuery, AtlassianAccountMigrationStageQueryVariables>;