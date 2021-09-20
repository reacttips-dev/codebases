import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"ChangeCardRole"}}
export type ChangeCardRoleMutationVariables = Types.Exact<{
  idCard: Types.Scalars['ID'];
  cardRole?: Types.Maybe<Types.CardRole>;
}>;


export type ChangeCardRoleMutation = (
  { __typename: 'Mutation' }
  & { updateCardRole: (
    { __typename: 'Card' }
    & Pick<Types.Card, 'id' | 'cardRole' | 'possibleCardRole'>
  ) }
);


export const ChangeCardRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ChangeCardRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cardRole"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CardRole"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCardRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"idCard"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}}},{"kind":"Argument","name":{"kind":"Name","value":"cardRole"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cardRole"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cardRole"}},{"kind":"Field","name":{"kind":"Name","value":"possibleCardRole"}}]}}]}}]} as unknown as DocumentNode;
export type ChangeCardRoleMutationFn = Apollo.MutationFunction<ChangeCardRoleMutation, ChangeCardRoleMutationVariables>;

/**
 * __useChangeCardRoleMutation__
 *
 * To run a mutation, you first call `useChangeCardRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeCardRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeCardRoleMutation, { data, loading, error }] = useChangeCardRoleMutation({
 *   variables: {
 *      idCard: // value for 'idCard'
 *      cardRole: // value for 'cardRole'
 *   },
 * });
 */
export function useChangeCardRoleMutation(baseOptions?: Apollo.MutationHookOptions<ChangeCardRoleMutation, ChangeCardRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangeCardRoleMutation, ChangeCardRoleMutationVariables>(ChangeCardRoleDocument, options);
      }
export type ChangeCardRoleMutationHookResult = ReturnType<typeof useChangeCardRoleMutation>;
export type ChangeCardRoleMutationResult = Apollo.MutationResult<ChangeCardRoleMutation>;
export type ChangeCardRoleMutationOptions = Apollo.BaseMutationOptions<ChangeCardRoleMutation, ChangeCardRoleMutationVariables>;