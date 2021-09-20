import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"DeleteCardTemplate"}}
export type DeleteCardTemplateMutationVariables = Types.Exact<{
  idCard: Types.Scalars['ID'];
}>;


export type DeleteCardTemplateMutation = (
  { __typename: 'Mutation' }
  & { deleteCard?: Types.Maybe<(
    { __typename: 'Card_DeleteResponse' }
    & Pick<Types.Card_DeleteResponse, 'success'>
  )> }
);


export const DeleteCardTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCardTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"idCard"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode;
export type DeleteCardTemplateMutationFn = Apollo.MutationFunction<DeleteCardTemplateMutation, DeleteCardTemplateMutationVariables>;

/**
 * __useDeleteCardTemplateMutation__
 *
 * To run a mutation, you first call `useDeleteCardTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCardTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCardTemplateMutation, { data, loading, error }] = useDeleteCardTemplateMutation({
 *   variables: {
 *      idCard: // value for 'idCard'
 *   },
 * });
 */
export function useDeleteCardTemplateMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCardTemplateMutation, DeleteCardTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCardTemplateMutation, DeleteCardTemplateMutationVariables>(DeleteCardTemplateDocument, options);
      }
export type DeleteCardTemplateMutationHookResult = ReturnType<typeof useDeleteCardTemplateMutation>;
export type DeleteCardTemplateMutationResult = Apollo.MutationResult<DeleteCardTemplateMutation>;
export type DeleteCardTemplateMutationOptions = Apollo.BaseMutationOptions<DeleteCardTemplateMutation, DeleteCardTemplateMutationVariables>;