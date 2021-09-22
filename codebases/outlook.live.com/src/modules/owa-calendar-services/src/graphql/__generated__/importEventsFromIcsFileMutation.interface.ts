//@ts-nocheck TS6133
/* eslint-disable @typescript-eslint/no-duplicate-imports */
import * as Types from 'owa-graph-schema';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type ImportEventsFromIcsFileMutationVariables = Types.Exact<{
  fileContent?: Types.Maybe<Types.Scalars['String']>;
  attachmentId?: Types.Maybe<Types.Scalars['String']>;
  calendarId?: Types.Maybe<Types.CalendarIdInput>;
  folderId?: Types.Maybe<Types.Scalars['String']>;
  mailboxInfo?: Types.Maybe<Types.MailboxInfoInput>;
}>;


export type ImportEventsFromIcsFileMutation = (
  { __typename?: 'Mutation' }
  & { importEventsFromIcsFile?: Types.Maybe<(
    { __typename?: 'ImportEventsFromIcsFileResult' }
    & Pick<Types.ImportEventsFromIcsFileResult, 'numberOfEventsImported'>
  )> }
);


export const ImportEventsFromIcsFileDocument: DocumentNode<ImportEventsFromIcsFileMutation, ImportEventsFromIcsFileMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ImportEventsFromIcsFile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fileContent"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"attachmentId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"calendarId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarIdInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"folderId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mailboxInfo"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MailboxInfoInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"importEventsFromIcsFile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"fileContent"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fileContent"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"attachmentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"attachmentId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"calendarId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"calendarId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"folderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"folderId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"mailboxInfo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mailboxInfo"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"numberOfEventsImported"}}]}}]}}]};