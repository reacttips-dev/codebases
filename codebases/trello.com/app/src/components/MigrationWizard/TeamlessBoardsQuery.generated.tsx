import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"TeamlessBoards"}}
export type TeamlessBoardsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type TeamlessBoardsQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id'>
    & { boards: Array<(
      { __typename: 'Board' }
      & Pick<Types.Board, 'id' | 'name' | 'enterpriseOwned' | 'idOrganization'>
      & { prefs?: Types.Maybe<(
        { __typename: 'Board_Prefs' }
        & Pick<Types.Board_Prefs, 'backgroundTopColor' | 'backgroundImage' | 'backgroundTile' | 'permissionLevel'>
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


export const TeamlessBoardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TeamlessBoards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"boards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"open"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backgroundTopColor"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImage"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundTile"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImageScaled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"permissionLevel"}}]}},{"kind":"Field","name":{"kind":"Name","value":"enterpriseOwned"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}}]}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useTeamlessBoardsQuery__
 *
 * To run a query within a React component, call `useTeamlessBoardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTeamlessBoardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTeamlessBoardsQuery({
 *   variables: {
 *   },
 * });
 */
export function useTeamlessBoardsQuery(baseOptions?: Apollo.QueryHookOptions<TeamlessBoardsQuery, TeamlessBoardsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TeamlessBoardsQuery, TeamlessBoardsQueryVariables>(TeamlessBoardsDocument, options);
      }
export function useTeamlessBoardsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TeamlessBoardsQuery, TeamlessBoardsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TeamlessBoardsQuery, TeamlessBoardsQueryVariables>(TeamlessBoardsDocument, options);
        }
export type TeamlessBoardsQueryHookResult = ReturnType<typeof useTeamlessBoardsQuery>;
export type TeamlessBoardsLazyQueryHookResult = ReturnType<typeof useTeamlessBoardsLazyQuery>;
export type TeamlessBoardsQueryResult = Apollo.QueryResult<TeamlessBoardsQuery, TeamlessBoardsQueryVariables>;