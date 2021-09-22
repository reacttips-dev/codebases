//@ts-nocheck TS6133
/* eslint-disable @typescript-eslint/no-duplicate-imports */
import * as Types from 'owa-graph-schema';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type SendDraftMutationVariables = Types.Exact<{
  draft: Types.DraftInput;
  itemId: Types.Scalars['ItemId'];
  requestIMIOnly?: Types.Maybe<Types.Scalars['Boolean']>;
}>;


export type SendDraftMutation = (
  { __typename?: 'Mutation' }
  & { sendDraft: (
    { __typename?: 'SendOrSaveDraftResult' }
    & { draft?: Types.Maybe<(
      { __typename?: 'Draft' }
      & Pick<Types.Draft, 'ItemId' | 'LastModifiedTime' | 'InternetMessageId'>
      & { Body?: Types.Maybe<(
        { __typename?: 'Body' }
        & Pick<Types.Body, 'Value'>
      )> }
    )> }
  ) }
);


export const SendDraftDocument: DocumentNode<SendDraftMutation, SendDraftMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendDraft"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"draft"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DraftInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"itemId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ItemId"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"requestIMIOnly"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendDraft"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"draft"},"value":{"kind":"Variable","name":{"kind":"Name","value":"draft"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"itemId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"itemId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"requestIMIOnly"},"value":{"kind":"Variable","name":{"kind":"Name","value":"requestIMIOnly"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"draft"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ItemId"}},{"kind":"Field","name":{"kind":"Name","value":"LastModifiedTime"}},{"kind":"Field","name":{"kind":"Name","value":"Body"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"InternetMessageId"}}]}}]}}]}}]};