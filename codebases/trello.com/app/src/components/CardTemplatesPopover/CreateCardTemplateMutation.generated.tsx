import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"CreateCardTemplate"}}
export type CreateCardTemplateMutationVariables = Types.Exact<{
  listId: Types.Scalars['ID'];
  name: Types.Scalars['String'];
  closed?: Types.Maybe<Types.Scalars['Boolean']>;
  traceId: Types.Scalars['String'];
}>;


export type CreateCardTemplateMutation = (
  { __typename: 'Mutation' }
  & { createCardTemplate?: Types.Maybe<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'id' | 'idBoard' | 'shortLink' | 'name' | 'isTemplate' | 'closed' | 'idList' | 'idChecklists' | 'idLabels' | 'idMembers'>
    & { attachments: Array<(
      { __typename: 'Attachment' }
      & Pick<Types.Attachment, 'id'>
    )>, stickers: Array<(
      { __typename: 'Sticker' }
      & Pick<Types.Sticker, 'id' | 'top' | 'left' | 'rotate' | 'zIndex' | 'image' | 'imageUrl'>
      & { imageScaled: Array<(
        { __typename: 'Sticker_ImageScaled' }
        & Pick<Types.Sticker_ImageScaled, 'id' | 'width' | 'height' | 'url' | 'scaled'>
      )> }
    )>, labels: Array<(
      { __typename: 'Label' }
      & Pick<Types.Label, 'id' | 'name' | 'color' | 'idBoard'>
    )>, cover?: Types.Maybe<(
      { __typename: 'Card_Cover' }
      & Pick<Types.Card_Cover, 'edgeColor'>
      & { scaled?: Types.Maybe<Array<(
        { __typename: 'Card_Cover_Scaled' }
        & Pick<Types.Card_Cover_Scaled, 'url' | 'width' | 'height' | 'scaled'>
      )>> }
    )>, badges: (
      { __typename: 'Card_Badges' }
      & Pick<Types.Card_Badges, 'attachments' | 'checkItems' | 'description'>
      & { attachmentsByType: (
        { __typename: 'Card_Badges_AttachmentsByType' }
        & { trello: (
          { __typename: 'Card_Badges_AttachmentsByType_Trello' }
          & Pick<Types.Card_Badges_AttachmentsByType_Trello, 'board' | 'card'>
        ) }
      ) }
    ) }
  )> }
);


export const CreateCardTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCardTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"listId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"closed"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCardTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"listId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"listId"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"closed"},"value":{"kind":"Variable","name":{"kind":"Name","value":"closed"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"shortLink"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"idList"}},{"kind":"Field","name":{"kind":"Name","value":"idChecklists"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stickers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"top"}},{"kind":"Field","name":{"kind":"Name","value":"left"}},{"kind":"Field","name":{"kind":"Name","value":"rotate"}},{"kind":"Field","name":{"kind":"Name","value":"zIndex"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"imageScaled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"scaled"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"idLabels"}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}}]}},{"kind":"Field","name":{"kind":"Name","value":"idMembers"}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scaled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"scaled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edgeColor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"badges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attachments"}},{"kind":"Field","name":{"kind":"Name","value":"checkItems"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"attachmentsByType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trello"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"}},{"kind":"Field","name":{"kind":"Name","value":"card"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode;
export type CreateCardTemplateMutationFn = Apollo.MutationFunction<CreateCardTemplateMutation, CreateCardTemplateMutationVariables>;

/**
 * __useCreateCardTemplateMutation__
 *
 * To run a mutation, you first call `useCreateCardTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCardTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCardTemplateMutation, { data, loading, error }] = useCreateCardTemplateMutation({
 *   variables: {
 *      listId: // value for 'listId'
 *      name: // value for 'name'
 *      closed: // value for 'closed'
 *      traceId: // value for 'traceId'
 *   },
 * });
 */
export function useCreateCardTemplateMutation(baseOptions?: Apollo.MutationHookOptions<CreateCardTemplateMutation, CreateCardTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCardTemplateMutation, CreateCardTemplateMutationVariables>(CreateCardTemplateDocument, options);
      }
export type CreateCardTemplateMutationHookResult = ReturnType<typeof useCreateCardTemplateMutation>;
export type CreateCardTemplateMutationResult = Apollo.MutationResult<CreateCardTemplateMutation>;
export type CreateCardTemplateMutationOptions = Apollo.BaseMutationOptions<CreateCardTemplateMutation, CreateCardTemplateMutationVariables>;