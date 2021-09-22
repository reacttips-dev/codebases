//@ts-nocheck TS6133
/* eslint-disable @typescript-eslint/no-duplicate-imports */
import * as Types from 'owa-graph-schema';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type MailFolderPermissionsFragmentFragment = (
  { __typename?: 'MailFolder' }
  & { PermissionSet?: Types.Maybe<(
    { __typename?: 'Permissions' }
    & { Permissions?: Types.Maybe<Array<Types.Maybe<(
      { __typename?: 'Permission' }
      & Pick<Types.Permission, 'PermissionLevel' | 'ReadItems' | 'CanCreateItems' | 'CanCreateSubFolders' | 'IsFolderOwner' | 'IsFolderVisible' | 'IsFolderContact' | 'EditItems' | 'DeleteItems'>
      & { UserId?: Types.Maybe<(
        { __typename?: 'UserId' }
        & Pick<Types.UserId, 'PrimarySmtpAddress' | 'DisplayName' | 'DistinguishedUser'>
      )> }
    )>>> }
  )> }
);

export const MailFolderPermissionsFragmentFragmentDoc: DocumentNode<MailFolderPermissionsFragmentFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MailFolderPermissionsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MailFolderPermissions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"PermissionSet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Permissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"PermissionLevel"}},{"kind":"Field","name":{"kind":"Name","value":"ReadItems"}},{"kind":"Field","name":{"kind":"Name","value":"UserId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"PrimarySmtpAddress"}},{"kind":"Field","name":{"kind":"Name","value":"DisplayName"}},{"kind":"Field","name":{"kind":"Name","value":"DistinguishedUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"CanCreateItems"}},{"kind":"Field","name":{"kind":"Name","value":"CanCreateSubFolders"}},{"kind":"Field","name":{"kind":"Name","value":"IsFolderOwner"}},{"kind":"Field","name":{"kind":"Name","value":"IsFolderVisible"}},{"kind":"Field","name":{"kind":"Name","value":"IsFolderContact"}},{"kind":"Field","name":{"kind":"Name","value":"EditItems"}},{"kind":"Field","name":{"kind":"Name","value":"DeleteItems"}}]}}]}}]}}]};