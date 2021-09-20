import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"MigrationWizardRemoveMembersFromWorkspace"}}
export type MigrationWizardRemoveMembersFromWorkspaceMutationVariables = Types.Exact<{
  orgId: Types.Scalars['ID'];
  users: Array<Types.Maybe<Types.MemberOrEmail>> | Types.Maybe<Types.MemberOrEmail>;
  type?: Types.Maybe<Types.Scalars['String']>;
}>;


export type MigrationWizardRemoveMembersFromWorkspaceMutation = (
  { __typename: 'Mutation' }
  & { removeMembersFromWorkspace?: Types.Maybe<(
    { __typename: 'RemoveMembersFromWorkspace_Response' }
    & Pick<Types.RemoveMembersFromWorkspace_Response, 'success' | 'error'>
  )> }
);


export const MigrationWizardRemoveMembersFromWorkspaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MigrationWizardRemoveMembersFromWorkspace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"users"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MemberOrEmail"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeMembersFromWorkspace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orgId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}},{"kind":"Argument","name":{"kind":"Name","value":"users"},"value":{"kind":"Variable","name":{"kind":"Name","value":"users"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]} as unknown as DocumentNode;
export type MigrationWizardRemoveMembersFromWorkspaceMutationFn = Apollo.MutationFunction<MigrationWizardRemoveMembersFromWorkspaceMutation, MigrationWizardRemoveMembersFromWorkspaceMutationVariables>;

/**
 * __useMigrationWizardRemoveMembersFromWorkspaceMutation__
 *
 * To run a mutation, you first call `useMigrationWizardRemoveMembersFromWorkspaceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMigrationWizardRemoveMembersFromWorkspaceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [migrationWizardRemoveMembersFromWorkspaceMutation, { data, loading, error }] = useMigrationWizardRemoveMembersFromWorkspaceMutation({
 *   variables: {
 *      orgId: // value for 'orgId'
 *      users: // value for 'users'
 *      type: // value for 'type'
 *   },
 * });
 */
export function useMigrationWizardRemoveMembersFromWorkspaceMutation(baseOptions?: Apollo.MutationHookOptions<MigrationWizardRemoveMembersFromWorkspaceMutation, MigrationWizardRemoveMembersFromWorkspaceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MigrationWizardRemoveMembersFromWorkspaceMutation, MigrationWizardRemoveMembersFromWorkspaceMutationVariables>(MigrationWizardRemoveMembersFromWorkspaceDocument, options);
      }
export type MigrationWizardRemoveMembersFromWorkspaceMutationHookResult = ReturnType<typeof useMigrationWizardRemoveMembersFromWorkspaceMutation>;
export type MigrationWizardRemoveMembersFromWorkspaceMutationResult = Apollo.MutationResult<MigrationWizardRemoveMembersFromWorkspaceMutation>;
export type MigrationWizardRemoveMembersFromWorkspaceMutationOptions = Apollo.BaseMutationOptions<MigrationWizardRemoveMembersFromWorkspaceMutation, MigrationWizardRemoveMembersFromWorkspaceMutationVariables>;