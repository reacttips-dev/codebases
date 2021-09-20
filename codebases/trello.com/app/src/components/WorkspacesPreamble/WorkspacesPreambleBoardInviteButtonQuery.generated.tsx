import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"WorkspacesPreambleBoardInviteButton"}}
export type WorkspacesPreambleBoardInviteButtonQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID'];
}>;


export type WorkspacesPreambleBoardInviteButtonQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id' | 'enterpriseOwned' | 'idOrganization'>
    & { members: Array<(
      { __typename: 'Member' }
      & Pick<Types.Member, 'id'>
    )>, memberships: Array<(
      { __typename: 'Board_Membership' }
      & Pick<Types.Board_Membership, 'idMember' | 'memberType'>
    )> }
  )>, member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'confirmed'>
    & { enterprises: Array<(
      { __typename: 'Enterprise' }
      & Pick<Types.Enterprise, 'id'>
    )> }
  )> }
);


export const WorkspacesPreambleBoardInviteButtonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WorkspacesPreambleBoardInviteButton"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"enterpriseOwned"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"confirmed"}},{"kind":"Field","name":{"kind":"Name","value":"enterprises"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useWorkspacesPreambleBoardInviteButtonQuery__
 *
 * To run a query within a React component, call `useWorkspacesPreambleBoardInviteButtonQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspacesPreambleBoardInviteButtonQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspacesPreambleBoardInviteButtonQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *   },
 * });
 */
export function useWorkspacesPreambleBoardInviteButtonQuery(baseOptions: Apollo.QueryHookOptions<WorkspacesPreambleBoardInviteButtonQuery, WorkspacesPreambleBoardInviteButtonQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspacesPreambleBoardInviteButtonQuery, WorkspacesPreambleBoardInviteButtonQueryVariables>(WorkspacesPreambleBoardInviteButtonDocument, options);
      }
export function useWorkspacesPreambleBoardInviteButtonLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspacesPreambleBoardInviteButtonQuery, WorkspacesPreambleBoardInviteButtonQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspacesPreambleBoardInviteButtonQuery, WorkspacesPreambleBoardInviteButtonQueryVariables>(WorkspacesPreambleBoardInviteButtonDocument, options);
        }
export type WorkspacesPreambleBoardInviteButtonQueryHookResult = ReturnType<typeof useWorkspacesPreambleBoardInviteButtonQuery>;
export type WorkspacesPreambleBoardInviteButtonLazyQueryHookResult = ReturnType<typeof useWorkspacesPreambleBoardInviteButtonLazyQuery>;
export type WorkspacesPreambleBoardInviteButtonQueryResult = Apollo.QueryResult<WorkspacesPreambleBoardInviteButtonQuery, WorkspacesPreambleBoardInviteButtonQueryVariables>;