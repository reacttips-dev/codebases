import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"FreeTeamOnboardingChecklistDismissCheckItem"}}
export type FreeTeamOnboardingChecklistDismissCheckItemMutationVariables = Types.Exact<{
  messageId: Types.Scalars['ID'];
}>;


export type FreeTeamOnboardingChecklistDismissCheckItemMutation = (
  { __typename: 'Mutation' }
  & { addOneTimeMessagesDismissed?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'oneTimeMessagesDismissed'>
  )> }
);


export const FreeTeamOnboardingChecklistDismissCheckItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"FreeTeamOnboardingChecklistDismissCheckItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"messageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addOneTimeMessagesDismissed"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"memberId"},"value":{"kind":"StringValue","value":"me","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"messageId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"messageId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}}]}}]}}]} as unknown as DocumentNode;
export type FreeTeamOnboardingChecklistDismissCheckItemMutationFn = Apollo.MutationFunction<FreeTeamOnboardingChecklistDismissCheckItemMutation, FreeTeamOnboardingChecklistDismissCheckItemMutationVariables>;

/**
 * __useFreeTeamOnboardingChecklistDismissCheckItemMutation__
 *
 * To run a mutation, you first call `useFreeTeamOnboardingChecklistDismissCheckItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFreeTeamOnboardingChecklistDismissCheckItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [freeTeamOnboardingChecklistDismissCheckItemMutation, { data, loading, error }] = useFreeTeamOnboardingChecklistDismissCheckItemMutation({
 *   variables: {
 *      messageId: // value for 'messageId'
 *   },
 * });
 */
export function useFreeTeamOnboardingChecklistDismissCheckItemMutation(baseOptions?: Apollo.MutationHookOptions<FreeTeamOnboardingChecklistDismissCheckItemMutation, FreeTeamOnboardingChecklistDismissCheckItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<FreeTeamOnboardingChecklistDismissCheckItemMutation, FreeTeamOnboardingChecklistDismissCheckItemMutationVariables>(FreeTeamOnboardingChecklistDismissCheckItemDocument, options);
      }
export type FreeTeamOnboardingChecklistDismissCheckItemMutationHookResult = ReturnType<typeof useFreeTeamOnboardingChecklistDismissCheckItemMutation>;
export type FreeTeamOnboardingChecklistDismissCheckItemMutationResult = Apollo.MutationResult<FreeTeamOnboardingChecklistDismissCheckItemMutation>;
export type FreeTeamOnboardingChecklistDismissCheckItemMutationOptions = Apollo.BaseMutationOptions<FreeTeamOnboardingChecklistDismissCheckItemMutation, FreeTeamOnboardingChecklistDismissCheckItemMutationVariables>;