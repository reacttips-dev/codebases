//@ts-nocheck TS6133
/* eslint-disable @typescript-eslint/no-duplicate-imports */
import * as Types from 'owa-graph-schema';

import { PartialCalendarEventFragmentFragment } from './PartialEventFragment.interface';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { PartialCalendarEventFragmentFragmentDoc } from './PartialEventFragment.interface';
export type CalendarEventsQueryVariables = Types.Exact<{
  input: Types.CalendarEventsInput;
}>;


export type CalendarEventsQuery = (
  { __typename?: 'Query' }
  & { calendarEvents?: Types.Maybe<(
    { __typename?: 'CalendarEventsResult' }
    & Pick<Types.CalendarEventsResult, 'requiresForceOverride'>
    & { events?: Types.Maybe<Array<Types.Maybe<(
      { __typename?: 'CalendarEvent' }
      & PartialCalendarEventFragmentFragment
    )>>>, workingHours?: Types.Maybe<(
      { __typename?: 'WorkingHours' }
      & Pick<Types.WorkingHours, 'WorkHoursStartTimeInMinutes' | 'WorkHoursEndTimeInMinutes' | 'WorkDays' | 'WorkingHoursTimeZoneId'>
    )> }
  )> }
);


export const CalendarEventsDocument: DocumentNode<CalendarEventsQuery, CalendarEventsQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CalendarEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarEventsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendarEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PartialCalendarEventFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requiresForceOverride"}},{"kind":"Field","name":{"kind":"Name","value":"workingHours"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"WorkHoursStartTimeInMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"WorkHoursEndTimeInMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"WorkDays"}},{"kind":"Field","name":{"kind":"Name","value":"WorkingHoursTimeZoneId"}}]}}]}}]}},...PartialCalendarEventFragmentFragmentDoc.definitions]};