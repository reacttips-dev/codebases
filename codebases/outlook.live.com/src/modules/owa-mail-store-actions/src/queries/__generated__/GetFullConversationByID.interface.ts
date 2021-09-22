//@ts-nocheck TS6133
/* eslint-disable @typescript-eslint/no-duplicate-imports */
import * as Types from 'owa-graph-schema';

import { AllRecurrenceFieldsFragment } from 'owa-calendar-events-graphql-documents/lib/graphql/__generated__/AllRecurrenceFields.interface';
import { AllEnhancedLocationFieldsFragment } from 'owa-calendar-events-graphql-documents/lib/graphql/__generated__/AllEnhancedLocationsFields.interface';
import { AllAttendeeFieldsFragment } from 'owa-calendar-events-graphql-documents/lib/graphql/__generated__/AllAttendeeFields.interface';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { AllRecurrenceFieldsFragmentDoc } from 'owa-calendar-events-graphql-documents/lib/graphql/__generated__/AllRecurrenceFields.interface';
import { AllEnhancedLocationFieldsFragmentDoc } from 'owa-calendar-events-graphql-documents/lib/graphql/__generated__/AllEnhancedLocationsFields.interface';
import { AllAttendeeFieldsFragmentDoc } from 'owa-calendar-events-graphql-documents/lib/graphql/__generated__/AllAttendeeFields.interface';
export type AllGenericItemFields_CalendarItem_Fragment = (
  { __typename?: 'CalendarItem' }
  & Pick<Types.CalendarItem, 'ItemId' | 'ConversationId' | 'ParentFolderId' | 'BlockStatus' | 'CanDelete' | 'Categories' | 'ContainsOnlyMandatoryProperties' | 'ConversationThreadId' | 'DateTimeCreated' | 'DateTimeReceived' | 'DateTimeSent' | 'DeferredSendTime' | 'DisplayBcc' | 'DisplayCc' | 'DisplayTo' | 'EntityDocument' | 'EntityNamesMap' | 'ExtensibleContentData' | 'HasAttachments' | 'HasBlockedImages' | 'Hashtags' | 'HasProcessedSharepointLink' | 'HasQuotedText' | 'IconIndex' | 'id' | 'Importance' | 'InferenceClassification' | 'InReplyTo' | 'InstanceKey' | 'IsDraft' | 'IsExternalSender' | 'IsFromMe' | 'IsLocked' | 'IsSubmitted' | 'ItemClass' | 'LastModifiedTime' | 'MentionedMe' | 'Mentions' | 'MSIPLabelGuid' | 'PendingSocialActivityTagIds' | 'Preview' | 'QuotedTextList' | 'ReceivedOrRenewTime' | 'ReminderIsSet' | 'ReminderMinutesBeforeStart' | 'RetentionDate' | 'ReturnTime' | 'Sensitivity' | 'SerializedImmutableId' | 'Size' | 'SortOrderSource' | 'Subject' | 'SystemCategories' | 'TailoredXpEntities' | 'TailoredXpEntitiesChangeNumber' | 'TrimmedQuotedText' | 'UserHighlightData' | 'YammerNotification'>
  & { Apps?: Types.Maybe<Array<(
    { __typename?: 'AddinsApp' }
    & Pick<Types.AddinsApp, 'Id'>
    & { Notifications?: Types.Maybe<Array<(
      { __typename?: 'Notification' }
      & Pick<Types.Notification, 'Key' | 'Type' | 'Message' | 'Icon'>
    )>> }
  )>>, ArchiveTag?: Types.Maybe<(
    { __typename?: 'RetentionTagType' }
    & Pick<Types.RetentionTagType, 'IsExplicit' | 'Value'>
  )>, Attachments?: Types.Maybe<Array<(
    { __typename?: 'BasicAttachment' }
    & Pick<Types.BasicAttachment, 'OwsTypeName' | 'AttachmentOriginalUrl' | 'ContentId' | 'ContentLocation' | 'ContentType' | 'id' | 'IsInline' | 'IsInlineToNormalBody' | 'IsInlineToUniqueBody' | 'LastModifiedTime' | 'Name' | 'Size' | 'Thumbnail' | 'ThumbnailMimeType'>
    & { AttachmentId?: Types.Maybe<(
      { __typename?: 'AttachmentId' }
      & Pick<Types.AttachmentId, 'Id'>
    )> }
  ) | (
    { __typename?: 'ReferenceAttachment' }
    & Pick<Types.ReferenceAttachment, 'ProviderType' | 'WebUrl' | 'AttachLongPathName' | 'AttachmentThumbnailUrl' | 'AttachmentPreviewUrl' | 'OwsTypeName' | 'AttachmentOriginalUrl' | 'ContentId' | 'ContentLocation' | 'ContentType' | 'id' | 'IsInline' | 'IsInlineToNormalBody' | 'IsInlineToUniqueBody' | 'LastModifiedTime' | 'Name' | 'Size' | 'Thumbnail' | 'ThumbnailMimeType'>
    & { AttachmentId?: Types.Maybe<(
      { __typename?: 'AttachmentId' }
      & Pick<Types.AttachmentId, 'Id'>
    )> }
  )>>, Body?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )>, Conversation?: Types.Maybe<(
    { __typename?: 'ConversationType' }
    & Pick<Types.ConversationType, 'ConversationId' | 'ConversationTopic' | 'UniqueRecipients' | 'UniqueSenders' | 'LastDeliveryTime' | 'Categories' | 'FlagStatus' | 'HasAttachments' | 'MessageCount' | 'GlobalMessageCount' | 'UnreadCount' | 'GlobalUnreadCount' | 'Size' | 'ItemClasses' | 'Importance' | 'ItemIds' | 'GlobalItemIds' | 'LastModifiedTime' | 'InstanceKey' | 'Preview' | 'IconIndex' | 'DraftItemIds' | 'HasIrm' | 'GlobalLikeCount' | 'LastDeliveryOrRenewTime' | 'GlobalMentionedMe' | 'GlobalAtAllMention' | 'SortOrderSource' | 'LastSender' | 'From' | 'EntityNamesMap' | 'HasExternalEmails' | 'ReturnTime' | 'HasSharepointLink' | 'HasAttachmentPreviews' | 'HasProcessedSharepointLink' | 'CouponRanks' | 'CouponExpiryDates' | 'mentionedMe'>
    & { ParentFolderId?: Types.Maybe<(
      { __typename?: 'FolderId' }
      & Pick<Types.FolderId, 'Id'>
    )> }
  )>, DocLinks?: Types.Maybe<Array<(
    { __typename?: 'DocLink' }
    & Pick<Types.DocLink, 'ProviderType' | 'Url' | 'PermissionType'>
  )>>, EffectiveRights?: Types.Maybe<(
    { __typename?: 'EffectiveRightsType' }
    & Pick<Types.EffectiveRightsType, 'CreateAssociated' | 'CreateContents' | 'CreateHierarchy' | 'Delete' | 'Modify' | 'Read' | 'ViewPrivateItems'>
  )>, EntityExtractionResult?: Types.Maybe<(
    { __typename?: 'EntityExtractionResult' }
    & Pick<Types.EntityExtractionResult, 'BusinessNames' | 'PeopleNames'>
    & { Addresses?: Types.Maybe<Array<(
      { __typename?: 'AddressEntity' }
      & Pick<Types.AddressEntity, 'Position' | 'Address'>
    )>>, MeetingSuggestions?: Types.Maybe<Array<(
      { __typename?: 'MeetingSuggestion' }
      & Pick<Types.MeetingSuggestion, 'Position' | 'Location' | 'Subject' | 'MeetingString' | 'TimeStringBeginIndex' | 'TimeStringLength' | 'EntityId' | 'ExtractionId' | 'StartTime' | 'EndTime'>
      & { Attendees?: Types.Maybe<Array<(
        { __typename?: 'TxpEmailUser' }
        & Pick<Types.TxpEmailUser, 'Name' | 'UserId'>
      )>> }
    )>>, TaskSuggestions?: Types.Maybe<Array<(
      { __typename?: 'TaskSuggestion' }
      & Pick<Types.TaskSuggestion, 'Position' | 'TaskString'>
      & { Assignees?: Types.Maybe<Array<(
        { __typename?: 'TxpEmailUser' }
        & Pick<Types.TxpEmailUser, 'Name' | 'UserId'>
      )>> }
    )>>, EmailAddresses?: Types.Maybe<Array<(
      { __typename?: 'EmailAddressEntity' }
      & Pick<Types.EmailAddressEntity, 'Position' | 'EmailAddress'>
    )>>, Contacts?: Types.Maybe<Array<(
      { __typename?: 'Contact' }
      & Pick<Types.Contact, 'Position' | 'PersonName' | 'BusinessName' | 'Urls' | 'EmailAddresses' | 'Addresses' | 'ContactString' | 'ContactGroupsGuids'>
      & { PhoneNumbers?: Types.Maybe<Array<(
        { __typename?: 'Phone' }
        & Pick<Types.Phone, 'OriginalPhoneString' | 'PhoneString' | 'Type'>
      )>> }
    )>>, Urls?: Types.Maybe<Array<(
      { __typename?: 'UrlEntity' }
      & Pick<Types.UrlEntity, 'Position' | 'Url'>
    )>>, PhoneNumbers?: Types.Maybe<Array<(
      { __typename?: 'PhoneEntity' }
      & Pick<Types.PhoneEntity, 'Position' | 'OriginalPhoneString' | 'PhoneString' | 'Type'>
    )>>, ParcelDeliveries?: Types.Maybe<Array<(
      { __typename?: 'ParcelDeliveryEntity' }
      & Pick<Types.ParcelDeliveryEntity, 'Position' | 'Carrier' | 'TrackingNumber' | 'TrackingUrl' | 'ExpectedArrivalFrom' | 'ExpectedArrivalUntil' | 'Product' | 'ProductUrl' | 'ProductImage' | 'ProductSku' | 'ProductDescription' | 'ProductBrand' | 'ProductColor' | 'OrderNumber' | 'Seller' | 'OrderStatus' | 'AddressName' | 'StreetAddress' | 'AddressLocality' | 'AddressRegion' | 'AddressCountry' | 'PostalCode'>
    )>>, FlightResevations?: Types.Maybe<Array<(
      { __typename?: 'FlightReservationEntity' }
      & Pick<Types.FlightReservationEntity, 'Position' | 'ReservationId' | 'ReservationStatus' | 'UnderName' | 'BrokerName' | 'BrokerPhone'>
      & { Flights?: Types.Maybe<Array<(
        { __typename?: 'TxpFlight' }
        & Pick<Types.TxpFlight, 'Position' | 'FlightNumber' | 'AirlineIataCode' | 'DepartureTime' | 'WindowsTimeZoneName' | 'DepartureAirportIataCode' | 'ArrivalAirportIataCode'>
      )>> }
    )>>, SenderAddIns?: Types.Maybe<Array<(
      { __typename?: 'SenderAddInEntity' }
      & Pick<Types.SenderAddInEntity, 'Position' | 'ExtensionId'>
    )>> }
  )>, ErrorProperties?: Types.Maybe<Array<(
    { __typename?: 'PropertyError' }
    & Pick<Types.PropertyError, 'ErrorCode'>
    & { PropertyPath?: Types.Maybe<(
      { __typename?: 'BuiltInPropertyUri' }
      & Pick<Types.BuiltInPropertyUri, 'FieldURI'>
    ) | (
      { __typename?: 'ExtendedPropertyUri' }
      & Pick<Types.ExtendedPropertyUri, 'DistinguishedPropertySetId' | 'PropertySetId' | 'PropertyTag' | 'PropertyName' | 'PropertyId' | 'PropertyType'>
    )> }
  )>>, ExtendedProperty?: Types.Maybe<Array<(
    { __typename?: 'ExtendedProperty' }
    & Pick<Types.ExtendedProperty, 'Value' | 'Values'>
    & { ExtendedFieldURI?: Types.Maybe<(
      { __typename?: 'ExtendedPropertyUri' }
      & Pick<Types.ExtendedPropertyUri, 'DistinguishedPropertySetId' | 'PropertySetId' | 'PropertyTag' | 'PropertyName' | 'PropertyId' | 'PropertyType'>
    )> }
  )>>, FirstBody?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )>, Flag?: Types.Maybe<(
    { __typename?: 'Flag' }
    & Pick<Types.Flag, 'FlagStatus' | 'StartDate' | 'DueDate' | 'CompleteDate'>
  )>, MentionsEx?: Types.Maybe<Array<(
    { __typename?: 'MentionActionWrapper' }
    & Pick<Types.MentionActionWrapper, 'Mentioned' | 'MentionText' | 'ClientReference'>
  )>>, MentionsPreview?: Types.Maybe<(
    { __typename?: 'MentionsPreviewWrapper' }
    & Pick<Types.MentionsPreviewWrapper, 'IsMentioned'>
  )>, MimeContent?: Types.Maybe<(
    { __typename?: 'MimeContentType' }
    & Pick<Types.MimeContentType, 'CharacterSet' | 'Value'>
  )>, NormalizedBody?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )>, PolicyTag?: Types.Maybe<(
    { __typename?: 'RetentionTagType' }
    & Pick<Types.RetentionTagType, 'IsExplicit' | 'Value'>
  )>, PropertyExistence?: Types.Maybe<(
    { __typename?: 'PropertyExistence' }
    & Pick<Types.PropertyExistence, 'ExtractedAddresses' | 'ExtractedContacts' | 'ExtractedEmails' | 'ExtractedKeywords' | 'ExtractedMeetings' | 'ExtractedPhones' | 'ExtractedTasks' | 'ExtractedUrls' | 'WebExtNotifications' | 'TextEntityExtractions' | 'ReplyToNames' | 'ReplyToBlob' | 'UserHighlightData'>
  )>, ResponseObjects?: Types.Maybe<Array<(
    { __typename?: 'ResponseObject' }
    & Pick<Types.ResponseObject, 'ObjectName' | 'ReferenceItemId'>
  )>>, RightsManagementLicenseData?: Types.Maybe<(
    { __typename?: 'RightsManagementLicenseData' }
    & Pick<Types.RightsManagementLicenseData, 'RightsManagedMessageDecryptionStatus' | 'RmsTemplateId' | 'TemplateName' | 'TemplateDescription' | 'EditAllowed' | 'ReplyAllowed' | 'ReplyAllAllowed' | 'ForwardAllowed' | 'ModifyRecipientsAllowed' | 'ExtractAllowed' | 'PrintAllowed' | 'ExportAllowed' | 'ProgrammaticAccessAllowed' | 'IsOwner' | 'ContentOwner' | 'ContentExpiryDate' | 'BodyType'>
  )>, UniqueBody?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )>, UniqueBottomFragment?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )>, UniqueTopFragment?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )> }
);

export type AllGenericItemFields_Item_Fragment = (
  { __typename?: 'Item' }
  & Pick<Types.Item, 'ItemId' | 'ConversationId' | 'ParentFolderId' | 'BlockStatus' | 'CanDelete' | 'Categories' | 'ContainsOnlyMandatoryProperties' | 'ConversationThreadId' | 'DateTimeCreated' | 'DateTimeReceived' | 'DateTimeSent' | 'DeferredSendTime' | 'DisplayBcc' | 'DisplayCc' | 'DisplayTo' | 'EntityDocument' | 'EntityNamesMap' | 'ExtensibleContentData' | 'HasAttachments' | 'HasBlockedImages' | 'Hashtags' | 'HasProcessedSharepointLink' | 'HasQuotedText' | 'IconIndex' | 'id' | 'Importance' | 'InferenceClassification' | 'InReplyTo' | 'InstanceKey' | 'IsDraft' | 'IsExternalSender' | 'IsFromMe' | 'IsLocked' | 'IsSubmitted' | 'ItemClass' | 'LastModifiedTime' | 'MentionedMe' | 'Mentions' | 'MSIPLabelGuid' | 'PendingSocialActivityTagIds' | 'Preview' | 'QuotedTextList' | 'ReceivedOrRenewTime' | 'ReminderIsSet' | 'ReminderMinutesBeforeStart' | 'RetentionDate' | 'ReturnTime' | 'Sensitivity' | 'SerializedImmutableId' | 'Size' | 'SortOrderSource' | 'Subject' | 'SystemCategories' | 'TailoredXpEntities' | 'TailoredXpEntitiesChangeNumber' | 'TrimmedQuotedText' | 'UserHighlightData' | 'YammerNotification'>
  & { Apps?: Types.Maybe<Array<(
    { __typename?: 'AddinsApp' }
    & Pick<Types.AddinsApp, 'Id'>
    & { Notifications?: Types.Maybe<Array<(
      { __typename?: 'Notification' }
      & Pick<Types.Notification, 'Key' | 'Type' | 'Message' | 'Icon'>
    )>> }
  )>>, ArchiveTag?: Types.Maybe<(
    { __typename?: 'RetentionTagType' }
    & Pick<Types.RetentionTagType, 'IsExplicit' | 'Value'>
  )>, Attachments?: Types.Maybe<Array<(
    { __typename?: 'BasicAttachment' }
    & Pick<Types.BasicAttachment, 'OwsTypeName' | 'AttachmentOriginalUrl' | 'ContentId' | 'ContentLocation' | 'ContentType' | 'id' | 'IsInline' | 'IsInlineToNormalBody' | 'IsInlineToUniqueBody' | 'LastModifiedTime' | 'Name' | 'Size' | 'Thumbnail' | 'ThumbnailMimeType'>
    & { AttachmentId?: Types.Maybe<(
      { __typename?: 'AttachmentId' }
      & Pick<Types.AttachmentId, 'Id'>
    )> }
  ) | (
    { __typename?: 'ReferenceAttachment' }
    & Pick<Types.ReferenceAttachment, 'ProviderType' | 'WebUrl' | 'AttachLongPathName' | 'AttachmentThumbnailUrl' | 'AttachmentPreviewUrl' | 'OwsTypeName' | 'AttachmentOriginalUrl' | 'ContentId' | 'ContentLocation' | 'ContentType' | 'id' | 'IsInline' | 'IsInlineToNormalBody' | 'IsInlineToUniqueBody' | 'LastModifiedTime' | 'Name' | 'Size' | 'Thumbnail' | 'ThumbnailMimeType'>
    & { AttachmentId?: Types.Maybe<(
      { __typename?: 'AttachmentId' }
      & Pick<Types.AttachmentId, 'Id'>
    )> }
  )>>, Body?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )>, Conversation?: Types.Maybe<(
    { __typename?: 'ConversationType' }
    & Pick<Types.ConversationType, 'ConversationId' | 'ConversationTopic' | 'UniqueRecipients' | 'UniqueSenders' | 'LastDeliveryTime' | 'Categories' | 'FlagStatus' | 'HasAttachments' | 'MessageCount' | 'GlobalMessageCount' | 'UnreadCount' | 'GlobalUnreadCount' | 'Size' | 'ItemClasses' | 'Importance' | 'ItemIds' | 'GlobalItemIds' | 'LastModifiedTime' | 'InstanceKey' | 'Preview' | 'IconIndex' | 'DraftItemIds' | 'HasIrm' | 'GlobalLikeCount' | 'LastDeliveryOrRenewTime' | 'GlobalMentionedMe' | 'GlobalAtAllMention' | 'SortOrderSource' | 'LastSender' | 'From' | 'EntityNamesMap' | 'HasExternalEmails' | 'ReturnTime' | 'HasSharepointLink' | 'HasAttachmentPreviews' | 'HasProcessedSharepointLink' | 'CouponRanks' | 'CouponExpiryDates' | 'mentionedMe'>
    & { ParentFolderId?: Types.Maybe<(
      { __typename?: 'FolderId' }
      & Pick<Types.FolderId, 'Id'>
    )> }
  )>, DocLinks?: Types.Maybe<Array<(
    { __typename?: 'DocLink' }
    & Pick<Types.DocLink, 'ProviderType' | 'Url' | 'PermissionType'>
  )>>, EffectiveRights?: Types.Maybe<(
    { __typename?: 'EffectiveRightsType' }
    & Pick<Types.EffectiveRightsType, 'CreateAssociated' | 'CreateContents' | 'CreateHierarchy' | 'Delete' | 'Modify' | 'Read' | 'ViewPrivateItems'>
  )>, EntityExtractionResult?: Types.Maybe<(
    { __typename?: 'EntityExtractionResult' }
    & Pick<Types.EntityExtractionResult, 'BusinessNames' | 'PeopleNames'>
    & { Addresses?: Types.Maybe<Array<(
      { __typename?: 'AddressEntity' }
      & Pick<Types.AddressEntity, 'Position' | 'Address'>
    )>>, MeetingSuggestions?: Types.Maybe<Array<(
      { __typename?: 'MeetingSuggestion' }
      & Pick<Types.MeetingSuggestion, 'Position' | 'Location' | 'Subject' | 'MeetingString' | 'TimeStringBeginIndex' | 'TimeStringLength' | 'EntityId' | 'ExtractionId' | 'StartTime' | 'EndTime'>
      & { Attendees?: Types.Maybe<Array<(
        { __typename?: 'TxpEmailUser' }
        & Pick<Types.TxpEmailUser, 'Name' | 'UserId'>
      )>> }
    )>>, TaskSuggestions?: Types.Maybe<Array<(
      { __typename?: 'TaskSuggestion' }
      & Pick<Types.TaskSuggestion, 'Position' | 'TaskString'>
      & { Assignees?: Types.Maybe<Array<(
        { __typename?: 'TxpEmailUser' }
        & Pick<Types.TxpEmailUser, 'Name' | 'UserId'>
      )>> }
    )>>, EmailAddresses?: Types.Maybe<Array<(
      { __typename?: 'EmailAddressEntity' }
      & Pick<Types.EmailAddressEntity, 'Position' | 'EmailAddress'>
    )>>, Contacts?: Types.Maybe<Array<(
      { __typename?: 'Contact' }
      & Pick<Types.Contact, 'Position' | 'PersonName' | 'BusinessName' | 'Urls' | 'EmailAddresses' | 'Addresses' | 'ContactString' | 'ContactGroupsGuids'>
      & { PhoneNumbers?: Types.Maybe<Array<(
        { __typename?: 'Phone' }
        & Pick<Types.Phone, 'OriginalPhoneString' | 'PhoneString' | 'Type'>
      )>> }
    )>>, Urls?: Types.Maybe<Array<(
      { __typename?: 'UrlEntity' }
      & Pick<Types.UrlEntity, 'Position' | 'Url'>
    )>>, PhoneNumbers?: Types.Maybe<Array<(
      { __typename?: 'PhoneEntity' }
      & Pick<Types.PhoneEntity, 'Position' | 'OriginalPhoneString' | 'PhoneString' | 'Type'>
    )>>, ParcelDeliveries?: Types.Maybe<Array<(
      { __typename?: 'ParcelDeliveryEntity' }
      & Pick<Types.ParcelDeliveryEntity, 'Position' | 'Carrier' | 'TrackingNumber' | 'TrackingUrl' | 'ExpectedArrivalFrom' | 'ExpectedArrivalUntil' | 'Product' | 'ProductUrl' | 'ProductImage' | 'ProductSku' | 'ProductDescription' | 'ProductBrand' | 'ProductColor' | 'OrderNumber' | 'Seller' | 'OrderStatus' | 'AddressName' | 'StreetAddress' | 'AddressLocality' | 'AddressRegion' | 'AddressCountry' | 'PostalCode'>
    )>>, FlightResevations?: Types.Maybe<Array<(
      { __typename?: 'FlightReservationEntity' }
      & Pick<Types.FlightReservationEntity, 'Position' | 'ReservationId' | 'ReservationStatus' | 'UnderName' | 'BrokerName' | 'BrokerPhone'>
      & { Flights?: Types.Maybe<Array<(
        { __typename?: 'TxpFlight' }
        & Pick<Types.TxpFlight, 'Position' | 'FlightNumber' | 'AirlineIataCode' | 'DepartureTime' | 'WindowsTimeZoneName' | 'DepartureAirportIataCode' | 'ArrivalAirportIataCode'>
      )>> }
    )>>, SenderAddIns?: Types.Maybe<Array<(
      { __typename?: 'SenderAddInEntity' }
      & Pick<Types.SenderAddInEntity, 'Position' | 'ExtensionId'>
    )>> }
  )>, ErrorProperties?: Types.Maybe<Array<(
    { __typename?: 'PropertyError' }
    & Pick<Types.PropertyError, 'ErrorCode'>
    & { PropertyPath?: Types.Maybe<(
      { __typename?: 'BuiltInPropertyUri' }
      & Pick<Types.BuiltInPropertyUri, 'FieldURI'>
    ) | (
      { __typename?: 'ExtendedPropertyUri' }
      & Pick<Types.ExtendedPropertyUri, 'DistinguishedPropertySetId' | 'PropertySetId' | 'PropertyTag' | 'PropertyName' | 'PropertyId' | 'PropertyType'>
    )> }
  )>>, ExtendedProperty?: Types.Maybe<Array<(
    { __typename?: 'ExtendedProperty' }
    & Pick<Types.ExtendedProperty, 'Value' | 'Values'>
    & { ExtendedFieldURI?: Types.Maybe<(
      { __typename?: 'ExtendedPropertyUri' }
      & Pick<Types.ExtendedPropertyUri, 'DistinguishedPropertySetId' | 'PropertySetId' | 'PropertyTag' | 'PropertyName' | 'PropertyId' | 'PropertyType'>
    )> }
  )>>, FirstBody?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )>, Flag?: Types.Maybe<(
    { __typename?: 'Flag' }
    & Pick<Types.Flag, 'FlagStatus' | 'StartDate' | 'DueDate' | 'CompleteDate'>
  )>, MentionsEx?: Types.Maybe<Array<(
    { __typename?: 'MentionActionWrapper' }
    & Pick<Types.MentionActionWrapper, 'Mentioned' | 'MentionText' | 'ClientReference'>
  )>>, MentionsPreview?: Types.Maybe<(
    { __typename?: 'MentionsPreviewWrapper' }
    & Pick<Types.MentionsPreviewWrapper, 'IsMentioned'>
  )>, MimeContent?: Types.Maybe<(
    { __typename?: 'MimeContentType' }
    & Pick<Types.MimeContentType, 'CharacterSet' | 'Value'>
  )>, NormalizedBody?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )>, PolicyTag?: Types.Maybe<(
    { __typename?: 'RetentionTagType' }
    & Pick<Types.RetentionTagType, 'IsExplicit' | 'Value'>
  )>, PropertyExistence?: Types.Maybe<(
    { __typename?: 'PropertyExistence' }
    & Pick<Types.PropertyExistence, 'ExtractedAddresses' | 'ExtractedContacts' | 'ExtractedEmails' | 'ExtractedKeywords' | 'ExtractedMeetings' | 'ExtractedPhones' | 'ExtractedTasks' | 'ExtractedUrls' | 'WebExtNotifications' | 'TextEntityExtractions' | 'ReplyToNames' | 'ReplyToBlob' | 'UserHighlightData'>
  )>, ResponseObjects?: Types.Maybe<Array<(
    { __typename?: 'ResponseObject' }
    & Pick<Types.ResponseObject, 'ObjectName' | 'ReferenceItemId'>
  )>>, RightsManagementLicenseData?: Types.Maybe<(
    { __typename?: 'RightsManagementLicenseData' }
    & Pick<Types.RightsManagementLicenseData, 'RightsManagedMessageDecryptionStatus' | 'RmsTemplateId' | 'TemplateName' | 'TemplateDescription' | 'EditAllowed' | 'ReplyAllowed' | 'ReplyAllAllowed' | 'ForwardAllowed' | 'ModifyRecipientsAllowed' | 'ExtractAllowed' | 'PrintAllowed' | 'ExportAllowed' | 'ProgrammaticAccessAllowed' | 'IsOwner' | 'ContentOwner' | 'ContentExpiryDate' | 'BodyType'>
  )>, UniqueBody?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )>, UniqueBottomFragment?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )>, UniqueTopFragment?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )> }
);

export type AllGenericItemFields_MeetingCancellationMessage_Fragment = (
  { __typename?: 'MeetingCancellationMessage' }
  & Pick<Types.MeetingCancellationMessage, 'ItemId' | 'ConversationId' | 'ParentFolderId' | 'BlockStatus' | 'CanDelete' | 'Categories' | 'ContainsOnlyMandatoryProperties' | 'ConversationThreadId' | 'DateTimeCreated' | 'DateTimeReceived' | 'DateTimeSent' | 'DeferredSendTime' | 'DisplayBcc' | 'DisplayCc' | 'DisplayTo' | 'EntityDocument' | 'EntityNamesMap' | 'ExtensibleContentData' | 'HasAttachments' | 'HasBlockedImages' | 'Hashtags' | 'HasProcessedSharepointLink' | 'HasQuotedText' | 'IconIndex' | 'id' | 'Importance' | 'InferenceClassification' | 'InReplyTo' | 'InstanceKey' | 'IsDraft' | 'IsExternalSender' | 'IsFromMe' | 'IsLocked' | 'IsSubmitted' | 'ItemClass' | 'LastModifiedTime' | 'MentionedMe' | 'Mentions' | 'MSIPLabelGuid' | 'PendingSocialActivityTagIds' | 'Preview' | 'QuotedTextList' | 'ReceivedOrRenewTime' | 'ReminderIsSet' | 'ReminderMinutesBeforeStart' | 'RetentionDate' | 'ReturnTime' | 'Sensitivity' | 'SerializedImmutableId' | 'Size' | 'SortOrderSource' | 'Subject' | 'SystemCategories' | 'TailoredXpEntities' | 'TailoredXpEntitiesChangeNumber' | 'TrimmedQuotedText' | 'UserHighlightData' | 'YammerNotification'>
  & { Apps?: Types.Maybe<Array<(
    { __typename?: 'AddinsApp' }
    & Pick<Types.AddinsApp, 'Id'>
    & { Notifications?: Types.Maybe<Array<(
      { __typename?: 'Notification' }
      & Pick<Types.Notification, 'Key' | 'Type' | 'Message' | 'Icon'>
    )>> }
  )>>, ArchiveTag?: Types.Maybe<(
    { __typename?: 'RetentionTagType' }
    & Pick<Types.RetentionTagType, 'IsExplicit' | 'Value'>
  )>, Attachments?: Types.Maybe<Array<(
    { __typename?: 'BasicAttachment' }
    & Pick<Types.BasicAttachment, 'OwsTypeName' | 'AttachmentOriginalUrl' | 'ContentId' | 'ContentLocation' | 'ContentType' | 'id' | 'IsInline' | 'IsInlineToNormalBody' | 'IsInlineToUniqueBody' | 'LastModifiedTime' | 'Name' | 'Size' | 'Thumbnail' | 'ThumbnailMimeType'>
    & { AttachmentId?: Types.Maybe<(
      { __typename?: 'AttachmentId' }
      & Pick<Types.AttachmentId, 'Id'>
    )> }
  ) | (
    { __typename?: 'ReferenceAttachment' }
    & Pick<Types.ReferenceAttachment, 'ProviderType' | 'WebUrl' | 'AttachLongPathName' | 'AttachmentThumbnailUrl' | 'AttachmentPreviewUrl' | 'OwsTypeName' | 'AttachmentOriginalUrl' | 'ContentId' | 'ContentLocation' | 'ContentType' | 'id' | 'IsInline' | 'IsInlineToNormalBody' | 'IsInlineToUniqueBody' | 'LastModifiedTime' | 'Name' | 'Size' | 'Thumbnail' | 'ThumbnailMimeType'>
    & { AttachmentId?: Types.Maybe<(
      { __typename?: 'AttachmentId' }
      & Pick<Types.AttachmentId, 'Id'>
    )> }
  )>>, Body?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )>, Conversation?: Types.Maybe<(
    { __typename?: 'ConversationType' }
    & Pick<Types.ConversationType, 'ConversationId' | 'ConversationTopic' | 'UniqueRecipients' | 'UniqueSenders' | 'LastDeliveryTime' | 'Categories' | 'FlagStatus' | 'HasAttachments' | 'MessageCount' | 'GlobalMessageCount' | 'UnreadCount' | 'GlobalUnreadCount' | 'Size' | 'ItemClasses' | 'Importance' | 'ItemIds' | 'GlobalItemIds' | 'LastModifiedTime' | 'InstanceKey' | 'Preview' | 'IconIndex' | 'DraftItemIds' | 'HasIrm' | 'GlobalLikeCount' | 'LastDeliveryOrRenewTime' | 'GlobalMentionedMe' | 'GlobalAtAllMention' | 'SortOrderSource' | 'LastSender' | 'From' | 'EntityNamesMap' | 'HasExternalEmails' | 'ReturnTime' | 'HasSharepointLink' | 'HasAttachmentPreviews' | 'HasProcessedSharepointLink' | 'CouponRanks' | 'CouponExpiryDates' | 'mentionedMe'>
    & { ParentFolderId?: Types.Maybe<(
      { __typename?: 'FolderId' }
      & Pick<Types.FolderId, 'Id'>
    )> }
  )>, DocLinks?: Types.Maybe<Array<(
    { __typename?: 'DocLink' }
    & Pick<Types.DocLink, 'ProviderType' | 'Url' | 'PermissionType'>
  )>>, EffectiveRights?: Types.Maybe<(
    { __typename?: 'EffectiveRightsType' }
    & Pick<Types.EffectiveRightsType, 'CreateAssociated' | 'CreateContents' | 'CreateHierarchy' | 'Delete' | 'Modify' | 'Read' | 'ViewPrivateItems'>
  )>, EntityExtractionResult?: Types.Maybe<(
    { __typename?: 'EntityExtractionResult' }
    & Pick<Types.EntityExtractionResult, 'BusinessNames' | 'PeopleNames'>
    & { Addresses?: Types.Maybe<Array<(
      { __typename?: 'AddressEntity' }
      & Pick<Types.AddressEntity, 'Position' | 'Address'>
    )>>, MeetingSuggestions?: Types.Maybe<Array<(
      { __typename?: 'MeetingSuggestion' }
      & Pick<Types.MeetingSuggestion, 'Position' | 'Location' | 'Subject' | 'MeetingString' | 'TimeStringBeginIndex' | 'TimeStringLength' | 'EntityId' | 'ExtractionId' | 'StartTime' | 'EndTime'>
      & { Attendees?: Types.Maybe<Array<(
        { __typename?: 'TxpEmailUser' }
        & Pick<Types.TxpEmailUser, 'Name' | 'UserId'>
      )>> }
    )>>, TaskSuggestions?: Types.Maybe<Array<(
      { __typename?: 'TaskSuggestion' }
      & Pick<Types.TaskSuggestion, 'Position' | 'TaskString'>
      & { Assignees?: Types.Maybe<Array<(
        { __typename?: 'TxpEmailUser' }
        & Pick<Types.TxpEmailUser, 'Name' | 'UserId'>
      )>> }
    )>>, EmailAddresses?: Types.Maybe<Array<(
      { __typename?: 'EmailAddressEntity' }
      & Pick<Types.EmailAddressEntity, 'Position' | 'EmailAddress'>
    )>>, Contacts?: Types.Maybe<Array<(
      { __typename?: 'Contact' }
      & Pick<Types.Contact, 'Position' | 'PersonName' | 'BusinessName' | 'Urls' | 'EmailAddresses' | 'Addresses' | 'ContactString' | 'ContactGroupsGuids'>
      & { PhoneNumbers?: Types.Maybe<Array<(
        { __typename?: 'Phone' }
        & Pick<Types.Phone, 'OriginalPhoneString' | 'PhoneString' | 'Type'>
      )>> }
    )>>, Urls?: Types.Maybe<Array<(
      { __typename?: 'UrlEntity' }
      & Pick<Types.UrlEntity, 'Position' | 'Url'>
    )>>, PhoneNumbers?: Types.Maybe<Array<(
      { __typename?: 'PhoneEntity' }
      & Pick<Types.PhoneEntity, 'Position' | 'OriginalPhoneString' | 'PhoneString' | 'Type'>
    )>>, ParcelDeliveries?: Types.Maybe<Array<(
      { __typename?: 'ParcelDeliveryEntity' }
      & Pick<Types.ParcelDeliveryEntity, 'Position' | 'Carrier' | 'TrackingNumber' | 'TrackingUrl' | 'ExpectedArrivalFrom' | 'ExpectedArrivalUntil' | 'Product' | 'ProductUrl' | 'ProductImage' | 'ProductSku' | 'ProductDescription' | 'ProductBrand' | 'ProductColor' | 'OrderNumber' | 'Seller' | 'OrderStatus' | 'AddressName' | 'StreetAddress' | 'AddressLocality' | 'AddressRegion' | 'AddressCountry' | 'PostalCode'>
    )>>, FlightResevations?: Types.Maybe<Array<(
      { __typename?: 'FlightReservationEntity' }
      & Pick<Types.FlightReservationEntity, 'Position' | 'ReservationId' | 'ReservationStatus' | 'UnderName' | 'BrokerName' | 'BrokerPhone'>
      & { Flights?: Types.Maybe<Array<(
        { __typename?: 'TxpFlight' }
        & Pick<Types.TxpFlight, 'Position' | 'FlightNumber' | 'AirlineIataCode' | 'DepartureTime' | 'WindowsTimeZoneName' | 'DepartureAirportIataCode' | 'ArrivalAirportIataCode'>
      )>> }
    )>>, SenderAddIns?: Types.Maybe<Array<(
      { __typename?: 'SenderAddInEntity' }
      & Pick<Types.SenderAddInEntity, 'Position' | 'ExtensionId'>
    )>> }
  )>, ErrorProperties?: Types.Maybe<Array<(
    { __typename?: 'PropertyError' }
    & Pick<Types.PropertyError, 'ErrorCode'>
    & { PropertyPath?: Types.Maybe<(
      { __typename?: 'BuiltInPropertyUri' }
      & Pick<Types.BuiltInPropertyUri, 'FieldURI'>
    ) | (
      { __typename?: 'ExtendedPropertyUri' }
      & Pick<Types.ExtendedPropertyUri, 'DistinguishedPropertySetId' | 'PropertySetId' | 'PropertyTag' | 'PropertyName' | 'PropertyId' | 'PropertyType'>
    )> }
  )>>, ExtendedProperty?: Types.Maybe<Array<(
    { __typename?: 'ExtendedProperty' }
    & Pick<Types.ExtendedProperty, 'Value' | 'Values'>
    & { ExtendedFieldURI?: Types.Maybe<(
      { __typename?: 'ExtendedPropertyUri' }
      & Pick<Types.ExtendedPropertyUri, 'DistinguishedPropertySetId' | 'PropertySetId' | 'PropertyTag' | 'PropertyName' | 'PropertyId' | 'PropertyType'>
    )> }
  )>>, FirstBody?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )>, Flag?: Types.Maybe<(
    { __typename?: 'Flag' }
    & Pick<Types.Flag, 'FlagStatus' | 'StartDate' | 'DueDate' | 'CompleteDate'>
  )>, MentionsEx?: Types.Maybe<Array<(
    { __typename?: 'MentionActionWrapper' }
    & Pick<Types.MentionActionWrapper, 'Mentioned' | 'MentionText' | 'ClientReference'>
  )>>, MentionsPreview?: Types.Maybe<(
    { __typename?: 'MentionsPreviewWrapper' }
    & Pick<Types.MentionsPreviewWrapper, 'IsMentioned'>
  )>, MimeContent?: Types.Maybe<(
    { __typename?: 'MimeContentType' }
    & Pick<Types.MimeContentType, 'CharacterSet' | 'Value'>
  )>, NormalizedBody?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )>, PolicyTag?: Types.Maybe<(
    { __typename?: 'RetentionTagType' }
    & Pick<Types.RetentionTagType, 'IsExplicit' | 'Value'>
  )>, PropertyExistence?: Types.Maybe<(
    { __typename?: 'PropertyExistence' }
    & Pick<Types.PropertyExistence, 'ExtractedAddresses' | 'ExtractedContacts' | 'ExtractedEmails' | 'ExtractedKeywords' | 'ExtractedMeetings' | 'ExtractedPhones' | 'ExtractedTasks' | 'ExtractedUrls' | 'WebExtNotifications' | 'TextEntityExtractions' | 'ReplyToNames' | 'ReplyToBlob' | 'UserHighlightData'>
  )>, ResponseObjects?: Types.Maybe<Array<(
    { __typename?: 'ResponseObject' }
    & Pick<Types.ResponseObject, 'ObjectName' | 'ReferenceItemId'>
  )>>, RightsManagementLicenseData?: Types.Maybe<(
    { __typename?: 'RightsManagementLicenseData' }
    & Pick<Types.RightsManagementLicenseData, 'RightsManagedMessageDecryptionStatus' | 'RmsTemplateId' | 'TemplateName' | 'TemplateDescription' | 'EditAllowed' | 'ReplyAllowed' | 'ReplyAllAllowed' | 'ForwardAllowed' | 'ModifyRecipientsAllowed' | 'ExtractAllowed' | 'PrintAllowed' | 'ExportAllowed' | 'ProgrammaticAccessAllowed' | 'IsOwner' | 'ContentOwner' | 'ContentExpiryDate' | 'BodyType'>
  )>, UniqueBody?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )>, UniqueBottomFragment?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )>, UniqueTopFragment?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )> }
);

export type AllGenericItemFields_MeetingMessage_Fragment = (
  { __typename?: 'MeetingMessage' }
  & Pick<Types.MeetingMessage, 'ItemId' | 'ConversationId' | 'ParentFolderId' | 'BlockStatus' | 'CanDelete' | 'Categories' | 'ContainsOnlyMandatoryProperties' | 'ConversationThreadId' | 'DateTimeCreated' | 'DateTimeReceived' | 'DateTimeSent' | 'DeferredSendTime' | 'DisplayBcc' | 'DisplayCc' | 'DisplayTo' | 'EntityDocument' | 'EntityNamesMap' | 'ExtensibleContentData' | 'HasAttachments' | 'HasBlockedImages' | 'Hashtags' | 'HasProcessedSharepointLink' | 'HasQuotedText' | 'IconIndex' | 'id' | 'Importance' | 'InferenceClassification' | 'InReplyTo' | 'InstanceKey' | 'IsDraft' | 'IsExternalSender' | 'IsFromMe' | 'IsLocked' | 'IsSubmitted' | 'ItemClass' | 'LastModifiedTime' | 'MentionedMe' | 'Mentions' | 'MSIPLabelGuid' | 'PendingSocialActivityTagIds' | 'Preview' | 'QuotedTextList' | 'ReceivedOrRenewTime' | 'ReminderIsSet' | 'ReminderMinutesBeforeStart' | 'RetentionDate' | 'ReturnTime' | 'Sensitivity' | 'SerializedImmutableId' | 'Size' | 'SortOrderSource' | 'Subject' | 'SystemCategories' | 'TailoredXpEntities' | 'TailoredXpEntitiesChangeNumber' | 'TrimmedQuotedText' | 'UserHighlightData' | 'YammerNotification'>
  & { Apps?: Types.Maybe<Array<(
    { __typename?: 'AddinsApp' }
    & Pick<Types.AddinsApp, 'Id'>
    & { Notifications?: Types.Maybe<Array<(
      { __typename?: 'Notification' }
      & Pick<Types.Notification, 'Key' | 'Type' | 'Message' | 'Icon'>
    )>> }
  )>>, ArchiveTag?: Types.Maybe<(
    { __typename?: 'RetentionTagType' }
    & Pick<Types.RetentionTagType, 'IsExplicit' | 'Value'>
  )>, Attachments?: Types.Maybe<Array<(
    { __typename?: 'BasicAttachment' }
    & Pick<Types.BasicAttachment, 'OwsTypeName' | 'AttachmentOriginalUrl' | 'ContentId' | 'ContentLocation' | 'ContentType' | 'id' | 'IsInline' | 'IsInlineToNormalBody' | 'IsInlineToUniqueBody' | 'LastModifiedTime' | 'Name' | 'Size' | 'Thumbnail' | 'ThumbnailMimeType'>
    & { AttachmentId?: Types.Maybe<(
      { __typename?: 'AttachmentId' }
      & Pick<Types.AttachmentId, 'Id'>
    )> }
  ) | (
    { __typename?: 'ReferenceAttachment' }
    & Pick<Types.ReferenceAttachment, 'ProviderType' | 'WebUrl' | 'AttachLongPathName' | 'AttachmentThumbnailUrl' | 'AttachmentPreviewUrl' | 'OwsTypeName' | 'AttachmentOriginalUrl' | 'ContentId' | 'ContentLocation' | 'ContentType' | 'id' | 'IsInline' | 'IsInlineToNormalBody' | 'IsInlineToUniqueBody' | 'LastModifiedTime' | 'Name' | 'Size' | 'Thumbnail' | 'ThumbnailMimeType'>
    & { AttachmentId?: Types.Maybe<(
      { __typename?: 'AttachmentId' }
      & Pick<Types.AttachmentId, 'Id'>
    )> }
  )>>, Body?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )>, Conversation?: Types.Maybe<(
    { __typename?: 'ConversationType' }
    & Pick<Types.ConversationType, 'ConversationId' | 'ConversationTopic' | 'UniqueRecipients' | 'UniqueSenders' | 'LastDeliveryTime' | 'Categories' | 'FlagStatus' | 'HasAttachments' | 'MessageCount' | 'GlobalMessageCount' | 'UnreadCount' | 'GlobalUnreadCount' | 'Size' | 'ItemClasses' | 'Importance' | 'ItemIds' | 'GlobalItemIds' | 'LastModifiedTime' | 'InstanceKey' | 'Preview' | 'IconIndex' | 'DraftItemIds' | 'HasIrm' | 'GlobalLikeCount' | 'LastDeliveryOrRenewTime' | 'GlobalMentionedMe' | 'GlobalAtAllMention' | 'SortOrderSource' | 'LastSender' | 'From' | 'EntityNamesMap' | 'HasExternalEmails' | 'ReturnTime' | 'HasSharepointLink' | 'HasAttachmentPreviews' | 'HasProcessedSharepointLink' | 'CouponRanks' | 'CouponExpiryDates' | 'mentionedMe'>
    & { ParentFolderId?: Types.Maybe<(
      { __typename?: 'FolderId' }
      & Pick<Types.FolderId, 'Id'>
    )> }
  )>, DocLinks?: Types.Maybe<Array<(
    { __typename?: 'DocLink' }
    & Pick<Types.DocLink, 'ProviderType' | 'Url' | 'PermissionType'>
  )>>, EffectiveRights?: Types.Maybe<(
    { __typename?: 'EffectiveRightsType' }
    & Pick<Types.EffectiveRightsType, 'CreateAssociated' | 'CreateContents' | 'CreateHierarchy' | 'Delete' | 'Modify' | 'Read' | 'ViewPrivateItems'>
  )>, EntityExtractionResult?: Types.Maybe<(
    { __typename?: 'EntityExtractionResult' }
    & Pick<Types.EntityExtractionResult, 'BusinessNames' | 'PeopleNames'>
    & { Addresses?: Types.Maybe<Array<(
      { __typename?: 'AddressEntity' }
      & Pick<Types.AddressEntity, 'Position' | 'Address'>
    )>>, MeetingSuggestions?: Types.Maybe<Array<(
      { __typename?: 'MeetingSuggestion' }
      & Pick<Types.MeetingSuggestion, 'Position' | 'Location' | 'Subject' | 'MeetingString' | 'TimeStringBeginIndex' | 'TimeStringLength' | 'EntityId' | 'ExtractionId' | 'StartTime' | 'EndTime'>
      & { Attendees?: Types.Maybe<Array<(
        { __typename?: 'TxpEmailUser' }
        & Pick<Types.TxpEmailUser, 'Name' | 'UserId'>
      )>> }
    )>>, TaskSuggestions?: Types.Maybe<Array<(
      { __typename?: 'TaskSuggestion' }
      & Pick<Types.TaskSuggestion, 'Position' | 'TaskString'>
      & { Assignees?: Types.Maybe<Array<(
        { __typename?: 'TxpEmailUser' }
        & Pick<Types.TxpEmailUser, 'Name' | 'UserId'>
      )>> }
    )>>, EmailAddresses?: Types.Maybe<Array<(
      { __typename?: 'EmailAddressEntity' }
      & Pick<Types.EmailAddressEntity, 'Position' | 'EmailAddress'>
    )>>, Contacts?: Types.Maybe<Array<(
      { __typename?: 'Contact' }
      & Pick<Types.Contact, 'Position' | 'PersonName' | 'BusinessName' | 'Urls' | 'EmailAddresses' | 'Addresses' | 'ContactString' | 'ContactGroupsGuids'>
      & { PhoneNumbers?: Types.Maybe<Array<(
        { __typename?: 'Phone' }
        & Pick<Types.Phone, 'OriginalPhoneString' | 'PhoneString' | 'Type'>
      )>> }
    )>>, Urls?: Types.Maybe<Array<(
      { __typename?: 'UrlEntity' }
      & Pick<Types.UrlEntity, 'Position' | 'Url'>
    )>>, PhoneNumbers?: Types.Maybe<Array<(
      { __typename?: 'PhoneEntity' }
      & Pick<Types.PhoneEntity, 'Position' | 'OriginalPhoneString' | 'PhoneString' | 'Type'>
    )>>, ParcelDeliveries?: Types.Maybe<Array<(
      { __typename?: 'ParcelDeliveryEntity' }
      & Pick<Types.ParcelDeliveryEntity, 'Position' | 'Carrier' | 'TrackingNumber' | 'TrackingUrl' | 'ExpectedArrivalFrom' | 'ExpectedArrivalUntil' | 'Product' | 'ProductUrl' | 'ProductImage' | 'ProductSku' | 'ProductDescription' | 'ProductBrand' | 'ProductColor' | 'OrderNumber' | 'Seller' | 'OrderStatus' | 'AddressName' | 'StreetAddress' | 'AddressLocality' | 'AddressRegion' | 'AddressCountry' | 'PostalCode'>
    )>>, FlightResevations?: Types.Maybe<Array<(
      { __typename?: 'FlightReservationEntity' }
      & Pick<Types.FlightReservationEntity, 'Position' | 'ReservationId' | 'ReservationStatus' | 'UnderName' | 'BrokerName' | 'BrokerPhone'>
      & { Flights?: Types.Maybe<Array<(
        { __typename?: 'TxpFlight' }
        & Pick<Types.TxpFlight, 'Position' | 'FlightNumber' | 'AirlineIataCode' | 'DepartureTime' | 'WindowsTimeZoneName' | 'DepartureAirportIataCode' | 'ArrivalAirportIataCode'>
      )>> }
    )>>, SenderAddIns?: Types.Maybe<Array<(
      { __typename?: 'SenderAddInEntity' }
      & Pick<Types.SenderAddInEntity, 'Position' | 'ExtensionId'>
    )>> }
  )>, ErrorProperties?: Types.Maybe<Array<(
    { __typename?: 'PropertyError' }
    & Pick<Types.PropertyError, 'ErrorCode'>
    & { PropertyPath?: Types.Maybe<(
      { __typename?: 'BuiltInPropertyUri' }
      & Pick<Types.BuiltInPropertyUri, 'FieldURI'>
    ) | (
      { __typename?: 'ExtendedPropertyUri' }
      & Pick<Types.ExtendedPropertyUri, 'DistinguishedPropertySetId' | 'PropertySetId' | 'PropertyTag' | 'PropertyName' | 'PropertyId' | 'PropertyType'>
    )> }
  )>>, ExtendedProperty?: Types.Maybe<Array<(
    { __typename?: 'ExtendedProperty' }
    & Pick<Types.ExtendedProperty, 'Value' | 'Values'>
    & { ExtendedFieldURI?: Types.Maybe<(
      { __typename?: 'ExtendedPropertyUri' }
      & Pick<Types.ExtendedPropertyUri, 'DistinguishedPropertySetId' | 'PropertySetId' | 'PropertyTag' | 'PropertyName' | 'PropertyId' | 'PropertyType'>
    )> }
  )>>, FirstBody?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )>, Flag?: Types.Maybe<(
    { __typename?: 'Flag' }
    & Pick<Types.Flag, 'FlagStatus' | 'StartDate' | 'DueDate' | 'CompleteDate'>
  )>, MentionsEx?: Types.Maybe<Array<(
    { __typename?: 'MentionActionWrapper' }
    & Pick<Types.MentionActionWrapper, 'Mentioned' | 'MentionText' | 'ClientReference'>
  )>>, MentionsPreview?: Types.Maybe<(
    { __typename?: 'MentionsPreviewWrapper' }
    & Pick<Types.MentionsPreviewWrapper, 'IsMentioned'>
  )>, MimeContent?: Types.Maybe<(
    { __typename?: 'MimeContentType' }
    & Pick<Types.MimeContentType, 'CharacterSet' | 'Value'>
  )>, NormalizedBody?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )>, PolicyTag?: Types.Maybe<(
    { __typename?: 'RetentionTagType' }
    & Pick<Types.RetentionTagType, 'IsExplicit' | 'Value'>
  )>, PropertyExistence?: Types.Maybe<(
    { __typename?: 'PropertyExistence' }
    & Pick<Types.PropertyExistence, 'ExtractedAddresses' | 'ExtractedContacts' | 'ExtractedEmails' | 'ExtractedKeywords' | 'ExtractedMeetings' | 'ExtractedPhones' | 'ExtractedTasks' | 'ExtractedUrls' | 'WebExtNotifications' | 'TextEntityExtractions' | 'ReplyToNames' | 'ReplyToBlob' | 'UserHighlightData'>
  )>, ResponseObjects?: Types.Maybe<Array<(
    { __typename?: 'ResponseObject' }
    & Pick<Types.ResponseObject, 'ObjectName' | 'ReferenceItemId'>
  )>>, RightsManagementLicenseData?: Types.Maybe<(
    { __typename?: 'RightsManagementLicenseData' }
    & Pick<Types.RightsManagementLicenseData, 'RightsManagedMessageDecryptionStatus' | 'RmsTemplateId' | 'TemplateName' | 'TemplateDescription' | 'EditAllowed' | 'ReplyAllowed' | 'ReplyAllAllowed' | 'ForwardAllowed' | 'ModifyRecipientsAllowed' | 'ExtractAllowed' | 'PrintAllowed' | 'ExportAllowed' | 'ProgrammaticAccessAllowed' | 'IsOwner' | 'ContentOwner' | 'ContentExpiryDate' | 'BodyType'>
  )>, UniqueBody?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )>, UniqueBottomFragment?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )>, UniqueTopFragment?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )> }
);

export type AllGenericItemFields_MeetingRequestMessage_Fragment = (
  { __typename?: 'MeetingRequestMessage' }
  & Pick<Types.MeetingRequestMessage, 'ItemId' | 'ConversationId' | 'ParentFolderId' | 'BlockStatus' | 'CanDelete' | 'Categories' | 'ContainsOnlyMandatoryProperties' | 'ConversationThreadId' | 'DateTimeCreated' | 'DateTimeReceived' | 'DateTimeSent' | 'DeferredSendTime' | 'DisplayBcc' | 'DisplayCc' | 'DisplayTo' | 'EntityDocument' | 'EntityNamesMap' | 'ExtensibleContentData' | 'HasAttachments' | 'HasBlockedImages' | 'Hashtags' | 'HasProcessedSharepointLink' | 'HasQuotedText' | 'IconIndex' | 'id' | 'Importance' | 'InferenceClassification' | 'InReplyTo' | 'InstanceKey' | 'IsDraft' | 'IsExternalSender' | 'IsFromMe' | 'IsLocked' | 'IsSubmitted' | 'ItemClass' | 'LastModifiedTime' | 'MentionedMe' | 'Mentions' | 'MSIPLabelGuid' | 'PendingSocialActivityTagIds' | 'Preview' | 'QuotedTextList' | 'ReceivedOrRenewTime' | 'ReminderIsSet' | 'ReminderMinutesBeforeStart' | 'RetentionDate' | 'ReturnTime' | 'Sensitivity' | 'SerializedImmutableId' | 'Size' | 'SortOrderSource' | 'Subject' | 'SystemCategories' | 'TailoredXpEntities' | 'TailoredXpEntitiesChangeNumber' | 'TrimmedQuotedText' | 'UserHighlightData' | 'YammerNotification'>
  & { Apps?: Types.Maybe<Array<(
    { __typename?: 'AddinsApp' }
    & Pick<Types.AddinsApp, 'Id'>
    & { Notifications?: Types.Maybe<Array<(
      { __typename?: 'Notification' }
      & Pick<Types.Notification, 'Key' | 'Type' | 'Message' | 'Icon'>
    )>> }
  )>>, ArchiveTag?: Types.Maybe<(
    { __typename?: 'RetentionTagType' }
    & Pick<Types.RetentionTagType, 'IsExplicit' | 'Value'>
  )>, Attachments?: Types.Maybe<Array<(
    { __typename?: 'BasicAttachment' }
    & Pick<Types.BasicAttachment, 'OwsTypeName' | 'AttachmentOriginalUrl' | 'ContentId' | 'ContentLocation' | 'ContentType' | 'id' | 'IsInline' | 'IsInlineToNormalBody' | 'IsInlineToUniqueBody' | 'LastModifiedTime' | 'Name' | 'Size' | 'Thumbnail' | 'ThumbnailMimeType'>
    & { AttachmentId?: Types.Maybe<(
      { __typename?: 'AttachmentId' }
      & Pick<Types.AttachmentId, 'Id'>
    )> }
  ) | (
    { __typename?: 'ReferenceAttachment' }
    & Pick<Types.ReferenceAttachment, 'ProviderType' | 'WebUrl' | 'AttachLongPathName' | 'AttachmentThumbnailUrl' | 'AttachmentPreviewUrl' | 'OwsTypeName' | 'AttachmentOriginalUrl' | 'ContentId' | 'ContentLocation' | 'ContentType' | 'id' | 'IsInline' | 'IsInlineToNormalBody' | 'IsInlineToUniqueBody' | 'LastModifiedTime' | 'Name' | 'Size' | 'Thumbnail' | 'ThumbnailMimeType'>
    & { AttachmentId?: Types.Maybe<(
      { __typename?: 'AttachmentId' }
      & Pick<Types.AttachmentId, 'Id'>
    )> }
  )>>, Body?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )>, Conversation?: Types.Maybe<(
    { __typename?: 'ConversationType' }
    & Pick<Types.ConversationType, 'ConversationId' | 'ConversationTopic' | 'UniqueRecipients' | 'UniqueSenders' | 'LastDeliveryTime' | 'Categories' | 'FlagStatus' | 'HasAttachments' | 'MessageCount' | 'GlobalMessageCount' | 'UnreadCount' | 'GlobalUnreadCount' | 'Size' | 'ItemClasses' | 'Importance' | 'ItemIds' | 'GlobalItemIds' | 'LastModifiedTime' | 'InstanceKey' | 'Preview' | 'IconIndex' | 'DraftItemIds' | 'HasIrm' | 'GlobalLikeCount' | 'LastDeliveryOrRenewTime' | 'GlobalMentionedMe' | 'GlobalAtAllMention' | 'SortOrderSource' | 'LastSender' | 'From' | 'EntityNamesMap' | 'HasExternalEmails' | 'ReturnTime' | 'HasSharepointLink' | 'HasAttachmentPreviews' | 'HasProcessedSharepointLink' | 'CouponRanks' | 'CouponExpiryDates' | 'mentionedMe'>
    & { ParentFolderId?: Types.Maybe<(
      { __typename?: 'FolderId' }
      & Pick<Types.FolderId, 'Id'>
    )> }
  )>, DocLinks?: Types.Maybe<Array<(
    { __typename?: 'DocLink' }
    & Pick<Types.DocLink, 'ProviderType' | 'Url' | 'PermissionType'>
  )>>, EffectiveRights?: Types.Maybe<(
    { __typename?: 'EffectiveRightsType' }
    & Pick<Types.EffectiveRightsType, 'CreateAssociated' | 'CreateContents' | 'CreateHierarchy' | 'Delete' | 'Modify' | 'Read' | 'ViewPrivateItems'>
  )>, EntityExtractionResult?: Types.Maybe<(
    { __typename?: 'EntityExtractionResult' }
    & Pick<Types.EntityExtractionResult, 'BusinessNames' | 'PeopleNames'>
    & { Addresses?: Types.Maybe<Array<(
      { __typename?: 'AddressEntity' }
      & Pick<Types.AddressEntity, 'Position' | 'Address'>
    )>>, MeetingSuggestions?: Types.Maybe<Array<(
      { __typename?: 'MeetingSuggestion' }
      & Pick<Types.MeetingSuggestion, 'Position' | 'Location' | 'Subject' | 'MeetingString' | 'TimeStringBeginIndex' | 'TimeStringLength' | 'EntityId' | 'ExtractionId' | 'StartTime' | 'EndTime'>
      & { Attendees?: Types.Maybe<Array<(
        { __typename?: 'TxpEmailUser' }
        & Pick<Types.TxpEmailUser, 'Name' | 'UserId'>
      )>> }
    )>>, TaskSuggestions?: Types.Maybe<Array<(
      { __typename?: 'TaskSuggestion' }
      & Pick<Types.TaskSuggestion, 'Position' | 'TaskString'>
      & { Assignees?: Types.Maybe<Array<(
        { __typename?: 'TxpEmailUser' }
        & Pick<Types.TxpEmailUser, 'Name' | 'UserId'>
      )>> }
    )>>, EmailAddresses?: Types.Maybe<Array<(
      { __typename?: 'EmailAddressEntity' }
      & Pick<Types.EmailAddressEntity, 'Position' | 'EmailAddress'>
    )>>, Contacts?: Types.Maybe<Array<(
      { __typename?: 'Contact' }
      & Pick<Types.Contact, 'Position' | 'PersonName' | 'BusinessName' | 'Urls' | 'EmailAddresses' | 'Addresses' | 'ContactString' | 'ContactGroupsGuids'>
      & { PhoneNumbers?: Types.Maybe<Array<(
        { __typename?: 'Phone' }
        & Pick<Types.Phone, 'OriginalPhoneString' | 'PhoneString' | 'Type'>
      )>> }
    )>>, Urls?: Types.Maybe<Array<(
      { __typename?: 'UrlEntity' }
      & Pick<Types.UrlEntity, 'Position' | 'Url'>
    )>>, PhoneNumbers?: Types.Maybe<Array<(
      { __typename?: 'PhoneEntity' }
      & Pick<Types.PhoneEntity, 'Position' | 'OriginalPhoneString' | 'PhoneString' | 'Type'>
    )>>, ParcelDeliveries?: Types.Maybe<Array<(
      { __typename?: 'ParcelDeliveryEntity' }
      & Pick<Types.ParcelDeliveryEntity, 'Position' | 'Carrier' | 'TrackingNumber' | 'TrackingUrl' | 'ExpectedArrivalFrom' | 'ExpectedArrivalUntil' | 'Product' | 'ProductUrl' | 'ProductImage' | 'ProductSku' | 'ProductDescription' | 'ProductBrand' | 'ProductColor' | 'OrderNumber' | 'Seller' | 'OrderStatus' | 'AddressName' | 'StreetAddress' | 'AddressLocality' | 'AddressRegion' | 'AddressCountry' | 'PostalCode'>
    )>>, FlightResevations?: Types.Maybe<Array<(
      { __typename?: 'FlightReservationEntity' }
      & Pick<Types.FlightReservationEntity, 'Position' | 'ReservationId' | 'ReservationStatus' | 'UnderName' | 'BrokerName' | 'BrokerPhone'>
      & { Flights?: Types.Maybe<Array<(
        { __typename?: 'TxpFlight' }
        & Pick<Types.TxpFlight, 'Position' | 'FlightNumber' | 'AirlineIataCode' | 'DepartureTime' | 'WindowsTimeZoneName' | 'DepartureAirportIataCode' | 'ArrivalAirportIataCode'>
      )>> }
    )>>, SenderAddIns?: Types.Maybe<Array<(
      { __typename?: 'SenderAddInEntity' }
      & Pick<Types.SenderAddInEntity, 'Position' | 'ExtensionId'>
    )>> }
  )>, ErrorProperties?: Types.Maybe<Array<(
    { __typename?: 'PropertyError' }
    & Pick<Types.PropertyError, 'ErrorCode'>
    & { PropertyPath?: Types.Maybe<(
      { __typename?: 'BuiltInPropertyUri' }
      & Pick<Types.BuiltInPropertyUri, 'FieldURI'>
    ) | (
      { __typename?: 'ExtendedPropertyUri' }
      & Pick<Types.ExtendedPropertyUri, 'DistinguishedPropertySetId' | 'PropertySetId' | 'PropertyTag' | 'PropertyName' | 'PropertyId' | 'PropertyType'>
    )> }
  )>>, ExtendedProperty?: Types.Maybe<Array<(
    { __typename?: 'ExtendedProperty' }
    & Pick<Types.ExtendedProperty, 'Value' | 'Values'>
    & { ExtendedFieldURI?: Types.Maybe<(
      { __typename?: 'ExtendedPropertyUri' }
      & Pick<Types.ExtendedPropertyUri, 'DistinguishedPropertySetId' | 'PropertySetId' | 'PropertyTag' | 'PropertyName' | 'PropertyId' | 'PropertyType'>
    )> }
  )>>, FirstBody?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )>, Flag?: Types.Maybe<(
    { __typename?: 'Flag' }
    & Pick<Types.Flag, 'FlagStatus' | 'StartDate' | 'DueDate' | 'CompleteDate'>
  )>, MentionsEx?: Types.Maybe<Array<(
    { __typename?: 'MentionActionWrapper' }
    & Pick<Types.MentionActionWrapper, 'Mentioned' | 'MentionText' | 'ClientReference'>
  )>>, MentionsPreview?: Types.Maybe<(
    { __typename?: 'MentionsPreviewWrapper' }
    & Pick<Types.MentionsPreviewWrapper, 'IsMentioned'>
  )>, MimeContent?: Types.Maybe<(
    { __typename?: 'MimeContentType' }
    & Pick<Types.MimeContentType, 'CharacterSet' | 'Value'>
  )>, NormalizedBody?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )>, PolicyTag?: Types.Maybe<(
    { __typename?: 'RetentionTagType' }
    & Pick<Types.RetentionTagType, 'IsExplicit' | 'Value'>
  )>, PropertyExistence?: Types.Maybe<(
    { __typename?: 'PropertyExistence' }
    & Pick<Types.PropertyExistence, 'ExtractedAddresses' | 'ExtractedContacts' | 'ExtractedEmails' | 'ExtractedKeywords' | 'ExtractedMeetings' | 'ExtractedPhones' | 'ExtractedTasks' | 'ExtractedUrls' | 'WebExtNotifications' | 'TextEntityExtractions' | 'ReplyToNames' | 'ReplyToBlob' | 'UserHighlightData'>
  )>, ResponseObjects?: Types.Maybe<Array<(
    { __typename?: 'ResponseObject' }
    & Pick<Types.ResponseObject, 'ObjectName' | 'ReferenceItemId'>
  )>>, RightsManagementLicenseData?: Types.Maybe<(
    { __typename?: 'RightsManagementLicenseData' }
    & Pick<Types.RightsManagementLicenseData, 'RightsManagedMessageDecryptionStatus' | 'RmsTemplateId' | 'TemplateName' | 'TemplateDescription' | 'EditAllowed' | 'ReplyAllowed' | 'ReplyAllAllowed' | 'ForwardAllowed' | 'ModifyRecipientsAllowed' | 'ExtractAllowed' | 'PrintAllowed' | 'ExportAllowed' | 'ProgrammaticAccessAllowed' | 'IsOwner' | 'ContentOwner' | 'ContentExpiryDate' | 'BodyType'>
  )>, UniqueBody?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )>, UniqueBottomFragment?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )>, UniqueTopFragment?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )> }
);

export type AllGenericItemFields_MeetingResponseMessage_Fragment = (
  { __typename?: 'MeetingResponseMessage' }
  & Pick<Types.MeetingResponseMessage, 'ItemId' | 'ConversationId' | 'ParentFolderId' | 'BlockStatus' | 'CanDelete' | 'Categories' | 'ContainsOnlyMandatoryProperties' | 'ConversationThreadId' | 'DateTimeCreated' | 'DateTimeReceived' | 'DateTimeSent' | 'DeferredSendTime' | 'DisplayBcc' | 'DisplayCc' | 'DisplayTo' | 'EntityDocument' | 'EntityNamesMap' | 'ExtensibleContentData' | 'HasAttachments' | 'HasBlockedImages' | 'Hashtags' | 'HasProcessedSharepointLink' | 'HasQuotedText' | 'IconIndex' | 'id' | 'Importance' | 'InferenceClassification' | 'InReplyTo' | 'InstanceKey' | 'IsDraft' | 'IsExternalSender' | 'IsFromMe' | 'IsLocked' | 'IsSubmitted' | 'ItemClass' | 'LastModifiedTime' | 'MentionedMe' | 'Mentions' | 'MSIPLabelGuid' | 'PendingSocialActivityTagIds' | 'Preview' | 'QuotedTextList' | 'ReceivedOrRenewTime' | 'ReminderIsSet' | 'ReminderMinutesBeforeStart' | 'RetentionDate' | 'ReturnTime' | 'Sensitivity' | 'SerializedImmutableId' | 'Size' | 'SortOrderSource' | 'Subject' | 'SystemCategories' | 'TailoredXpEntities' | 'TailoredXpEntitiesChangeNumber' | 'TrimmedQuotedText' | 'UserHighlightData' | 'YammerNotification'>
  & { Apps?: Types.Maybe<Array<(
    { __typename?: 'AddinsApp' }
    & Pick<Types.AddinsApp, 'Id'>
    & { Notifications?: Types.Maybe<Array<(
      { __typename?: 'Notification' }
      & Pick<Types.Notification, 'Key' | 'Type' | 'Message' | 'Icon'>
    )>> }
  )>>, ArchiveTag?: Types.Maybe<(
    { __typename?: 'RetentionTagType' }
    & Pick<Types.RetentionTagType, 'IsExplicit' | 'Value'>
  )>, Attachments?: Types.Maybe<Array<(
    { __typename?: 'BasicAttachment' }
    & Pick<Types.BasicAttachment, 'OwsTypeName' | 'AttachmentOriginalUrl' | 'ContentId' | 'ContentLocation' | 'ContentType' | 'id' | 'IsInline' | 'IsInlineToNormalBody' | 'IsInlineToUniqueBody' | 'LastModifiedTime' | 'Name' | 'Size' | 'Thumbnail' | 'ThumbnailMimeType'>
    & { AttachmentId?: Types.Maybe<(
      { __typename?: 'AttachmentId' }
      & Pick<Types.AttachmentId, 'Id'>
    )> }
  ) | (
    { __typename?: 'ReferenceAttachment' }
    & Pick<Types.ReferenceAttachment, 'ProviderType' | 'WebUrl' | 'AttachLongPathName' | 'AttachmentThumbnailUrl' | 'AttachmentPreviewUrl' | 'OwsTypeName' | 'AttachmentOriginalUrl' | 'ContentId' | 'ContentLocation' | 'ContentType' | 'id' | 'IsInline' | 'IsInlineToNormalBody' | 'IsInlineToUniqueBody' | 'LastModifiedTime' | 'Name' | 'Size' | 'Thumbnail' | 'ThumbnailMimeType'>
    & { AttachmentId?: Types.Maybe<(
      { __typename?: 'AttachmentId' }
      & Pick<Types.AttachmentId, 'Id'>
    )> }
  )>>, Body?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )>, Conversation?: Types.Maybe<(
    { __typename?: 'ConversationType' }
    & Pick<Types.ConversationType, 'ConversationId' | 'ConversationTopic' | 'UniqueRecipients' | 'UniqueSenders' | 'LastDeliveryTime' | 'Categories' | 'FlagStatus' | 'HasAttachments' | 'MessageCount' | 'GlobalMessageCount' | 'UnreadCount' | 'GlobalUnreadCount' | 'Size' | 'ItemClasses' | 'Importance' | 'ItemIds' | 'GlobalItemIds' | 'LastModifiedTime' | 'InstanceKey' | 'Preview' | 'IconIndex' | 'DraftItemIds' | 'HasIrm' | 'GlobalLikeCount' | 'LastDeliveryOrRenewTime' | 'GlobalMentionedMe' | 'GlobalAtAllMention' | 'SortOrderSource' | 'LastSender' | 'From' | 'EntityNamesMap' | 'HasExternalEmails' | 'ReturnTime' | 'HasSharepointLink' | 'HasAttachmentPreviews' | 'HasProcessedSharepointLink' | 'CouponRanks' | 'CouponExpiryDates' | 'mentionedMe'>
    & { ParentFolderId?: Types.Maybe<(
      { __typename?: 'FolderId' }
      & Pick<Types.FolderId, 'Id'>
    )> }
  )>, DocLinks?: Types.Maybe<Array<(
    { __typename?: 'DocLink' }
    & Pick<Types.DocLink, 'ProviderType' | 'Url' | 'PermissionType'>
  )>>, EffectiveRights?: Types.Maybe<(
    { __typename?: 'EffectiveRightsType' }
    & Pick<Types.EffectiveRightsType, 'CreateAssociated' | 'CreateContents' | 'CreateHierarchy' | 'Delete' | 'Modify' | 'Read' | 'ViewPrivateItems'>
  )>, EntityExtractionResult?: Types.Maybe<(
    { __typename?: 'EntityExtractionResult' }
    & Pick<Types.EntityExtractionResult, 'BusinessNames' | 'PeopleNames'>
    & { Addresses?: Types.Maybe<Array<(
      { __typename?: 'AddressEntity' }
      & Pick<Types.AddressEntity, 'Position' | 'Address'>
    )>>, MeetingSuggestions?: Types.Maybe<Array<(
      { __typename?: 'MeetingSuggestion' }
      & Pick<Types.MeetingSuggestion, 'Position' | 'Location' | 'Subject' | 'MeetingString' | 'TimeStringBeginIndex' | 'TimeStringLength' | 'EntityId' | 'ExtractionId' | 'StartTime' | 'EndTime'>
      & { Attendees?: Types.Maybe<Array<(
        { __typename?: 'TxpEmailUser' }
        & Pick<Types.TxpEmailUser, 'Name' | 'UserId'>
      )>> }
    )>>, TaskSuggestions?: Types.Maybe<Array<(
      { __typename?: 'TaskSuggestion' }
      & Pick<Types.TaskSuggestion, 'Position' | 'TaskString'>
      & { Assignees?: Types.Maybe<Array<(
        { __typename?: 'TxpEmailUser' }
        & Pick<Types.TxpEmailUser, 'Name' | 'UserId'>
      )>> }
    )>>, EmailAddresses?: Types.Maybe<Array<(
      { __typename?: 'EmailAddressEntity' }
      & Pick<Types.EmailAddressEntity, 'Position' | 'EmailAddress'>
    )>>, Contacts?: Types.Maybe<Array<(
      { __typename?: 'Contact' }
      & Pick<Types.Contact, 'Position' | 'PersonName' | 'BusinessName' | 'Urls' | 'EmailAddresses' | 'Addresses' | 'ContactString' | 'ContactGroupsGuids'>
      & { PhoneNumbers?: Types.Maybe<Array<(
        { __typename?: 'Phone' }
        & Pick<Types.Phone, 'OriginalPhoneString' | 'PhoneString' | 'Type'>
      )>> }
    )>>, Urls?: Types.Maybe<Array<(
      { __typename?: 'UrlEntity' }
      & Pick<Types.UrlEntity, 'Position' | 'Url'>
    )>>, PhoneNumbers?: Types.Maybe<Array<(
      { __typename?: 'PhoneEntity' }
      & Pick<Types.PhoneEntity, 'Position' | 'OriginalPhoneString' | 'PhoneString' | 'Type'>
    )>>, ParcelDeliveries?: Types.Maybe<Array<(
      { __typename?: 'ParcelDeliveryEntity' }
      & Pick<Types.ParcelDeliveryEntity, 'Position' | 'Carrier' | 'TrackingNumber' | 'TrackingUrl' | 'ExpectedArrivalFrom' | 'ExpectedArrivalUntil' | 'Product' | 'ProductUrl' | 'ProductImage' | 'ProductSku' | 'ProductDescription' | 'ProductBrand' | 'ProductColor' | 'OrderNumber' | 'Seller' | 'OrderStatus' | 'AddressName' | 'StreetAddress' | 'AddressLocality' | 'AddressRegion' | 'AddressCountry' | 'PostalCode'>
    )>>, FlightResevations?: Types.Maybe<Array<(
      { __typename?: 'FlightReservationEntity' }
      & Pick<Types.FlightReservationEntity, 'Position' | 'ReservationId' | 'ReservationStatus' | 'UnderName' | 'BrokerName' | 'BrokerPhone'>
      & { Flights?: Types.Maybe<Array<(
        { __typename?: 'TxpFlight' }
        & Pick<Types.TxpFlight, 'Position' | 'FlightNumber' | 'AirlineIataCode' | 'DepartureTime' | 'WindowsTimeZoneName' | 'DepartureAirportIataCode' | 'ArrivalAirportIataCode'>
      )>> }
    )>>, SenderAddIns?: Types.Maybe<Array<(
      { __typename?: 'SenderAddInEntity' }
      & Pick<Types.SenderAddInEntity, 'Position' | 'ExtensionId'>
    )>> }
  )>, ErrorProperties?: Types.Maybe<Array<(
    { __typename?: 'PropertyError' }
    & Pick<Types.PropertyError, 'ErrorCode'>
    & { PropertyPath?: Types.Maybe<(
      { __typename?: 'BuiltInPropertyUri' }
      & Pick<Types.BuiltInPropertyUri, 'FieldURI'>
    ) | (
      { __typename?: 'ExtendedPropertyUri' }
      & Pick<Types.ExtendedPropertyUri, 'DistinguishedPropertySetId' | 'PropertySetId' | 'PropertyTag' | 'PropertyName' | 'PropertyId' | 'PropertyType'>
    )> }
  )>>, ExtendedProperty?: Types.Maybe<Array<(
    { __typename?: 'ExtendedProperty' }
    & Pick<Types.ExtendedProperty, 'Value' | 'Values'>
    & { ExtendedFieldURI?: Types.Maybe<(
      { __typename?: 'ExtendedPropertyUri' }
      & Pick<Types.ExtendedPropertyUri, 'DistinguishedPropertySetId' | 'PropertySetId' | 'PropertyTag' | 'PropertyName' | 'PropertyId' | 'PropertyType'>
    )> }
  )>>, FirstBody?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )>, Flag?: Types.Maybe<(
    { __typename?: 'Flag' }
    & Pick<Types.Flag, 'FlagStatus' | 'StartDate' | 'DueDate' | 'CompleteDate'>
  )>, MentionsEx?: Types.Maybe<Array<(
    { __typename?: 'MentionActionWrapper' }
    & Pick<Types.MentionActionWrapper, 'Mentioned' | 'MentionText' | 'ClientReference'>
  )>>, MentionsPreview?: Types.Maybe<(
    { __typename?: 'MentionsPreviewWrapper' }
    & Pick<Types.MentionsPreviewWrapper, 'IsMentioned'>
  )>, MimeContent?: Types.Maybe<(
    { __typename?: 'MimeContentType' }
    & Pick<Types.MimeContentType, 'CharacterSet' | 'Value'>
  )>, NormalizedBody?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )>, PolicyTag?: Types.Maybe<(
    { __typename?: 'RetentionTagType' }
    & Pick<Types.RetentionTagType, 'IsExplicit' | 'Value'>
  )>, PropertyExistence?: Types.Maybe<(
    { __typename?: 'PropertyExistence' }
    & Pick<Types.PropertyExistence, 'ExtractedAddresses' | 'ExtractedContacts' | 'ExtractedEmails' | 'ExtractedKeywords' | 'ExtractedMeetings' | 'ExtractedPhones' | 'ExtractedTasks' | 'ExtractedUrls' | 'WebExtNotifications' | 'TextEntityExtractions' | 'ReplyToNames' | 'ReplyToBlob' | 'UserHighlightData'>
  )>, ResponseObjects?: Types.Maybe<Array<(
    { __typename?: 'ResponseObject' }
    & Pick<Types.ResponseObject, 'ObjectName' | 'ReferenceItemId'>
  )>>, RightsManagementLicenseData?: Types.Maybe<(
    { __typename?: 'RightsManagementLicenseData' }
    & Pick<Types.RightsManagementLicenseData, 'RightsManagedMessageDecryptionStatus' | 'RmsTemplateId' | 'TemplateName' | 'TemplateDescription' | 'EditAllowed' | 'ReplyAllowed' | 'ReplyAllAllowed' | 'ForwardAllowed' | 'ModifyRecipientsAllowed' | 'ExtractAllowed' | 'PrintAllowed' | 'ExportAllowed' | 'ProgrammaticAccessAllowed' | 'IsOwner' | 'ContentOwner' | 'ContentExpiryDate' | 'BodyType'>
  )>, UniqueBody?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )>, UniqueBottomFragment?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )>, UniqueTopFragment?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )> }
);

export type AllGenericItemFields_Message_Fragment = (
  { __typename?: 'Message' }
  & Pick<Types.Message, 'ItemId' | 'ConversationId' | 'ParentFolderId' | 'BlockStatus' | 'CanDelete' | 'Categories' | 'ContainsOnlyMandatoryProperties' | 'ConversationThreadId' | 'DateTimeCreated' | 'DateTimeReceived' | 'DateTimeSent' | 'DeferredSendTime' | 'DisplayBcc' | 'DisplayCc' | 'DisplayTo' | 'EntityDocument' | 'EntityNamesMap' | 'ExtensibleContentData' | 'HasAttachments' | 'HasBlockedImages' | 'Hashtags' | 'HasProcessedSharepointLink' | 'HasQuotedText' | 'IconIndex' | 'id' | 'Importance' | 'InferenceClassification' | 'InReplyTo' | 'InstanceKey' | 'IsDraft' | 'IsExternalSender' | 'IsFromMe' | 'IsLocked' | 'IsSubmitted' | 'ItemClass' | 'LastModifiedTime' | 'MentionedMe' | 'Mentions' | 'MSIPLabelGuid' | 'PendingSocialActivityTagIds' | 'Preview' | 'QuotedTextList' | 'ReceivedOrRenewTime' | 'ReminderIsSet' | 'ReminderMinutesBeforeStart' | 'RetentionDate' | 'ReturnTime' | 'Sensitivity' | 'SerializedImmutableId' | 'Size' | 'SortOrderSource' | 'Subject' | 'SystemCategories' | 'TailoredXpEntities' | 'TailoredXpEntitiesChangeNumber' | 'TrimmedQuotedText' | 'UserHighlightData' | 'YammerNotification'>
  & { Apps?: Types.Maybe<Array<(
    { __typename?: 'AddinsApp' }
    & Pick<Types.AddinsApp, 'Id'>
    & { Notifications?: Types.Maybe<Array<(
      { __typename?: 'Notification' }
      & Pick<Types.Notification, 'Key' | 'Type' | 'Message' | 'Icon'>
    )>> }
  )>>, ArchiveTag?: Types.Maybe<(
    { __typename?: 'RetentionTagType' }
    & Pick<Types.RetentionTagType, 'IsExplicit' | 'Value'>
  )>, Attachments?: Types.Maybe<Array<(
    { __typename?: 'BasicAttachment' }
    & Pick<Types.BasicAttachment, 'OwsTypeName' | 'AttachmentOriginalUrl' | 'ContentId' | 'ContentLocation' | 'ContentType' | 'id' | 'IsInline' | 'IsInlineToNormalBody' | 'IsInlineToUniqueBody' | 'LastModifiedTime' | 'Name' | 'Size' | 'Thumbnail' | 'ThumbnailMimeType'>
    & { AttachmentId?: Types.Maybe<(
      { __typename?: 'AttachmentId' }
      & Pick<Types.AttachmentId, 'Id'>
    )> }
  ) | (
    { __typename?: 'ReferenceAttachment' }
    & Pick<Types.ReferenceAttachment, 'ProviderType' | 'WebUrl' | 'AttachLongPathName' | 'AttachmentThumbnailUrl' | 'AttachmentPreviewUrl' | 'OwsTypeName' | 'AttachmentOriginalUrl' | 'ContentId' | 'ContentLocation' | 'ContentType' | 'id' | 'IsInline' | 'IsInlineToNormalBody' | 'IsInlineToUniqueBody' | 'LastModifiedTime' | 'Name' | 'Size' | 'Thumbnail' | 'ThumbnailMimeType'>
    & { AttachmentId?: Types.Maybe<(
      { __typename?: 'AttachmentId' }
      & Pick<Types.AttachmentId, 'Id'>
    )> }
  )>>, Body?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )>, Conversation?: Types.Maybe<(
    { __typename?: 'ConversationType' }
    & Pick<Types.ConversationType, 'ConversationId' | 'ConversationTopic' | 'UniqueRecipients' | 'UniqueSenders' | 'LastDeliveryTime' | 'Categories' | 'FlagStatus' | 'HasAttachments' | 'MessageCount' | 'GlobalMessageCount' | 'UnreadCount' | 'GlobalUnreadCount' | 'Size' | 'ItemClasses' | 'Importance' | 'ItemIds' | 'GlobalItemIds' | 'LastModifiedTime' | 'InstanceKey' | 'Preview' | 'IconIndex' | 'DraftItemIds' | 'HasIrm' | 'GlobalLikeCount' | 'LastDeliveryOrRenewTime' | 'GlobalMentionedMe' | 'GlobalAtAllMention' | 'SortOrderSource' | 'LastSender' | 'From' | 'EntityNamesMap' | 'HasExternalEmails' | 'ReturnTime' | 'HasSharepointLink' | 'HasAttachmentPreviews' | 'HasProcessedSharepointLink' | 'CouponRanks' | 'CouponExpiryDates' | 'mentionedMe'>
    & { ParentFolderId?: Types.Maybe<(
      { __typename?: 'FolderId' }
      & Pick<Types.FolderId, 'Id'>
    )> }
  )>, DocLinks?: Types.Maybe<Array<(
    { __typename?: 'DocLink' }
    & Pick<Types.DocLink, 'ProviderType' | 'Url' | 'PermissionType'>
  )>>, EffectiveRights?: Types.Maybe<(
    { __typename?: 'EffectiveRightsType' }
    & Pick<Types.EffectiveRightsType, 'CreateAssociated' | 'CreateContents' | 'CreateHierarchy' | 'Delete' | 'Modify' | 'Read' | 'ViewPrivateItems'>
  )>, EntityExtractionResult?: Types.Maybe<(
    { __typename?: 'EntityExtractionResult' }
    & Pick<Types.EntityExtractionResult, 'BusinessNames' | 'PeopleNames'>
    & { Addresses?: Types.Maybe<Array<(
      { __typename?: 'AddressEntity' }
      & Pick<Types.AddressEntity, 'Position' | 'Address'>
    )>>, MeetingSuggestions?: Types.Maybe<Array<(
      { __typename?: 'MeetingSuggestion' }
      & Pick<Types.MeetingSuggestion, 'Position' | 'Location' | 'Subject' | 'MeetingString' | 'TimeStringBeginIndex' | 'TimeStringLength' | 'EntityId' | 'ExtractionId' | 'StartTime' | 'EndTime'>
      & { Attendees?: Types.Maybe<Array<(
        { __typename?: 'TxpEmailUser' }
        & Pick<Types.TxpEmailUser, 'Name' | 'UserId'>
      )>> }
    )>>, TaskSuggestions?: Types.Maybe<Array<(
      { __typename?: 'TaskSuggestion' }
      & Pick<Types.TaskSuggestion, 'Position' | 'TaskString'>
      & { Assignees?: Types.Maybe<Array<(
        { __typename?: 'TxpEmailUser' }
        & Pick<Types.TxpEmailUser, 'Name' | 'UserId'>
      )>> }
    )>>, EmailAddresses?: Types.Maybe<Array<(
      { __typename?: 'EmailAddressEntity' }
      & Pick<Types.EmailAddressEntity, 'Position' | 'EmailAddress'>
    )>>, Contacts?: Types.Maybe<Array<(
      { __typename?: 'Contact' }
      & Pick<Types.Contact, 'Position' | 'PersonName' | 'BusinessName' | 'Urls' | 'EmailAddresses' | 'Addresses' | 'ContactString' | 'ContactGroupsGuids'>
      & { PhoneNumbers?: Types.Maybe<Array<(
        { __typename?: 'Phone' }
        & Pick<Types.Phone, 'OriginalPhoneString' | 'PhoneString' | 'Type'>
      )>> }
    )>>, Urls?: Types.Maybe<Array<(
      { __typename?: 'UrlEntity' }
      & Pick<Types.UrlEntity, 'Position' | 'Url'>
    )>>, PhoneNumbers?: Types.Maybe<Array<(
      { __typename?: 'PhoneEntity' }
      & Pick<Types.PhoneEntity, 'Position' | 'OriginalPhoneString' | 'PhoneString' | 'Type'>
    )>>, ParcelDeliveries?: Types.Maybe<Array<(
      { __typename?: 'ParcelDeliveryEntity' }
      & Pick<Types.ParcelDeliveryEntity, 'Position' | 'Carrier' | 'TrackingNumber' | 'TrackingUrl' | 'ExpectedArrivalFrom' | 'ExpectedArrivalUntil' | 'Product' | 'ProductUrl' | 'ProductImage' | 'ProductSku' | 'ProductDescription' | 'ProductBrand' | 'ProductColor' | 'OrderNumber' | 'Seller' | 'OrderStatus' | 'AddressName' | 'StreetAddress' | 'AddressLocality' | 'AddressRegion' | 'AddressCountry' | 'PostalCode'>
    )>>, FlightResevations?: Types.Maybe<Array<(
      { __typename?: 'FlightReservationEntity' }
      & Pick<Types.FlightReservationEntity, 'Position' | 'ReservationId' | 'ReservationStatus' | 'UnderName' | 'BrokerName' | 'BrokerPhone'>
      & { Flights?: Types.Maybe<Array<(
        { __typename?: 'TxpFlight' }
        & Pick<Types.TxpFlight, 'Position' | 'FlightNumber' | 'AirlineIataCode' | 'DepartureTime' | 'WindowsTimeZoneName' | 'DepartureAirportIataCode' | 'ArrivalAirportIataCode'>
      )>> }
    )>>, SenderAddIns?: Types.Maybe<Array<(
      { __typename?: 'SenderAddInEntity' }
      & Pick<Types.SenderAddInEntity, 'Position' | 'ExtensionId'>
    )>> }
  )>, ErrorProperties?: Types.Maybe<Array<(
    { __typename?: 'PropertyError' }
    & Pick<Types.PropertyError, 'ErrorCode'>
    & { PropertyPath?: Types.Maybe<(
      { __typename?: 'BuiltInPropertyUri' }
      & Pick<Types.BuiltInPropertyUri, 'FieldURI'>
    ) | (
      { __typename?: 'ExtendedPropertyUri' }
      & Pick<Types.ExtendedPropertyUri, 'DistinguishedPropertySetId' | 'PropertySetId' | 'PropertyTag' | 'PropertyName' | 'PropertyId' | 'PropertyType'>
    )> }
  )>>, ExtendedProperty?: Types.Maybe<Array<(
    { __typename?: 'ExtendedProperty' }
    & Pick<Types.ExtendedProperty, 'Value' | 'Values'>
    & { ExtendedFieldURI?: Types.Maybe<(
      { __typename?: 'ExtendedPropertyUri' }
      & Pick<Types.ExtendedPropertyUri, 'DistinguishedPropertySetId' | 'PropertySetId' | 'PropertyTag' | 'PropertyName' | 'PropertyId' | 'PropertyType'>
    )> }
  )>>, FirstBody?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )>, Flag?: Types.Maybe<(
    { __typename?: 'Flag' }
    & Pick<Types.Flag, 'FlagStatus' | 'StartDate' | 'DueDate' | 'CompleteDate'>
  )>, MentionsEx?: Types.Maybe<Array<(
    { __typename?: 'MentionActionWrapper' }
    & Pick<Types.MentionActionWrapper, 'Mentioned' | 'MentionText' | 'ClientReference'>
  )>>, MentionsPreview?: Types.Maybe<(
    { __typename?: 'MentionsPreviewWrapper' }
    & Pick<Types.MentionsPreviewWrapper, 'IsMentioned'>
  )>, MimeContent?: Types.Maybe<(
    { __typename?: 'MimeContentType' }
    & Pick<Types.MimeContentType, 'CharacterSet' | 'Value'>
  )>, NormalizedBody?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )>, PolicyTag?: Types.Maybe<(
    { __typename?: 'RetentionTagType' }
    & Pick<Types.RetentionTagType, 'IsExplicit' | 'Value'>
  )>, PropertyExistence?: Types.Maybe<(
    { __typename?: 'PropertyExistence' }
    & Pick<Types.PropertyExistence, 'ExtractedAddresses' | 'ExtractedContacts' | 'ExtractedEmails' | 'ExtractedKeywords' | 'ExtractedMeetings' | 'ExtractedPhones' | 'ExtractedTasks' | 'ExtractedUrls' | 'WebExtNotifications' | 'TextEntityExtractions' | 'ReplyToNames' | 'ReplyToBlob' | 'UserHighlightData'>
  )>, ResponseObjects?: Types.Maybe<Array<(
    { __typename?: 'ResponseObject' }
    & Pick<Types.ResponseObject, 'ObjectName' | 'ReferenceItemId'>
  )>>, RightsManagementLicenseData?: Types.Maybe<(
    { __typename?: 'RightsManagementLicenseData' }
    & Pick<Types.RightsManagementLicenseData, 'RightsManagedMessageDecryptionStatus' | 'RmsTemplateId' | 'TemplateName' | 'TemplateDescription' | 'EditAllowed' | 'ReplyAllowed' | 'ReplyAllAllowed' | 'ForwardAllowed' | 'ModifyRecipientsAllowed' | 'ExtractAllowed' | 'PrintAllowed' | 'ExportAllowed' | 'ProgrammaticAccessAllowed' | 'IsOwner' | 'ContentOwner' | 'ContentExpiryDate' | 'BodyType'>
  )>, UniqueBody?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )>, UniqueBottomFragment?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )>, UniqueTopFragment?: Types.Maybe<(
    { __typename?: 'BodyContent' }
    & Pick<Types.BodyContent, 'BodyType' | 'Value' | 'QuotedText' | 'IsTruncated' | 'UTF8BodySize' | 'DataUriCount' | 'CustomDataUriCount'>
    & { BodyFragmentInformation?: Types.Maybe<Array<(
      { __typename?: 'BodyFragmentType' }
      & Pick<Types.BodyFragmentType, 'StartOffset' | 'EndOffset'>
    )>> }
  )> }
);

export type AllGenericItemFieldsFragment = AllGenericItemFields_CalendarItem_Fragment | AllGenericItemFields_Item_Fragment | AllGenericItemFields_MeetingCancellationMessage_Fragment | AllGenericItemFields_MeetingMessage_Fragment | AllGenericItemFields_MeetingRequestMessage_Fragment | AllGenericItemFields_MeetingResponseMessage_Fragment | AllGenericItemFields_Message_Fragment;

export type AllMessageFields_MeetingCancellationMessage_Fragment = (
  { __typename?: 'MeetingCancellationMessage' }
  & Pick<Types.MeetingCancellationMessage, 'Sender' | 'ToRecipients' | 'CcRecipients' | 'BccRecipients' | 'IsReadReceiptRequested' | 'IsDeliveryReceiptRequested' | 'ConversationIndex' | 'ConversationTopic' | 'From' | 'InternetMessageId' | 'IsRead' | 'IsResponseRequested' | 'References' | 'ReplyTo' | 'ReceivedBy' | 'ReceivedRepresenting' | 'LikeCount' | 'Likers' | 'IsGroupEscalationMessage' | 'MessageResponseType' | 'SenderSMTPAddress' | 'TailoredXpCalendarEventIds' | 'Charm' | 'TailoredXpEntitiesStatus' | 'LastAction' | 'ViaInFrom' | 'AntispamUnauthenticatedSender' | 'CouponRanks' | 'CouponExpiryDates' | 'Coupons' | 'AmpHtmlBody' | 'OwnerReactionType' | 'ParentMessageId'>
  & { ApprovalRequestData?: Types.Maybe<(
    { __typename?: 'ApprovalRequestDataType' }
    & Pick<Types.ApprovalRequestDataType, 'IsUndecidedApprovalRequest' | 'ApprovalDecision' | 'ApprovalDecisionMaker' | 'ApprovalDecisionTime'>
  )>, VotingInformation?: Types.Maybe<(
    { __typename?: 'VotingInformationType' }
    & Pick<Types.VotingInformationType, 'VotingResponse'>
    & { UserOptions?: Types.Maybe<Array<(
      { __typename?: 'VotingOptionDataType' }
      & Pick<Types.VotingOptionDataType, 'DisplayName' | 'SendPrompt'>
    )>> }
  )>, ReminderMessageData?: Types.Maybe<(
    { __typename?: 'ReminderMessageDataType' }
    & Pick<Types.ReminderMessageDataType, 'ReminderText' | 'Location' | 'StartTime' | 'EndTime' | 'AssociatedCalendarItemId'>
  )>, ModernReminders?: Types.Maybe<Array<(
    { __typename?: 'ModernReminderType' }
    & Pick<Types.ModernReminderType, 'Id' | 'ReminderTimeHint' | 'Hours' | 'Priority' | 'Duration' | 'ReferenceTime' | 'CustomReminderTime' | 'DueDate'>
  )>>, RecipientCounts?: Types.Maybe<(
    { __typename?: 'RecipientCountsType' }
    & Pick<Types.RecipientCountsType, 'ToRecipientsCount' | 'CcRecipientsCount' | 'BccRecipientsCount'>
  )>, MessageSafety?: Types.Maybe<(
    { __typename?: 'MessageSafetyType' }
    & Pick<Types.MessageSafetyType, 'MessageSafetyLevel' | 'MessageSafetyReason' | 'Info'>
  )>, Reactions?: Types.Maybe<Array<(
    { __typename?: 'ReactionsGroupedByType' }
    & Pick<Types.ReactionsGroupedByType, 'ReactionType' | 'Count'>
    & { Reactors?: Types.Maybe<Array<(
      { __typename?: 'Reactor' }
      & Pick<Types.Reactor, 'ReactorEmail' | 'ReactionTime'>
    )>> }
  )>> }
  & AllGenericItemFields_MeetingCancellationMessage_Fragment
);

export type AllMessageFields_MeetingMessage_Fragment = (
  { __typename?: 'MeetingMessage' }
  & Pick<Types.MeetingMessage, 'Sender' | 'ToRecipients' | 'CcRecipients' | 'BccRecipients' | 'IsReadReceiptRequested' | 'IsDeliveryReceiptRequested' | 'ConversationIndex' | 'ConversationTopic' | 'From' | 'InternetMessageId' | 'IsRead' | 'IsResponseRequested' | 'References' | 'ReplyTo' | 'ReceivedBy' | 'ReceivedRepresenting' | 'LikeCount' | 'Likers' | 'IsGroupEscalationMessage' | 'MessageResponseType' | 'SenderSMTPAddress' | 'TailoredXpCalendarEventIds' | 'Charm' | 'TailoredXpEntitiesStatus' | 'LastAction' | 'ViaInFrom' | 'AntispamUnauthenticatedSender' | 'CouponRanks' | 'CouponExpiryDates' | 'Coupons' | 'AmpHtmlBody' | 'OwnerReactionType' | 'ParentMessageId'>
  & { ApprovalRequestData?: Types.Maybe<(
    { __typename?: 'ApprovalRequestDataType' }
    & Pick<Types.ApprovalRequestDataType, 'IsUndecidedApprovalRequest' | 'ApprovalDecision' | 'ApprovalDecisionMaker' | 'ApprovalDecisionTime'>
  )>, VotingInformation?: Types.Maybe<(
    { __typename?: 'VotingInformationType' }
    & Pick<Types.VotingInformationType, 'VotingResponse'>
    & { UserOptions?: Types.Maybe<Array<(
      { __typename?: 'VotingOptionDataType' }
      & Pick<Types.VotingOptionDataType, 'DisplayName' | 'SendPrompt'>
    )>> }
  )>, ReminderMessageData?: Types.Maybe<(
    { __typename?: 'ReminderMessageDataType' }
    & Pick<Types.ReminderMessageDataType, 'ReminderText' | 'Location' | 'StartTime' | 'EndTime' | 'AssociatedCalendarItemId'>
  )>, ModernReminders?: Types.Maybe<Array<(
    { __typename?: 'ModernReminderType' }
    & Pick<Types.ModernReminderType, 'Id' | 'ReminderTimeHint' | 'Hours' | 'Priority' | 'Duration' | 'ReferenceTime' | 'CustomReminderTime' | 'DueDate'>
  )>>, RecipientCounts?: Types.Maybe<(
    { __typename?: 'RecipientCountsType' }
    & Pick<Types.RecipientCountsType, 'ToRecipientsCount' | 'CcRecipientsCount' | 'BccRecipientsCount'>
  )>, MessageSafety?: Types.Maybe<(
    { __typename?: 'MessageSafetyType' }
    & Pick<Types.MessageSafetyType, 'MessageSafetyLevel' | 'MessageSafetyReason' | 'Info'>
  )>, Reactions?: Types.Maybe<Array<(
    { __typename?: 'ReactionsGroupedByType' }
    & Pick<Types.ReactionsGroupedByType, 'ReactionType' | 'Count'>
    & { Reactors?: Types.Maybe<Array<(
      { __typename?: 'Reactor' }
      & Pick<Types.Reactor, 'ReactorEmail' | 'ReactionTime'>
    )>> }
  )>> }
  & AllGenericItemFields_MeetingMessage_Fragment
);

export type AllMessageFields_MeetingRequestMessage_Fragment = (
  { __typename?: 'MeetingRequestMessage' }
  & Pick<Types.MeetingRequestMessage, 'Sender' | 'ToRecipients' | 'CcRecipients' | 'BccRecipients' | 'IsReadReceiptRequested' | 'IsDeliveryReceiptRequested' | 'ConversationIndex' | 'ConversationTopic' | 'From' | 'InternetMessageId' | 'IsRead' | 'IsResponseRequested' | 'References' | 'ReplyTo' | 'ReceivedBy' | 'ReceivedRepresenting' | 'LikeCount' | 'Likers' | 'IsGroupEscalationMessage' | 'MessageResponseType' | 'SenderSMTPAddress' | 'TailoredXpCalendarEventIds' | 'Charm' | 'TailoredXpEntitiesStatus' | 'LastAction' | 'ViaInFrom' | 'AntispamUnauthenticatedSender' | 'CouponRanks' | 'CouponExpiryDates' | 'Coupons' | 'AmpHtmlBody' | 'OwnerReactionType' | 'ParentMessageId'>
  & { ApprovalRequestData?: Types.Maybe<(
    { __typename?: 'ApprovalRequestDataType' }
    & Pick<Types.ApprovalRequestDataType, 'IsUndecidedApprovalRequest' | 'ApprovalDecision' | 'ApprovalDecisionMaker' | 'ApprovalDecisionTime'>
  )>, VotingInformation?: Types.Maybe<(
    { __typename?: 'VotingInformationType' }
    & Pick<Types.VotingInformationType, 'VotingResponse'>
    & { UserOptions?: Types.Maybe<Array<(
      { __typename?: 'VotingOptionDataType' }
      & Pick<Types.VotingOptionDataType, 'DisplayName' | 'SendPrompt'>
    )>> }
  )>, ReminderMessageData?: Types.Maybe<(
    { __typename?: 'ReminderMessageDataType' }
    & Pick<Types.ReminderMessageDataType, 'ReminderText' | 'Location' | 'StartTime' | 'EndTime' | 'AssociatedCalendarItemId'>
  )>, ModernReminders?: Types.Maybe<Array<(
    { __typename?: 'ModernReminderType' }
    & Pick<Types.ModernReminderType, 'Id' | 'ReminderTimeHint' | 'Hours' | 'Priority' | 'Duration' | 'ReferenceTime' | 'CustomReminderTime' | 'DueDate'>
  )>>, RecipientCounts?: Types.Maybe<(
    { __typename?: 'RecipientCountsType' }
    & Pick<Types.RecipientCountsType, 'ToRecipientsCount' | 'CcRecipientsCount' | 'BccRecipientsCount'>
  )>, MessageSafety?: Types.Maybe<(
    { __typename?: 'MessageSafetyType' }
    & Pick<Types.MessageSafetyType, 'MessageSafetyLevel' | 'MessageSafetyReason' | 'Info'>
  )>, Reactions?: Types.Maybe<Array<(
    { __typename?: 'ReactionsGroupedByType' }
    & Pick<Types.ReactionsGroupedByType, 'ReactionType' | 'Count'>
    & { Reactors?: Types.Maybe<Array<(
      { __typename?: 'Reactor' }
      & Pick<Types.Reactor, 'ReactorEmail' | 'ReactionTime'>
    )>> }
  )>> }
  & AllGenericItemFields_MeetingRequestMessage_Fragment
);

export type AllMessageFields_MeetingResponseMessage_Fragment = (
  { __typename?: 'MeetingResponseMessage' }
  & Pick<Types.MeetingResponseMessage, 'Sender' | 'ToRecipients' | 'CcRecipients' | 'BccRecipients' | 'IsReadReceiptRequested' | 'IsDeliveryReceiptRequested' | 'ConversationIndex' | 'ConversationTopic' | 'From' | 'InternetMessageId' | 'IsRead' | 'IsResponseRequested' | 'References' | 'ReplyTo' | 'ReceivedBy' | 'ReceivedRepresenting' | 'LikeCount' | 'Likers' | 'IsGroupEscalationMessage' | 'MessageResponseType' | 'SenderSMTPAddress' | 'TailoredXpCalendarEventIds' | 'Charm' | 'TailoredXpEntitiesStatus' | 'LastAction' | 'ViaInFrom' | 'AntispamUnauthenticatedSender' | 'CouponRanks' | 'CouponExpiryDates' | 'Coupons' | 'AmpHtmlBody' | 'OwnerReactionType' | 'ParentMessageId'>
  & { ApprovalRequestData?: Types.Maybe<(
    { __typename?: 'ApprovalRequestDataType' }
    & Pick<Types.ApprovalRequestDataType, 'IsUndecidedApprovalRequest' | 'ApprovalDecision' | 'ApprovalDecisionMaker' | 'ApprovalDecisionTime'>
  )>, VotingInformation?: Types.Maybe<(
    { __typename?: 'VotingInformationType' }
    & Pick<Types.VotingInformationType, 'VotingResponse'>
    & { UserOptions?: Types.Maybe<Array<(
      { __typename?: 'VotingOptionDataType' }
      & Pick<Types.VotingOptionDataType, 'DisplayName' | 'SendPrompt'>
    )>> }
  )>, ReminderMessageData?: Types.Maybe<(
    { __typename?: 'ReminderMessageDataType' }
    & Pick<Types.ReminderMessageDataType, 'ReminderText' | 'Location' | 'StartTime' | 'EndTime' | 'AssociatedCalendarItemId'>
  )>, ModernReminders?: Types.Maybe<Array<(
    { __typename?: 'ModernReminderType' }
    & Pick<Types.ModernReminderType, 'Id' | 'ReminderTimeHint' | 'Hours' | 'Priority' | 'Duration' | 'ReferenceTime' | 'CustomReminderTime' | 'DueDate'>
  )>>, RecipientCounts?: Types.Maybe<(
    { __typename?: 'RecipientCountsType' }
    & Pick<Types.RecipientCountsType, 'ToRecipientsCount' | 'CcRecipientsCount' | 'BccRecipientsCount'>
  )>, MessageSafety?: Types.Maybe<(
    { __typename?: 'MessageSafetyType' }
    & Pick<Types.MessageSafetyType, 'MessageSafetyLevel' | 'MessageSafetyReason' | 'Info'>
  )>, Reactions?: Types.Maybe<Array<(
    { __typename?: 'ReactionsGroupedByType' }
    & Pick<Types.ReactionsGroupedByType, 'ReactionType' | 'Count'>
    & { Reactors?: Types.Maybe<Array<(
      { __typename?: 'Reactor' }
      & Pick<Types.Reactor, 'ReactorEmail' | 'ReactionTime'>
    )>> }
  )>> }
  & AllGenericItemFields_MeetingResponseMessage_Fragment
);

export type AllMessageFields_Message_Fragment = (
  { __typename?: 'Message' }
  & Pick<Types.Message, 'Sender' | 'ToRecipients' | 'CcRecipients' | 'BccRecipients' | 'IsReadReceiptRequested' | 'IsDeliveryReceiptRequested' | 'ConversationIndex' | 'ConversationTopic' | 'From' | 'InternetMessageId' | 'IsRead' | 'IsResponseRequested' | 'References' | 'ReplyTo' | 'ReceivedBy' | 'ReceivedRepresenting' | 'LikeCount' | 'Likers' | 'IsGroupEscalationMessage' | 'MessageResponseType' | 'SenderSMTPAddress' | 'TailoredXpCalendarEventIds' | 'Charm' | 'TailoredXpEntitiesStatus' | 'LastAction' | 'ViaInFrom' | 'AntispamUnauthenticatedSender' | 'CouponRanks' | 'CouponExpiryDates' | 'Coupons' | 'AmpHtmlBody' | 'OwnerReactionType' | 'ParentMessageId'>
  & { ApprovalRequestData?: Types.Maybe<(
    { __typename?: 'ApprovalRequestDataType' }
    & Pick<Types.ApprovalRequestDataType, 'IsUndecidedApprovalRequest' | 'ApprovalDecision' | 'ApprovalDecisionMaker' | 'ApprovalDecisionTime'>
  )>, VotingInformation?: Types.Maybe<(
    { __typename?: 'VotingInformationType' }
    & Pick<Types.VotingInformationType, 'VotingResponse'>
    & { UserOptions?: Types.Maybe<Array<(
      { __typename?: 'VotingOptionDataType' }
      & Pick<Types.VotingOptionDataType, 'DisplayName' | 'SendPrompt'>
    )>> }
  )>, ReminderMessageData?: Types.Maybe<(
    { __typename?: 'ReminderMessageDataType' }
    & Pick<Types.ReminderMessageDataType, 'ReminderText' | 'Location' | 'StartTime' | 'EndTime' | 'AssociatedCalendarItemId'>
  )>, ModernReminders?: Types.Maybe<Array<(
    { __typename?: 'ModernReminderType' }
    & Pick<Types.ModernReminderType, 'Id' | 'ReminderTimeHint' | 'Hours' | 'Priority' | 'Duration' | 'ReferenceTime' | 'CustomReminderTime' | 'DueDate'>
  )>>, RecipientCounts?: Types.Maybe<(
    { __typename?: 'RecipientCountsType' }
    & Pick<Types.RecipientCountsType, 'ToRecipientsCount' | 'CcRecipientsCount' | 'BccRecipientsCount'>
  )>, MessageSafety?: Types.Maybe<(
    { __typename?: 'MessageSafetyType' }
    & Pick<Types.MessageSafetyType, 'MessageSafetyLevel' | 'MessageSafetyReason' | 'Info'>
  )>, Reactions?: Types.Maybe<Array<(
    { __typename?: 'ReactionsGroupedByType' }
    & Pick<Types.ReactionsGroupedByType, 'ReactionType' | 'Count'>
    & { Reactors?: Types.Maybe<Array<(
      { __typename?: 'Reactor' }
      & Pick<Types.Reactor, 'ReactorEmail' | 'ReactionTime'>
    )>> }
  )>> }
  & AllGenericItemFields_Message_Fragment
);

export type AllMessageFieldsFragment = AllMessageFields_MeetingCancellationMessage_Fragment | AllMessageFields_MeetingMessage_Fragment | AllMessageFields_MeetingRequestMessage_Fragment | AllMessageFields_MeetingResponseMessage_Fragment | AllMessageFields_Message_Fragment;

export type AllMeetingMessageFields_MeetingCancellationMessage_Fragment = (
  { __typename?: 'MeetingCancellationMessage' }
  & Pick<Types.MeetingCancellationMessage, 'AssociatedCalendarItemId' | 'IsDelegated' | 'IsOutOfDate' | 'HasBeenProcessed' | 'ResponseType' | 'UID' | 'RecurrenceId' | 'DateTimeStamp' | 'IsOrganizer' | 'IsNonPatternRecurring' | 'IsNPROccurrenceUpdate' | 'IsMeetingPollEvent' | 'AssociatedSharedCalendarId' | 'AssociatedSharedCalendarItemId'>
  & AllMessageFields_MeetingCancellationMessage_Fragment
);

export type AllMeetingMessageFields_MeetingMessage_Fragment = (
  { __typename?: 'MeetingMessage' }
  & Pick<Types.MeetingMessage, 'AssociatedCalendarItemId' | 'IsDelegated' | 'IsOutOfDate' | 'HasBeenProcessed' | 'ResponseType' | 'UID' | 'RecurrenceId' | 'DateTimeStamp' | 'IsOrganizer' | 'IsNonPatternRecurring' | 'IsNPROccurrenceUpdate' | 'IsMeetingPollEvent' | 'AssociatedSharedCalendarId' | 'AssociatedSharedCalendarItemId'>
  & AllMessageFields_MeetingMessage_Fragment
);

export type AllMeetingMessageFields_MeetingRequestMessage_Fragment = (
  { __typename?: 'MeetingRequestMessage' }
  & Pick<Types.MeetingRequestMessage, 'AssociatedCalendarItemId' | 'IsDelegated' | 'IsOutOfDate' | 'HasBeenProcessed' | 'ResponseType' | 'UID' | 'RecurrenceId' | 'DateTimeStamp' | 'IsOrganizer' | 'IsNonPatternRecurring' | 'IsNPROccurrenceUpdate' | 'IsMeetingPollEvent' | 'AssociatedSharedCalendarId' | 'AssociatedSharedCalendarItemId'>
  & AllMessageFields_MeetingRequestMessage_Fragment
);

export type AllMeetingMessageFields_MeetingResponseMessage_Fragment = (
  { __typename?: 'MeetingResponseMessage' }
  & Pick<Types.MeetingResponseMessage, 'AssociatedCalendarItemId' | 'IsDelegated' | 'IsOutOfDate' | 'HasBeenProcessed' | 'ResponseType' | 'UID' | 'RecurrenceId' | 'DateTimeStamp' | 'IsOrganizer' | 'IsNonPatternRecurring' | 'IsNPROccurrenceUpdate' | 'IsMeetingPollEvent' | 'AssociatedSharedCalendarId' | 'AssociatedSharedCalendarItemId'>
  & AllMessageFields_MeetingResponseMessage_Fragment
);

export type AllMeetingMessageFieldsFragment = AllMeetingMessageFields_MeetingCancellationMessage_Fragment | AllMeetingMessageFields_MeetingMessage_Fragment | AllMeetingMessageFields_MeetingRequestMessage_Fragment | AllMeetingMessageFields_MeetingResponseMessage_Fragment;

export type AllMeetingResponseMessageFieldsFragment = (
  { __typename?: 'MeetingResponseMessage' }
  & Pick<Types.MeetingResponseMessage, 'Start' | 'End' | 'CalendarItemType' | 'ProposedStart' | 'ProposedEnd' | 'StartTimeZoneId' | 'EndTimeZoneId'>
  & { Recurrence?: Types.Maybe<(
    { __typename?: 'RecurrenceType' }
    & AllRecurrenceFieldsFragment
  )>, Location?: Types.Maybe<(
    { __typename?: 'EnhancedLocation' }
    & AllEnhancedLocationFieldsFragment
  )> }
  & AllMeetingMessageFields_MeetingResponseMessage_Fragment
);

export type AllMeetingCancellationMessageFieldsFragment = (
  { __typename?: 'MeetingCancellationMessage' }
  & Pick<Types.MeetingCancellationMessage, 'Start' | 'End' | 'CalendarItemType' | 'StartTimeZoneId' | 'EndTimeZoneId'>
  & { Recurrence?: Types.Maybe<(
    { __typename?: 'RecurrenceType' }
    & AllRecurrenceFieldsFragment
  )>, Location?: Types.Maybe<(
    { __typename?: 'EnhancedLocation' }
    & AllEnhancedLocationFieldsFragment
  )> }
  & AllMeetingMessageFields_MeetingCancellationMessage_Fragment
);

export type AllOccurrenceInfoFieldsFragment = (
  { __typename?: 'OccurrenceInfo' }
  & Pick<Types.OccurrenceInfo, 'ItemId' | 'Start' | 'End' | 'OriginalStart'>
);

export type MeetingMessageCalendarItemFieldsFragment = (
  { __typename?: 'CalendarItem' }
  & Pick<Types.CalendarItem, 'ItemId' | 'Subject' | 'Start' | 'End' | 'FreeBusyType' | 'IsAllDayEvent'>
);

export type TimeChangeFieldsFragment = (
  { __typename?: 'TimeChange' }
  & Pick<Types.TimeChange, 'Offset' | 'AbsoluteDate' | 'Time' | 'TimeZoneName'>
  & { RelativeYearlyRecurrence?: Types.Maybe<(
    { __typename?: 'RelativeYearlyRecurrence' }
    & Pick<Types.RelativeYearlyRecurrence, 'DaysOfWeek' | 'DayOfWeekIndex' | 'Month'>
  )> }
);

export type AllMeetingRequestMessageFieldsFragment = (
  { __typename?: 'MeetingRequestMessage' }
  & Pick<Types.MeetingRequestMessage, 'MeetingRequestType' | 'IntendedFreeBusyStatus' | 'Start' | 'End' | 'OriginalStart' | 'IsAllDayEvent' | 'FreeBusyType' | 'When' | 'IsMeeting' | 'IsCancelled' | 'IsRecurring' | 'MeetingRequestWasSent' | 'CalendarItemType' | 'MyResponseType' | 'Organizer' | 'ConflictingMeetingCount' | 'AdjacentMeetingCount' | 'Duration' | 'TimeZone' | 'AppointmentReplyTime' | 'AppointmentSequenceInt' | 'AppointmentState' | 'ConferenceType' | 'AllowNewTimeProposal' | 'IsOnlineMeeting' | 'MeetingWorkspaceUrl' | 'NetShowUrl' | 'StartWallClock' | 'EndWallClock' | 'StartTimeZoneId' | 'EndTimeZoneId' | 'MeetingNotesWebUrl' | 'DoNotForwardMeeting'>
  & { RequiredAttendees?: Types.Maybe<Array<(
    { __typename?: 'Attendee' }
    & AllAttendeeFieldsFragment
  )>>, OptionalAttendees?: Types.Maybe<Array<(
    { __typename?: 'Attendee' }
    & AllAttendeeFieldsFragment
  )>>, Resources?: Types.Maybe<Array<(
    { __typename?: 'Attendee' }
    & AllAttendeeFieldsFragment
  )>>, ConflictingMeetings?: Types.Maybe<(
    { __typename?: 'NonEmptyArrayOfMeetingsType' }
    & { Items?: Types.Maybe<Array<(
      { __typename?: 'CalendarItem' }
      & MeetingMessageCalendarItemFieldsFragment
    )>> }
  )>, AdjacentMeetings?: Types.Maybe<(
    { __typename?: 'NonEmptyArrayOfMeetingsType' }
    & { Items?: Types.Maybe<Array<(
      { __typename?: 'CalendarItem' }
      & MeetingMessageCalendarItemFieldsFragment
    )>> }
  )>, Recurrence?: Types.Maybe<(
    { __typename?: 'RecurrenceType' }
    & AllRecurrenceFieldsFragment
  )>, FirstOccurrence?: Types.Maybe<(
    { __typename?: 'OccurrenceInfo' }
    & AllOccurrenceInfoFieldsFragment
  )>, LastOccurrence?: Types.Maybe<(
    { __typename?: 'OccurrenceInfo' }
    & AllOccurrenceInfoFieldsFragment
  )>, ModifiedOccurrences?: Types.Maybe<Array<(
    { __typename?: 'OccurrenceInfo' }
    & AllOccurrenceInfoFieldsFragment
  )>>, DeletedOccurrences?: Types.Maybe<Array<(
    { __typename?: 'DeletedOccurrenceInfo' }
    & Pick<Types.DeletedOccurrenceInfo, 'Start'>
  )>>, MeetingTimeZone?: Types.Maybe<(
    { __typename?: 'TimeZone' }
    & Pick<Types.TimeZone, 'BaseOffset' | 'TimeZoneName'>
    & { Standard?: Types.Maybe<(
      { __typename?: 'TimeChange' }
      & TimeChangeFieldsFragment
    )>, Daylight?: Types.Maybe<(
      { __typename?: 'TimeChange' }
      & TimeChangeFieldsFragment
    )> }
  )>, StartTimeZone?: Types.Maybe<(
    { __typename?: 'TimeZoneDefinition' }
    & Pick<Types.TimeZoneDefinition, 'Name' | 'Id'>
    & { Periods?: Types.Maybe<Array<(
      { __typename?: 'Period' }
      & Pick<Types.Period, 'Bias' | 'Name' | 'Id'>
    )>>, TransitionsGroups?: Types.Maybe<Array<(
      { __typename?: 'ArrayOfTransitions' }
      & Pick<Types.ArrayOfTransitions, 'Id'>
      & { Transition?: Types.Maybe<Array<(
        { __typename?: 'Transition' }
        & { To?: Types.Maybe<(
          { __typename?: 'TransitionTargetType' }
          & Pick<Types.TransitionTargetType, 'Kind' | 'Value'>
        )> }
      )>> }
    )>>, Transitions?: Types.Maybe<(
      { __typename?: 'ArrayOfTransitions' }
      & Pick<Types.ArrayOfTransitions, 'Id'>
      & { Transition?: Types.Maybe<Array<(
        { __typename?: 'Transition' }
        & { To?: Types.Maybe<(
          { __typename?: 'TransitionTargetType' }
          & Pick<Types.TransitionTargetType, 'Kind' | 'Value'>
        )> }
      )>> }
    )> }
  )>, EndTimeZone?: Types.Maybe<(
    { __typename?: 'TimeZoneDefinition' }
    & Pick<Types.TimeZoneDefinition, 'Name' | 'Id'>
    & { Periods?: Types.Maybe<Array<(
      { __typename?: 'Period' }
      & Pick<Types.Period, 'Bias' | 'Name' | 'Id'>
    )>>, TransitionsGroups?: Types.Maybe<Array<(
      { __typename?: 'ArrayOfTransitions' }
      & Pick<Types.ArrayOfTransitions, 'Id'>
      & { Transition?: Types.Maybe<Array<(
        { __typename?: 'Transition' }
        & { To?: Types.Maybe<(
          { __typename?: 'TransitionTargetType' }
          & Pick<Types.TransitionTargetType, 'Kind' | 'Value'>
        )> }
      )>> }
    )>>, Transitions?: Types.Maybe<(
      { __typename?: 'ArrayOfTransitions' }
      & Pick<Types.ArrayOfTransitions, 'Id'>
      & { Transition?: Types.Maybe<Array<(
        { __typename?: 'Transition' }
        & { To?: Types.Maybe<(
          { __typename?: 'TransitionTargetType' }
          & Pick<Types.TransitionTargetType, 'Kind' | 'Value'>
        )> }
      )>> }
    )> }
  )>, Location?: Types.Maybe<(
    { __typename?: 'EnhancedLocation' }
    & AllEnhancedLocationFieldsFragment
  )>, ChangeHighlights?: Types.Maybe<(
    { __typename?: 'ChangeHighlights' }
    & Pick<Types.ChangeHighlights, 'HasLocationChanged' | 'Location' | 'HasStartTimeChanged' | 'Start' | 'HasEndTimeChanged' | 'End' | 'HasSubjectChanged' | 'HasBodyChanged' | 'HasOnlineMeetingUrlChanged' | 'HasRecurrenceChanged'>
  )>, AttendeeCounts?: Types.Maybe<(
    { __typename?: 'AttendeeCounts' }
    & Pick<Types.AttendeeCounts, 'RequiredAttendeesCount' | 'OptionalAttendeesCount' | 'ResourcesCount'>
  )> }
  & AllMeetingMessageFields_MeetingRequestMessage_Fragment
);

export type AllFieldsFromAnyItem_CalendarItem_Fragment = { __typename?: 'CalendarItem' };

export type AllFieldsFromAnyItem_Item_Fragment = (
  { __typename?: 'Item' }
  & AllGenericItemFields_Item_Fragment
);

export type AllFieldsFromAnyItem_MeetingCancellationMessage_Fragment = (
  { __typename?: 'MeetingCancellationMessage' }
  & AllMeetingCancellationMessageFieldsFragment
);

export type AllFieldsFromAnyItem_MeetingMessage_Fragment = (
  { __typename?: 'MeetingMessage' }
  & AllMeetingMessageFields_MeetingMessage_Fragment
);

export type AllFieldsFromAnyItem_MeetingRequestMessage_Fragment = (
  { __typename?: 'MeetingRequestMessage' }
  & AllMeetingRequestMessageFieldsFragment
);

export type AllFieldsFromAnyItem_MeetingResponseMessage_Fragment = (
  { __typename?: 'MeetingResponseMessage' }
  & AllMeetingResponseMessageFieldsFragment
);

export type AllFieldsFromAnyItem_Message_Fragment = (
  { __typename?: 'Message' }
  & AllMessageFields_Message_Fragment
);

export type AllFieldsFromAnyItemFragment = AllFieldsFromAnyItem_CalendarItem_Fragment | AllFieldsFromAnyItem_Item_Fragment | AllFieldsFromAnyItem_MeetingCancellationMessage_Fragment | AllFieldsFromAnyItem_MeetingMessage_Fragment | AllFieldsFromAnyItem_MeetingRequestMessage_Fragment | AllFieldsFromAnyItem_MeetingResponseMessage_Fragment | AllFieldsFromAnyItem_Message_Fragment;

export type GetFullConversationByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  limit?: Types.Maybe<Types.Scalars['Int']>;
  options: Types.InputGetConversationItemsOptions;
  mailboxInfo?: Types.Maybe<Types.MailboxInfoInput>;
}>;


export type GetFullConversationByIdQuery = (
  { __typename: 'Query' }
  & { conversation?: Types.Maybe<(
    { __typename?: 'Conversation' }
    & Pick<Types.Conversation, 'id' | 'syncState' | 'totalConversationNodesCount' | 'lastModifiedTime' | 'canDelete' | 'isLocked' | 'conversationDiagnosticsInfo'>
    & { toRecipients?: Types.Maybe<Array<Types.Maybe<(
      { __typename?: 'Recipient' }
      & Pick<Types.Recipient, 'id' | 'name' | 'emailAddress' | 'routingType' | 'mailboxType' | 'sipUri' | 'submitted' | 'originalDisplayName' | 'emailAddressIndex' | 'relevanceScore' | 'isExternalSmtpAddress' | 'isDomainInOrganization'>
    )>>>, ccRecipients?: Types.Maybe<Array<Types.Maybe<(
      { __typename?: 'Recipient' }
      & Pick<Types.Recipient, 'id' | 'name' | 'emailAddress' | 'routingType' | 'mailboxType' | 'sipUri' | 'submitted' | 'originalDisplayName' | 'emailAddressIndex' | 'relevanceScore' | 'isExternalSmtpAddress' | 'isDomainInOrganization'>
    )>>>, conversationNodes?: Types.Maybe<(
      { __typename?: 'ConversationToConversationNodesConnection' }
      & { edges: Array<Types.Maybe<(
        { __typename?: 'ConversationConversationNodesEdge' }
        & Pick<Types.ConversationConversationNodesEdge, 'cursor'>
        & { node?: Types.Maybe<(
          { __typename?: 'ConversationNode' }
          & Pick<Types.ConversationNode, 'id' | 'InternetMessageId' | 'ParentInternetMessageId' | 'QuotedTextState' | 'IsQuotedTextChanged' | 'HasQuotedText' | 'QuotedTextList'>
          & { Items: Array<(
            { __typename?: 'Item' }
            & AllFieldsFromAnyItem_Item_Fragment
          ) | (
            { __typename?: 'Message' }
            & AllFieldsFromAnyItem_Message_Fragment
          ) | (
            { __typename?: 'MeetingMessage' }
            & AllFieldsFromAnyItem_MeetingMessage_Fragment
          ) | (
            { __typename?: 'MeetingResponseMessage' }
            & AllFieldsFromAnyItem_MeetingResponseMessage_Fragment
          ) | (
            { __typename?: 'MeetingRequestMessage' }
            & AllFieldsFromAnyItem_MeetingRequestMessage_Fragment
          ) | (
            { __typename?: 'MeetingCancellationMessage' }
            & AllFieldsFromAnyItem_MeetingCancellationMessage_Fragment
          )> }
        )> }
      )>>, pageInfo: (
        { __typename?: 'PageInfo' }
        & Pick<Types.PageInfo, 'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'>
      ) }
    )> }
  )> }
);

export const AllGenericItemFieldsFragmentDoc: DocumentNode<AllGenericItemFieldsFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AllGenericItemFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GenericItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ItemId"}},{"kind":"Field","name":{"kind":"Name","value":"ConversationId"}},{"kind":"Field","name":{"kind":"Name","value":"ParentFolderId"}},{"kind":"Field","name":{"kind":"Name","value":"Apps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Id"}},{"kind":"Field","name":{"kind":"Name","value":"Notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Key"}},{"kind":"Field","name":{"kind":"Name","value":"Type"}},{"kind":"Field","name":{"kind":"Name","value":"Message"}},{"kind":"Field","name":{"kind":"Name","value":"Icon"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"ArchiveTag"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"IsExplicit"}},{"kind":"Field","name":{"kind":"Name","value":"Value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"OwsTypeName"}},{"kind":"Field","name":{"kind":"Name","value":"AttachmentId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"AttachmentOriginalUrl"}},{"kind":"Field","name":{"kind":"Name","value":"ContentId"}},{"kind":"Field","name":{"kind":"Name","value":"ContentLocation"}},{"kind":"Field","name":{"kind":"Name","value":"ContentType"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"IsInline"}},{"kind":"Field","name":{"kind":"Name","value":"IsInlineToNormalBody"}},{"kind":"Field","name":{"kind":"Name","value":"IsInlineToUniqueBody"}},{"kind":"Field","name":{"kind":"Name","value":"LastModifiedTime"}},{"kind":"Field","name":{"kind":"Name","value":"Name"}},{"kind":"Field","name":{"kind":"Name","value":"Size"}},{"kind":"Field","name":{"kind":"Name","value":"Thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"ThumbnailMimeType"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ReferenceAttachment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ProviderType"}},{"kind":"Field","name":{"kind":"Name","value":"WebUrl"}},{"kind":"Field","name":{"kind":"Name","value":"AttachLongPathName"}},{"kind":"Field","name":{"kind":"Name","value":"AttachmentThumbnailUrl"}},{"kind":"Field","name":{"kind":"Name","value":"AttachmentPreviewUrl"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"BlockStatus"}},{"kind":"Field","name":{"kind":"Name","value":"Body"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"BodyType"}},{"kind":"Field","name":{"kind":"Name","value":"Value"}},{"kind":"Field","name":{"kind":"Name","value":"QuotedText"}},{"kind":"Field","name":{"kind":"Name","value":"IsTruncated"}},{"kind":"Field","name":{"kind":"Name","value":"UTF8BodySize"}},{"kind":"Field","name":{"kind":"Name","value":"BodyFragmentInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"StartOffset"}},{"kind":"Field","name":{"kind":"Name","value":"EndOffset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"DataUriCount"}},{"kind":"Field","name":{"kind":"Name","value":"CustomDataUriCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"CanDelete"}},{"kind":"Field","name":{"kind":"Name","value":"Categories"}},{"kind":"Field","name":{"kind":"Name","value":"ContainsOnlyMandatoryProperties"}},{"kind":"Field","name":{"kind":"Name","value":"Conversation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ConversationId"}},{"kind":"Field","name":{"kind":"Name","value":"ConversationTopic"}},{"kind":"Field","name":{"kind":"Name","value":"UniqueRecipients"}},{"kind":"Field","name":{"kind":"Name","value":"UniqueSenders"}},{"kind":"Field","name":{"kind":"Name","value":"LastDeliveryTime"}},{"kind":"Field","name":{"kind":"Name","value":"Categories"}},{"kind":"Field","name":{"kind":"Name","value":"FlagStatus"}},{"kind":"Field","name":{"kind":"Name","value":"HasAttachments"}},{"kind":"Field","name":{"kind":"Name","value":"MessageCount"}},{"kind":"Field","name":{"kind":"Name","value":"GlobalMessageCount"}},{"kind":"Field","name":{"kind":"Name","value":"UnreadCount"}},{"kind":"Field","name":{"kind":"Name","value":"GlobalUnreadCount"}},{"kind":"Field","name":{"kind":"Name","value":"Size"}},{"kind":"Field","name":{"kind":"Name","value":"ItemClasses"}},{"kind":"Field","name":{"kind":"Name","value":"Importance"}},{"kind":"Field","name":{"kind":"Name","value":"ItemIds"}},{"kind":"Field","name":{"kind":"Name","value":"GlobalItemIds"}},{"kind":"Field","name":{"kind":"Name","value":"LastModifiedTime"}},{"kind":"Field","name":{"kind":"Name","value":"InstanceKey"}},{"kind":"Field","name":{"kind":"Name","value":"Preview"}},{"kind":"Field","name":{"kind":"Name","value":"IconIndex"}},{"kind":"Field","name":{"kind":"Name","value":"DraftItemIds"}},{"kind":"Field","name":{"kind":"Name","value":"HasIrm"}},{"kind":"Field","name":{"kind":"Name","value":"GlobalLikeCount"}},{"kind":"Field","name":{"kind":"Name","value":"LastDeliveryOrRenewTime"}},{"kind":"Field","name":{"kind":"Name","value":"GlobalMentionedMe"}},{"kind":"Field","name":{"kind":"Name","value":"GlobalAtAllMention"}},{"kind":"Field","name":{"kind":"Name","value":"SortOrderSource"}},{"kind":"Field","name":{"kind":"Name","value":"LastSender"}},{"kind":"Field","name":{"kind":"Name","value":"From"}},{"kind":"Field","name":{"kind":"Name","value":"ParentFolderId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"EntityNamesMap"}},{"kind":"Field","name":{"kind":"Name","value":"HasExternalEmails"}},{"kind":"Field","name":{"kind":"Name","value":"ReturnTime"}},{"kind":"Field","name":{"kind":"Name","value":"HasSharepointLink"}},{"kind":"Field","name":{"kind":"Name","value":"HasAttachmentPreviews"}},{"kind":"Field","name":{"kind":"Name","value":"HasProcessedSharepointLink"}},{"kind":"Field","name":{"kind":"Name","value":"CouponRanks"}},{"kind":"Field","name":{"kind":"Name","value":"CouponExpiryDates"}},{"kind":"Field","name":{"kind":"Name","value":"mentionedMe"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ConversationThreadId"}},{"kind":"Field","name":{"kind":"Name","value":"DateTimeCreated"}},{"kind":"Field","name":{"kind":"Name","value":"DateTimeReceived"}},{"kind":"Field","name":{"kind":"Name","value":"DateTimeSent"}},{"kind":"Field","name":{"kind":"Name","value":"DeferredSendTime"}},{"kind":"Field","name":{"kind":"Name","value":"DisplayBcc"}},{"kind":"Field","name":{"kind":"Name","value":"DisplayCc"}},{"kind":"Field","name":{"kind":"Name","value":"DisplayTo"}},{"kind":"Field","name":{"kind":"Name","value":"DocLinks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ProviderType"}},{"kind":"Field","name":{"kind":"Name","value":"Url"}},{"kind":"Field","name":{"kind":"Name","value":"PermissionType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"EffectiveRights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"CreateAssociated"}},{"kind":"Field","name":{"kind":"Name","value":"CreateContents"}},{"kind":"Field","name":{"kind":"Name","value":"CreateHierarchy"}},{"kind":"Field","name":{"kind":"Name","value":"Delete"}},{"kind":"Field","name":{"kind":"Name","value":"Modify"}},{"kind":"Field","name":{"kind":"Name","value":"Read"}},{"kind":"Field","name":{"kind":"Name","value":"ViewPrivateItems"}}]}},{"kind":"Field","name":{"kind":"Name","value":"EntityDocument"}},{"kind":"Field","name":{"kind":"Name","value":"EntityExtractionResult"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Addresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Position"}},{"kind":"Field","name":{"kind":"Name","value":"Address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"MeetingSuggestions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Position"}},{"kind":"Field","name":{"kind":"Name","value":"Attendees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Name"}},{"kind":"Field","name":{"kind":"Name","value":"UserId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Location"}},{"kind":"Field","name":{"kind":"Name","value":"Subject"}},{"kind":"Field","name":{"kind":"Name","value":"MeetingString"}},{"kind":"Field","name":{"kind":"Name","value":"TimeStringBeginIndex"}},{"kind":"Field","name":{"kind":"Name","value":"TimeStringLength"}},{"kind":"Field","name":{"kind":"Name","value":"EntityId"}},{"kind":"Field","name":{"kind":"Name","value":"ExtractionId"}},{"kind":"Field","name":{"kind":"Name","value":"StartTime"}},{"kind":"Field","name":{"kind":"Name","value":"EndTime"}}]}},{"kind":"Field","name":{"kind":"Name","value":"TaskSuggestions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Position"}},{"kind":"Field","name":{"kind":"Name","value":"TaskString"}},{"kind":"Field","name":{"kind":"Name","value":"Assignees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Name"}},{"kind":"Field","name":{"kind":"Name","value":"UserId"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"BusinessNames"}},{"kind":"Field","name":{"kind":"Name","value":"PeopleNames"}},{"kind":"Field","name":{"kind":"Name","value":"EmailAddresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Position"}},{"kind":"Field","name":{"kind":"Name","value":"EmailAddress"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Contacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Position"}},{"kind":"Field","name":{"kind":"Name","value":"PersonName"}},{"kind":"Field","name":{"kind":"Name","value":"BusinessName"}},{"kind":"Field","name":{"kind":"Name","value":"PhoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"OriginalPhoneString"}},{"kind":"Field","name":{"kind":"Name","value":"PhoneString"}},{"kind":"Field","name":{"kind":"Name","value":"Type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Urls"}},{"kind":"Field","name":{"kind":"Name","value":"EmailAddresses"}},{"kind":"Field","name":{"kind":"Name","value":"Addresses"}},{"kind":"Field","name":{"kind":"Name","value":"ContactString"}},{"kind":"Field","name":{"kind":"Name","value":"ContactGroupsGuids"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Urls"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Position"}},{"kind":"Field","name":{"kind":"Name","value":"Url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"PhoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Position"}},{"kind":"Field","name":{"kind":"Name","value":"OriginalPhoneString"}},{"kind":"Field","name":{"kind":"Name","value":"PhoneString"}},{"kind":"Field","name":{"kind":"Name","value":"Type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ParcelDeliveries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Position"}},{"kind":"Field","name":{"kind":"Name","value":"Carrier"}},{"kind":"Field","name":{"kind":"Name","value":"TrackingNumber"}},{"kind":"Field","name":{"kind":"Name","value":"TrackingUrl"}},{"kind":"Field","name":{"kind":"Name","value":"ExpectedArrivalFrom"}},{"kind":"Field","name":{"kind":"Name","value":"ExpectedArrivalUntil"}},{"kind":"Field","name":{"kind":"Name","value":"Product"}},{"kind":"Field","name":{"kind":"Name","value":"ProductUrl"}},{"kind":"Field","name":{"kind":"Name","value":"ProductImage"}},{"kind":"Field","name":{"kind":"Name","value":"ProductSku"}},{"kind":"Field","name":{"kind":"Name","value":"ProductDescription"}},{"kind":"Field","name":{"kind":"Name","value":"ProductBrand"}},{"kind":"Field","name":{"kind":"Name","value":"ProductColor"}},{"kind":"Field","name":{"kind":"Name","value":"OrderNumber"}},{"kind":"Field","name":{"kind":"Name","value":"Seller"}},{"kind":"Field","name":{"kind":"Name","value":"OrderStatus"}},{"kind":"Field","name":{"kind":"Name","value":"AddressName"}},{"kind":"Field","name":{"kind":"Name","value":"StreetAddress"}},{"kind":"Field","name":{"kind":"Name","value":"AddressLocality"}},{"kind":"Field","name":{"kind":"Name","value":"AddressRegion"}},{"kind":"Field","name":{"kind":"Name","value":"AddressCountry"}},{"kind":"Field","name":{"kind":"Name","value":"PostalCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"FlightResevations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Position"}},{"kind":"Field","name":{"kind":"Name","value":"ReservationId"}},{"kind":"Field","name":{"kind":"Name","value":"ReservationStatus"}},{"kind":"Field","name":{"kind":"Name","value":"UnderName"}},{"kind":"Field","name":{"kind":"Name","value":"BrokerName"}},{"kind":"Field","name":{"kind":"Name","value":"BrokerPhone"}},{"kind":"Field","name":{"kind":"Name","value":"Flights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Position"}},{"kind":"Field","name":{"kind":"Name","value":"FlightNumber"}},{"kind":"Field","name":{"kind":"Name","value":"AirlineIataCode"}},{"kind":"Field","name":{"kind":"Name","value":"DepartureTime"}},{"kind":"Field","name":{"kind":"Name","value":"WindowsTimeZoneName"}},{"kind":"Field","name":{"kind":"Name","value":"DepartureAirportIataCode"}},{"kind":"Field","name":{"kind":"Name","value":"ArrivalAirportIataCode"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"SenderAddIns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Position"}},{"kind":"Field","name":{"kind":"Name","value":"ExtensionId"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"EntityNamesMap"}},{"kind":"Field","name":{"kind":"Name","value":"ErrorProperties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"PropertyPath"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BuiltInPropertyUri"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"FieldURI"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExtendedPropertyUri"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"DistinguishedPropertySetId"}},{"kind":"Field","name":{"kind":"Name","value":"PropertySetId"}},{"kind":"Field","name":{"kind":"Name","value":"PropertyTag"}},{"kind":"Field","name":{"kind":"Name","value":"PropertyName"}},{"kind":"Field","name":{"kind":"Name","value":"PropertyId"}},{"kind":"Field","name":{"kind":"Name","value":"PropertyType"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"ErrorCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ExtendedProperty"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ExtendedFieldURI"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"DistinguishedPropertySetId"}},{"kind":"Field","name":{"kind":"Name","value":"PropertySetId"}},{"kind":"Field","name":{"kind":"Name","value":"PropertyTag"}},{"kind":"Field","name":{"kind":"Name","value":"PropertyName"}},{"kind":"Field","name":{"kind":"Name","value":"PropertyId"}},{"kind":"Field","name":{"kind":"Name","value":"PropertyType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Value"}},{"kind":"Field","name":{"kind":"Name","value":"Values"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ExtensibleContentData"}},{"kind":"Field","name":{"kind":"Name","value":"FirstBody"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"BodyType"}},{"kind":"Field","name":{"kind":"Name","value":"Value"}},{"kind":"Field","name":{"kind":"Name","value":"QuotedText"}},{"kind":"Field","name":{"kind":"Name","value":"IsTruncated"}},{"kind":"Field","name":{"kind":"Name","value":"UTF8BodySize"}},{"kind":"Field","name":{"kind":"Name","value":"BodyFragmentInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"StartOffset"}},{"kind":"Field","name":{"kind":"Name","value":"EndOffset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"DataUriCount"}},{"kind":"Field","name":{"kind":"Name","value":"CustomDataUriCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Flag"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"FlagStatus"}},{"kind":"Field","name":{"kind":"Name","value":"StartDate"}},{"kind":"Field","name":{"kind":"Name","value":"DueDate"}},{"kind":"Field","name":{"kind":"Name","value":"CompleteDate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"HasAttachments"}},{"kind":"Field","name":{"kind":"Name","value":"HasBlockedImages"}},{"kind":"Field","name":{"kind":"Name","value":"Hashtags"}},{"kind":"Field","name":{"kind":"Name","value":"HasProcessedSharepointLink"}},{"kind":"Field","name":{"kind":"Name","value":"HasQuotedText"}},{"kind":"Field","name":{"kind":"Name","value":"IconIndex"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"Importance"}},{"kind":"Field","name":{"kind":"Name","value":"InferenceClassification"}},{"kind":"Field","name":{"kind":"Name","value":"InReplyTo"}},{"kind":"Field","name":{"kind":"Name","value":"InstanceKey"}},{"kind":"Field","name":{"kind":"Name","value":"IsDraft"}},{"kind":"Field","name":{"kind":"Name","value":"IsExternalSender"}},{"kind":"Field","name":{"kind":"Name","value":"IsFromMe"}},{"kind":"Field","name":{"kind":"Name","value":"IsLocked"}},{"kind":"Field","name":{"kind":"Name","value":"IsSubmitted"}},{"kind":"Field","name":{"kind":"Name","value":"ItemClass"}},{"kind":"Field","name":{"kind":"Name","value":"LastModifiedTime"}},{"kind":"Field","name":{"kind":"Name","value":"MentionedMe"}},{"kind":"Field","name":{"kind":"Name","value":"Mentions"}},{"kind":"Field","name":{"kind":"Name","value":"MentionsEx"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Mentioned"}},{"kind":"Field","name":{"kind":"Name","value":"MentionText"}},{"kind":"Field","name":{"kind":"Name","value":"ClientReference"}}]}},{"kind":"Field","name":{"kind":"Name","value":"MentionsPreview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"IsMentioned"}}]}},{"kind":"Field","name":{"kind":"Name","value":"MimeContent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"CharacterSet"}},{"kind":"Field","name":{"kind":"Name","value":"Value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"MSIPLabelGuid"}},{"kind":"Field","name":{"kind":"Name","value":"NormalizedBody"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"BodyType"}},{"kind":"Field","name":{"kind":"Name","value":"Value"}},{"kind":"Field","name":{"kind":"Name","value":"QuotedText"}},{"kind":"Field","name":{"kind":"Name","value":"IsTruncated"}},{"kind":"Field","name":{"kind":"Name","value":"UTF8BodySize"}},{"kind":"Field","name":{"kind":"Name","value":"BodyFragmentInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"StartOffset"}},{"kind":"Field","name":{"kind":"Name","value":"EndOffset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"DataUriCount"}},{"kind":"Field","name":{"kind":"Name","value":"CustomDataUriCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ParentFolderId"}},{"kind":"Field","name":{"kind":"Name","value":"PendingSocialActivityTagIds"}},{"kind":"Field","name":{"kind":"Name","value":"PolicyTag"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"IsExplicit"}},{"kind":"Field","name":{"kind":"Name","value":"Value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Preview"}},{"kind":"Field","name":{"kind":"Name","value":"PropertyExistence"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ExtractedAddresses"}},{"kind":"Field","name":{"kind":"Name","value":"ExtractedContacts"}},{"kind":"Field","name":{"kind":"Name","value":"ExtractedEmails"}},{"kind":"Field","name":{"kind":"Name","value":"ExtractedKeywords"}},{"kind":"Field","name":{"kind":"Name","value":"ExtractedMeetings"}},{"kind":"Field","name":{"kind":"Name","value":"ExtractedPhones"}},{"kind":"Field","name":{"kind":"Name","value":"ExtractedTasks"}},{"kind":"Field","name":{"kind":"Name","value":"ExtractedUrls"}},{"kind":"Field","name":{"kind":"Name","value":"WebExtNotifications"}},{"kind":"Field","name":{"kind":"Name","value":"TextEntityExtractions"}},{"kind":"Field","name":{"kind":"Name","value":"ReplyToNames"}},{"kind":"Field","name":{"kind":"Name","value":"ReplyToBlob"}},{"kind":"Field","name":{"kind":"Name","value":"UserHighlightData"}}]}},{"kind":"Field","name":{"kind":"Name","value":"QuotedTextList"}},{"kind":"Field","name":{"kind":"Name","value":"ReceivedOrRenewTime"}},{"kind":"Field","name":{"kind":"Name","value":"ReminderIsSet"}},{"kind":"Field","name":{"kind":"Name","value":"ReminderMinutesBeforeStart"}},{"kind":"Field","name":{"kind":"Name","value":"ResponseObjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ObjectName"}},{"kind":"Field","name":{"kind":"Name","value":"ReferenceItemId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"RetentionDate"}},{"kind":"Field","name":{"kind":"Name","value":"ReturnTime"}},{"kind":"Field","name":{"kind":"Name","value":"RightsManagementLicenseData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"RightsManagedMessageDecryptionStatus"}},{"kind":"Field","name":{"kind":"Name","value":"RmsTemplateId"}},{"kind":"Field","name":{"kind":"Name","value":"TemplateName"}},{"kind":"Field","name":{"kind":"Name","value":"TemplateDescription"}},{"kind":"Field","name":{"kind":"Name","value":"EditAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"ReplyAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"ReplyAllAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"ForwardAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"ModifyRecipientsAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"ExtractAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"PrintAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"ExportAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"ProgrammaticAccessAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"IsOwner"}},{"kind":"Field","name":{"kind":"Name","value":"ContentOwner"}},{"kind":"Field","name":{"kind":"Name","value":"ContentExpiryDate"}},{"kind":"Field","name":{"kind":"Name","value":"BodyType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Sensitivity"}},{"kind":"Field","name":{"kind":"Name","value":"SerializedImmutableId"}},{"kind":"Field","name":{"kind":"Name","value":"Size"}},{"kind":"Field","name":{"kind":"Name","value":"SortOrderSource"}},{"kind":"Field","name":{"kind":"Name","value":"Subject"}},{"kind":"Field","name":{"kind":"Name","value":"SystemCategories"}},{"kind":"Field","name":{"kind":"Name","value":"TailoredXpEntities"}},{"kind":"Field","name":{"kind":"Name","value":"TailoredXpEntitiesChangeNumber"}},{"kind":"Field","name":{"kind":"Name","value":"TrimmedQuotedText"}},{"kind":"Field","name":{"kind":"Name","value":"UniqueBody"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"BodyType"}},{"kind":"Field","name":{"kind":"Name","value":"Value"}},{"kind":"Field","name":{"kind":"Name","value":"QuotedText"}},{"kind":"Field","name":{"kind":"Name","value":"IsTruncated"}},{"kind":"Field","name":{"kind":"Name","value":"UTF8BodySize"}},{"kind":"Field","name":{"kind":"Name","value":"BodyFragmentInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"StartOffset"}},{"kind":"Field","name":{"kind":"Name","value":"EndOffset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"DataUriCount"}},{"kind":"Field","name":{"kind":"Name","value":"CustomDataUriCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"UniqueBottomFragment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"BodyType"}},{"kind":"Field","name":{"kind":"Name","value":"Value"}},{"kind":"Field","name":{"kind":"Name","value":"QuotedText"}},{"kind":"Field","name":{"kind":"Name","value":"IsTruncated"}},{"kind":"Field","name":{"kind":"Name","value":"UTF8BodySize"}},{"kind":"Field","name":{"kind":"Name","value":"BodyFragmentInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"StartOffset"}},{"kind":"Field","name":{"kind":"Name","value":"EndOffset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"DataUriCount"}},{"kind":"Field","name":{"kind":"Name","value":"CustomDataUriCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"UniqueTopFragment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"BodyType"}},{"kind":"Field","name":{"kind":"Name","value":"Value"}},{"kind":"Field","name":{"kind":"Name","value":"QuotedText"}},{"kind":"Field","name":{"kind":"Name","value":"IsTruncated"}},{"kind":"Field","name":{"kind":"Name","value":"UTF8BodySize"}},{"kind":"Field","name":{"kind":"Name","value":"BodyFragmentInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"StartOffset"}},{"kind":"Field","name":{"kind":"Name","value":"EndOffset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"DataUriCount"}},{"kind":"Field","name":{"kind":"Name","value":"CustomDataUriCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"UserHighlightData"}},{"kind":"Field","name":{"kind":"Name","value":"YammerNotification"}}]}}]};
export const AllMessageFieldsFragmentDoc: DocumentNode<AllMessageFieldsFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AllMessageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GenericMessage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AllGenericItemFields"}},{"kind":"Field","name":{"kind":"Name","value":"Sender"}},{"kind":"Field","name":{"kind":"Name","value":"ToRecipients"}},{"kind":"Field","name":{"kind":"Name","value":"CcRecipients"}},{"kind":"Field","name":{"kind":"Name","value":"BccRecipients"}},{"kind":"Field","name":{"kind":"Name","value":"IsReadReceiptRequested"}},{"kind":"Field","name":{"kind":"Name","value":"IsDeliveryReceiptRequested"}},{"kind":"Field","name":{"kind":"Name","value":"ConversationIndex"}},{"kind":"Field","name":{"kind":"Name","value":"ConversationTopic"}},{"kind":"Field","name":{"kind":"Name","value":"From"}},{"kind":"Field","name":{"kind":"Name","value":"InternetMessageId"}},{"kind":"Field","name":{"kind":"Name","value":"IsRead"}},{"kind":"Field","name":{"kind":"Name","value":"IsResponseRequested"}},{"kind":"Field","name":{"kind":"Name","value":"References"}},{"kind":"Field","name":{"kind":"Name","value":"ReplyTo"}},{"kind":"Field","name":{"kind":"Name","value":"ReceivedBy"}},{"kind":"Field","name":{"kind":"Name","value":"ReceivedRepresenting"}},{"kind":"Field","name":{"kind":"Name","value":"ApprovalRequestData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"IsUndecidedApprovalRequest"}},{"kind":"Field","name":{"kind":"Name","value":"ApprovalDecision"}},{"kind":"Field","name":{"kind":"Name","value":"ApprovalDecisionMaker"}},{"kind":"Field","name":{"kind":"Name","value":"ApprovalDecisionTime"}}]}},{"kind":"Field","name":{"kind":"Name","value":"VotingInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"UserOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"DisplayName"}},{"kind":"Field","name":{"kind":"Name","value":"SendPrompt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"VotingResponse"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ReminderMessageData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ReminderText"}},{"kind":"Field","name":{"kind":"Name","value":"Location"}},{"kind":"Field","name":{"kind":"Name","value":"StartTime"}},{"kind":"Field","name":{"kind":"Name","value":"EndTime"}},{"kind":"Field","name":{"kind":"Name","value":"AssociatedCalendarItemId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"LikeCount"}},{"kind":"Field","name":{"kind":"Name","value":"Likers"}},{"kind":"Field","name":{"kind":"Name","value":"ModernReminders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Id"}},{"kind":"Field","name":{"kind":"Name","value":"ReminderTimeHint"}},{"kind":"Field","name":{"kind":"Name","value":"Hours"}},{"kind":"Field","name":{"kind":"Name","value":"Priority"}},{"kind":"Field","name":{"kind":"Name","value":"Duration"}},{"kind":"Field","name":{"kind":"Name","value":"ReferenceTime"}},{"kind":"Field","name":{"kind":"Name","value":"CustomReminderTime"}},{"kind":"Field","name":{"kind":"Name","value":"DueDate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"RecipientCounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ToRecipientsCount"}},{"kind":"Field","name":{"kind":"Name","value":"CcRecipientsCount"}},{"kind":"Field","name":{"kind":"Name","value":"BccRecipientsCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"IsGroupEscalationMessage"}},{"kind":"Field","name":{"kind":"Name","value":"MessageSafety"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"MessageSafetyLevel"}},{"kind":"Field","name":{"kind":"Name","value":"MessageSafetyReason"}},{"kind":"Field","name":{"kind":"Name","value":"Info"}}]}},{"kind":"Field","name":{"kind":"Name","value":"MessageResponseType"}},{"kind":"Field","name":{"kind":"Name","value":"SenderSMTPAddress"}},{"kind":"Field","name":{"kind":"Name","value":"TailoredXpCalendarEventIds"}},{"kind":"Field","name":{"kind":"Name","value":"Charm"}},{"kind":"Field","name":{"kind":"Name","value":"TailoredXpEntitiesStatus"}},{"kind":"Field","name":{"kind":"Name","value":"LastAction"}},{"kind":"Field","name":{"kind":"Name","value":"ViaInFrom"}},{"kind":"Field","name":{"kind":"Name","value":"AntispamUnauthenticatedSender"}},{"kind":"Field","name":{"kind":"Name","value":"CouponRanks"}},{"kind":"Field","name":{"kind":"Name","value":"CouponExpiryDates"}},{"kind":"Field","name":{"kind":"Name","value":"Coupons"}},{"kind":"Field","name":{"kind":"Name","value":"AmpHtmlBody"}},{"kind":"Field","name":{"kind":"Name","value":"OwnerReactionType"}},{"kind":"Field","name":{"kind":"Name","value":"Reactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ReactionType"}},{"kind":"Field","name":{"kind":"Name","value":"Reactors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ReactorEmail"}},{"kind":"Field","name":{"kind":"Name","value":"ReactionTime"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ParentMessageId"}}]}},...AllGenericItemFieldsFragmentDoc.definitions]};
export const AllMeetingMessageFieldsFragmentDoc: DocumentNode<AllMeetingMessageFieldsFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AllMeetingMessageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GenericMeetingMessage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AllMessageFields"}},{"kind":"Field","name":{"kind":"Name","value":"AssociatedCalendarItemId"}},{"kind":"Field","name":{"kind":"Name","value":"IsDelegated"}},{"kind":"Field","name":{"kind":"Name","value":"IsOutOfDate"}},{"kind":"Field","name":{"kind":"Name","value":"HasBeenProcessed"}},{"kind":"Field","name":{"kind":"Name","value":"ResponseType"}},{"kind":"Field","name":{"kind":"Name","value":"UID"}},{"kind":"Field","name":{"kind":"Name","value":"RecurrenceId"}},{"kind":"Field","name":{"kind":"Name","value":"DateTimeStamp"}},{"kind":"Field","name":{"kind":"Name","value":"IsOrganizer"}},{"kind":"Field","name":{"kind":"Name","value":"IsNonPatternRecurring"}},{"kind":"Field","name":{"kind":"Name","value":"IsNPROccurrenceUpdate"}},{"kind":"Field","name":{"kind":"Name","value":"IsMeetingPollEvent"}},{"kind":"Field","name":{"kind":"Name","value":"AssociatedSharedCalendarId"}},{"kind":"Field","name":{"kind":"Name","value":"AssociatedSharedCalendarItemId"}}]}},...AllMessageFieldsFragmentDoc.definitions]};
export const AllMeetingResponseMessageFieldsFragmentDoc: DocumentNode<AllMeetingResponseMessageFieldsFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AllMeetingResponseMessageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MeetingResponseMessage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AllMeetingMessageFields"}},{"kind":"Field","name":{"kind":"Name","value":"Start"}},{"kind":"Field","name":{"kind":"Name","value":"End"}},{"kind":"Field","name":{"kind":"Name","value":"Recurrence"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AllRecurrenceFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"CalendarItemType"}},{"kind":"Field","name":{"kind":"Name","value":"ProposedStart"}},{"kind":"Field","name":{"kind":"Name","value":"ProposedEnd"}},{"kind":"Field","name":{"kind":"Name","value":"Location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AllEnhancedLocationFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"StartTimeZoneId"}},{"kind":"Field","name":{"kind":"Name","value":"EndTimeZoneId"}}]}},...AllMeetingMessageFieldsFragmentDoc.definitions,...AllRecurrenceFieldsFragmentDoc.definitions,...AllEnhancedLocationFieldsFragmentDoc.definitions]};
export const AllMeetingCancellationMessageFieldsFragmentDoc: DocumentNode<AllMeetingCancellationMessageFieldsFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AllMeetingCancellationMessageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MeetingCancellationMessage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AllMeetingMessageFields"}},{"kind":"Field","name":{"kind":"Name","value":"Start"}},{"kind":"Field","name":{"kind":"Name","value":"End"}},{"kind":"Field","name":{"kind":"Name","value":"Recurrence"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AllRecurrenceFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"CalendarItemType"}},{"kind":"Field","name":{"kind":"Name","value":"Location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AllEnhancedLocationFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"StartTimeZoneId"}},{"kind":"Field","name":{"kind":"Name","value":"EndTimeZoneId"}}]}},...AllMeetingMessageFieldsFragmentDoc.definitions,...AllRecurrenceFieldsFragmentDoc.definitions,...AllEnhancedLocationFieldsFragmentDoc.definitions]};
export const MeetingMessageCalendarItemFieldsFragmentDoc: DocumentNode<MeetingMessageCalendarItemFieldsFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeetingMessageCalendarItemFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ItemId"}},{"kind":"Field","name":{"kind":"Name","value":"Subject"}},{"kind":"Field","name":{"kind":"Name","value":"Start"}},{"kind":"Field","name":{"kind":"Name","value":"End"}},{"kind":"Field","name":{"kind":"Name","value":"FreeBusyType"}},{"kind":"Field","name":{"kind":"Name","value":"IsAllDayEvent"}}]}}]};
export const AllOccurrenceInfoFieldsFragmentDoc: DocumentNode<AllOccurrenceInfoFieldsFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AllOccurrenceInfoFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OccurrenceInfo"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ItemId"}},{"kind":"Field","name":{"kind":"Name","value":"Start"}},{"kind":"Field","name":{"kind":"Name","value":"End"}},{"kind":"Field","name":{"kind":"Name","value":"OriginalStart"}}]}}]};
export const TimeChangeFieldsFragmentDoc: DocumentNode<TimeChangeFieldsFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TimeChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TimeChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Offset"}},{"kind":"Field","name":{"kind":"Name","value":"AbsoluteDate"}},{"kind":"Field","name":{"kind":"Name","value":"RelativeYearlyRecurrence"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"DaysOfWeek"}},{"kind":"Field","name":{"kind":"Name","value":"DayOfWeekIndex"}},{"kind":"Field","name":{"kind":"Name","value":"Month"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Time"}},{"kind":"Field","name":{"kind":"Name","value":"TimeZoneName"}}]}}]};
export const AllMeetingRequestMessageFieldsFragmentDoc: DocumentNode<AllMeetingRequestMessageFieldsFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AllMeetingRequestMessageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MeetingRequestMessage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AllMeetingMessageFields"}},{"kind":"Field","name":{"kind":"Name","value":"MeetingRequestType"}},{"kind":"Field","name":{"kind":"Name","value":"IntendedFreeBusyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"Start"}},{"kind":"Field","name":{"kind":"Name","value":"End"}},{"kind":"Field","name":{"kind":"Name","value":"OriginalStart"}},{"kind":"Field","name":{"kind":"Name","value":"IsAllDayEvent"}},{"kind":"Field","name":{"kind":"Name","value":"FreeBusyType"}},{"kind":"Field","name":{"kind":"Name","value":"When"}},{"kind":"Field","name":{"kind":"Name","value":"IsMeeting"}},{"kind":"Field","name":{"kind":"Name","value":"IsCancelled"}},{"kind":"Field","name":{"kind":"Name","value":"IsRecurring"}},{"kind":"Field","name":{"kind":"Name","value":"MeetingRequestWasSent"}},{"kind":"Field","name":{"kind":"Name","value":"CalendarItemType"}},{"kind":"Field","name":{"kind":"Name","value":"MyResponseType"}},{"kind":"Field","name":{"kind":"Name","value":"Organizer"}},{"kind":"Field","name":{"kind":"Name","value":"RequiredAttendees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AllAttendeeFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"OptionalAttendees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AllAttendeeFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Resources"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AllAttendeeFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ConflictingMeetingCount"}},{"kind":"Field","name":{"kind":"Name","value":"AdjacentMeetingCount"}},{"kind":"Field","name":{"kind":"Name","value":"ConflictingMeetings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MeetingMessageCalendarItemFields"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"AdjacentMeetings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MeetingMessageCalendarItemFields"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"Duration"}},{"kind":"Field","name":{"kind":"Name","value":"TimeZone"}},{"kind":"Field","name":{"kind":"Name","value":"AppointmentReplyTime"}},{"kind":"Field","name":{"kind":"Name","value":"AppointmentSequenceInt"}},{"kind":"Field","name":{"kind":"Name","value":"AppointmentState"}},{"kind":"Field","name":{"kind":"Name","value":"Recurrence"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AllRecurrenceFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"FirstOccurrence"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AllOccurrenceInfoFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"LastOccurrence"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AllOccurrenceInfoFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ModifiedOccurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AllOccurrenceInfoFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"DeletedOccurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Start"}}]}},{"kind":"Field","name":{"kind":"Name","value":"MeetingTimeZone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"BaseOffset"}},{"kind":"Field","name":{"kind":"Name","value":"Standard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TimeChangeFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Daylight"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TimeChangeFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"TimeZoneName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"StartTimeZone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Periods"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Bias"}},{"kind":"Field","name":{"kind":"Name","value":"Name"}},{"kind":"Field","name":{"kind":"Name","value":"Id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"TransitionsGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Transition"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"To"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Kind"}},{"kind":"Field","name":{"kind":"Name","value":"Value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"Id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Transitions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Transition"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"To"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Kind"}},{"kind":"Field","name":{"kind":"Name","value":"Value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"Id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Name"}},{"kind":"Field","name":{"kind":"Name","value":"Id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"EndTimeZone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Periods"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Bias"}},{"kind":"Field","name":{"kind":"Name","value":"Name"}},{"kind":"Field","name":{"kind":"Name","value":"Id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"TransitionsGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Transition"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"To"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Kind"}},{"kind":"Field","name":{"kind":"Name","value":"Value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"Id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Transitions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Transition"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"To"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Kind"}},{"kind":"Field","name":{"kind":"Name","value":"Value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"Id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Name"}},{"kind":"Field","name":{"kind":"Name","value":"Id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ConferenceType"}},{"kind":"Field","name":{"kind":"Name","value":"AllowNewTimeProposal"}},{"kind":"Field","name":{"kind":"Name","value":"IsOnlineMeeting"}},{"kind":"Field","name":{"kind":"Name","value":"MeetingWorkspaceUrl"}},{"kind":"Field","name":{"kind":"Name","value":"NetShowUrl"}},{"kind":"Field","name":{"kind":"Name","value":"Location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AllEnhancedLocationFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ChangeHighlights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"HasLocationChanged"}},{"kind":"Field","name":{"kind":"Name","value":"Location"}},{"kind":"Field","name":{"kind":"Name","value":"HasStartTimeChanged"}},{"kind":"Field","name":{"kind":"Name","value":"Start"}},{"kind":"Field","name":{"kind":"Name","value":"HasEndTimeChanged"}},{"kind":"Field","name":{"kind":"Name","value":"End"}},{"kind":"Field","name":{"kind":"Name","value":"HasSubjectChanged"}},{"kind":"Field","name":{"kind":"Name","value":"HasBodyChanged"}},{"kind":"Field","name":{"kind":"Name","value":"HasOnlineMeetingUrlChanged"}},{"kind":"Field","name":{"kind":"Name","value":"HasRecurrenceChanged"}}]}},{"kind":"Field","name":{"kind":"Name","value":"StartWallClock"}},{"kind":"Field","name":{"kind":"Name","value":"EndWallClock"}},{"kind":"Field","name":{"kind":"Name","value":"StartTimeZoneId"}},{"kind":"Field","name":{"kind":"Name","value":"EndTimeZoneId"}},{"kind":"Field","name":{"kind":"Name","value":"AttendeeCounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"RequiredAttendeesCount"}},{"kind":"Field","name":{"kind":"Name","value":"OptionalAttendeesCount"}},{"kind":"Field","name":{"kind":"Name","value":"ResourcesCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"MeetingNotesWebUrl"}},{"kind":"Field","name":{"kind":"Name","value":"DoNotForwardMeeting"}}]}},...AllMeetingMessageFieldsFragmentDoc.definitions,...AllAttendeeFieldsFragmentDoc.definitions,...MeetingMessageCalendarItemFieldsFragmentDoc.definitions,...AllRecurrenceFieldsFragmentDoc.definitions,...AllOccurrenceInfoFieldsFragmentDoc.definitions,...TimeChangeFieldsFragmentDoc.definitions,...AllEnhancedLocationFieldsFragmentDoc.definitions]};
export const AllFieldsFromAnyItemFragmentDoc: DocumentNode<AllFieldsFromAnyItemFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AllFieldsFromAnyItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GenericItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AllGenericItemFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AllMessageFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MeetingMessage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AllMeetingMessageFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MeetingResponseMessage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AllMeetingResponseMessageFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MeetingCancellationMessage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AllMeetingCancellationMessageFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MeetingRequestMessage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AllMeetingRequestMessageFields"}}]}}]}},...AllGenericItemFieldsFragmentDoc.definitions,...AllMessageFieldsFragmentDoc.definitions,...AllMeetingMessageFieldsFragmentDoc.definitions,...AllMeetingResponseMessageFieldsFragmentDoc.definitions,...AllMeetingCancellationMessageFieldsFragmentDoc.definitions,...AllMeetingRequestMessageFieldsFragmentDoc.definitions]};
export const GetFullConversationByIdDocument: DocumentNode<GetFullConversationByIdQuery, GetFullConversationByIdQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFullConversationByID"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputGetConversationItemsOptions"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mailboxInfo"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MailboxInfoInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"conversation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"mailboxInfo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mailboxInfo"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"syncState"}},{"kind":"Field","name":{"kind":"Name","value":"totalConversationNodesCount"}},{"kind":"Field","name":{"kind":"Name","value":"toRecipients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"routingType"}},{"kind":"Field","name":{"kind":"Name","value":"mailboxType"}},{"kind":"Field","name":{"kind":"Name","value":"sipUri"}},{"kind":"Field","name":{"kind":"Name","value":"submitted"}},{"kind":"Field","name":{"kind":"Name","value":"originalDisplayName"}},{"kind":"Field","name":{"kind":"Name","value":"emailAddressIndex"}},{"kind":"Field","name":{"kind":"Name","value":"relevanceScore"}},{"kind":"Field","name":{"kind":"Name","value":"isExternalSmtpAddress"}},{"kind":"Field","name":{"kind":"Name","value":"isDomainInOrganization"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ccRecipients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"routingType"}},{"kind":"Field","name":{"kind":"Name","value":"mailboxType"}},{"kind":"Field","name":{"kind":"Name","value":"sipUri"}},{"kind":"Field","name":{"kind":"Name","value":"submitted"}},{"kind":"Field","name":{"kind":"Name","value":"originalDisplayName"}},{"kind":"Field","name":{"kind":"Name","value":"emailAddressIndex"}},{"kind":"Field","name":{"kind":"Name","value":"relevanceScore"}},{"kind":"Field","name":{"kind":"Name","value":"isExternalSmtpAddress"}},{"kind":"Field","name":{"kind":"Name","value":"isDomainInOrganization"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lastModifiedTime"}},{"kind":"Field","name":{"kind":"Name","value":"canDelete"}},{"kind":"Field","name":{"kind":"Name","value":"isLocked"}},{"kind":"Field","name":{"kind":"Name","value":"conversationDiagnosticsInfo"}},{"kind":"Field","name":{"kind":"Name","value":"conversationNodes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"InternetMessageId"}},{"kind":"Field","name":{"kind":"Name","value":"ParentInternetMessageId"}},{"kind":"Field","name":{"kind":"Name","value":"Items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AllFieldsFromAnyItem"}}]}},{"kind":"Field","name":{"kind":"Name","value":"QuotedTextState"}},{"kind":"Field","name":{"kind":"Name","value":"IsQuotedTextChanged"}},{"kind":"Field","name":{"kind":"Name","value":"HasQuotedText"}},{"kind":"Field","name":{"kind":"Name","value":"QuotedTextList"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}}]}}]}}]}},...AllFieldsFromAnyItemFragmentDoc.definitions]};