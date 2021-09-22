//@ts-nocheck TS6133
/* eslint-disable @typescript-eslint/no-duplicate-imports */
import * as Types from 'owa-graph-schema';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type AllAttendeeFieldsFragment = (
  { __typename?: 'Attendee' }
  & Pick<Types.Attendee, 'Mailbox' | 'ResponseType' | 'LastResponseTime' | 'ResponseComment' | 'ProposedStart' | 'ProposedEnd' | 'IsCoauthor'>
);

export const AllAttendeeFieldsFragmentDoc: DocumentNode<AllAttendeeFieldsFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AllAttendeeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Attendee"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Mailbox"}},{"kind":"Field","name":{"kind":"Name","value":"ResponseType"}},{"kind":"Field","name":{"kind":"Name","value":"LastResponseTime"}},{"kind":"Field","name":{"kind":"Name","value":"ResponseComment"}},{"kind":"Field","name":{"kind":"Name","value":"ProposedStart"}},{"kind":"Field","name":{"kind":"Name","value":"ProposedEnd"}},{"kind":"Field","name":{"kind":"Name","value":"IsCoauthor"}}]}}]};