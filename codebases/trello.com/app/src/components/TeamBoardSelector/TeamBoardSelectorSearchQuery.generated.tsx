import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"TeamBoardSelectorSearch"}}
export type TeamBoardSelectorSearchQueryVariables = Types.Exact<{
  query: Types.Scalars['String'];
  idOrganizations?: Types.Maybe<Array<Types.Scalars['ID']> | Types.Scalars['ID']>;
}>;


export type TeamBoardSelectorSearchQuery = (
  { __typename: 'Query' }
  & { search: (
    { __typename: 'Search' }
    & { boards: Array<(
      { __typename: 'Board' }
      & Pick<Types.Board, 'id' | 'name' | 'idOrganization' | 'shortLink' | 'closed'>
      & { prefs?: Types.Maybe<(
        { __typename: 'Board_Prefs' }
        & Pick<Types.Board_Prefs, 'background' | 'backgroundImage' | 'backgroundColor' | 'backgroundTile'>
        & { backgroundImageScaled?: Types.Maybe<Array<(
          { __typename: 'Board_Prefs_BackgroundImageScaled' }
          & Pick<Types.Board_Prefs_BackgroundImageScaled, 'url' | 'width' | 'height'>
        )>> }
      )> }
    )> }
  ) }
);


export const TeamBoardSelectorSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TeamBoardSelectorSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idOrganizations"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"search"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}},{"kind":"Argument","name":{"kind":"Name","value":"idOrganizations"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idOrganizations"}}},{"kind":"Argument","name":{"kind":"Name","value":"partial"},"value":{"kind":"BooleanValue","value":true}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}},{"kind":"Field","name":{"kind":"Name","value":"shortLink"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImage"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColor"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImageScaled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}},{"kind":"Field","name":{"kind":"Name","value":"backgroundTile"}}]}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useTeamBoardSelectorSearchQuery__
 *
 * To run a query within a React component, call `useTeamBoardSelectorSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useTeamBoardSelectorSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTeamBoardSelectorSearchQuery({
 *   variables: {
 *      query: // value for 'query'
 *      idOrganizations: // value for 'idOrganizations'
 *   },
 * });
 */
export function useTeamBoardSelectorSearchQuery(baseOptions: Apollo.QueryHookOptions<TeamBoardSelectorSearchQuery, TeamBoardSelectorSearchQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TeamBoardSelectorSearchQuery, TeamBoardSelectorSearchQueryVariables>(TeamBoardSelectorSearchDocument, options);
      }
export function useTeamBoardSelectorSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TeamBoardSelectorSearchQuery, TeamBoardSelectorSearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TeamBoardSelectorSearchQuery, TeamBoardSelectorSearchQueryVariables>(TeamBoardSelectorSearchDocument, options);
        }
export type TeamBoardSelectorSearchQueryHookResult = ReturnType<typeof useTeamBoardSelectorSearchQuery>;
export type TeamBoardSelectorSearchLazyQueryHookResult = ReturnType<typeof useTeamBoardSelectorSearchLazyQuery>;
export type TeamBoardSelectorSearchQueryResult = Apollo.QueryResult<TeamBoardSelectorSearchQuery, TeamBoardSelectorSearchQueryVariables>;