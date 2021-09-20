import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"UpgradePromptDismissMessage"}}
export type UpgradePromptDismissMessageMutationVariables = Types.Exact<{
  memberId: Types.Scalars['ID'];
  messageId: Types.Scalars['ID'];
}>;


export type UpgradePromptDismissMessageMutation = (
  { __typename: 'Mutation' }
  & { addOneTimeMessagesDismissed?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'oneTimeMessagesDismissed'>
  )> }
);


export const UpgradePromptDismissMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpgradePromptDismissMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"messageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addOneTimeMessagesDismissed"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"memberId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}},{"kind":"Argument","name":{"kind":"Name","value":"messageId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"messageId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}}]}}]}}]} as unknown as DocumentNode;
export type UpgradePromptDismissMessageMutationFn = Apollo.MutationFunction<UpgradePromptDismissMessageMutation, UpgradePromptDismissMessageMutationVariables>;

/**
 * __useUpgradePromptDismissMessageMutation__
 *
 * To run a mutation, you first call `useUpgradePromptDismissMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpgradePromptDismissMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upgradePromptDismissMessageMutation, { data, loading, error }] = useUpgradePromptDismissMessageMutation({
 *   variables: {
 *      memberId: // value for 'memberId'
 *      messageId: // value for 'messageId'
 *   },
 * });
 */
export function useUpgradePromptDismissMessageMutation(baseOptions?: Apollo.MutationHookOptions<UpgradePromptDismissMessageMutation, UpgradePromptDismissMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpgradePromptDismissMessageMutation, UpgradePromptDismissMessageMutationVariables>(UpgradePromptDismissMessageDocument, options);
      }
export type UpgradePromptDismissMessageMutationHookResult = ReturnType<typeof useUpgradePromptDismissMessageMutation>;
export type UpgradePromptDismissMessageMutationResult = Apollo.MutationResult<UpgradePromptDismissMessageMutation>;
export type UpgradePromptDismissMessageMutationOptions = Apollo.BaseMutationOptions<UpgradePromptDismissMessageMutation, UpgradePromptDismissMessageMutationVariables>;