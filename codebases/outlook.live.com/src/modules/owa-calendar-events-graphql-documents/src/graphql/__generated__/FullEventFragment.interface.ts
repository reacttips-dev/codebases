//@ts-nocheck TS6133
/* eslint-disable @typescript-eslint/no-duplicate-imports */
import * as Types from 'owa-graph-schema';

import { PartialCalendarEventFragmentFragment } from './PartialEventFragment.interface';
import { AllEnhancedLocationFieldsFragment } from './AllEnhancedLocationsFields.interface';
import { AllAttendeeFieldsFragment } from './AllAttendeeFields.interface';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { PartialCalendarEventFragmentFragmentDoc } from './PartialEventFragment.interface';
import { AllEnhancedLocationFieldsFragmentDoc } from './AllEnhancedLocationsFields.interface';
import { AllAttendeeFieldsFragmentDoc } from './AllAttendeeFields.interface';
export type FullCalendarEventFragmentFragment = (
  { __typename?: 'CalendarEvent' }
  & Pick<Types.CalendarEvent, 'ConversationId' | 'EntityNamesMap' | 'HasBlockedImages' | 'InReplyTo' | 'LastModifiedTime' | 'TailoredXpEntities' | 'AppointmentReplyName' | 'AppointmentReplyTime' | 'AutoRoomBookingStatus' | 'ClientSeriesId' | 'DoNotForwardMeeting' | 'ExtractionSourceId' | 'IntendedFreeBusyStatus' | 'IsRoomRequested' | 'JoinOnlineMeetingUrl' | 'OnlineMeetingProvider' | 'OnlineMeetingConferenceId' | 'OnlineMeetingTollNumber' | 'OnlineMeetingTollFreeNumbers' | 'CollabSpace' | 'FlexEventsMetadata' | 'IsBookedFreeBlocks' | 'TravelTimeEventsLinked' | 'PersonId'>
  & { Body?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )>, DocLinks?: Types.Maybe<Array<(
    { __typename?: 'DocLink' }
    & Pick<Types.DocLink, 'ProviderType' | 'Url' | 'PermissionType'>
  )>>, EffectiveRights?: Types.Maybe<(
    { __typename?: 'EffectiveRightsType' }
    & Pick<Types.EffectiveRightsType, 'CreateAssociated' | 'CreateContents' | 'CreateHierarchy' | 'Delete' | 'Modify' | 'Read' | 'ViewPrivateItems'>
  )>, InboxReminders?: Types.Maybe<Array<Types.Maybe<(
    { __typename?: 'InboxReminder' }
    & Pick<Types.InboxReminder, 'Id' | 'ReminderOffset' | 'Message' | 'IsOrganizerReminder' | 'OccurrenceChange' | 'IsImportedFromOLC' | 'SendOption'>
  )>>>, Locations?: Types.Maybe<Array<Types.Maybe<(
    { __typename?: 'EnhancedLocation' }
    & AllEnhancedLocationFieldsFragment
  )>>>, RequiredAttendees?: Types.Maybe<Array<Types.Maybe<(
    { __typename?: 'Attendee' }
    & AllAttendeeFieldsFragment
  )>>>, OptionalAttendees?: Types.Maybe<Array<Types.Maybe<(
    { __typename?: 'Attendee' }
    & AllAttendeeFieldsFragment
  )>>>, Resources?: Types.Maybe<Array<Types.Maybe<(
    { __typename?: 'Attendee' }
    & AllAttendeeFieldsFragment
  )>>>, AppendOnSend?: Types.Maybe<Array<Types.Maybe<never>>> }
  & PartialCalendarEventFragmentFragment
);

export const FullCalendarEventFragmentFragmentDoc: DocumentNode<FullCalendarEventFragmentFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FullCalendarEventFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PartialCalendarEventFragment"}},{"kind":"Field","name":{"kind":"Name","value":"Body"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"BodyType"}},{"kind":"Field","name":{"kind":"Name","value":"Value"}},{"kind":"Field","name":{"kind":"Name","value":"QuotedText"}},{"kind":"Field","name":{"kind":"Name","value":"IsTruncated"}},{"kind":"Field","name":{"kind":"Name","value":"UTF8BodySize"}},{"kind":"Field","name":{"kind":"Name","value":"BodyFragmentInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"StartOffset"}},{"kind":"Field","name":{"kind":"Name","value":"EndOffset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"DataUriCount"}},{"kind":"Field","name":{"kind":"Name","value":"CustomDataUriCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ConversationId"}},{"kind":"Field","name":{"kind":"Name","value":"DocLinks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ProviderType"}},{"kind":"Field","name":{"kind":"Name","value":"Url"}},{"kind":"Field","name":{"kind":"Name","value":"PermissionType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"EffectiveRights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"CreateAssociated"}},{"kind":"Field","name":{"kind":"Name","value":"CreateContents"}},{"kind":"Field","name":{"kind":"Name","value":"CreateHierarchy"}},{"kind":"Field","name":{"kind":"Name","value":"Delete"}},{"kind":"Field","name":{"kind":"Name","value":"Modify"}},{"kind":"Field","name":{"kind":"Name","value":"Read"}},{"kind":"Field","name":{"kind":"Name","value":"ViewPrivateItems"}}]}},{"kind":"Field","name":{"kind":"Name","value":"EntityNamesMap"}},{"kind":"Field","name":{"kind":"Name","value":"HasBlockedImages"}},{"kind":"Field","name":{"kind":"Name","value":"InReplyTo"}},{"kind":"Field","name":{"kind":"Name","value":"LastModifiedTime"}},{"kind":"Field","name":{"kind":"Name","value":"TailoredXpEntities"}},{"kind":"Field","name":{"kind":"Name","value":"AppointmentReplyName"}},{"kind":"Field","name":{"kind":"Name","value":"AppointmentReplyTime"}},{"kind":"Field","name":{"kind":"Name","value":"AutoRoomBookingStatus"}},{"kind":"Field","name":{"kind":"Name","value":"ClientSeriesId"}},{"kind":"Field","name":{"kind":"Name","value":"DoNotForwardMeeting"}},{"kind":"Field","name":{"kind":"Name","value":"ExtractionSourceId"}},{"kind":"Field","name":{"kind":"Name","value":"InboxReminders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Id"}},{"kind":"Field","name":{"kind":"Name","value":"ReminderOffset"}},{"kind":"Field","name":{"kind":"Name","value":"Message"}},{"kind":"Field","name":{"kind":"Name","value":"IsOrganizerReminder"}},{"kind":"Field","name":{"kind":"Name","value":"OccurrenceChange"}},{"kind":"Field","name":{"kind":"Name","value":"IsImportedFromOLC"}},{"kind":"Field","name":{"kind":"Name","value":"SendOption"}}]}},{"kind":"Field","name":{"kind":"Name","value":"IntendedFreeBusyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"IsRoomRequested"}},{"kind":"Field","name":{"kind":"Name","value":"JoinOnlineMeetingUrl"}},{"kind":"Field","name":{"kind":"Name","value":"Locations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AllEnhancedLocationFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"OnlineMeetingProvider"}},{"kind":"Field","name":{"kind":"Name","value":"OnlineMeetingConferenceId"}},{"kind":"Field","name":{"kind":"Name","value":"OnlineMeetingTollNumber"}},{"kind":"Field","name":{"kind":"Name","value":"OnlineMeetingTollFreeNumbers"}},{"kind":"Field","name":{"kind":"Name","value":"RequiredAttendees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AllAttendeeFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"OptionalAttendees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AllAttendeeFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Resources"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AllAttendeeFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"AppendOnSend"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"txt"}},{"kind":"Field","name":{"kind":"Name","value":"typ"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"CollabSpace"}},{"kind":"Field","name":{"kind":"Name","value":"FlexEventsMetadata"}},{"kind":"Field","name":{"kind":"Name","value":"IsBookedFreeBlocks"}},{"kind":"Field","name":{"kind":"Name","value":"TravelTimeEventsLinked"}},{"kind":"Field","name":{"kind":"Name","value":"PersonId"}}]}},...PartialCalendarEventFragmentFragmentDoc.definitions,...AllEnhancedLocationFieldsFragmentDoc.definitions,...AllAttendeeFieldsFragmentDoc.definitions]};