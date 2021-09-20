import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"AllBoardsAndWorkspaces"}}
export type AllBoardsAndWorkspacesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type AllBoardsAndWorkspacesQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'username'>
    & { boards: Array<(
      { __typename: 'Board' }
      & Pick<Types.Board, 'url' | 'dateLastView' | 'idOrganization' | 'closed'>
    )>, organizations: Array<(
      { __typename: 'Organization' }
      & Pick<Types.Organization, 'id' | 'displayName' | 'name' | 'logoHash'>
    )>, guestOrganizations: Array<(
      { __typename: 'GuestOrganization' }
      & Pick<Types.GuestOrganization, 'id' | 'displayName' | 'logoHash'>
    )> }
  )> }
);


export const AllBoardsAndWorkspacesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllBoardsAndWorkspaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"boards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"dateLastView"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logoHash"}}]}},{"kind":"Field","name":{"kind":"Name","value":"guestOrganizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"logoHash"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useAllBoardsAndWorkspacesQuery__
 *
 * To run a query within a React component, call `useAllBoardsAndWorkspacesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllBoardsAndWorkspacesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllBoardsAndWorkspacesQuery({
 *   variables: {
 *   },
 * });
 */
export function useAllBoardsAndWorkspacesQuery(baseOptions?: Apollo.QueryHookOptions<AllBoardsAndWorkspacesQuery, AllBoardsAndWorkspacesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllBoardsAndWorkspacesQuery, AllBoardsAndWorkspacesQueryVariables>(AllBoardsAndWorkspacesDocument, options);
      }
export function useAllBoardsAndWorkspacesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllBoardsAndWorkspacesQuery, AllBoardsAndWorkspacesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllBoardsAndWorkspacesQuery, AllBoardsAndWorkspacesQueryVariables>(AllBoardsAndWorkspacesDocument, options);
        }
export type AllBoardsAndWorkspacesQueryHookResult = ReturnType<typeof useAllBoardsAndWorkspacesQuery>;
export type AllBoardsAndWorkspacesLazyQueryHookResult = ReturnType<typeof useAllBoardsAndWorkspacesLazyQuery>;
export type AllBoardsAndWorkspacesQueryResult = Apollo.QueryResult<AllBoardsAndWorkspacesQuery, AllBoardsAndWorkspacesQueryVariables>;