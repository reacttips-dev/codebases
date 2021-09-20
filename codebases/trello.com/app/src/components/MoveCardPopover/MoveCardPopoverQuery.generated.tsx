import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"MoveCardPopover"}}
export type MoveCardPopoverQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID'];
}>;


export type MoveCardPopoverQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & { lists: Array<(
      { __typename: 'List' }
      & Pick<Types.List, 'id' | 'name'>
    )>, cards: Array<(
      { __typename: 'Card' }
      & Pick<Types.Card, 'id' | 'idList'>
    )> }
  )> }
);


export const MoveCardPopoverDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MoveCardPopover"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lists"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"open"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"visible"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idList"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useMoveCardPopoverQuery__
 *
 * To run a query within a React component, call `useMoveCardPopoverQuery` and pass it any options that fit your needs.
 * When your component renders, `useMoveCardPopoverQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMoveCardPopoverQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *   },
 * });
 */
export function useMoveCardPopoverQuery(baseOptions: Apollo.QueryHookOptions<MoveCardPopoverQuery, MoveCardPopoverQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MoveCardPopoverQuery, MoveCardPopoverQueryVariables>(MoveCardPopoverDocument, options);
      }
export function useMoveCardPopoverLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MoveCardPopoverQuery, MoveCardPopoverQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MoveCardPopoverQuery, MoveCardPopoverQueryVariables>(MoveCardPopoverDocument, options);
        }
export type MoveCardPopoverQueryHookResult = ReturnType<typeof useMoveCardPopoverQuery>;
export type MoveCardPopoverLazyQueryHookResult = ReturnType<typeof useMoveCardPopoverLazyQuery>;
export type MoveCardPopoverQueryResult = Apollo.QueryResult<MoveCardPopoverQuery, MoveCardPopoverQueryVariables>;