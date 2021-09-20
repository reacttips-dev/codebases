import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"AddWorkspaceNavEnabledOneTimeMessage"}}
export type AddWorkspaceNavEnabledOneTimeMessageMutationVariables = Types.Exact<{
  messageId: Types.Scalars['ID'];
}>;


export type AddWorkspaceNavEnabledOneTimeMessageMutation = (
  { __typename: 'Mutation' }
  & { addOneTimeMessagesDismissed?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'oneTimeMessagesDismissed'>
  )> }
);


export const AddWorkspaceNavEnabledOneTimeMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddWorkspaceNavEnabledOneTimeMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"messageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addOneTimeMessagesDismissed"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"memberId"},"value":{"kind":"StringValue","value":"me","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"messageId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"messageId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}}]}}]}}]} as unknown as DocumentNode;
export type AddWorkspaceNavEnabledOneTimeMessageMutationFn = Apollo.MutationFunction<AddWorkspaceNavEnabledOneTimeMessageMutation, AddWorkspaceNavEnabledOneTimeMessageMutationVariables>;

/**
 * __useAddWorkspaceNavEnabledOneTimeMessageMutation__
 *
 * To run a mutation, you first call `useAddWorkspaceNavEnabledOneTimeMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddWorkspaceNavEnabledOneTimeMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addWorkspaceNavEnabledOneTimeMessageMutation, { data, loading, error }] = useAddWorkspaceNavEnabledOneTimeMessageMutation({
 *   variables: {
 *      messageId: // value for 'messageId'
 *   },
 * });
 */
export function useAddWorkspaceNavEnabledOneTimeMessageMutation(baseOptions?: Apollo.MutationHookOptions<AddWorkspaceNavEnabledOneTimeMessageMutation, AddWorkspaceNavEnabledOneTimeMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddWorkspaceNavEnabledOneTimeMessageMutation, AddWorkspaceNavEnabledOneTimeMessageMutationVariables>(AddWorkspaceNavEnabledOneTimeMessageDocument, options);
      }
export type AddWorkspaceNavEnabledOneTimeMessageMutationHookResult = ReturnType<typeof useAddWorkspaceNavEnabledOneTimeMessageMutation>;
export type AddWorkspaceNavEnabledOneTimeMessageMutationResult = Apollo.MutationResult<AddWorkspaceNavEnabledOneTimeMessageMutation>;
export type AddWorkspaceNavEnabledOneTimeMessageMutationOptions = Apollo.BaseMutationOptions<AddWorkspaceNavEnabledOneTimeMessageMutation, AddWorkspaceNavEnabledOneTimeMessageMutationVariables>;