import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"BoardClosedCards"}}
export type BoardClosedCardsQueryVariables = Types.Exact<{
  parentId: Types.Scalars['ID'];
}>;


export type BoardClosedCardsQuery = (
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


export const BoardClosedCardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BoardClosedCards"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"closed"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useBoardClosedCardsQuery__
 *
 * To run a query within a React component, call `useBoardClosedCardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardClosedCardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardClosedCardsQuery({
 *   variables: {
 *      parentId: // value for 'parentId'
 *   },
 * });
 */
export function useBoardClosedCardsQuery(baseOptions: Apollo.QueryHookOptions<BoardClosedCardsQuery, BoardClosedCardsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BoardClosedCardsQuery, BoardClosedCardsQueryVariables>(BoardClosedCardsDocument, options);
      }
export function useBoardClosedCardsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BoardClosedCardsQuery, BoardClosedCardsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BoardClosedCardsQuery, BoardClosedCardsQueryVariables>(BoardClosedCardsDocument, options);
        }
export type BoardClosedCardsQueryHookResult = ReturnType<typeof useBoardClosedCardsQuery>;
export type BoardClosedCardsLazyQueryHookResult = ReturnType<typeof useBoardClosedCardsLazyQuery>;
export type BoardClosedCardsQueryResult = Apollo.QueryResult<BoardClosedCardsQuery, BoardClosedCardsQueryVariables>;