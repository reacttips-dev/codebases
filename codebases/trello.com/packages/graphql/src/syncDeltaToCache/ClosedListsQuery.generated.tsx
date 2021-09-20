import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"ClosedLists"}}
export type ClosedListsQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID'];
}>;


export type ClosedListsQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id'>
    & { lists: Array<(
      { __typename: 'List' }
      & Pick<Types.List, 'id' | 'closed'>
    )> }
  )> }
);


export const ClosedListsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ClosedLists"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lists"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"closed"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useClosedListsQuery__
 *
 * To run a query within a React component, call `useClosedListsQuery` and pass it any options that fit your needs.
 * When your component renders, `useClosedListsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClosedListsQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *   },
 * });
 */
export function useClosedListsQuery(baseOptions: Apollo.QueryHookOptions<ClosedListsQuery, ClosedListsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ClosedListsQuery, ClosedListsQueryVariables>(ClosedListsDocument, options);
      }
export function useClosedListsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ClosedListsQuery, ClosedListsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ClosedListsQuery, ClosedListsQueryVariables>(ClosedListsDocument, options);
        }
export type ClosedListsQueryHookResult = ReturnType<typeof useClosedListsQuery>;
export type ClosedListsLazyQueryHookResult = ReturnType<typeof useClosedListsLazyQuery>;
export type ClosedListsQueryResult = Apollo.QueryResult<ClosedListsQuery, ClosedListsQueryVariables>;