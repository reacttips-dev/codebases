import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"BoardStats"}}
export type BoardStatsQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID'];
}>;


export type BoardStatsQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & { stats?: Types.Maybe<(
      { __typename: 'Board_Stats' }
      & Pick<Types.Board_Stats, 'viewCount' | 'copyCount'>
    )> }
  )> }
);


export const BoardStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BoardStats"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stats"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"viewCount"}},{"kind":"Field","name":{"kind":"Name","value":"copyCount"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useBoardStatsQuery__
 *
 * To run a query within a React component, call `useBoardStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardStatsQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *   },
 * });
 */
export function useBoardStatsQuery(baseOptions: Apollo.QueryHookOptions<BoardStatsQuery, BoardStatsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BoardStatsQuery, BoardStatsQueryVariables>(BoardStatsDocument, options);
      }
export function useBoardStatsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BoardStatsQuery, BoardStatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BoardStatsQuery, BoardStatsQueryVariables>(BoardStatsDocument, options);
        }
export type BoardStatsQueryHookResult = ReturnType<typeof useBoardStatsQuery>;
export type BoardStatsLazyQueryHookResult = ReturnType<typeof useBoardStatsLazyQuery>;
export type BoardStatsQueryResult = Apollo.QueryResult<BoardStatsQuery, BoardStatsQueryVariables>;