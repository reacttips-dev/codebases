import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"BoardOpenCards"}}
export type BoardOpenCardsQueryVariables = Types.Exact<{
  parentId: Types.Scalars['ID'];
}>;


export type BoardOpenCardsQuery = (
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


export const BoardOpenCardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BoardOpenCards"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"open"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useBoardOpenCardsQuery__
 *
 * To run a query within a React component, call `useBoardOpenCardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardOpenCardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardOpenCardsQuery({
 *   variables: {
 *      parentId: // value for 'parentId'
 *   },
 * });
 */
export function useBoardOpenCardsQuery(baseOptions: Apollo.QueryHookOptions<BoardOpenCardsQuery, BoardOpenCardsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BoardOpenCardsQuery, BoardOpenCardsQueryVariables>(BoardOpenCardsDocument, options);
      }
export function useBoardOpenCardsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BoardOpenCardsQuery, BoardOpenCardsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BoardOpenCardsQuery, BoardOpenCardsQueryVariables>(BoardOpenCardsDocument, options);
        }
export type BoardOpenCardsQueryHookResult = ReturnType<typeof useBoardOpenCardsQuery>;
export type BoardOpenCardsLazyQueryHookResult = ReturnType<typeof useBoardOpenCardsLazyQuery>;
export type BoardOpenCardsQueryResult = Apollo.QueryResult<BoardOpenCardsQuery, BoardOpenCardsQueryVariables>;