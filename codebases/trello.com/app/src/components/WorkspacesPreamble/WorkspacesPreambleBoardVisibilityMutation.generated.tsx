import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"WorkspacesPreambleBoardVisibility"}}
export type WorkspacesPreambleBoardVisibilityMutationVariables = Types.Exact<{
  boardId: Types.Scalars['ID'];
  visibility: Types.Board_Prefs_PermissionLevel;
  orgId?: Types.Maybe<Types.Scalars['ID']>;
  keepBillableGuests?: Types.Maybe<Types.Scalars['Boolean']>;
}>;


export type WorkspacesPreambleBoardVisibilityMutation = (
  { __typename: 'Mutation' }
  & { updateBoardVisibility?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id'>
  )> }
);


export const WorkspacesPreambleBoardVisibilityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"WorkspacesPreambleBoardVisibility"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visibility"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Board_Prefs_PermissionLevel"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"keepBillableGuests"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBoardVisibility"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"boardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}},{"kind":"Argument","name":{"kind":"Name","value":"visibility"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visibility"}}},{"kind":"Argument","name":{"kind":"Name","value":"orgId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}},{"kind":"Argument","name":{"kind":"Name","value":"keepBillableGuests"},"value":{"kind":"Variable","name":{"kind":"Name","value":"keepBillableGuests"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode;
export type WorkspacesPreambleBoardVisibilityMutationFn = Apollo.MutationFunction<WorkspacesPreambleBoardVisibilityMutation, WorkspacesPreambleBoardVisibilityMutationVariables>;

/**
 * __useWorkspacesPreambleBoardVisibilityMutation__
 *
 * To run a mutation, you first call `useWorkspacesPreambleBoardVisibilityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useWorkspacesPreambleBoardVisibilityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [workspacesPreambleBoardVisibilityMutation, { data, loading, error }] = useWorkspacesPreambleBoardVisibilityMutation({
 *   variables: {
 *      boardId: // value for 'boardId'
 *      visibility: // value for 'visibility'
 *      orgId: // value for 'orgId'
 *      keepBillableGuests: // value for 'keepBillableGuests'
 *   },
 * });
 */
export function useWorkspacesPreambleBoardVisibilityMutation(baseOptions?: Apollo.MutationHookOptions<WorkspacesPreambleBoardVisibilityMutation, WorkspacesPreambleBoardVisibilityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<WorkspacesPreambleBoardVisibilityMutation, WorkspacesPreambleBoardVisibilityMutationVariables>(WorkspacesPreambleBoardVisibilityDocument, options);
      }
export type WorkspacesPreambleBoardVisibilityMutationHookResult = ReturnType<typeof useWorkspacesPreambleBoardVisibilityMutation>;
export type WorkspacesPreambleBoardVisibilityMutationResult = Apollo.MutationResult<WorkspacesPreambleBoardVisibilityMutation>;
export type WorkspacesPreambleBoardVisibilityMutationOptions = Apollo.BaseMutationOptions<WorkspacesPreambleBoardVisibilityMutation, WorkspacesPreambleBoardVisibilityMutationVariables>;