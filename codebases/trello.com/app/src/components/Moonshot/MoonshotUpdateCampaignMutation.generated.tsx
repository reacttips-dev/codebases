import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"MoonshotUpdateCampaign"}}
export type MoonshotUpdateCampaignMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  currentStep?: Types.Maybe<Types.Scalars['String']>;
  dateDismissed?: Types.Maybe<Types.Scalars['String']>;
  isDismissed?: Types.Maybe<Types.Scalars['Boolean']>;
}>;


export type MoonshotUpdateCampaignMutation = (
  { __typename: 'Mutation' }
  & { updateCampaign?: Types.Maybe<(
    { __typename: 'Campaign' }
    & Pick<Types.Campaign, 'id' | 'dateDismissed' | 'currentStep' | 'name'>
  )> }
);


export const MoonshotUpdateCampaignDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MoonshotUpdateCampaign"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"currentStep"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dateDismissed"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isDismissed"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCampaign"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"campaignId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"currentStep"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currentStep"}}},{"kind":"Argument","name":{"kind":"Name","value":"dateDismissed"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dateDismissed"}}},{"kind":"Argument","name":{"kind":"Name","value":"isDismissed"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isDismissed"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"dateDismissed"}},{"kind":"Field","name":{"kind":"Name","value":"currentStep"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode;
export type MoonshotUpdateCampaignMutationFn = Apollo.MutationFunction<MoonshotUpdateCampaignMutation, MoonshotUpdateCampaignMutationVariables>;

/**
 * __useMoonshotUpdateCampaignMutation__
 *
 * To run a mutation, you first call `useMoonshotUpdateCampaignMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMoonshotUpdateCampaignMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [moonshotUpdateCampaignMutation, { data, loading, error }] = useMoonshotUpdateCampaignMutation({
 *   variables: {
 *      id: // value for 'id'
 *      currentStep: // value for 'currentStep'
 *      dateDismissed: // value for 'dateDismissed'
 *      isDismissed: // value for 'isDismissed'
 *   },
 * });
 */
export function useMoonshotUpdateCampaignMutation(baseOptions?: Apollo.MutationHookOptions<MoonshotUpdateCampaignMutation, MoonshotUpdateCampaignMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MoonshotUpdateCampaignMutation, MoonshotUpdateCampaignMutationVariables>(MoonshotUpdateCampaignDocument, options);
      }
export type MoonshotUpdateCampaignMutationHookResult = ReturnType<typeof useMoonshotUpdateCampaignMutation>;
export type MoonshotUpdateCampaignMutationResult = Apollo.MutationResult<MoonshotUpdateCampaignMutation>;
export type MoonshotUpdateCampaignMutationOptions = Apollo.BaseMutationOptions<MoonshotUpdateCampaignMutation, MoonshotUpdateCampaignMutationVariables>;