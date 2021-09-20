import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"AddFreeTrial"}}
export type AddFreeTrialMutationVariables = Types.Exact<{
  orgId: Types.Scalars['ID'];
}>;


export type AddFreeTrialMutation = (
  { __typename: 'Mutation' }
  & { addFreeTrial?: Types.Maybe<(
    { __typename: 'Organization' }
    & { paidAccount?: Types.Maybe<(
      { __typename: 'PaidAccount' }
      & Pick<Types.PaidAccount, 'products' | 'standing' | 'dateFirstSubscription'>
    )> }
  )> }
);


export const AddFreeTrialDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddFreeTrial"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addFreeTrial"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orgId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}},{"kind":"Argument","name":{"kind":"Name","value":"via"},"value":{"kind":"StringValue","value":"teamify-wizard","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paidAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"products"}},{"kind":"Field","name":{"kind":"Name","value":"standing"}},{"kind":"Field","name":{"kind":"Name","value":"dateFirstSubscription"}}]}}]}}]}}]} as unknown as DocumentNode;
export type AddFreeTrialMutationFn = Apollo.MutationFunction<AddFreeTrialMutation, AddFreeTrialMutationVariables>;

/**
 * __useAddFreeTrialMutation__
 *
 * To run a mutation, you first call `useAddFreeTrialMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddFreeTrialMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addFreeTrialMutation, { data, loading, error }] = useAddFreeTrialMutation({
 *   variables: {
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useAddFreeTrialMutation(baseOptions?: Apollo.MutationHookOptions<AddFreeTrialMutation, AddFreeTrialMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddFreeTrialMutation, AddFreeTrialMutationVariables>(AddFreeTrialDocument, options);
      }
export type AddFreeTrialMutationHookResult = ReturnType<typeof useAddFreeTrialMutation>;
export type AddFreeTrialMutationResult = Apollo.MutationResult<AddFreeTrialMutation>;
export type AddFreeTrialMutationOptions = Apollo.BaseMutationOptions<AddFreeTrialMutation, AddFreeTrialMutationVariables>;