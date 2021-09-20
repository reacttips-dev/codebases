import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"QuickFilterTableSelectedBoards"}}
export type QuickFilterTableSelectedBoardsQueryVariables = Types.Exact<{
  idOrg: Types.Scalars['ID'];
  shortLinksOrIds: Array<Types.Scalars['ID']> | Types.Scalars['ID'];
}>;


export type QuickFilterTableSelectedBoardsQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & { boards: Array<(
      { __typename: 'Board' }
      & Pick<Types.Board, 'id' | 'name'>
      & { lists: Array<(
        { __typename: 'List' }
        & Pick<Types.List, 'id' | 'name'>
      )>, memberships: Array<(
        { __typename: 'Board_Membership' }
        & Pick<Types.Board_Membership, 'idMember' | 'deactivated'>
      )>, members: Array<(
        { __typename: 'Member' }
        & Pick<Types.Member, 'id' | 'fullName' | 'username'>
      )>, labels: Array<(
        { __typename: 'Label' }
        & Pick<Types.Label, 'id' | 'name' | 'color'>
      )> }
    )> }
  )> }
);


export const QuickFilterTableSelectedBoardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"QuickFilterTableSelectedBoards"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idOrg"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"shortLinksOrIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idOrg"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"shortLinksOrIds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"lists"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"open"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"deactivated"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useQuickFilterTableSelectedBoardsQuery__
 *
 * To run a query within a React component, call `useQuickFilterTableSelectedBoardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useQuickFilterTableSelectedBoardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQuickFilterTableSelectedBoardsQuery({
 *   variables: {
 *      idOrg: // value for 'idOrg'
 *      shortLinksOrIds: // value for 'shortLinksOrIds'
 *   },
 * });
 */
export function useQuickFilterTableSelectedBoardsQuery(baseOptions: Apollo.QueryHookOptions<QuickFilterTableSelectedBoardsQuery, QuickFilterTableSelectedBoardsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<QuickFilterTableSelectedBoardsQuery, QuickFilterTableSelectedBoardsQueryVariables>(QuickFilterTableSelectedBoardsDocument, options);
      }
export function useQuickFilterTableSelectedBoardsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<QuickFilterTableSelectedBoardsQuery, QuickFilterTableSelectedBoardsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<QuickFilterTableSelectedBoardsQuery, QuickFilterTableSelectedBoardsQueryVariables>(QuickFilterTableSelectedBoardsDocument, options);
        }
export type QuickFilterTableSelectedBoardsQueryHookResult = ReturnType<typeof useQuickFilterTableSelectedBoardsQuery>;
export type QuickFilterTableSelectedBoardsLazyQueryHookResult = ReturnType<typeof useQuickFilterTableSelectedBoardsLazyQuery>;
export type QuickFilterTableSelectedBoardsQueryResult = Apollo.QueryResult<QuickFilterTableSelectedBoardsQuery, QuickFilterTableSelectedBoardsQueryVariables>;