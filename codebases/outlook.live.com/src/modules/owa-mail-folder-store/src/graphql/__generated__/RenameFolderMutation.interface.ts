//@ts-nocheck TS6133
/* eslint-disable @typescript-eslint/no-duplicate-imports */
import * as Types from 'owa-graph-schema';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type RenameFolderMutationVariables = Types.Exact<{
  id: Types.Scalars['String'];
  newDisplayName: Types.Scalars['String'];
  mailboxInfo: Types.MailboxInfoInput;
}>;


export type RenameFolderMutation = (
  { __typename?: 'Mutation' }
  & { renameFolder?: Types.Maybe<(
    { __typename?: 'MailFolder' }
    & Pick<Types.MailFolder, 'id' | 'DisplayName'>
  )> }
);


export const RenameFolderDocument: DocumentNode<RenameFolderMutation, RenameFolderMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RenameFolder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newDisplayName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mailboxInfo"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MailboxInfoInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"renameFolder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"newDisplayName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newDisplayName"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"mailboxInfo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mailboxInfo"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"DisplayName"}}]}}]}}]};