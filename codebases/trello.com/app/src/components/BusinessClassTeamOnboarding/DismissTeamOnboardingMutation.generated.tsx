import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"DismissTeamOnboarding"}}
export type DismissTeamOnboardingMutationVariables = Types.Exact<{
  memberId: Types.Scalars['ID'];
  messageId: Types.Scalars['ID'];
}>;


export type DismissTeamOnboardingMutation = (
  { __typename: 'Mutation' }
  & { addOneTimeMessagesDismissed?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'oneTimeMessagesDismissed'>
  )> }
);


export const DismissTeamOnboardingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DismissTeamOnboarding"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"messageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addOneTimeMessagesDismissed"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"memberId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}},{"kind":"Argument","name":{"kind":"Name","value":"messageId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"messageId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}}]}}]}}]} as unknown as DocumentNode;
export type DismissTeamOnboardingMutationFn = Apollo.MutationFunction<DismissTeamOnboardingMutation, DismissTeamOnboardingMutationVariables>;

/**
 * __useDismissTeamOnboardingMutation__
 *
 * To run a mutation, you first call `useDismissTeamOnboardingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDismissTeamOnboardingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [dismissTeamOnboardingMutation, { data, loading, error }] = useDismissTeamOnboardingMutation({
 *   variables: {
 *      memberId: // value for 'memberId'
 *      messageId: // value for 'messageId'
 *   },
 * });
 */
export function useDismissTeamOnboardingMutation(baseOptions?: Apollo.MutationHookOptions<DismissTeamOnboardingMutation, DismissTeamOnboardingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DismissTeamOnboardingMutation, DismissTeamOnboardingMutationVariables>(DismissTeamOnboardingDocument, options);
      }
export type DismissTeamOnboardingMutationHookResult = ReturnType<typeof useDismissTeamOnboardingMutation>;
export type DismissTeamOnboardingMutationResult = Apollo.MutationResult<DismissTeamOnboardingMutation>;
export type DismissTeamOnboardingMutationOptions = Apollo.BaseMutationOptions<DismissTeamOnboardingMutation, DismissTeamOnboardingMutationVariables>;