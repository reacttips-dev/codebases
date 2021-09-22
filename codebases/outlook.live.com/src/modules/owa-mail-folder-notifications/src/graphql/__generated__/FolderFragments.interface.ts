//@ts-nocheck TS6133
/* eslint-disable @typescript-eslint/no-duplicate-imports */
import * as Types from 'owa-graph-schema';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type FolderUpdateNotificationFragment = (
  { __typename?: 'MailFolder' }
  & Pick<Types.MailFolder, 'UnreadCount' | 'TotalCount' | 'DisplayName'>
  & { ParentFolderId: (
    { __typename?: 'FolderId' }
    & Pick<Types.FolderId, 'Id'>
  ) }
);

export type NewFolderFragment = (
  { __typename?: 'MailFolder' }
  & Pick<Types.MailFolder, 'id' | 'type' | 'DisplayName' | 'DistinguishedFolderId' | 'FolderClass' | 'UnreadCount' | 'TotalCount' | 'hasChildren' | 'childFolderIds' | 'mailboxInfo' | 'remoteFolderDisplayName'>
  & { FolderId: (
    { __typename?: 'FolderId' }
    & Pick<Types.FolderId, 'Id' | 'ChangeKey'>
  ), ParentFolderId: (
    { __typename?: 'FolderId' }
    & Pick<Types.FolderId, 'Id' | 'ChangeKey'>
  ) }
);

export const FolderUpdateNotificationFragmentDoc: DocumentNode<FolderUpdateNotificationFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FolderUpdateNotification"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MailFolder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"UnreadCount"}},{"kind":"Field","name":{"kind":"Name","value":"TotalCount"}},{"kind":"Field","name":{"kind":"Name","value":"DisplayName"}},{"kind":"Field","name":{"kind":"Name","value":"ParentFolderId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Id"}}]}}]}}]};
export const NewFolderFragmentDoc: DocumentNode<NewFolderFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NewFolder"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MailFolder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"FolderId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Id"}},{"kind":"Field","name":{"kind":"Name","value":"ChangeKey"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ParentFolderId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Id"}},{"kind":"Field","name":{"kind":"Name","value":"ChangeKey"}}]}},{"kind":"Field","name":{"kind":"Name","value":"DisplayName"}},{"kind":"Field","name":{"kind":"Name","value":"DistinguishedFolderId"}},{"kind":"Field","name":{"kind":"Name","value":"FolderClass"}},{"kind":"Field","name":{"kind":"Name","value":"UnreadCount"}},{"kind":"Field","name":{"kind":"Name","value":"TotalCount"}},{"kind":"Field","name":{"kind":"Name","value":"hasChildren"}},{"kind":"Field","name":{"kind":"Name","value":"childFolderIds"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}]},{"kind":"Field","name":{"kind":"Name","value":"mailboxInfo"}},{"kind":"Field","name":{"kind":"Name","value":"remoteFolderDisplayName"}}]}}]};