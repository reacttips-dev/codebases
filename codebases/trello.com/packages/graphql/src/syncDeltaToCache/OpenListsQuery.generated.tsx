import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"OpenLists"}}
export type OpenListsQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID'];
}>;


export type OpenListsQuery = (
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


export const OpenListsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OpenLists"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lists"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"open"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useOpenListsQuery__
 *
 * To run a query within a React component, call `useOpenListsQuery` and pass it any options that fit your needs.
 * When your component renders, `useOpenListsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOpenListsQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *   },
 * });
 */
export function useOpenListsQuery(baseOptions: Apollo.QueryHookOptions<OpenListsQuery, OpenListsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OpenListsQuery, OpenListsQueryVariables>(OpenListsDocument, options);
      }
export function useOpenListsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OpenListsQuery, OpenListsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OpenListsQuery, OpenListsQueryVariables>(OpenListsDocument, options);
        }
export type OpenListsQueryHookResult = ReturnType<typeof useOpenListsQuery>;
export type OpenListsLazyQueryHookResult = ReturnType<typeof useOpenListsLazyQuery>;
export type OpenListsQueryResult = Apollo.QueryResult<OpenListsQuery, OpenListsQueryVariables>;