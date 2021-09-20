import * as Types from '@trello/graphql/generated';

import { DocumentNode } from 'graphql';
export type CardsOnListFragment = (
  { __typename: 'List' }
  & { cards: Array<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'id' | 'closed' | 'idMembers'>
  )> }
);

export type OpenCardsOnListFragment = (
  { __typename: 'List' }
  & { cards: Array<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'id' | 'closed' | 'idMembers'>
  )> }
);

export type ClosedCardsOnListFragment = (
  { __typename: 'List' }
  & { cards: Array<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'id' | 'closed' | 'idMembers'>
  )> }
);

export type VisibleCardsOnListFragment = (
  { __typename: 'List' }
  & { cards: Array<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'id' | 'closed' | 'idMembers'>
  )> }
);

export type TemplateCardsOnListFragment = (
  { __typename: 'List' }
  & { cards: Array<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'id' | 'closed' | 'idMembers'>
  )> }
);

export type CheckItemsAssignedCardsOnListFragment = (
  { __typename: 'List' }
  & { cards: Array<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'id' | 'closed' | 'idMembers'>
  )> }
);

export const CardsOnListFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CardsOnList"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"List"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"idMembers"}}]}}]}}]} as unknown as DocumentNode;
export const OpenCardsOnListFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OpenCardsOnList"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"List"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"open"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"idMembers"}}]}}]}}]} as unknown as DocumentNode;
export const ClosedCardsOnListFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"closedCardsOnList"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"List"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"closed"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"idMembers"}}]}}]}}]} as unknown as DocumentNode;
export const VisibleCardsOnListFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"visibleCardsOnList"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"List"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"visible"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"idMembers"}}]}}]}}]} as unknown as DocumentNode;
export const TemplateCardsOnListFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"templateCardsOnList"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"List"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"template"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"idMembers"}}]}}]}}]} as unknown as DocumentNode;
export const CheckItemsAssignedCardsOnListFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"checkItemsAssignedCardsOnList"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"List"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"checkItemsAssigned"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"idMembers"}}]}}]}}]} as unknown as DocumentNode;