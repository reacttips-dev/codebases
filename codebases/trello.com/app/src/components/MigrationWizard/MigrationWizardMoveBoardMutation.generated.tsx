import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"MigrationWizardMoveBoard"}}
export type MigrationWizardMoveBoardMutationVariables = Types.Exact<{
  boardId: Types.Scalars['ID'];
  orgId: Types.Scalars['ID'];
  keepBillableGuests?: Types.Maybe<Types.Scalars['Boolean']>;
  traceId?: Types.Maybe<Types.Scalars['String']>;
}>;


export type MigrationWizardMoveBoardMutation = (
  { __typename: 'Mutation' }
  & { updateBoardOrg?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id' | 'idOrganization'>
  )> }
);


export const MigrationWizardMoveBoardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MigrationWizardMoveBoard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"keepBillableGuests"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"defaultValue":{"kind":"BooleanValue","value":false}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBoardOrg"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"boardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}},{"kind":"Argument","name":{"kind":"Name","value":"orgId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}},{"kind":"Argument","name":{"kind":"Name","value":"keepBillableGuests"},"value":{"kind":"Variable","name":{"kind":"Name","value":"keepBillableGuests"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}}]}}]}}]} as unknown as DocumentNode;
export type MigrationWizardMoveBoardMutationFn = Apollo.MutationFunction<MigrationWizardMoveBoardMutation, MigrationWizardMoveBoardMutationVariables>;

/**
 * __useMigrationWizardMoveBoardMutation__
 *
 * To run a mutation, you first call `useMigrationWizardMoveBoardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMigrationWizardMoveBoardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [migrationWizardMoveBoardMutation, { data, loading, error }] = useMigrationWizardMoveBoardMutation({
 *   variables: {
 *      boardId: // value for 'boardId'
 *      orgId: // value for 'orgId'
 *      keepBillableGuests: // value for 'keepBillableGuests'
 *      traceId: // value for 'traceId'
 *   },
 * });
 */
export function useMigrationWizardMoveBoardMutation(baseOptions?: Apollo.MutationHookOptions<MigrationWizardMoveBoardMutation, MigrationWizardMoveBoardMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MigrationWizardMoveBoardMutation, MigrationWizardMoveBoardMutationVariables>(MigrationWizardMoveBoardDocument, options);
      }
export type MigrationWizardMoveBoardMutationHookResult = ReturnType<typeof useMigrationWizardMoveBoardMutation>;
export type MigrationWizardMoveBoardMutationResult = Apollo.MutationResult<MigrationWizardMoveBoardMutation>;
export type MigrationWizardMoveBoardMutationOptions = Apollo.BaseMutationOptions<MigrationWizardMoveBoardMutation, MigrationWizardMoveBoardMutationVariables>;