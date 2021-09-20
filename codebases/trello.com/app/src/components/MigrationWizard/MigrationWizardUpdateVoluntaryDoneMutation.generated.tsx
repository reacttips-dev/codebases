import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"MigrationWizardUpdateVoluntaryDone"}}
export type MigrationWizardUpdateVoluntaryDoneMutationVariables = Types.Exact<{
  memberId: Types.Scalars['ID'];
}>;


export type MigrationWizardUpdateVoluntaryDoneMutation = (
  { __typename: 'Mutation' }
  & { updateTeamifyVoluntaryDone?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id'>
  )> }
);


export const MigrationWizardUpdateVoluntaryDoneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MigrationWizardUpdateVoluntaryDone"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTeamifyVoluntaryDone"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"memberId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode;
export type MigrationWizardUpdateVoluntaryDoneMutationFn = Apollo.MutationFunction<MigrationWizardUpdateVoluntaryDoneMutation, MigrationWizardUpdateVoluntaryDoneMutationVariables>;

/**
 * __useMigrationWizardUpdateVoluntaryDoneMutation__
 *
 * To run a mutation, you first call `useMigrationWizardUpdateVoluntaryDoneMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMigrationWizardUpdateVoluntaryDoneMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [migrationWizardUpdateVoluntaryDoneMutation, { data, loading, error }] = useMigrationWizardUpdateVoluntaryDoneMutation({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useMigrationWizardUpdateVoluntaryDoneMutation(baseOptions?: Apollo.MutationHookOptions<MigrationWizardUpdateVoluntaryDoneMutation, MigrationWizardUpdateVoluntaryDoneMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MigrationWizardUpdateVoluntaryDoneMutation, MigrationWizardUpdateVoluntaryDoneMutationVariables>(MigrationWizardUpdateVoluntaryDoneDocument, options);
      }
export type MigrationWizardUpdateVoluntaryDoneMutationHookResult = ReturnType<typeof useMigrationWizardUpdateVoluntaryDoneMutation>;
export type MigrationWizardUpdateVoluntaryDoneMutationResult = Apollo.MutationResult<MigrationWizardUpdateVoluntaryDoneMutation>;
export type MigrationWizardUpdateVoluntaryDoneMutationOptions = Apollo.BaseMutationOptions<MigrationWizardUpdateVoluntaryDoneMutation, MigrationWizardUpdateVoluntaryDoneMutationVariables>;