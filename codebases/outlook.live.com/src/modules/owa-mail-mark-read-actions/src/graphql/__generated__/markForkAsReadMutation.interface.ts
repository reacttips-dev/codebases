//@ts-nocheck TS6133
/* eslint-disable @typescript-eslint/no-duplicate-imports */
import * as Types from 'owa-graph-schema';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type MarkForkAsReadMutationVariables = Types.Exact<{
  forks: Array<Types.ConversationForkInput> | Types.ConversationForkInput;
  isRead: Types.Scalars['Boolean'];
  isUserInitiated: Types.Scalars['Boolean'];
}>;


export type MarkForkAsReadMutation = (
  { __typename?: 'Mutation' }
  & { markForkAsRead?: Types.Maybe<(
    { __typename?: 'MarkForkAsReadResult' }
    & Pick<Types.MarkForkAsReadResult, 'success'>
  )> }
);


export const MarkForkAsReadDocument: DocumentNode<MarkForkAsReadMutation, MarkForkAsReadMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MarkForkAsRead"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"forks"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ConversationForkInput"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isRead"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isUserInitiated"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"markForkAsRead"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"forks"},"value":{"kind":"Variable","name":{"kind":"Name","value":"forks"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"isRead"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isRead"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"isUserInitiated"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isUserInitiated"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]};