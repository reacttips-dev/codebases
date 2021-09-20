import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"SelectedWorkspace"}}
export type SelectedWorkspaceQueryVariables = Types.Exact<{
  orgId: Types.Scalars['ID'];
}>;


export type SelectedWorkspaceQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id' | 'idEnterprise' | 'products' | 'displayName' | 'premiumFeatures'>
    & { prefs: (
      { __typename: 'Organization_Prefs' }
      & { boardVisibilityRestrict?: Types.Maybe<(
        { __typename: 'Organization_Prefs_BoardVisibilityRestrict' }
        & Pick<Types.Organization_Prefs_BoardVisibilityRestrict, 'private' | 'org' | 'enterprise' | 'public'>
      )> }
    ), boards: Array<(
      { __typename: 'Board' }
      & Pick<Types.Board, 'id' | 'name'>
      & { prefs?: Types.Maybe<(
        { __typename: 'Board_Prefs' }
        & Pick<Types.Board_Prefs, 'backgroundTopColor' | 'backgroundTile' | 'backgroundImage' | 'permissionLevel'>
        & { backgroundImageScaled?: Types.Maybe<Array<(
          { __typename: 'Board_Prefs_BackgroundImageScaled' }
          & Pick<Types.Board_Prefs_BackgroundImageScaled, 'width' | 'height' | 'url'>
        )>> }
      )> }
    )> }
  )> }
);


export const SelectedWorkspaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SelectedWorkspace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"products"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boardVisibilityRestrict"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"org"}},{"kind":"Field","name":{"kind":"Name","value":"enterprise"}},{"kind":"Field","name":{"kind":"Name","value":"public"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"boards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"open"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backgroundTopColor"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundTile"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImage"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImageScaled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"permissionLevel"}}]}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useSelectedWorkspaceQuery__
 *
 * To run a query within a React component, call `useSelectedWorkspaceQuery` and pass it any options that fit your needs.
 * When your component renders, `useSelectedWorkspaceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSelectedWorkspaceQuery({
 *   variables: {
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useSelectedWorkspaceQuery(baseOptions: Apollo.QueryHookOptions<SelectedWorkspaceQuery, SelectedWorkspaceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SelectedWorkspaceQuery, SelectedWorkspaceQueryVariables>(SelectedWorkspaceDocument, options);
      }
export function useSelectedWorkspaceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SelectedWorkspaceQuery, SelectedWorkspaceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SelectedWorkspaceQuery, SelectedWorkspaceQueryVariables>(SelectedWorkspaceDocument, options);
        }
export type SelectedWorkspaceQueryHookResult = ReturnType<typeof useSelectedWorkspaceQuery>;
export type SelectedWorkspaceLazyQueryHookResult = ReturnType<typeof useSelectedWorkspaceLazyQuery>;
export type SelectedWorkspaceQueryResult = Apollo.QueryResult<SelectedWorkspaceQuery, SelectedWorkspaceQueryVariables>;