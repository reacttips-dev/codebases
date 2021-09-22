//@ts-nocheck TS6133
/* eslint-disable @typescript-eslint/no-duplicate-imports */
import * as Types from 'owa-graph-schema';

import { AllEnhancedLocationFieldsFragment } from './AllEnhancedLocationsFields.interface';
import { AllRecurrenceFieldsFragment } from './AllRecurrenceFields.interface';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { AllEnhancedLocationFieldsFragmentDoc } from './AllEnhancedLocationsFields.interface';
import { AllRecurrenceFieldsFragmentDoc } from './AllRecurrenceFields.interface';
export type PartialCalendarEventFragmentFragment = (
  { __typename?: 'CalendarEvent' }
  & Pick<Types.CalendarEvent, 'id' | 'Categories' | 'HasAttachments' | 'InstanceKey' | 'IsDraft' | 'Preview' | 'ReminderIsSet' | 'ReminderMinutesBeforeStart' | 'Sensitivity' | 'Subject' | 'CalendarItemType' | 'CharmId' | 'End' | 'EndTimeZoneId' | 'ExperienceType' | 'FreeBusyType' | 'HideAttendees' | 'IsAllDayEvent' | 'IsMeeting' | 'IsCancelled' | 'IsOnlineMeeting' | 'IsOrganizer' | 'IsRecurring' | 'IsResponseRequested' | 'IsSeriesCancelled' | 'MeetingRequestWasSent' | 'OnlineMeetingJoinUrl' | 'Organizer' | 'ResponseType' | 'PersonId' | 'Start' | 'StartTimeZoneId' | 'UID'>
  & { ItemId: (
    { __typename?: 'ClientItemId' }
    & Pick<Types.ClientItemId, 'mailboxInfo' | 'Id'>
  ), EffectiveRights?: Types.Maybe<(
    { __typename?: 'EffectiveRightsType' }
    & Pick<Types.EffectiveRightsType, 'CreateAssociated' | 'CreateContents' | 'CreateHierarchy' | 'Delete' | 'Modify' | 'Read' | 'ViewPrivateItems'>
  )>, ParentFolderId?: Types.Maybe<(
    { __typename?: 'ClientItemId' }
    & Pick<Types.ClientItemId, 'Id' | 'mailboxInfo'>
  )>, SkypeTeamsProperties?: Types.Maybe<(
    { __typename?: 'SkypeTeamsPropertiesData' }
    & Pick<Types.SkypeTeamsPropertiesData, 'cid' | 'rid' | 'mid' | 'uid' | 'private' | 'type'>
  )>, Location?: Types.Maybe<(
    { __typename?: 'EnhancedLocation' }
    & AllEnhancedLocationFieldsFragment
  )>, Recurrence?: Types.Maybe<(
    { __typename?: 'RecurrenceType' }
    & AllRecurrenceFieldsFragment
  )>, SeriesMasterItemId?: Types.Maybe<(
    { __typename?: 'ClientItemId' }
    & Pick<Types.ClientItemId, 'mailboxInfo' | 'Id'>
  )> }
);

export const PartialCalendarEventFragmentFragmentDoc: DocumentNode<PartialCalendarEventFragmentFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PartialCalendarEventFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ItemId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mailboxInfo"}},{"kind":"Field","name":{"kind":"Name","value":"Id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Categories"}},{"kind":"Field","name":{"kind":"Name","value":"EffectiveRights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"CreateAssociated"}},{"kind":"Field","name":{"kind":"Name","value":"CreateContents"}},{"kind":"Field","name":{"kind":"Name","value":"CreateHierarchy"}},{"kind":"Field","name":{"kind":"Name","value":"Delete"}},{"kind":"Field","name":{"kind":"Name","value":"Modify"}},{"kind":"Field","name":{"kind":"Name","value":"Read"}},{"kind":"Field","name":{"kind":"Name","value":"ViewPrivateItems"}}]}},{"kind":"Field","name":{"kind":"Name","value":"HasAttachments"}},{"kind":"Field","name":{"kind":"Name","value":"InstanceKey"}},{"kind":"Field","name":{"kind":"Name","value":"IsDraft"}},{"kind":"Field","name":{"kind":"Name","value":"ParentFolderId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Id"}},{"kind":"Field","name":{"kind":"Name","value":"mailboxInfo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Preview"}},{"kind":"Field","name":{"kind":"Name","value":"ReminderIsSet"}},{"kind":"Field","name":{"kind":"Name","value":"ReminderMinutesBeforeStart"}},{"kind":"Field","name":{"kind":"Name","value":"Sensitivity"}},{"kind":"Field","name":{"kind":"Name","value":"Subject"}},{"kind":"Field","name":{"kind":"Name","value":"CalendarItemType"}},{"kind":"Field","name":{"kind":"Name","value":"CharmId"}},{"kind":"Field","name":{"kind":"Name","value":"End"}},{"kind":"Field","name":{"kind":"Name","value":"EndTimeZoneId"}},{"kind":"Field","name":{"kind":"Name","value":"ExperienceType"}},{"kind":"Field","name":{"kind":"Name","value":"FreeBusyType"}},{"kind":"Field","name":{"kind":"Name","value":"HideAttendees"}},{"kind":"Field","name":{"kind":"Name","value":"IsAllDayEvent"}},{"kind":"Field","name":{"kind":"Name","value":"IsMeeting"}},{"kind":"Field","name":{"kind":"Name","value":"IsCancelled"}},{"kind":"Field","name":{"kind":"Name","value":"IsOnlineMeeting"}},{"kind":"Field","name":{"kind":"Name","value":"IsOrganizer"}},{"kind":"Field","name":{"kind":"Name","value":"IsRecurring"}},{"kind":"Field","name":{"kind":"Name","value":"IsResponseRequested"}},{"kind":"Field","name":{"kind":"Name","value":"IsSeriesCancelled"}},{"kind":"Field","name":{"kind":"Name","value":"SkypeTeamsProperties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cid"}},{"kind":"Field","name":{"kind":"Name","value":"rid"}},{"kind":"Field","name":{"kind":"Name","value":"mid"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AllEnhancedLocationFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"MeetingRequestWasSent"}},{"kind":"Field","name":{"kind":"Name","value":"OnlineMeetingJoinUrl"}},{"kind":"Field","name":{"kind":"Name","value":"Organizer"}},{"kind":"Field","name":{"kind":"Name","value":"Recurrence"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AllRecurrenceFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ResponseType"}},{"kind":"Field","name":{"kind":"Name","value":"SeriesMasterItemId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mailboxInfo"}},{"kind":"Field","name":{"kind":"Name","value":"Id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"PersonId"}},{"kind":"Field","name":{"kind":"Name","value":"Start"}},{"kind":"Field","name":{"kind":"Name","value":"StartTimeZoneId"}},{"kind":"Field","name":{"kind":"Name","value":"UID"}}]}},...AllEnhancedLocationFieldsFragmentDoc.definitions,...AllRecurrenceFieldsFragmentDoc.definitions]};