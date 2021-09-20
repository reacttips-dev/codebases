import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"WorkspacesAutoNameAlertDismiss"}}
export type WorkspacesAutoNameAlertDismissMutationVariables = Types.Exact<{
  messageId: Types.Scalars['ID'];
}>;


export type WorkspacesAutoNameAlertDismissMutation = (
  { __typename: 'Mutation' }
  & { addOneTimeMessagesDismissed?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'oneTimeMessagesDismissed'>
  )> }
);


export const WorkspacesAutoNameAlertDismissDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"WorkspacesAutoNameAlertDismiss"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"messageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addOneTimeMessagesDismissed"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"memberId"},"value":{"kind":"StringValue","value":"me","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"messageId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"messageId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}}]}}]}}]} as unknown as DocumentNode;
export type WorkspacesAutoNameAlertDismissMutationFn = Apollo.MutationFunction<WorkspacesAutoNameAlertDismissMutation, WorkspacesAutoNameAlertDismissMutationVariables>;

/**
 * __useWorkspacesAutoNameAlertDismissMutation__
 *
 * To run a mutation, you first call `useWorkspacesAutoNameAlertDismissMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useWorkspacesAutoNameAlertDismissMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [workspacesAutoNameAlertDismissMutation, { data, loading, error }] = useWorkspacesAutoNameAlertDismissMutation({
 *   variables: {
 *      messageId: // value for 'messageId'
 *   },
 * });
 */
export function useWorkspacesAutoNameAlertDismissMutation(baseOptions?: Apollo.MutationHookOptions<WorkspacesAutoNameAlertDismissMutation, WorkspacesAutoNameAlertDismissMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<WorkspacesAutoNameAlertDismissMutation, WorkspacesAutoNameAlertDismissMutationVariables>(WorkspacesAutoNameAlertDismissDocument, options);
      }
export type WorkspacesAutoNameAlertDismissMutationHookResult = ReturnType<typeof useWorkspacesAutoNameAlertDismissMutation>;
export type WorkspacesAutoNameAlertDismissMutationResult = Apollo.MutationResult<WorkspacesAutoNameAlertDismissMutation>;
export type WorkspacesAutoNameAlertDismissMutationOptions = Apollo.BaseMutationOptions<WorkspacesAutoNameAlertDismissMutation, WorkspacesAutoNameAlertDismissMutationVariables>;