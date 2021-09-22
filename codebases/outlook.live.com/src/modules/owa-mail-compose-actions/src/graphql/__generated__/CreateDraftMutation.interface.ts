//@ts-nocheck TS6133
/* eslint-disable @typescript-eslint/no-duplicate-imports */
import * as Types from 'owa-graph-schema';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type CreateDraftMutationVariables = Types.Exact<{
  draft: Types.DraftInput;
  isSend?: Types.Maybe<Types.Scalars['Boolean']>;
  suppressServerMarkReadOnReplyOrForward?: Types.Maybe<Types.Scalars['Boolean']>;
  requestIMIOnly?: Types.Maybe<Types.Scalars['Boolean']>;
}>;


export type CreateDraftMutation = (
  { __typename?: 'Mutation' }
  & { createDraft: (
    { __typename?: 'CreateDraftResult' }
    & { draft?: Types.Maybe<(
      { __typename?: 'Draft' }
      & Pick<Types.Draft, 'ItemId' | 'Subject' | 'LastModifiedTime' | 'InternetMessageId'>
      & { Attachments?: Types.Maybe<Array<(
        { __typename?: 'BasicAttachment' }
        & Pick<Types.BasicAttachment, 'OwsTypeName' | 'AttachmentOriginalUrl' | 'ContentId' | 'ContentLocation' | 'ContentType' | 'id' | 'IsInline' | 'IsInlineToNormalBody' | 'IsInlineToUniqueBody' | 'LastModifiedTime' | 'Name' | 'Size' | 'Thumbnail' | 'ThumbnailMimeType'>
        & { AttachmentId?: Types.Maybe<(
          { __typename?: 'AttachmentId' }
          & Pick<Types.AttachmentId, 'Id'>
        )> }
      ) | (
        { __typename?: 'ReferenceAttachment' }
        & Pick<Types.ReferenceAttachment, 'ProviderType' | 'WebUrl' | 'AttachLongPathName' | 'OwsTypeName' | 'AttachmentOriginalUrl' | 'ContentId' | 'ContentLocation' | 'ContentType' | 'id' | 'IsInline' | 'IsInlineToNormalBody' | 'IsInlineToUniqueBody' | 'LastModifiedTime' | 'Name' | 'Size' | 'Thumbnail' | 'ThumbnailMimeType'>
        & { AttachmentId?: Types.Maybe<(
          { __typename?: 'AttachmentId' }
          & Pick<Types.AttachmentId, 'Id'>
        )> }
      )>>, Body?: Types.Maybe<(
        { __typename?: 'Body' }
        & Pick<Types.Body, 'Value'>
      )> }
    )> }
  ) }
);


export const CreateDraftDocument: DocumentNode<CreateDraftMutation, CreateDraftMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDraft"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"draft"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DraftInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isSend"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"suppressServerMarkReadOnReplyOrForward"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"requestIMIOnly"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDraft"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"draft"},"value":{"kind":"Variable","name":{"kind":"Name","value":"draft"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"isSend"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isSend"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"suppressServerMarkReadOnReplyOrForward"},"value":{"kind":"Variable","name":{"kind":"Name","value":"suppressServerMarkReadOnReplyOrForward"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"requestIMIOnly"},"value":{"kind":"Variable","name":{"kind":"Name","value":"requestIMIOnly"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"draft"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ItemId"}},{"kind":"Field","name":{"kind":"Name","value":"Subject"}},{"kind":"Field","name":{"kind":"Name","value":"LastModifiedTime"}},{"kind":"Field","name":{"kind":"Name","value":"Attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"OwsTypeName"}},{"kind":"Field","name":{"kind":"Name","value":"AttachmentId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"AttachmentOriginalUrl"}},{"kind":"Field","name":{"kind":"Name","value":"ContentId"}},{"kind":"Field","name":{"kind":"Name","value":"ContentLocation"}},{"kind":"Field","name":{"kind":"Name","value":"ContentType"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"IsInline"}},{"kind":"Field","name":{"kind":"Name","value":"IsInlineToNormalBody"}},{"kind":"Field","name":{"kind":"Name","value":"IsInlineToUniqueBody"}},{"kind":"Field","name":{"kind":"Name","value":"LastModifiedTime"}},{"kind":"Field","name":{"kind":"Name","value":"Name"}},{"kind":"Field","name":{"kind":"Name","value":"Size"}},{"kind":"Field","name":{"kind":"Name","value":"Thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"ThumbnailMimeType"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ReferenceAttachment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ProviderType"}},{"kind":"Field","name":{"kind":"Name","value":"WebUrl"}},{"kind":"Field","name":{"kind":"Name","value":"AttachLongPathName"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"Body"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"InternetMessageId"}}]}}]}}]}}]};