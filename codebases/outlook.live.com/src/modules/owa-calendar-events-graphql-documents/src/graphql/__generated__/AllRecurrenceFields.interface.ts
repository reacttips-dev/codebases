//@ts-nocheck TS6133
/* eslint-disable @typescript-eslint/no-duplicate-imports */
import * as Types from 'owa-graph-schema';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type AllRecurrenceFieldsFragment = (
  { __typename?: 'RecurrenceType' }
  & { RecurrencePattern: (
    { __typename?: 'AbsoluteYearlyRecurrence' }
    & Pick<Types.AbsoluteYearlyRecurrence, 'DayOfMonth' | 'Month'>
  ) | (
    { __typename?: 'AbsoluteMonthlyRecurrence' }
    & Pick<Types.AbsoluteMonthlyRecurrence, 'Interval' | 'DayOfMonth'>
  ) | (
    { __typename?: 'DailyRecurrence' }
    & Pick<Types.DailyRecurrence, 'Interval'>
  ) | (
    { __typename?: 'RegeneratingPatternBaseType' }
    & Pick<Types.RegeneratingPatternBaseType, 'Interval'>
  ) | (
    { __typename?: 'RelativeYearlyRecurrence' }
    & Pick<Types.RelativeYearlyRecurrence, 'DaysOfWeek' | 'DayOfWeekIndex' | 'Month'>
  ) | (
    { __typename?: 'RelativeMonthlyRecurrence' }
    & Pick<Types.RelativeMonthlyRecurrence, 'DaysOfWeek' | 'DayOfWeekIndex' | 'Interval'>
  ) | (
    { __typename?: 'WeeklyRecurrence' }
    & Pick<Types.WeeklyRecurrence, 'DaysOfWeek' | 'FirstDayOfWeek' | 'Interval'>
  ), RecurrenceRange: (
    { __typename?: 'EndDateRecurrence' }
    & Pick<Types.EndDateRecurrence, 'StartDate' | 'EndDate'>
  ) | (
    { __typename?: 'NoEndRecurrence' }
    & Pick<Types.NoEndRecurrence, 'StartDate'>
  ) | (
    { __typename?: 'NumberedRecurrence' }
    & Pick<Types.NumberedRecurrence, 'StartDate' | 'NumberOfOccurrences'>
  ) }
);

export const AllRecurrenceFieldsFragmentDoc: DocumentNode<AllRecurrenceFieldsFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AllRecurrenceFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RecurrenceType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"RecurrencePattern"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AbsoluteYearlyRecurrence"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"DayOfMonth"}},{"kind":"Field","name":{"kind":"Name","value":"Month"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AbsoluteMonthlyRecurrence"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Interval"}},{"kind":"Field","name":{"kind":"Name","value":"DayOfMonth"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DailyRecurrence"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Interval"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RegeneratingPatternBaseType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Interval"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RelativeYearlyRecurrence"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"DaysOfWeek"}},{"kind":"Field","name":{"kind":"Name","value":"DayOfWeekIndex"}},{"kind":"Field","name":{"kind":"Name","value":"Month"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RelativeMonthlyRecurrence"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"DaysOfWeek"}},{"kind":"Field","name":{"kind":"Name","value":"DayOfWeekIndex"}},{"kind":"Field","name":{"kind":"Name","value":"Interval"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WeeklyRecurrence"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"DaysOfWeek"}},{"kind":"Field","name":{"kind":"Name","value":"FirstDayOfWeek"}},{"kind":"Field","name":{"kind":"Name","value":"Interval"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"RecurrenceRange"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EndDateRecurrence"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"StartDate"}},{"kind":"Field","name":{"kind":"Name","value":"EndDate"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NoEndRecurrence"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"StartDate"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NumberedRecurrence"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"StartDate"}},{"kind":"Field","name":{"kind":"Name","value":"NumberOfOccurrences"}}]}}]}}]}}]};