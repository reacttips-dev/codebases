//@ts-nocheck TS6133
/* eslint-disable @typescript-eslint/no-duplicate-imports */
import * as Types from 'owa-graph-schema';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type DismissUndoMutationVariables = Types.Exact<{
  undoRequestId: Types.Scalars['Int'];
}>;


export type DismissUndoMutation = (
  { __typename?: 'Mutation' }
  & { dismissUndo?: Types.Maybe<(
    { __typename?: 'DismissUndoResult' }
    & Pick<Types.DismissUndoResult, 'success'>
  )> }
);


export const DismissUndoDocument: DocumentNode<DismissUndoMutation, DismissUndoMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DismissUndo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"undoRequestId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dismissUndo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"undoRequestId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"undoRequestId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]};