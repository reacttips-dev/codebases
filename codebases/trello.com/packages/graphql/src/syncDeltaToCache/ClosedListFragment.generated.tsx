import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
export type ClosedListFragment = (
  { __typename: 'List' }
  & Pick<Types.List, 'closed'>
);

export const ClosedListFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ClosedList"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"List"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"closed"}}]}}]} as unknown as DocumentNode;