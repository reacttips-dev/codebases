import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"AddSpotlightLoomOneTimeMessagesDismissed"}}
export type AddSpotlightLoomOneTimeMessagesDismissedMutationVariables = Types.Exact<{
  messageId: Types.Scalars['ID'];
}>;


export type AddSpotlightLoomOneTimeMessagesDismissedMutation = (
  { __typename: 'Mutation' }
  & { addOneTimeMessagesDismissed?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'oneTimeMessagesDismissed'>
  )> }
);


export const AddSpotlightLoomOneTimeMessagesDismissedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddSpotlightLoomOneTimeMessagesDismissed"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"messageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addOneTimeMessagesDismissed"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"memberId"},"value":{"kind":"StringValue","value":"me","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"messageId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"messageId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}}]}}]}}]} as unknown as DocumentNode;
export type AddSpotlightLoomOneTimeMessagesDismissedMutationFn = Apollo.MutationFunction<AddSpotlightLoomOneTimeMessagesDismissedMutation, AddSpotlightLoomOneTimeMessagesDismissedMutationVariables>;

/**
 * __useAddSpotlightLoomOneTimeMessagesDismissedMutation__
 *
 * To run a mutation, you first call `useAddSpotlightLoomOneTimeMessagesDismissedMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddSpotlightLoomOneTimeMessagesDismissedMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addSpotlightLoomOneTimeMessagesDismissedMutation, { data, loading, error }] = useAddSpotlightLoomOneTimeMessagesDismissedMutation({
 *   variables: {
 *      messageId: // value for 'messageId'
 *   },
 * });
 */
export function useAddSpotlightLoomOneTimeMessagesDismissedMutation(baseOptions?: Apollo.MutationHookOptions<AddSpotlightLoomOneTimeMessagesDismissedMutation, AddSpotlightLoomOneTimeMessagesDismissedMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddSpotlightLoomOneTimeMessagesDismissedMutation, AddSpotlightLoomOneTimeMessagesDismissedMutationVariables>(AddSpotlightLoomOneTimeMessagesDismissedDocument, options);
      }
export type AddSpotlightLoomOneTimeMessagesDismissedMutationHookResult = ReturnType<typeof useAddSpotlightLoomOneTimeMessagesDismissedMutation>;
export type AddSpotlightLoomOneTimeMessagesDismissedMutationResult = Apollo.MutationResult<AddSpotlightLoomOneTimeMessagesDismissedMutation>;
export type AddSpotlightLoomOneTimeMessagesDismissedMutationOptions = Apollo.BaseMutationOptions<AddSpotlightLoomOneTimeMessagesDismissedMutation, AddSpotlightLoomOneTimeMessagesDismissedMutationVariables>;