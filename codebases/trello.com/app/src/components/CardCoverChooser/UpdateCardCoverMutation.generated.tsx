import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"UpdateCardCover"}}
export type UpdateCardCoverMutationVariables = Types.Exact<{
  cardId: Types.Scalars['ID'];
  cover?: Types.Maybe<Types.InputCover>;
  traceId: Types.Scalars['String'];
}>;


export type UpdateCardCoverMutation = (
  { __typename: 'Mutation' }
  & { updateCardCover?: Types.Maybe<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'id' | 'idAttachmentCover'>
    & { cover?: Types.Maybe<(
      { __typename: 'Card_Cover' }
      & Pick<Types.Card_Cover, 'idAttachment' | 'idUploadedBackground' | 'color' | 'size' | 'brightness'>
      & { scaled?: Types.Maybe<Array<(
        { __typename: 'Card_Cover_Scaled' }
        & Pick<Types.Card_Cover_Scaled, 'url' | 'width' | 'height' | 'scaled'>
      )>> }
    )> }
  )> }
);


export const UpdateCardCoverDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCardCover"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cover"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"InputCover"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCardCover"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}}},{"kind":"Argument","name":{"kind":"Name","value":"cover"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cover"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idAttachmentCover"}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idAttachment"}},{"kind":"Field","name":{"kind":"Name","value":"idUploadedBackground"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"brightness"}},{"kind":"Field","name":{"kind":"Name","value":"scaled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"scaled"}}]}}]}}]}}]}}]} as unknown as DocumentNode;
export type UpdateCardCoverMutationFn = Apollo.MutationFunction<UpdateCardCoverMutation, UpdateCardCoverMutationVariables>;

/**
 * __useUpdateCardCoverMutation__
 *
 * To run a mutation, you first call `useUpdateCardCoverMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCardCoverMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCardCoverMutation, { data, loading, error }] = useUpdateCardCoverMutation({
 *   variables: {
 *      cardId: // value for 'cardId'
 *      cover: // value for 'cover'
 *      traceId: // value for 'traceId'
 *   },
 * });
 */
export function useUpdateCardCoverMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCardCoverMutation, UpdateCardCoverMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCardCoverMutation, UpdateCardCoverMutationVariables>(UpdateCardCoverDocument, options);
      }
export type UpdateCardCoverMutationHookResult = ReturnType<typeof useUpdateCardCoverMutation>;
export type UpdateCardCoverMutationResult = Apollo.MutationResult<UpdateCardCoverMutation>;
export type UpdateCardCoverMutationOptions = Apollo.BaseMutationOptions<UpdateCardCoverMutation, UpdateCardCoverMutationVariables>;