import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"SendRequestAccess"}}
export type SendRequestAccessMutationVariables = Types.Exact<{
  modelType: Types.RequestAccessModelType;
  modelId: Types.Scalars['ID'];
}>;


export type SendRequestAccessMutation = (
  { __typename: 'Mutation' }
  & { sendBoardAccessRequest?: Types.Maybe<(
    { __typename: 'BoardAccessRequest_Response' }
    & Pick<Types.BoardAccessRequest_Response, 'success'>
  )> }
);


export const SendRequestAccessDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendRequestAccess"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"modelType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RequestAccessModelType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"modelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendBoardAccessRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"modelType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"modelType"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"modelId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode;
export type SendRequestAccessMutationFn = Apollo.MutationFunction<SendRequestAccessMutation, SendRequestAccessMutationVariables>;

/**
 * __useSendRequestAccessMutation__
 *
 * To run a mutation, you first call `useSendRequestAccessMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendRequestAccessMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendRequestAccessMutation, { data, loading, error }] = useSendRequestAccessMutation({
 *   variables: {
 *      modelType: // value for 'modelType'
 *      modelId: // value for 'modelId'
 *   },
 * });
 */
export function useSendRequestAccessMutation(baseOptions?: Apollo.MutationHookOptions<SendRequestAccessMutation, SendRequestAccessMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendRequestAccessMutation, SendRequestAccessMutationVariables>(SendRequestAccessDocument, options);
      }
export type SendRequestAccessMutationHookResult = ReturnType<typeof useSendRequestAccessMutation>;
export type SendRequestAccessMutationResult = Apollo.MutationResult<SendRequestAccessMutation>;
export type SendRequestAccessMutationOptions = Apollo.BaseMutationOptions<SendRequestAccessMutation, SendRequestAccessMutationVariables>;