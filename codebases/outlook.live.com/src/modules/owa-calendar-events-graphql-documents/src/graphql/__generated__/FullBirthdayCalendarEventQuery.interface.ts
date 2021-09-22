//@ts-nocheck TS6133
/* eslint-disable @typescript-eslint/no-duplicate-imports */
import * as Types from 'owa-graph-schema';

import { FullCalendarEventFragmentFragment } from './FullEventFragment.interface';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { FullCalendarEventFragmentFragmentDoc } from './FullEventFragment.interface';
export type FullBirthdayCalendarEventQueryVariables = Types.Exact<{
  input: Types.BirthdayEventRequestTypeParameters;
}>;


export type FullBirthdayCalendarEventQuery = (
  { __typename?: 'Query' }
  & { fullBirthdayCalendarEvent?: Types.Maybe<(
    { __typename?: 'FullCalendarEventResult' }
    & Pick<Types.FullCalendarEventResult, 'error' | 'responseCode'>
    & { calendarEvent?: Types.Maybe<(
      { __typename?: 'CalendarEvent' }
      & FullCalendarEventFragmentFragment
    )> }
  )> }
);


export const FullBirthdayCalendarEventDocument: DocumentNode<FullBirthdayCalendarEventQuery, FullBirthdayCalendarEventQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FullBirthdayCalendarEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BirthdayEventRequestTypeParameters"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullBirthdayCalendarEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendarEvent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FullCalendarEventFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"responseCode"}}]}}]}},...FullCalendarEventFragmentFragmentDoc.definitions]};