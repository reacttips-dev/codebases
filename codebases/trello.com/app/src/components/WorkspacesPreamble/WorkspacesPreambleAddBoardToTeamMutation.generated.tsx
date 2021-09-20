import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"WorkspacesPreambleAddBoardToTeam"}}
export type WorkspacesPreambleAddBoardToTeamMutationVariables = Types.Exact<{
  boardId: Types.Scalars['ID'];
  orgId?: Types.Maybe<Types.Scalars['ID']>;
  keepBillableGuests?: Types.Maybe<Types.Scalars['Boolean']>;
}>;


export type WorkspacesPreambleAddBoardToTeamMutation = (
  { __typename: 'Mutation' }
  & { updateBoardOrg?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id'>
  )> }
);


export const WorkspacesPreambleAddBoardToTeamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"WorkspacesPreambleAddBoardToTeam"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"keepBillableGuests"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBoardOrg"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"boardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}},{"kind":"Argument","name":{"kind":"Name","value":"orgId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}},{"kind":"Argument","name":{"kind":"Name","value":"keepBillableGuests"},"value":{"kind":"Variable","name":{"kind":"Name","value":"keepBillableGuests"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode;
export type WorkspacesPreambleAddBoardToTeamMutationFn = Apollo.MutationFunction<WorkspacesPreambleAddBoardToTeamMutation, WorkspacesPreambleAddBoardToTeamMutationVariables>;

/**
 * __useWorkspacesPreambleAddBoardToTeamMutation__
 *
 * To run a mutation, you first call `useWorkspacesPreambleAddBoardToTeamMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useWorkspacesPreambleAddBoardToTeamMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [workspacesPreambleAddBoardToTeamMutation, { data, loading, error }] = useWorkspacesPreambleAddBoardToTeamMutation({
 *   variables: {
 *      boardId: // value for 'boardId'
 *      orgId: // value for 'orgId'
 *      keepBillableGuests: // value for 'keepBillableGuests'
 *   },
 * });
 */
export function useWorkspacesPreambleAddBoardToTeamMutation(baseOptions?: Apollo.MutationHookOptions<WorkspacesPreambleAddBoardToTeamMutation, WorkspacesPreambleAddBoardToTeamMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<WorkspacesPreambleAddBoardToTeamMutation, WorkspacesPreambleAddBoardToTeamMutationVariables>(WorkspacesPreambleAddBoardToTeamDocument, options);
      }
export type WorkspacesPreambleAddBoardToTeamMutationHookResult = ReturnType<typeof useWorkspacesPreambleAddBoardToTeamMutation>;
export type WorkspacesPreambleAddBoardToTeamMutationResult = Apollo.MutationResult<WorkspacesPreambleAddBoardToTeamMutation>;
export type WorkspacesPreambleAddBoardToTeamMutationOptions = Apollo.BaseMutationOptions<WorkspacesPreambleAddBoardToTeamMutation, WorkspacesPreambleAddBoardToTeamMutationVariables>;