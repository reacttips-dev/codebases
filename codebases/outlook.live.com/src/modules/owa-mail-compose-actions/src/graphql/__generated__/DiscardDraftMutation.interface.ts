//@ts-nocheck TS6133
/* eslint-disable @typescript-eslint/no-duplicate-imports */
import * as Types from 'owa-graph-schema';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type DiscardDraftMutationVariables = Types.Exact<{
  itemIds: Array<Types.Scalars['ItemId']> | Types.Scalars['ItemId'];
  disposalType: Types.DisposalType;
}>;


export type DiscardDraftMutation = (
  { __typename?: 'Mutation' }
  & { discardDraft?: Types.Maybe<(
    { __typename?: 'DeleteItemResult' }
    & Pick<Types.DeleteItemResult, 'success'>
  )> }
);


export const DiscardDraftDocument: DocumentNode<DiscardDraftMutation, DiscardDraftMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DiscardDraft"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"itemIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ItemId"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"disposalType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DisposalType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"discardDraft"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"itemIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"itemIds"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"disposalType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"disposalType"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]};