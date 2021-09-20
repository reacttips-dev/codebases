import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"BoardsInOrg"}}
export type BoardsInOrgQueryVariables = Types.Exact<{
  orgId: Types.Scalars['ID'];
}>;


export type BoardsInOrgQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & { boards: Array<(
      { __typename: 'Board' }
      & Pick<Types.Board, 'id'>
    )>, memberships: Array<(
      { __typename: 'Organization_Membership' }
      & Pick<Types.Organization_Membership, 'idMember' | 'memberType'>
    )> }
  )> }
);


export const BoardsInOrgDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BoardsInOrg"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"open"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useBoardsInOrgQuery__
 *
 * To run a query within a React component, call `useBoardsInOrgQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardsInOrgQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardsInOrgQuery({
 *   variables: {
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useBoardsInOrgQuery(baseOptions: Apollo.QueryHookOptions<BoardsInOrgQuery, BoardsInOrgQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BoardsInOrgQuery, BoardsInOrgQueryVariables>(BoardsInOrgDocument, options);
      }
export function useBoardsInOrgLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BoardsInOrgQuery, BoardsInOrgQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BoardsInOrgQuery, BoardsInOrgQueryVariables>(BoardsInOrgDocument, options);
        }
export type BoardsInOrgQueryHookResult = ReturnType<typeof useBoardsInOrgQuery>;
export type BoardsInOrgLazyQueryHookResult = ReturnType<typeof useBoardsInOrgLazyQuery>;
export type BoardsInOrgQueryResult = Apollo.QueryResult<BoardsInOrgQuery, BoardsInOrgQueryVariables>;