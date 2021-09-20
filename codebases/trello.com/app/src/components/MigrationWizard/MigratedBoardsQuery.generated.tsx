import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"MigratedBoards"}}
export type MigratedBoardsQueryVariables = Types.Exact<{
  orgId: Types.Scalars['ID'];
}>;


export type MigratedBoardsQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id' | 'displayName'>
    & { boards: Array<(
      { __typename: 'Board' }
      & Pick<Types.Board, 'id' | 'name' | 'enterpriseOwned' | 'idOrganization'>
      & { prefs?: Types.Maybe<(
        { __typename: 'Board_Prefs' }
        & Pick<Types.Board_Prefs, 'backgroundTopColor' | 'permissionLevel' | 'backgroundImage' | 'backgroundTile'>
        & { backgroundImageScaled?: Types.Maybe<Array<(
          { __typename: 'Board_Prefs_BackgroundImageScaled' }
          & Pick<Types.Board_Prefs_BackgroundImageScaled, 'width' | 'height' | 'url'>
        )>> }
      )>, memberships: Array<(
        { __typename: 'Board_Membership' }
        & Pick<Types.Board_Membership, 'idMember' | 'memberType'>
      )> }
    )> }
  )> }
);


export const MigratedBoardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MigratedBoards"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"boards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"open"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backgroundTopColor"}},{"kind":"Field","name":{"kind":"Name","value":"permissionLevel"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImage"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundTile"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImageScaled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"enterpriseOwned"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}}]}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useMigratedBoardsQuery__
 *
 * To run a query within a React component, call `useMigratedBoardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMigratedBoardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMigratedBoardsQuery({
 *   variables: {
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useMigratedBoardsQuery(baseOptions: Apollo.QueryHookOptions<MigratedBoardsQuery, MigratedBoardsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MigratedBoardsQuery, MigratedBoardsQueryVariables>(MigratedBoardsDocument, options);
      }
export function useMigratedBoardsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MigratedBoardsQuery, MigratedBoardsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MigratedBoardsQuery, MigratedBoardsQueryVariables>(MigratedBoardsDocument, options);
        }
export type MigratedBoardsQueryHookResult = ReturnType<typeof useMigratedBoardsQuery>;
export type MigratedBoardsLazyQueryHookResult = ReturnType<typeof useMigratedBoardsLazyQuery>;
export type MigratedBoardsQueryResult = Apollo.QueryResult<MigratedBoardsQuery, MigratedBoardsQueryVariables>;