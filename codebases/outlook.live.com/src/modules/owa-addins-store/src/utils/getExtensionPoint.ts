import type ExtensionPoint from 'owa-service/lib/contract/ExtensionPoint';
import type ExtensionPointCollection from 'owa-service/lib/contract/ExtensionPointCollection';
import { ExtensibilityModeEnum } from 'owa-addins-types';
import type LaunchEventExtensionPoint from 'owa-service/lib/contract/LaunchEventExtensionPoint';

export default function getExtensionPoint(
    extensionPointCollection: ExtensionPointCollection,
    mode: ExtensibilityModeEnum
): ExtensionPoint | LaunchEventExtensionPoint {
    switch (mode) {
        case ExtensibilityModeEnum.MeetingRequest:
            return extensionPointCollection.MessageReadCommandSurface;
        case ExtensibilityModeEnum.AppointmentAttendee:
            return extensionPointCollection.AppointmentAttendeeCommandSurface;
        case ExtensibilityModeEnum.AppointmentOrganizer:
            return extensionPointCollection.AppointmentOrganizerCommandSurface;
        case ExtensibilityModeEnum.DetectedEntity:
            return extensionPointCollection.DetectedEntity;
        case ExtensibilityModeEnum.MessageCompose:
            return extensionPointCollection.MessageComposeCommandSurface;
        case ExtensibilityModeEnum.MessageRead:
            return extensionPointCollection.MessageReadCommandSurface;
        case ExtensibilityModeEnum.LaunchEvent:
            return extensionPointCollection.LaunchEvent;
        case ExtensibilityModeEnum.TrapOnSendEvent:
            return null;
        default:
            return null;
    }
}
