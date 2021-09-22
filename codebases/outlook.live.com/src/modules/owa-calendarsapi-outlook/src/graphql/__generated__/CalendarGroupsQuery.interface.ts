//@ts-nocheck TS6133
/* eslint-disable @typescript-eslint/no-duplicate-imports */
import * as Types from 'owa-graph-schema';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type CalendarGroupsQueryVariables = Types.Exact<{
  mailboxInfo: Types.MailboxInfoInput;
}>;


export type CalendarGroupsQuery = (
  { __typename?: 'Query' }
  & { calendarGroups: Array<(
    { __typename?: 'CalendarGroup' }
    & Pick<Types.CalendarGroup, 'serverGroupId' | 'GroupName' | 'GroupType' | 'DisplayOrder'>
    & { calendarGroupId: (
      { __typename?: 'CalendarId' }
      & Pick<Types.CalendarId, 'id' | 'changeKey' | 'mailboxInfo'>
    ), Calendars?: Types.Maybe<Array<(
      { __typename?: 'LocalCalendarEntry' }
      & Pick<Types.LocalCalendarEntry, 'CalendarName' | 'CalendarFolderType' | 'CanShare' | 'HexColor' | 'HexColorString' | 'IsTallyingResponses' | 'ParentGroupId' | 'AllowedOnlineMeetingProviders' | 'CanEnableChangeNotifications' | 'ChangeNotificationStatus' | 'DefaultOnlineMeetingProvider' | 'DistinguishedFolderId' | 'ProviderId' | 'SourceId' | 'CalendarColor' | 'IsGroupMailboxCalendar' | 'AgendaMailDisabled' | 'CharmId' | 'DisplayOrder' | 'CanViewPrivateItems' | 'FamilyPuid' | 'IsDefaultCalendar' | 'IsInterestingCalendar' | 'IsInternetCalendar' | 'IsReadOnly' | 'IsRemovable' | 'IsShared' | 'OwnerSipUri' | 'SharedOwnerEmailAddress' | 'SharedOwnerName' | 'IsSchoolCalendar'>
      & { calendarId: (
        { __typename?: 'CalendarId' }
        & Pick<Types.CalendarId, 'id' | 'changeKey' | 'mailboxInfo'>
      ), EffectiveRights?: Types.Maybe<(
        { __typename?: 'EffectiveRightsType' }
        & Pick<Types.EffectiveRightsType, 'CreateAssociated' | 'CreateContents' | 'CreateHierarchy' | 'Delete' | 'Modify' | 'Read' | 'ViewPrivateItems'>
      )>, FolderId?: Types.Maybe<(
        { __typename?: 'FolderId' }
        & Pick<Types.FolderId, 'Id' | 'ChangeKey'>
      )>, LocalCalendarFolderId?: Types.Maybe<(
        { __typename?: 'FolderId' }
        & Pick<Types.FolderId, 'Id' | 'ChangeKey'>
      )> }
    ) | (
      { __typename?: 'LinkedCalendarEntry' }
      & Pick<Types.LinkedCalendarEntry, 'CalendarName' | 'CalendarFolderType' | 'CanShare' | 'HexColor' | 'HexColorString' | 'IsTallyingResponses' | 'ParentGroupId' | 'AllowedOnlineMeetingProviders' | 'CanEnableChangeNotifications' | 'ChangeNotificationStatus' | 'DefaultOnlineMeetingProvider' | 'DistinguishedFolderId' | 'ProviderId' | 'SourceId' | 'CalendarColor' | 'IsGroupMailboxCalendar' | 'AgendaMailDisabled' | 'CharmId' | 'DisplayOrder' | 'OwnerEmailAddress' | 'OwnerName' | 'OwnerSipUri' | 'IsGeneralScheduleCalendar' | 'IsOwnerEmailAddressInvalid'>
      & { calendarId: (
        { __typename?: 'CalendarId' }
        & Pick<Types.CalendarId, 'id' | 'changeKey' | 'mailboxInfo'>
      ), EffectiveRights?: Types.Maybe<(
        { __typename?: 'EffectiveRightsType' }
        & Pick<Types.EffectiveRightsType, 'CreateAssociated' | 'CreateContents' | 'CreateHierarchy' | 'Delete' | 'Modify' | 'Read' | 'ViewPrivateItems'>
      )>, FolderId?: Types.Maybe<(
        { __typename?: 'FolderId' }
        & Pick<Types.FolderId, 'Id' | 'ChangeKey'>
      )>, SharedFolderId?: Types.Maybe<(
        { __typename?: 'FolderId' }
        & Pick<Types.FolderId, 'Id' | 'ChangeKey'>
      )>, RemoteCategories?: Types.Maybe<(
        { __typename?: 'MasterCategoryList' }
        & { MasterList?: Types.Maybe<Array<Types.Maybe<(
          { __typename?: 'Category' }
          & Pick<Types.Category, 'Name' | 'Color' | 'Id' | 'LastTimeUsed'>
        )>>> }
      )> }
    ) | (
      { __typename?: 'LocalCacheForRemoteCalendarEntry' }
      & Pick<Types.LocalCacheForRemoteCalendarEntry, 'CalendarName' | 'CalendarFolderType' | 'CanShare' | 'HexColor' | 'HexColorString' | 'IsTallyingResponses' | 'ParentGroupId' | 'AllowedOnlineMeetingProviders' | 'CanEnableChangeNotifications' | 'ChangeNotificationStatus' | 'DefaultOnlineMeetingProvider' | 'DistinguishedFolderId' | 'ProviderId' | 'SourceId' | 'CalendarColor' | 'IsGroupMailboxCalendar' | 'AgendaMailDisabled' | 'CharmId' | 'DisplayOrder' | 'OwnerEmailAddress' | 'OwnerName' | 'IsGeneralScheduleCalendar' | 'IsOwnerEmailAddressInvalid' | 'SharedOwnerMailboxGuid' | 'IsDefaultCalendar' | 'IsReadOnly' | 'IsSharedWithMe' | 'CanViewPrivateItems'>
      & { calendarId: (
        { __typename?: 'CalendarId' }
        & Pick<Types.CalendarId, 'id' | 'changeKey' | 'mailboxInfo'>
      ), EffectiveRights?: Types.Maybe<(
        { __typename?: 'EffectiveRightsType' }
        & Pick<Types.EffectiveRightsType, 'CreateAssociated' | 'CreateContents' | 'CreateHierarchy' | 'Delete' | 'Modify' | 'Read' | 'ViewPrivateItems'>
      )>, FolderId?: Types.Maybe<(
        { __typename?: 'FolderId' }
        & Pick<Types.FolderId, 'Id' | 'ChangeKey'>
      )>, SharedFolderId?: Types.Maybe<(
        { __typename?: 'FolderId' }
        & Pick<Types.FolderId, 'Id' | 'ChangeKey'>
      )>, RemoteCategories?: Types.Maybe<(
        { __typename?: 'MasterCategoryList' }
        & { MasterList?: Types.Maybe<Array<Types.Maybe<(
          { __typename?: 'Category' }
          & Pick<Types.Category, 'Name' | 'Color' | 'Id' | 'LastTimeUsed'>
        )>>> }
      )>, LocalCalendarFolderId?: Types.Maybe<(
        { __typename?: 'FolderId' }
        & Pick<Types.FolderId, 'Id' | 'ChangeKey'>
      )> }
    )>> }
  )> }
);


export const CalendarGroupsDocument: DocumentNode<CalendarGroupsQuery, CalendarGroupsQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CalendarGroups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mailboxInfo"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MailboxInfoInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendarGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"mailboxInfo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mailboxInfo"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendarGroupId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"changeKey"}},{"kind":"Field","name":{"kind":"Name","value":"mailboxInfo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"serverGroupId"}},{"kind":"Field","name":{"kind":"Name","value":"GroupName"}},{"kind":"Field","name":{"kind":"Name","value":"GroupType"}},{"kind":"Field","name":{"kind":"Name","value":"DisplayOrder"}},{"kind":"Field","name":{"kind":"Name","value":"Calendars"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendarId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"changeKey"}},{"kind":"Field","name":{"kind":"Name","value":"mailboxInfo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"CalendarName"}},{"kind":"Field","name":{"kind":"Name","value":"CalendarFolderType"}},{"kind":"Field","name":{"kind":"Name","value":"CanShare"}},{"kind":"Field","name":{"kind":"Name","value":"HexColor"}},{"kind":"Field","name":{"kind":"Name","value":"HexColorString"}},{"kind":"Field","name":{"kind":"Name","value":"IsTallyingResponses"}},{"kind":"Field","name":{"kind":"Name","value":"ParentGroupId"}},{"kind":"Field","name":{"kind":"Name","value":"AllowedOnlineMeetingProviders"}},{"kind":"Field","name":{"kind":"Name","value":"CanEnableChangeNotifications"}},{"kind":"Field","name":{"kind":"Name","value":"ChangeNotificationStatus"}},{"kind":"Field","name":{"kind":"Name","value":"DefaultOnlineMeetingProvider"}},{"kind":"Field","name":{"kind":"Name","value":"DistinguishedFolderId"}},{"kind":"Field","name":{"kind":"Name","value":"EffectiveRights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"CreateAssociated"}},{"kind":"Field","name":{"kind":"Name","value":"CreateContents"}},{"kind":"Field","name":{"kind":"Name","value":"CreateHierarchy"}},{"kind":"Field","name":{"kind":"Name","value":"Delete"}},{"kind":"Field","name":{"kind":"Name","value":"Modify"}},{"kind":"Field","name":{"kind":"Name","value":"Read"}},{"kind":"Field","name":{"kind":"Name","value":"ViewPrivateItems"}}]}},{"kind":"Field","name":{"kind":"Name","value":"FolderId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Id"}},{"kind":"Field","name":{"kind":"Name","value":"ChangeKey"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ProviderId"}},{"kind":"Field","name":{"kind":"Name","value":"SourceId"}},{"kind":"Field","name":{"kind":"Name","value":"CalendarColor"}},{"kind":"Field","name":{"kind":"Name","value":"IsGroupMailboxCalendar"}},{"kind":"Field","name":{"kind":"Name","value":"AgendaMailDisabled"}},{"kind":"Field","name":{"kind":"Name","value":"CharmId"}},{"kind":"Field","name":{"kind":"Name","value":"DisplayOrder"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LocalCalendarEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"LocalCalendarFolderId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Id"}},{"kind":"Field","name":{"kind":"Name","value":"ChangeKey"}}]}},{"kind":"Field","name":{"kind":"Name","value":"CanViewPrivateItems"}},{"kind":"Field","name":{"kind":"Name","value":"FamilyPuid"}},{"kind":"Field","name":{"kind":"Name","value":"IsDefaultCalendar"}},{"kind":"Field","name":{"kind":"Name","value":"IsInterestingCalendar"}},{"kind":"Field","name":{"kind":"Name","value":"IsInternetCalendar"}},{"kind":"Field","name":{"kind":"Name","value":"IsReadOnly"}},{"kind":"Field","name":{"kind":"Name","value":"IsRemovable"}},{"kind":"Field","name":{"kind":"Name","value":"IsShared"}},{"kind":"Field","name":{"kind":"Name","value":"OwnerSipUri"}},{"kind":"Field","name":{"kind":"Name","value":"SharedOwnerEmailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"SharedOwnerName"}},{"kind":"Field","name":{"kind":"Name","value":"IsSchoolCalendar"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LocalCacheForRemoteCalendarEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"OwnerEmailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"OwnerName"}},{"kind":"Field","name":{"kind":"Name","value":"IsGeneralScheduleCalendar"}},{"kind":"Field","name":{"kind":"Name","value":"IsOwnerEmailAddressInvalid"}},{"kind":"Field","name":{"kind":"Name","value":"SharedFolderId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Id"}},{"kind":"Field","name":{"kind":"Name","value":"ChangeKey"}}]}},{"kind":"Field","name":{"kind":"Name","value":"RemoteCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"MasterList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Name"}},{"kind":"Field","name":{"kind":"Name","value":"Color"}},{"kind":"Field","name":{"kind":"Name","value":"Id"}},{"kind":"Field","name":{"kind":"Name","value":"LastTimeUsed"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"SharedOwnerMailboxGuid"}},{"kind":"Field","name":{"kind":"Name","value":"IsDefaultCalendar"}},{"kind":"Field","name":{"kind":"Name","value":"IsReadOnly"}},{"kind":"Field","name":{"kind":"Name","value":"IsSharedWithMe"}},{"kind":"Field","name":{"kind":"Name","value":"LocalCalendarFolderId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Id"}},{"kind":"Field","name":{"kind":"Name","value":"ChangeKey"}}]}},{"kind":"Field","name":{"kind":"Name","value":"CanViewPrivateItems"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LinkedCalendarEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"OwnerEmailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"OwnerName"}},{"kind":"Field","name":{"kind":"Name","value":"OwnerSipUri"}},{"kind":"Field","name":{"kind":"Name","value":"IsGeneralScheduleCalendar"}},{"kind":"Field","name":{"kind":"Name","value":"IsOwnerEmailAddressInvalid"}},{"kind":"Field","name":{"kind":"Name","value":"SharedFolderId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Id"}},{"kind":"Field","name":{"kind":"Name","value":"ChangeKey"}}]}},{"kind":"Field","name":{"kind":"Name","value":"RemoteCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"MasterList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Name"}},{"kind":"Field","name":{"kind":"Name","value":"Color"}},{"kind":"Field","name":{"kind":"Name","value":"Id"}},{"kind":"Field","name":{"kind":"Name","value":"LastTimeUsed"}}]}}]}}]}}]}}]}}]}}]};