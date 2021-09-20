import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"MigrationWizardBoardVisibilityChooserBoardVisibility"}}
export type MigrationWizardBoardVisibilityChooserBoardVisibilityMutationVariables = Types.Exact<{
  boardId: Types.Scalars['ID'];
  visibility: Types.Board_Prefs_PermissionLevel;
}>;


export type MigrationWizardBoardVisibilityChooserBoardVisibilityMutation = (
  { __typename: 'Mutation' }
  & { updateBoardVisibility?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id'>
  )> }
);


export const MigrationWizardBoardVisibilityChooserBoardVisibilityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MigrationWizardBoardVisibilityChooserBoardVisibility"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visibility"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Board_Prefs_PermissionLevel"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBoardVisibility"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"boardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}},{"kind":"Argument","name":{"kind":"Name","value":"visibility"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visibility"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode;
export type MigrationWizardBoardVisibilityChooserBoardVisibilityMutationFn = Apollo.MutationFunction<MigrationWizardBoardVisibilityChooserBoardVisibilityMutation, MigrationWizardBoardVisibilityChooserBoardVisibilityMutationVariables>;

/**
 * __useMigrationWizardBoardVisibilityChooserBoardVisibilityMutation__
 *
 * To run a mutation, you first call `useMigrationWizardBoardVisibilityChooserBoardVisibilityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMigrationWizardBoardVisibilityChooserBoardVisibilityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [migrationWizardBoardVisibilityChooserBoardVisibilityMutation, { data, loading, error }] = useMigrationWizardBoardVisibilityChooserBoardVisibilityMutation({
 *   variables: {
 *      boardId: // value for 'boardId'
 *      visibility: // value for 'visibility'
 *   },
 * });
 */
export function useMigrationWizardBoardVisibilityChooserBoardVisibilityMutation(baseOptions?: Apollo.MutationHookOptions<MigrationWizardBoardVisibilityChooserBoardVisibilityMutation, MigrationWizardBoardVisibilityChooserBoardVisibilityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MigrationWizardBoardVisibilityChooserBoardVisibilityMutation, MigrationWizardBoardVisibilityChooserBoardVisibilityMutationVariables>(MigrationWizardBoardVisibilityChooserBoardVisibilityDocument, options);
      }
export type MigrationWizardBoardVisibilityChooserBoardVisibilityMutationHookResult = ReturnType<typeof useMigrationWizardBoardVisibilityChooserBoardVisibilityMutation>;
export type MigrationWizardBoardVisibilityChooserBoardVisibilityMutationResult = Apollo.MutationResult<MigrationWizardBoardVisibilityChooserBoardVisibilityMutation>;
export type MigrationWizardBoardVisibilityChooserBoardVisibilityMutationOptions = Apollo.BaseMutationOptions<MigrationWizardBoardVisibilityChooserBoardVisibilityMutation, MigrationWizardBoardVisibilityChooserBoardVisibilityMutationVariables>;