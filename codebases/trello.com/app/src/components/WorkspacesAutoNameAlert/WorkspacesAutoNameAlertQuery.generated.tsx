import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"WorkspacesAutoNameAlert"}}
export type WorkspacesAutoNameAlertQueryVariables = Types.Exact<{
  orgId: Types.Scalars['ID'];
}>;


export type WorkspacesAutoNameAlertQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'creationMethod' | 'displayName' | 'idMemberCreator' | 'url'>
  )>, member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'oneTimeMessagesDismissed'>
  )> }
);


export const WorkspacesAutoNameAlertDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WorkspacesAutoNameAlert"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"creationMethod"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"idMemberCreator"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useWorkspacesAutoNameAlertQuery__
 *
 * To run a query within a React component, call `useWorkspacesAutoNameAlertQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspacesAutoNameAlertQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspacesAutoNameAlertQuery({
 *   variables: {
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useWorkspacesAutoNameAlertQuery(baseOptions: Apollo.QueryHookOptions<WorkspacesAutoNameAlertQuery, WorkspacesAutoNameAlertQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspacesAutoNameAlertQuery, WorkspacesAutoNameAlertQueryVariables>(WorkspacesAutoNameAlertDocument, options);
      }
export function useWorkspacesAutoNameAlertLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspacesAutoNameAlertQuery, WorkspacesAutoNameAlertQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspacesAutoNameAlertQuery, WorkspacesAutoNameAlertQueryVariables>(WorkspacesAutoNameAlertDocument, options);
        }
export type WorkspacesAutoNameAlertQueryHookResult = ReturnType<typeof useWorkspacesAutoNameAlertQuery>;
export type WorkspacesAutoNameAlertLazyQueryHookResult = ReturnType<typeof useWorkspacesAutoNameAlertLazyQuery>;
export type WorkspacesAutoNameAlertQueryResult = Apollo.QueryResult<WorkspacesAutoNameAlertQuery, WorkspacesAutoNameAlertQueryVariables>;