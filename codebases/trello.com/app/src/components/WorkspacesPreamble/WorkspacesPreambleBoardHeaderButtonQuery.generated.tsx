import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"WorkspacesPreambleBoardHeaderButton"}}
export type WorkspacesPreambleBoardHeaderButtonQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID'];
}>;


export type WorkspacesPreambleBoardHeaderButtonQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id' | 'idOrganization' | 'enterpriseOwned'>
    & { members: Array<(
      { __typename: 'Member' }
      & Pick<Types.Member, 'confirmed' | 'id'>
    )>, memberships: Array<(
      { __typename: 'Board_Membership' }
      & Pick<Types.Board_Membership, 'idMember' | 'memberType'>
    )> }
  )>, member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'confirmed' | 'idOrganizations' | 'oneTimeMessagesDismissed'>
  )> }
);


export const WorkspacesPreambleBoardHeaderButtonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WorkspacesPreambleBoardHeaderButton"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}},{"kind":"Field","name":{"kind":"Name","value":"enterpriseOwned"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"confirmed"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"confirmed"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganizations"}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useWorkspacesPreambleBoardHeaderButtonQuery__
 *
 * To run a query within a React component, call `useWorkspacesPreambleBoardHeaderButtonQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspacesPreambleBoardHeaderButtonQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspacesPreambleBoardHeaderButtonQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *   },
 * });
 */
export function useWorkspacesPreambleBoardHeaderButtonQuery(baseOptions: Apollo.QueryHookOptions<WorkspacesPreambleBoardHeaderButtonQuery, WorkspacesPreambleBoardHeaderButtonQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspacesPreambleBoardHeaderButtonQuery, WorkspacesPreambleBoardHeaderButtonQueryVariables>(WorkspacesPreambleBoardHeaderButtonDocument, options);
      }
export function useWorkspacesPreambleBoardHeaderButtonLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspacesPreambleBoardHeaderButtonQuery, WorkspacesPreambleBoardHeaderButtonQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspacesPreambleBoardHeaderButtonQuery, WorkspacesPreambleBoardHeaderButtonQueryVariables>(WorkspacesPreambleBoardHeaderButtonDocument, options);
        }
export type WorkspacesPreambleBoardHeaderButtonQueryHookResult = ReturnType<typeof useWorkspacesPreambleBoardHeaderButtonQuery>;
export type WorkspacesPreambleBoardHeaderButtonLazyQueryHookResult = ReturnType<typeof useWorkspacesPreambleBoardHeaderButtonLazyQuery>;
export type WorkspacesPreambleBoardHeaderButtonQueryResult = Apollo.QueryResult<WorkspacesPreambleBoardHeaderButtonQuery, WorkspacesPreambleBoardHeaderButtonQueryVariables>;