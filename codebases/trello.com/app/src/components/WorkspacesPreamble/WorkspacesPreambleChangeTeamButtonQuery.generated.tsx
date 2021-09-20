import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"WorkspacesPreambleChangeTeamButton"}}
export type WorkspacesPreambleChangeTeamButtonQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID'];
}>;


export type WorkspacesPreambleChangeTeamButtonQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id' | 'idOrganization'>
    & { memberships: Array<(
      { __typename: 'Board_Membership' }
      & Pick<Types.Board_Membership, 'idMember' | 'memberType'>
    )>, organization?: Types.Maybe<(
      { __typename: 'Organization' }
      & Pick<Types.Organization, 'displayName'>
    )> }
  )> }
);


export const WorkspacesPreambleChangeTeamButtonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WorkspacesPreambleChangeTeamButton"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useWorkspacesPreambleChangeTeamButtonQuery__
 *
 * To run a query within a React component, call `useWorkspacesPreambleChangeTeamButtonQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspacesPreambleChangeTeamButtonQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspacesPreambleChangeTeamButtonQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *   },
 * });
 */
export function useWorkspacesPreambleChangeTeamButtonQuery(baseOptions: Apollo.QueryHookOptions<WorkspacesPreambleChangeTeamButtonQuery, WorkspacesPreambleChangeTeamButtonQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspacesPreambleChangeTeamButtonQuery, WorkspacesPreambleChangeTeamButtonQueryVariables>(WorkspacesPreambleChangeTeamButtonDocument, options);
      }
export function useWorkspacesPreambleChangeTeamButtonLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspacesPreambleChangeTeamButtonQuery, WorkspacesPreambleChangeTeamButtonQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspacesPreambleChangeTeamButtonQuery, WorkspacesPreambleChangeTeamButtonQueryVariables>(WorkspacesPreambleChangeTeamButtonDocument, options);
        }
export type WorkspacesPreambleChangeTeamButtonQueryHookResult = ReturnType<typeof useWorkspacesPreambleChangeTeamButtonQuery>;
export type WorkspacesPreambleChangeTeamButtonLazyQueryHookResult = ReturnType<typeof useWorkspacesPreambleChangeTeamButtonLazyQuery>;
export type WorkspacesPreambleChangeTeamButtonQueryResult = Apollo.QueryResult<WorkspacesPreambleChangeTeamButtonQuery, WorkspacesPreambleChangeTeamButtonQueryVariables>;