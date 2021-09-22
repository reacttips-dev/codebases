//@ts-nocheck TS6133
/* eslint-disable @typescript-eslint/no-duplicate-imports */
import * as Types from 'owa-graph-schema';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type FolderChildFolderIdsFragment = (
  { __typename?: 'MailFolder' }
  & Pick<Types.MailFolder, 'childFolderIds' | 'hasChildren' | 'mailboxInfo'>
  & { FolderId: (
    { __typename?: 'FolderId' }
    & Pick<Types.FolderId, 'Id' | 'ChangeKey'>
  ) }
);

export type UpdateFolderChildFolderIdsFragment = (
  { __typename?: 'MailFolder' }
  & Pick<Types.MailFolder, 'childFolderIds' | 'hasChildren'>
);

export type FolderParentFolderFragment = (
  { __typename?: 'MailFolder' }
  & Pick<Types.MailFolder, 'mailboxInfo'>
  & { ParentFolderId: (
    { __typename?: 'FolderId' }
    & Pick<Types.FolderId, 'Id'>
  ) }
);

export type FolderCountsFragment = (
  { __typename?: 'MailFolder' }
  & Pick<Types.MailFolder, 'UnreadCount' | 'TotalCount'>
);

export const FolderChildFolderIdsFragmentDoc: DocumentNode<FolderChildFolderIdsFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FolderChildFolderIds"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MailFolder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"childFolderIds"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}]},{"kind":"Field","name":{"kind":"Name","value":"hasChildren"}},{"kind":"Field","name":{"kind":"Name","value":"FolderId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Id"}},{"kind":"Field","name":{"kind":"Name","value":"ChangeKey"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mailboxInfo"}}]}}]};
export const UpdateFolderChildFolderIdsFragmentDoc: DocumentNode<UpdateFolderChildFolderIdsFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UpdateFolderChildFolderIds"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MailFolder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"childFolderIds"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}]},{"kind":"Field","name":{"kind":"Name","value":"hasChildren"}}]}}]};
export const FolderParentFolderFragmentDoc: DocumentNode<FolderParentFolderFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FolderParentFolder"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MailFolder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ParentFolderId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mailboxInfo"}}]}}]};
export const FolderCountsFragmentDoc: DocumentNode<FolderCountsFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FolderCounts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MailFolder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"UnreadCount"}},{"kind":"Field","name":{"kind":"Name","value":"TotalCount"}}]}}]};