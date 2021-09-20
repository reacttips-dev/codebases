import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"WorkspaceForOrganizationView"}}
export type WorkspaceForOrganizationViewQueryVariables = Types.Exact<{
  idOrganizationView: Types.Scalars['ID'];
}>;


export type WorkspaceForOrganizationViewQuery = (
  { __typename: 'Query' }
  & { organizationView?: Types.Maybe<(
    { __typename: 'OrganizationView' }
    & Pick<Types.OrganizationView, 'id' | 'idOrganization'>
  )> }
);


export const WorkspaceForOrganizationViewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WorkspaceForOrganizationView"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idOrganizationView"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationView"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idOrganizationView"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useWorkspaceForOrganizationViewQuery__
 *
 * To run a query within a React component, call `useWorkspaceForOrganizationViewQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceForOrganizationViewQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceForOrganizationViewQuery({
 *   variables: {
 *      idOrganizationView: // value for 'idOrganizationView'
 *   },
 * });
 */
export function useWorkspaceForOrganizationViewQuery(baseOptions: Apollo.QueryHookOptions<WorkspaceForOrganizationViewQuery, WorkspaceForOrganizationViewQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspaceForOrganizationViewQuery, WorkspaceForOrganizationViewQueryVariables>(WorkspaceForOrganizationViewDocument, options);
      }
export function useWorkspaceForOrganizationViewLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspaceForOrganizationViewQuery, WorkspaceForOrganizationViewQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspaceForOrganizationViewQuery, WorkspaceForOrganizationViewQueryVariables>(WorkspaceForOrganizationViewDocument, options);
        }
export type WorkspaceForOrganizationViewQueryHookResult = ReturnType<typeof useWorkspaceForOrganizationViewQuery>;
export type WorkspaceForOrganizationViewLazyQueryHookResult = ReturnType<typeof useWorkspaceForOrganizationViewLazyQuery>;
export type WorkspaceForOrganizationViewQueryResult = Apollo.QueryResult<WorkspaceForOrganizationViewQuery, WorkspaceForOrganizationViewQueryVariables>;