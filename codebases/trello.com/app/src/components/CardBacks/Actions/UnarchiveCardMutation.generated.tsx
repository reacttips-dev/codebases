import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"UnarchiveCard"}}
export type UnarchiveCardMutationVariables = Types.Exact<{
  idCard: Types.Scalars['ID'];
}>;


export type UnarchiveCardMutation = (
  { __typename: 'Mutation' }
  & { unarchiveCard?: Types.Maybe<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'id' | 'closed'>
  )> }
);


export const UnarchiveCardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnarchiveCard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unarchiveCard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"idCard"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}}]}}]}}]} as unknown as DocumentNode;
export type UnarchiveCardMutationFn = Apollo.MutationFunction<UnarchiveCardMutation, UnarchiveCardMutationVariables>;

/**
 * __useUnarchiveCardMutation__
 *
 * To run a mutation, you first call `useUnarchiveCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnarchiveCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unarchiveCardMutation, { data, loading, error }] = useUnarchiveCardMutation({
 *   variables: {
 *      idCard: // value for 'idCard'
 *   },
 * });
 */
export function useUnarchiveCardMutation(baseOptions?: Apollo.MutationHookOptions<UnarchiveCardMutation, UnarchiveCardMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnarchiveCardMutation, UnarchiveCardMutationVariables>(UnarchiveCardDocument, options);
      }
export type UnarchiveCardMutationHookResult = ReturnType<typeof useUnarchiveCardMutation>;
export type UnarchiveCardMutationResult = Apollo.MutationResult<UnarchiveCardMutation>;
export type UnarchiveCardMutationOptions = Apollo.BaseMutationOptions<UnarchiveCardMutation, UnarchiveCardMutationVariables>;