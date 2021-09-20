import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"CardTemplates"}}
export type CardTemplatesQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID'];
}>;


export type CardTemplatesQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id'>
    & { members: Array<(
      { __typename: 'Member' }
      & Pick<Types.Member, 'id' | 'avatarUrl' | 'initials'>
    )>, cards: Array<(
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
        & Pick<Types.Card_Cover, 'edgeColor' | 'color' | 'size' | 'brightness'>
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
  )> }
);


export const CardTemplatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CardTemplates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"initials"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"template"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"shortLink"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"idList"}},{"kind":"Field","name":{"kind":"Name","value":"idChecklists"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stickers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"top"}},{"kind":"Field","name":{"kind":"Name","value":"left"}},{"kind":"Field","name":{"kind":"Name","value":"rotate"}},{"kind":"Field","name":{"kind":"Name","value":"zIndex"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"imageScaled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"scaled"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"idLabels"}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}}]}},{"kind":"Field","name":{"kind":"Name","value":"idMembers"}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scaled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"scaled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edgeColor"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"brightness"}}]}},{"kind":"Field","name":{"kind":"Name","value":"badges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attachments"}},{"kind":"Field","name":{"kind":"Name","value":"checkItems"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"attachmentsByType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trello"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"}},{"kind":"Field","name":{"kind":"Name","value":"card"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useCardTemplatesQuery__
 *
 * To run a query within a React component, call `useCardTemplatesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCardTemplatesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCardTemplatesQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *   },
 * });
 */
export function useCardTemplatesQuery(baseOptions: Apollo.QueryHookOptions<CardTemplatesQuery, CardTemplatesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CardTemplatesQuery, CardTemplatesQueryVariables>(CardTemplatesDocument, options);
      }
export function useCardTemplatesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CardTemplatesQuery, CardTemplatesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CardTemplatesQuery, CardTemplatesQueryVariables>(CardTemplatesDocument, options);
        }
export type CardTemplatesQueryHookResult = ReturnType<typeof useCardTemplatesQuery>;
export type CardTemplatesLazyQueryHookResult = ReturnType<typeof useCardTemplatesLazyQuery>;
export type CardTemplatesQueryResult = Apollo.QueryResult<CardTemplatesQuery, CardTemplatesQueryVariables>;