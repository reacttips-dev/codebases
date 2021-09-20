import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"AcknowledgeNewFeature"}}
export type AcknowledgeNewFeatureMutationVariables = Types.Exact<{
  messageId: Types.Scalars['ID'];
}>;


export type AcknowledgeNewFeatureMutation = (
  { __typename: 'Mutation' }
  & { addOneTimeMessagesDismissed?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'oneTimeMessagesDismissed'>
  )> }
);


export const AcknowledgeNewFeatureDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AcknowledgeNewFeature"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"messageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addOneTimeMessagesDismissed"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"memberId"},"value":{"kind":"StringValue","value":"me","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"messageId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"messageId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}}]}}]}}]} as unknown as DocumentNode;
export type AcknowledgeNewFeatureMutationFn = Apollo.MutationFunction<AcknowledgeNewFeatureMutation, AcknowledgeNewFeatureMutationVariables>;

/**
 * __useAcknowledgeNewFeatureMutation__
 *
 * To run a mutation, you first call `useAcknowledgeNewFeatureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcknowledgeNewFeatureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acknowledgeNewFeatureMutation, { data, loading, error }] = useAcknowledgeNewFeatureMutation({
 *   variables: {
 *      messageId: // value for 'messageId'
 *   },
 * });
 */
export function useAcknowledgeNewFeatureMutation(baseOptions?: Apollo.MutationHookOptions<AcknowledgeNewFeatureMutation, AcknowledgeNewFeatureMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AcknowledgeNewFeatureMutation, AcknowledgeNewFeatureMutationVariables>(AcknowledgeNewFeatureDocument, options);
      }
export type AcknowledgeNewFeatureMutationHookResult = ReturnType<typeof useAcknowledgeNewFeatureMutation>;
export type AcknowledgeNewFeatureMutationResult = Apollo.MutationResult<AcknowledgeNewFeatureMutation>;
export type AcknowledgeNewFeatureMutationOptions = Apollo.BaseMutationOptions<AcknowledgeNewFeatureMutation, AcknowledgeNewFeatureMutationVariables>;