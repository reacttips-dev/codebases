import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"AddFreeTrialCredit"}}
export type AddFreeTrialCreditMutationVariables = Types.Exact<{
  orgId: Types.Scalars['ID'];
  count?: Types.Maybe<Types.Scalars['Int']>;
}>;


export type AddFreeTrialCreditMutation = (
  { __typename: 'Mutation' }
  & { addFreeTrial?: Types.Maybe<(
    { __typename: 'Organization' }
    & { paidAccount?: Types.Maybe<(
      { __typename: 'PaidAccount' }
      & Pick<Types.PaidAccount, 'products' | 'standing' | 'dateFirstSubscription'>
    )> }
  )> }
);


export const AddFreeTrialCreditDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddFreeTrialCredit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"count"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addFreeTrial"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orgId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}},{"kind":"Argument","name":{"kind":"Name","value":"count"},"value":{"kind":"Variable","name":{"kind":"Name","value":"count"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paidAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"products"}},{"kind":"Field","name":{"kind":"Name","value":"standing"}},{"kind":"Field","name":{"kind":"Name","value":"dateFirstSubscription"}}]}}]}}]}}]} as unknown as DocumentNode;
export type AddFreeTrialCreditMutationFn = Apollo.MutationFunction<AddFreeTrialCreditMutation, AddFreeTrialCreditMutationVariables>;

/**
 * __useAddFreeTrialCreditMutation__
 *
 * To run a mutation, you first call `useAddFreeTrialCreditMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddFreeTrialCreditMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addFreeTrialCreditMutation, { data, loading, error }] = useAddFreeTrialCreditMutation({
 *   variables: {
 *      orgId: // value for 'orgId'
 *      count: // value for 'count'
 *   },
 * });
 */
export function useAddFreeTrialCreditMutation(baseOptions?: Apollo.MutationHookOptions<AddFreeTrialCreditMutation, AddFreeTrialCreditMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddFreeTrialCreditMutation, AddFreeTrialCreditMutationVariables>(AddFreeTrialCreditDocument, options);
      }
export type AddFreeTrialCreditMutationHookResult = ReturnType<typeof useAddFreeTrialCreditMutation>;
export type AddFreeTrialCreditMutationResult = Apollo.MutationResult<AddFreeTrialCreditMutation>;
export type AddFreeTrialCreditMutationOptions = Apollo.BaseMutationOptions<AddFreeTrialCreditMutation, AddFreeTrialCreditMutationVariables>;