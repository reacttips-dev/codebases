import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"WorkspaceForOrganization"}}
export type WorkspaceForOrganizationQueryVariables = Types.Exact<{
  name: Types.Scalars['ID'];
}>;


export type WorkspaceForOrganizationQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id'>
  )> }
);


export const WorkspaceForOrganizationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WorkspaceForOrganization"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useWorkspaceForOrganizationQuery__
 *
 * To run a query within a React component, call `useWorkspaceForOrganizationQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceForOrganizationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceForOrganizationQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useWorkspaceForOrganizationQuery(baseOptions: Apollo.QueryHookOptions<WorkspaceForOrganizationQuery, WorkspaceForOrganizationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspaceForOrganizationQuery, WorkspaceForOrganizationQueryVariables>(WorkspaceForOrganizationDocument, options);
      }
export function useWorkspaceForOrganizationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspaceForOrganizationQuery, WorkspaceForOrganizationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspaceForOrganizationQuery, WorkspaceForOrganizationQueryVariables>(WorkspaceForOrganizationDocument, options);
        }
export type WorkspaceForOrganizationQueryHookResult = ReturnType<typeof useWorkspaceForOrganizationQuery>;
export type WorkspaceForOrganizationLazyQueryHookResult = ReturnType<typeof useWorkspaceForOrganizationLazyQuery>;
export type WorkspaceForOrganizationQueryResult = Apollo.QueryResult<WorkspaceForOrganizationQuery, WorkspaceForOrganizationQueryVariables>;