import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"BoardVisibleCards"}}
export type BoardVisibleCardsQueryVariables = Types.Exact<{
  parentId: Types.Scalars['ID'];
}>;


export type BoardVisibleCardsQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id'>
    & { cards: Array<(
      { __typename: 'Card' }
      & Pick<Types.Card, 'id'>
    )> }
  )> }
);


export const BoardVisibleCardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BoardVisibleCards"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"visible"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useBoardVisibleCardsQuery__
 *
 * To run a query within a React component, call `useBoardVisibleCardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardVisibleCardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardVisibleCardsQuery({
 *   variables: {
 *      parentId: // value for 'parentId'
 *   },
 * });
 */
export function useBoardVisibleCardsQuery(baseOptions: Apollo.QueryHookOptions<BoardVisibleCardsQuery, BoardVisibleCardsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BoardVisibleCardsQuery, BoardVisibleCardsQueryVariables>(BoardVisibleCardsDocument, options);
      }
export function useBoardVisibleCardsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BoardVisibleCardsQuery, BoardVisibleCardsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BoardVisibleCardsQuery, BoardVisibleCardsQueryVariables>(BoardVisibleCardsDocument, options);
        }
export type BoardVisibleCardsQueryHookResult = ReturnType<typeof useBoardVisibleCardsQuery>;
export type BoardVisibleCardsLazyQueryHookResult = ReturnType<typeof useBoardVisibleCardsLazyQuery>;
export type BoardVisibleCardsQueryResult = Apollo.QueryResult<BoardVisibleCardsQuery, BoardVisibleCardsQueryVariables>;