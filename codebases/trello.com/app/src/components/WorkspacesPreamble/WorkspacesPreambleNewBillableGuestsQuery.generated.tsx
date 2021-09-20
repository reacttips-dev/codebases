import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"WorkspacesPreambleNewBillableGuests"}}
export type WorkspacesPreambleNewBillableGuestsQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID'];
  orgId: Types.Scalars['ID'];
}>;


export type WorkspacesPreambleNewBillableGuestsQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & { newBillableGuests: Array<(
      { __typename: 'Organization_NewBillableGuest' }
      & Pick<Types.Organization_NewBillableGuest, 'id'>
    )>, memberships: Array<(
      { __typename: 'Organization_Membership' }
      & Pick<Types.Organization_Membership, 'idMember' | 'memberType'>
    )> }
  )> }
);


export const WorkspacesPreambleNewBillableGuestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WorkspacesPreambleNewBillableGuests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newBillableGuests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"boardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useWorkspacesPreambleNewBillableGuestsQuery__
 *
 * To run a query within a React component, call `useWorkspacesPreambleNewBillableGuestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspacesPreambleNewBillableGuestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspacesPreambleNewBillableGuestsQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useWorkspacesPreambleNewBillableGuestsQuery(baseOptions: Apollo.QueryHookOptions<WorkspacesPreambleNewBillableGuestsQuery, WorkspacesPreambleNewBillableGuestsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspacesPreambleNewBillableGuestsQuery, WorkspacesPreambleNewBillableGuestsQueryVariables>(WorkspacesPreambleNewBillableGuestsDocument, options);
      }
export function useWorkspacesPreambleNewBillableGuestsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspacesPreambleNewBillableGuestsQuery, WorkspacesPreambleNewBillableGuestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspacesPreambleNewBillableGuestsQuery, WorkspacesPreambleNewBillableGuestsQueryVariables>(WorkspacesPreambleNewBillableGuestsDocument, options);
        }
export type WorkspacesPreambleNewBillableGuestsQueryHookResult = ReturnType<typeof useWorkspacesPreambleNewBillableGuestsQuery>;
export type WorkspacesPreambleNewBillableGuestsLazyQueryHookResult = ReturnType<typeof useWorkspacesPreambleNewBillableGuestsLazyQuery>;
export type WorkspacesPreambleNewBillableGuestsQueryResult = Apollo.QueryResult<WorkspacesPreambleNewBillableGuestsQuery, WorkspacesPreambleNewBillableGuestsQueryVariables>;