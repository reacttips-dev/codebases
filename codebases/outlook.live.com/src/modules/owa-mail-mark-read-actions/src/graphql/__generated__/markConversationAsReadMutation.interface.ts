//@ts-nocheck TS6133
/* eslint-disable @typescript-eslint/no-duplicate-imports */
import * as Types from 'owa-graph-schema';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type MarkConversationAsReadMutationVariables = Types.Exact<{
  conversations: Array<Types.ConversationSnapshot> | Types.ConversationSnapshot;
  isRead: Types.Scalars['Boolean'];
  isUserInitiated: Types.Scalars['Boolean'];
  folderId?: Types.Maybe<Types.Scalars['String']>;
  mailboxInfo: Types.MailboxInfoInput;
}>;


export type MarkConversationAsReadMutation = (
  { __typename?: 'Mutation' }
  & { markConversationAsRead?: Types.Maybe<(
    { __typename?: 'MarkConversationAsReadResult' }
    & Pick<Types.MarkConversationAsReadResult, 'success'>
  )> }
);


export const MarkConversationAsReadDocument: DocumentNode<MarkConversationAsReadMutation, MarkConversationAsReadMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MarkConversationAsRead"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"conversations"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ConversationSnapshot"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isRead"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isUserInitiated"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"folderId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mailboxInfo"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MailboxInfoInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"markConversationAsRead"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"isRead"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isRead"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"isUserInitiated"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isUserInitiated"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"actionOptions"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"conversations"},"value":{"kind":"Variable","name":{"kind":"Name","value":"conversations"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"folderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"folderId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"mailboxInfo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mailboxInfo"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]};