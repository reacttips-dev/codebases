import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"AccountSwitcherDismissNew"}}
export type AccountSwitcherDismissNewMutationVariables = Types.Exact<{
  memberId: Types.Scalars['ID'];
  messageId: Types.Scalars['ID'];
}>;


export type AccountSwitcherDismissNewMutation = (
  { __typename: 'Mutation' }
  & { addOneTimeMessagesDismissed?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'oneTimeMessagesDismissed'>
  )> }
);


export const AccountSwitcherDismissNewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AccountSwitcherDismissNew"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"messageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addOneTimeMessagesDismissed"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"memberId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}},{"kind":"Argument","name":{"kind":"Name","value":"messageId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"messageId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}}]}}]}}]} as unknown as DocumentNode;
export type AccountSwitcherDismissNewMutationFn = Apollo.MutationFunction<AccountSwitcherDismissNewMutation, AccountSwitcherDismissNewMutationVariables>;

/**
 * __useAccountSwitcherDismissNewMutation__
 *
 * To run a mutation, you first call `useAccountSwitcherDismissNewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAccountSwitcherDismissNewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [accountSwitcherDismissNewMutation, { data, loading, error }] = useAccountSwitcherDismissNewMutation({
 *   variables: {
 *      memberId: // value for 'memberId'
 *      messageId: // value for 'messageId'
 *   },
 * });
 */
export function useAccountSwitcherDismissNewMutation(baseOptions?: Apollo.MutationHookOptions<AccountSwitcherDismissNewMutation, AccountSwitcherDismissNewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AccountSwitcherDismissNewMutation, AccountSwitcherDismissNewMutationVariables>(AccountSwitcherDismissNewDocument, options);
      }
export type AccountSwitcherDismissNewMutationHookResult = ReturnType<typeof useAccountSwitcherDismissNewMutation>;
export type AccountSwitcherDismissNewMutationResult = Apollo.MutationResult<AccountSwitcherDismissNewMutation>;
export type AccountSwitcherDismissNewMutationOptions = Apollo.BaseMutationOptions<AccountSwitcherDismissNewMutation, AccountSwitcherDismissNewMutationVariables>;