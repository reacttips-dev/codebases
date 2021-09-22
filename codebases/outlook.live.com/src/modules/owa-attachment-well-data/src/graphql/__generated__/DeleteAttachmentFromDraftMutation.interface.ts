//@ts-nocheck TS6133
/* eslint-disable @typescript-eslint/no-duplicate-imports */
import * as Types from 'owa-graph-schema';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type DeleteAttachmentFromDraftMutationVariables = Types.Exact<{
  attachmentId: Types.AttachmentIdInput;
}>;


export type DeleteAttachmentFromDraftMutation = (
  { __typename?: 'Mutation' }
  & { deleteAttachmentFromDraft?: Types.Maybe<(
    { __typename?: 'DeleteAttachmentFromDraftResult' }
    & Pick<Types.DeleteAttachmentFromDraftResult, 'RootItemId'>
  )> }
);


export const DeleteAttachmentFromDraftDocument: DocumentNode<DeleteAttachmentFromDraftMutation, DeleteAttachmentFromDraftMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteAttachmentFromDraft"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"attachmentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AttachmentIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteAttachmentFromDraft"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"AttachmentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"attachmentId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"RootItemId"}}]}}]}}]};