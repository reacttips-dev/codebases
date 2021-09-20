import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"OrganizationClosedBoards"}}
export type OrganizationClosedBoardsQueryVariables = Types.Exact<{
  parentId: Types.Scalars['ID'];
}>;


export type OrganizationClosedBoardsQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id'>
    & { boards: Array<(
      { __typename: 'Board' }
      & Pick<Types.Board, 'id'>
    )> }
  )> }
);


export const OrganizationClosedBoardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrganizationClosedBoards"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"boards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"closed"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useOrganizationClosedBoardsQuery__
 *
 * To run a query within a React component, call `useOrganizationClosedBoardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrganizationClosedBoardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrganizationClosedBoardsQuery({
 *   variables: {
 *      parentId: // value for 'parentId'
 *   },
 * });
 */
export function useOrganizationClosedBoardsQuery(baseOptions: Apollo.QueryHookOptions<OrganizationClosedBoardsQuery, OrganizationClosedBoardsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrganizationClosedBoardsQuery, OrganizationClosedBoardsQueryVariables>(OrganizationClosedBoardsDocument, options);
      }
export function useOrganizationClosedBoardsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrganizationClosedBoardsQuery, OrganizationClosedBoardsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrganizationClosedBoardsQuery, OrganizationClosedBoardsQueryVariables>(OrganizationClosedBoardsDocument, options);
        }
export type OrganizationClosedBoardsQueryHookResult = ReturnType<typeof useOrganizationClosedBoardsQuery>;
export type OrganizationClosedBoardsLazyQueryHookResult = ReturnType<typeof useOrganizationClosedBoardsLazyQuery>;
export type OrganizationClosedBoardsQueryResult = Apollo.QueryResult<OrganizationClosedBoardsQuery, OrganizationClosedBoardsQueryVariables>;