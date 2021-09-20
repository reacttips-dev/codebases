import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"TeamBoardSelector"}}
export type TeamBoardSelectorQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type TeamBoardSelectorQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & { boardStars: Array<(
      { __typename: 'BoardStar' }
      & Pick<Types.BoardStar, 'idBoard'>
    )>, boards: Array<(
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
  )> }
);


export const TeamBoardSelectorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TeamBoardSelector"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boardStars"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idBoard"}}]}},{"kind":"Field","name":{"kind":"Name","value":"boards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"open"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}},{"kind":"Field","name":{"kind":"Name","value":"shortLink"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImage"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColor"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImageScaled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}},{"kind":"Field","name":{"kind":"Name","value":"backgroundTile"}}]}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useTeamBoardSelectorQuery__
 *
 * To run a query within a React component, call `useTeamBoardSelectorQuery` and pass it any options that fit your needs.
 * When your component renders, `useTeamBoardSelectorQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTeamBoardSelectorQuery({
 *   variables: {
 *   },
 * });
 */
export function useTeamBoardSelectorQuery(baseOptions?: Apollo.QueryHookOptions<TeamBoardSelectorQuery, TeamBoardSelectorQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TeamBoardSelectorQuery, TeamBoardSelectorQueryVariables>(TeamBoardSelectorDocument, options);
      }
export function useTeamBoardSelectorLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TeamBoardSelectorQuery, TeamBoardSelectorQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TeamBoardSelectorQuery, TeamBoardSelectorQueryVariables>(TeamBoardSelectorDocument, options);
        }
export type TeamBoardSelectorQueryHookResult = ReturnType<typeof useTeamBoardSelectorQuery>;
export type TeamBoardSelectorLazyQueryHookResult = ReturnType<typeof useTeamBoardSelectorLazyQuery>;
export type TeamBoardSelectorQueryResult = Apollo.QueryResult<TeamBoardSelectorQuery, TeamBoardSelectorQueryVariables>;