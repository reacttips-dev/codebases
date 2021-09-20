import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"MigrationWizardComplexCreateWorkspace"}}
export type MigrationWizardComplexCreateWorkspaceMutationVariables = Types.Exact<{
  name: Types.Scalars['String'];
  teamType: Types.Scalars['String'];
  traceId: Types.Scalars['String'];
}>;


export type MigrationWizardComplexCreateWorkspaceMutation = (
  { __typename: 'Mutation' }
  & { createOrganization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id' | 'displayName' | 'idBoards' | 'products'>
    & { memberships: Array<(
      { __typename: 'Organization_Membership' }
      & Pick<Types.Organization_Membership, 'idMember' | 'memberType'>
    )>, prefs: (
      { __typename: 'Organization_Prefs' }
      & { boardVisibilityRestrict?: Types.Maybe<(
        { __typename: 'Organization_Prefs_BoardVisibilityRestrict' }
        & Pick<Types.Organization_Prefs_BoardVisibilityRestrict, 'private' | 'public' | 'org' | 'enterprise'>
      )> }
    ), limits: (
      { __typename: 'Organization_Limits' }
      & { orgs: (
        { __typename: 'Organization_Limits_Orgs' }
        & { freeBoardsPerOrg: (
          { __typename: 'Limit' }
          & Pick<Types.Limit, 'disableAt'>
        ) }
      ) }
    ) }
  )> }
);


export const MigrationWizardComplexCreateWorkspaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MigrationWizardComplexCreateWorkspace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createOrganization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"displayName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"teamType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamType"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"StringValue","value":"default","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"creationMethod"},"value":{"kind":"StringValue","value":"teamify-wizard","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"idBoards"}},{"kind":"Field","name":{"kind":"Name","value":"products"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boardVisibilityRestrict"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"public"}},{"kind":"Field","name":{"kind":"Name","value":"org"}},{"kind":"Field","name":{"kind":"Name","value":"enterprise"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"limits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orgs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"freeBoardsPerOrg"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode;
export type MigrationWizardComplexCreateWorkspaceMutationFn = Apollo.MutationFunction<MigrationWizardComplexCreateWorkspaceMutation, MigrationWizardComplexCreateWorkspaceMutationVariables>;

/**
 * __useMigrationWizardComplexCreateWorkspaceMutation__
 *
 * To run a mutation, you first call `useMigrationWizardComplexCreateWorkspaceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMigrationWizardComplexCreateWorkspaceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [migrationWizardComplexCreateWorkspaceMutation, { data, loading, error }] = useMigrationWizardComplexCreateWorkspaceMutation({
 *   variables: {
 *      name: // value for 'name'
 *      teamType: // value for 'teamType'
 *      traceId: // value for 'traceId'
 *   },
 * });
 */
export function useMigrationWizardComplexCreateWorkspaceMutation(baseOptions?: Apollo.MutationHookOptions<MigrationWizardComplexCreateWorkspaceMutation, MigrationWizardComplexCreateWorkspaceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MigrationWizardComplexCreateWorkspaceMutation, MigrationWizardComplexCreateWorkspaceMutationVariables>(MigrationWizardComplexCreateWorkspaceDocument, options);
      }
export type MigrationWizardComplexCreateWorkspaceMutationHookResult = ReturnType<typeof useMigrationWizardComplexCreateWorkspaceMutation>;
export type MigrationWizardComplexCreateWorkspaceMutationResult = Apollo.MutationResult<MigrationWizardComplexCreateWorkspaceMutation>;
export type MigrationWizardComplexCreateWorkspaceMutationOptions = Apollo.BaseMutationOptions<MigrationWizardComplexCreateWorkspaceMutation, MigrationWizardComplexCreateWorkspaceMutationVariables>;