import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"UpdateCardCoversPreference"}}
export type UpdateCardCoversPreferenceMutationVariables = Types.Exact<{
  boardId: Types.Scalars['ID'];
  cardCovers: Types.Scalars['Boolean'];
}>;


export type UpdateCardCoversPreferenceMutation = (
  { __typename: 'Mutation' }
  & { updateBoardCardCoversPref?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id'>
    & { prefs?: Types.Maybe<(
      { __typename: 'Board_Prefs' }
      & Pick<Types.Board_Prefs, 'cardCovers'>
    )> }
  )> }
);


export const UpdateCardCoversPreferenceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCardCoversPreference"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cardCovers"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBoardCardCoversPref"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"boardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}},{"kind":"Argument","name":{"kind":"Name","value":"cardCovers"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cardCovers"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cardCovers"}}]}}]}}]}}]} as unknown as DocumentNode;
export type UpdateCardCoversPreferenceMutationFn = Apollo.MutationFunction<UpdateCardCoversPreferenceMutation, UpdateCardCoversPreferenceMutationVariables>;

/**
 * __useUpdateCardCoversPreferenceMutation__
 *
 * To run a mutation, you first call `useUpdateCardCoversPreferenceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCardCoversPreferenceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCardCoversPreferenceMutation, { data, loading, error }] = useUpdateCardCoversPreferenceMutation({
 *   variables: {
 *      boardId: // value for 'boardId'
 *      cardCovers: // value for 'cardCovers'
 *   },
 * });
 */
export function useUpdateCardCoversPreferenceMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCardCoversPreferenceMutation, UpdateCardCoversPreferenceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCardCoversPreferenceMutation, UpdateCardCoversPreferenceMutationVariables>(UpdateCardCoversPreferenceDocument, options);
      }
export type UpdateCardCoversPreferenceMutationHookResult = ReturnType<typeof useUpdateCardCoversPreferenceMutation>;
export type UpdateCardCoversPreferenceMutationResult = Apollo.MutationResult<UpdateCardCoversPreferenceMutation>;
export type UpdateCardCoversPreferenceMutationOptions = Apollo.BaseMutationOptions<UpdateCardCoversPreferenceMutation, UpdateCardCoversPreferenceMutationVariables>;