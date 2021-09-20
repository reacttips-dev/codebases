import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"OrganizationOpenBoards"}}
export type OrganizationOpenBoardsQueryVariables = Types.Exact<{
  parentId: Types.Scalars['ID'];
}>;


export type OrganizationOpenBoardsQuery = (
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


export const OrganizationOpenBoardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrganizationOpenBoards"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"boards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"open"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useOrganizationOpenBoardsQuery__
 *
 * To run a query within a React component, call `useOrganizationOpenBoardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrganizationOpenBoardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrganizationOpenBoardsQuery({
 *   variables: {
 *      parentId: // value for 'parentId'
 *   },
 * });
 */
export function useOrganizationOpenBoardsQuery(baseOptions: Apollo.QueryHookOptions<OrganizationOpenBoardsQuery, OrganizationOpenBoardsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrganizationOpenBoardsQuery, OrganizationOpenBoardsQueryVariables>(OrganizationOpenBoardsDocument, options);
      }
export function useOrganizationOpenBoardsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrganizationOpenBoardsQuery, OrganizationOpenBoardsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrganizationOpenBoardsQuery, OrganizationOpenBoardsQueryVariables>(OrganizationOpenBoardsDocument, options);
        }
export type OrganizationOpenBoardsQueryHookResult = ReturnType<typeof useOrganizationOpenBoardsQuery>;
export type OrganizationOpenBoardsLazyQueryHookResult = ReturnType<typeof useOrganizationOpenBoardsLazyQuery>;
export type OrganizationOpenBoardsQueryResult = Apollo.QueryResult<OrganizationOpenBoardsQuery, OrganizationOpenBoardsQueryVariables>;