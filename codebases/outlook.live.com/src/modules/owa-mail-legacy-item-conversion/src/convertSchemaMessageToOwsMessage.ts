import type * as Schema from 'owa-graph-schema';
import WebExtNotificationTypeType from 'owa-service/lib/contract/WebExtNotificationTypeType';
import AttachmentPermissionType from 'owa-service/lib/contract/AttachmentPermissionType';
import MessageSafetyReason from 'owa-service/lib/contract/MessageSafetyReason';
import MessageResponseType from 'owa-service/lib/contract/MessageResponseType';
import MessageSafetyLevel from 'owa-service/lib/contract/MessageSafetyLevel';
import type PropertyPath from 'owa-service/lib/contract/PropertyPath';
import type Message from 'owa-service/lib/contract/Message';
import type Item from 'owa-service/lib/contract/Item';
import type MeetingMessage from 'owa-service/lib/contract/MeetingMessage';
import type MeetingResponseMessageType from 'owa-service/lib/contract/MeetingResponseMessageType';
import type MeetingCancellationMessageType from 'owa-service/lib/contract/MeetingCancellationMessageType';
import type MeetingRequestMessageType from 'owa-service/lib/contract/MeetingRequestMessageType';
import message from 'owa-service/lib/factory/message';
import meetingMessage from 'owa-service/lib/factory/meetingMessage';
import meetingResponseMessageType from 'owa-service/lib/factory/meetingResponseMessageType';
import meetingCancellationMessageType from 'owa-service/lib/factory/meetingCancellationMessageType';
import meetingRequestMessageType from 'owa-service/lib/factory/meetingRequestMessageType';
import type RecurrencePatternBaseType from 'owa-service/lib/contract/RecurrencePatternBaseType';
import type RecurrenceRangeBaseType from 'owa-service/lib/contract/RecurrenceRangeBaseType';
import item from 'owa-service/lib/factory/item';
import type AbsoluteYearlyRecurrence from 'owa-service/lib/contract/AbsoluteYearlyRecurrence';
import type AbsoluteMonthlyRecurrence from 'owa-service/lib/contract/AbsoluteMonthlyRecurrence';
import type DailyRecurrence from 'owa-service/lib/contract/DailyRecurrence';
import type RelativeYearlyRecurrence from 'owa-service/lib/contract/RelativeYearlyRecurrence';
import type EndDateRecurrence from 'owa-service/lib/contract/EndDateRecurrence';
import type NoEndRecurrence from 'owa-service/lib/contract/NoEndRecurrence';
import type NumberedRecurrence from 'owa-service/lib/contract/NumberedRecurrence';
import { trace } from 'owa-trace';

const webExtensionNotificationType = (
    notificationType: Schema.WebExtNotificationType
): WebExtNotificationTypeType => {
    switch (notificationType) {
        case 'InformationalMessage':
            return WebExtNotificationTypeType.InformationalMessage;
        case 'ProgressIndicator':
            return WebExtNotificationTypeType.ProgressIndicator;
        case 'ErrorMessage':
            return WebExtNotificationTypeType.ErrorMessage;
        case 'InsightMessage':
            return WebExtNotificationTypeType.InsightMessage;
    }
};

const attachmentPermissionType = (
    attachmentPermissionType: Schema.AttachmentPermission
): AttachmentPermissionType => {
    switch (attachmentPermissionType) {
        case 'None':
            return AttachmentPermissionType.None;
        case 'View':
            return AttachmentPermissionType.View;
        case 'Edit':
            return AttachmentPermissionType.Edit;
        case 'AnonymousView':
            return AttachmentPermissionType.AnonymousView;
        case 'AnonymousEdit':
            return AttachmentPermissionType.AnonymousEdit;
        case 'OrganizationView':
            return AttachmentPermissionType.OrganizationView;
        case 'OrganizationEdit':
            return AttachmentPermissionType.OrganizationEdit;
    }
};

const messageSafetyLevel = (messageSafetyLevel: Schema.MessageSafetyLevel): MessageSafetyLevel => {
    switch (messageSafetyLevel) {
        case 'None':
            return MessageSafetyLevel.None;
        case 'Trusted':
            return MessageSafetyLevel.Trusted;
        case 'Safe':
            return MessageSafetyLevel.Safe;
        case 'Unknown':
            return MessageSafetyLevel.Unknown;
        case 'Suspicious':
            return MessageSafetyLevel.Suspicious;
    }
};

const messageSafetyReason = (
    messageSafetyReason: Schema.MessageSafetyReason
): MessageSafetyReason => {
    switch (messageSafetyReason) {
        case 'None':
            return MessageSafetyReason.None;
        case 'TrustedSender':
            return MessageSafetyReason.TrustedSender;
        case 'SpamFighterTrusted':
            return MessageSafetyReason.SpamFighterTrusted;
        case 'SafeSenderListed':
            return MessageSafetyReason.SafeSenderListed;
        case 'SenderInContactsList':
            return MessageSafetyReason.SenderInContactsList;
        case 'SafeSenderByOrg':
            return MessageSafetyReason.SafeSenderByOrg;
        case 'MovedToJunkByOrgRule':
            return MessageSafetyReason.MovedToJunkByOrgRule;
        case 'MovedToJunkByASFRule':
            return MessageSafetyReason.MovedToJunkByASFRule;
        case 'MovedFromJunkByUserRule':
            return MessageSafetyReason.MovedFromJunkByUserRule;
        case 'MovedToJunkByUserRule':
            return MessageSafetyReason.MovedToJunkByUserRule;
        case 'MovedToJunkByClientAction':
            return MessageSafetyReason.MovedToJunkByClientAction;
        case 'MovedToJunkByUserAction':
            return MessageSafetyReason.MovedToJunkByUserAction;
        case 'MovedToJunkByBlockedSenders':
            return MessageSafetyReason.MovedToJunkByBlockedSenders;
        case 'MovedToJunkByService':
            return MessageSafetyReason.MovedToJunkByService;
        case 'JunkFilteringDisabled':
            return MessageSafetyReason.JunkFilteringDisabled;
        case 'ContentDisabled':
            return MessageSafetyReason.ContentDisabled;
        case 'PartialContentDisabled':
            return MessageSafetyReason.PartialContentDisabled;
        case 'ExclusiveModeEnabled':
            return MessageSafetyReason.ExclusiveModeEnabled;
        case 'PhishDetected':
            return MessageSafetyReason.PhishDetected;
        case 'PhishPasswordDetected':
            return MessageSafetyReason.PhishPasswordDetected;
        case 'SenderFailedAuth':
            return MessageSafetyReason.SenderFailedAuth;
    }
};

const messageResponseType = (
    messageResponseType: Schema.MessageResponseType
): MessageResponseType => {
    switch (messageResponseType) {
        case 'None':
            return MessageResponseType.None;
        case 'Reply':
            return MessageResponseType.Reply;
        case 'Forward':
            return MessageResponseType.Forward;
    }
};

/**
 * Utility type for mapping between the return values from apollo
 * (SomeField: null | undefined | TypeOfField) and those
 * in OWS type (SomeField?: TypeOfField) under strict nulls.
 *
 * TODO: this type is inaccurate: null values should be explicitly
 * unset, not undefined. This is in most cases equivalent, but not all.
 */
type NullToUnset<T> = T extends (infer U)[]
    ? NullToUnset<U>[]
    : T extends object
    ? { [K in keyof T]: NullToUnset<T[K]> }
    : T extends null
    ? undefined | Exclude<T, null>
    : Exclude<T, null>;

const coerceNullToUnset = <T>(x: T): NullToUnset<T> => {
    /**
     * This series of casts is required because Typescript does not
     * narrow generics (e.g. T the typeof x is not narrowed to `null` if you
     * check x === null, nor is it narrowed to `object & T` if you check
     * `typeof x === object`).
     */
    if (x === null) {
        return undefined as any;
    } else if (Array.isArray(x)) {
        return x.map(coerceNullToUnset) as any;
    } else if (typeof x === 'object') {
        const v: Partial<{ [K in keyof T]: NullToUnset<T[K]> }> = {};
        for (let key of Object.keys(x as any)) {
            const keyValue = coerceNullToUnset(x[key]);
            // only assign the key value if it is non-'undefined'
            if (keyValue !== undefined) {
                v[key] = keyValue;
            }
        }
        return (v as Required<typeof v>) as any;
    } else {
        return x as any;
    }
};

const isPlainSchemaItemMessage = (
    t:
        | NullToUnset<Schema.Message>
        | NullToUnset<Schema.Item>
        | NullToUnset<Schema.MeetingMessage>
        | NullToUnset<Schema.MeetingResponseMessage>
        | NullToUnset<Schema.MeetingRequestMessage>
        | NullToUnset<Schema.MeetingCancellationMessage>
): t is NullToUnset<Schema.Item> => {
    return !!(t.__typename === 'Item');
};

const isSchemaMessage = (
    t:
        | NullToUnset<Schema.Message>
        | NullToUnset<Schema.Item>
        | NullToUnset<Schema.MeetingMessage>
        | NullToUnset<Schema.MeetingResponseMessage>
        | NullToUnset<Schema.MeetingRequestMessage>
        | NullToUnset<Schema.MeetingCancellationMessage>
): t is NullToUnset<Schema.Message> => {
    return !!(
        t.__typename === 'Message' ||
        ((t as unknown) as Partial<Schema.Message>).MessageSafety ||
        ((t as unknown) as Partial<Schema.Message>).MessageResponseType
    );
};

const isSchemaMeetingMessage = (
    t:
        | NullToUnset<Schema.Message>
        | NullToUnset<Schema.Item>
        | NullToUnset<Schema.MeetingMessage>
        | NullToUnset<Schema.MeetingResponseMessage>
        | NullToUnset<Schema.MeetingRequestMessage>
        | NullToUnset<Schema.MeetingCancellationMessage>
): t is NullToUnset<Schema.MeetingMessage> => {
    return !!(t.__typename === 'MeetingMessage');
};

const isSchemaMeetingResponseMessage = (
    t:
        | NullToUnset<Schema.Message>
        | NullToUnset<Schema.Item>
        | NullToUnset<Schema.MeetingMessage>
        | NullToUnset<Schema.MeetingResponseMessage>
        | NullToUnset<Schema.MeetingRequestMessage>
        | NullToUnset<Schema.MeetingCancellationMessage>
): t is NullToUnset<Schema.MeetingResponseMessage> => {
    return !!(t.__typename === 'MeetingResponseMessage');
};

const isSchemaMeetingCancellationMessage = (
    t:
        | NullToUnset<Schema.Message>
        | NullToUnset<Schema.Item>
        | NullToUnset<Schema.MeetingMessage>
        | NullToUnset<Schema.MeetingResponseMessage>
        | NullToUnset<Schema.MeetingRequestMessage>
        | NullToUnset<Schema.MeetingCancellationMessage>
): t is NullToUnset<Schema.MeetingCancellationMessage> => {
    return !!(t.__typename === 'MeetingCancellationMessage');
};

type WithPatchedErrorProperties = {
    ErrorProperties?: {
        // PropertyPath is incompatible in with the type from
        // graphql, because the graphql type is represented
        // as the union of all possible values, and the service
        // type is represented as a generic supertype with no fields,
        // that consumers must cast down to a concrete type.
        //
        // because the generic base type owa-service has no fields,
        // there are  no fields in common between it and the concrete
        // members of the union generated by graphql.
        //
        // This intersection type technically results in an empty object
        // type, but it's still a PropertyPath as far as typescript is
        // concerned
        PropertyPath?: PropertyPath & NullToUnset<Schema.PropertyPath>;
    }[];
};

const isSchemaMeetingRequestMessage = (
    t:
        | NullToUnset<Schema.Message>
        | NullToUnset<Schema.Item>
        | NullToUnset<Schema.MeetingMessage>
        | NullToUnset<Schema.MeetingResponseMessage>
        | NullToUnset<Schema.MeetingRequestMessage>
        | NullToUnset<Schema.MeetingCancellationMessage>
): t is NullToUnset<Schema.MeetingRequestMessage> &
    WithPatchedErrorProperties & {
        ConflictingMeetings?: {
            Items?: WithPatchedErrorProperties[];
        };
        AdjacentMeetings?: {
            Items?: WithPatchedErrorProperties[];
        };
        Recurrence?: {
            RecurrencePattern?: RecurrencePatternBaseType;
            RecurrenceRange?: RecurrenceRangeBaseType;
        };
    } => {
    return !!(t.__typename === 'MeetingResponseMessage');
};

export function convertSchemaMessageToOwsMessage(
    schemaMessageOrItem:
        | Schema.Message
        | Schema.Item
        | Schema.MeetingMessage
        | Schema.MeetingResponseMessage
        | Schema.MeetingRequestMessage
        | Schema.MeetingCancellationMessage
):
    | Message
    | Item
    | MeetingMessage
    | MeetingResponseMessageType
    | MeetingRequestMessageType
    | MeetingCancellationMessageType {
    const _schemaMessageOrItem: (
        | NullToUnset<Schema.Message>
        | NullToUnset<Schema.Item>
        | NullToUnset<Schema.MeetingResponseMessage>
        | NullToUnset<Schema.MeetingMessage>
        | NullToUnset<Schema.MeetingRequestMessage>
        | NullToUnset<Schema.MeetingCancellationMessage>
    ) &
        WithPatchedErrorProperties = coerceNullToUnset(schemaMessageOrItem);

    const itemFields: Pick<Item, 'Apps' | 'DocLinks' | 'MimeContent'> = {
        Apps: _schemaMessageOrItem.Apps?.map(app => ({
            app,
            Notifications: app.Notifications?.map(notification => ({
                ...notification,
                Type: notification?.Type && webExtensionNotificationType(notification.Type),
            })),
        })),
        DocLinks: _schemaMessageOrItem.DocLinks?.map(docLink => ({
            ...docLink,
            PermissionType:
                docLink?.PermissionType && attachmentPermissionType(docLink.PermissionType),
        })),
        MimeContent: {
            CharacterSet: coerceNullToUnset(schemaMessageOrItem.MimeContent?.CharacterSet),
            Value: schemaMessageOrItem.MimeContent?.Value || '',
        },
    };

    if (
        isSchemaMessage(_schemaMessageOrItem) ||
        isSchemaMeetingMessage(_schemaMessageOrItem) ||
        isSchemaMeetingResponseMessage(_schemaMessageOrItem) ||
        isSchemaMeetingRequestMessage(_schemaMessageOrItem) ||
        isSchemaMeetingCancellationMessage(_schemaMessageOrItem)
    ) {
        let messageFields = coerceNullToUnset({
            MessageSafety: _schemaMessageOrItem.MessageSafety && {
                ..._schemaMessageOrItem.MessageSafety,
                MessageSafetyLevel:
                    _schemaMessageOrItem.MessageSafety.MessageSafetyLevel &&
                    messageSafetyLevel(_schemaMessageOrItem.MessageSafety.MessageSafetyLevel),
                MessageSafetyReason:
                    _schemaMessageOrItem.MessageSafety.MessageSafetyReason &&
                    messageSafetyReason(_schemaMessageOrItem.MessageSafety.MessageSafetyReason),
            },
            MessageResponseType:
                _schemaMessageOrItem.MessageResponseType &&
                messageResponseType(_schemaMessageOrItem.MessageResponseType),
        });

        if (
            isSchemaMeetingResponseMessage(_schemaMessageOrItem) ||
            isSchemaMeetingCancellationMessage(_schemaMessageOrItem)
        ) {
            let recurrencePattern:
                | undefined
                | AbsoluteMonthlyRecurrence
                | AbsoluteYearlyRecurrence
                | DailyRecurrence
                | RelativeYearlyRecurrence = _schemaMessageOrItem.Recurrence?.RecurrencePattern;
            let recurrenceRange:
                | undefined
                | EndDateRecurrence
                | NoEndRecurrence
                | NumberedRecurrence = _schemaMessageOrItem.Recurrence?.RecurrenceRange;
            const meetingResponseOrCancellationMessageBody = {
                ..._schemaMessageOrItem,
                // cast to required, because typescript has no way to track
                // that the presence of fields in itemFields depends on the presence
                // of fields in schemaMessageOrItem
                //
                // e.g. Apps is of type Schema.AddinsApp[] or OWS App[] in typescript,
                // because according to the type declared on itemFields, it might not be
                // present in itemFields.
                ...(itemFields as Required<typeof itemFields>),
                Recurrence: recurrencePattern &&
                    recurrenceRange && {
                        RecurrencePattern: recurrencePattern,
                        RecurrenceRange: recurrenceRange,
                    },
                ...messageFields,
            };
            return isSchemaMeetingResponseMessage(_schemaMessageOrItem)
                ? meetingResponseMessageType(meetingResponseOrCancellationMessageBody)
                : meetingCancellationMessageType(meetingResponseOrCancellationMessageBody);
        } else if (isSchemaMeetingRequestMessage(_schemaMessageOrItem)) {
            return meetingRequestMessageType({
                ..._schemaMessageOrItem,
                // See above for reasons reasons on the cast to Required<>.
                ...(itemFields as Required<typeof itemFields>),
                ...messageFields,
            });
        }

        let owsTypeConstructor = isSchemaMeetingMessage(_schemaMessageOrItem)
            ? meetingMessage
            : message;
        return owsTypeConstructor({
            ..._schemaMessageOrItem,
            // See above for reasons reasons on the cast to Required<>.
            ...(itemFields as Required<typeof itemFields>),
            ...messageFields,
        });
    } else {
        if (!isPlainSchemaItemMessage(_schemaMessageOrItem)) {
            trace.warn(
                `Unhandled item type in convertSchemaMessageToOwsMessage: ${_schemaMessageOrItem.__typename}`
            );
        }
        return item({
            ..._schemaMessageOrItem,
            // See above for reasons reasons on the cast to Required<>.
            ...(itemFields as Required<typeof itemFields>),
        });
    }
}
