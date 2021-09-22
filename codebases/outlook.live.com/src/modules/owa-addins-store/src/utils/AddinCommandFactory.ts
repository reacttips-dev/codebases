import AddinCommand from '../store/schema/AddinCommand';
import ContextualAddinCommand from '../store/schema/ContextualAddinCommand';
import type Control from 'owa-service/lib/contract/Control';
import type DetectedEntity from 'owa-service/lib/contract/DetectedEntity';
import type Extension from 'owa-service/lib/contract/Extension';
import type ExtensionEvent from 'owa-service/lib/contract/ExtensionEvent';
import ExtensionEventType from 'owa-service/lib/contract/ExtensionEventType';
import type LaunchEvent from 'owa-service/lib/contract/LaunchEvent';
import LaunchEventType from 'owa-service/lib/contract/LaunchEventType';
import type Group from 'owa-service/lib/contract/Group';
import type Tab from 'owa-service/lib/contract/Tab';
import type { ExtensibilityModeEnum } from 'owa-addins-types';
import AutoRunAddinCommand from '../store/schema/AutoRunAddinCommand';

export default class AddinCommandFactory {
    CreateAddinCommand(
        control: Control,
        tabInfo: Tab,
        groupInfo: Group,
        extension: Extension
    ): AddinCommand {
        return new AddinCommand(control, tabInfo, groupInfo, extension);
    }

    CreateContextualAddinCommand(
        detectedEntity: DetectedEntity,
        extension: Extension
    ): ContextualAddinCommand {
        return new ContextualAddinCommand(detectedEntity, extension);
    }

    CreateEventAddinCommand(extensionEvent: ExtensionEvent, extension: Extension): AddinCommand {
        switch (extensionEvent.Type) {
            case ExtensionEventType.ItemSend:
                const control = {
                    Id: 'ItemSend',
                    Action: extensionEvent,
                };
                return new AddinCommand(control, null, null, extension);
        }

        return null;
    }

    CreateAutoRunAddinCommand(
        launchEvent: LaunchEvent,
        extension: Extension,
        mode: ExtensibilityModeEnum
    ): AutoRunAddinCommand {
        let id;
        switch (launchEvent.Type) {
            case LaunchEventType.Unknown:
                id = 'Unknown';
                break;
            case LaunchEventType.OnNewMessageCompose:
                id = 'OnNewMessageCompose';
                break;
            case LaunchEventType.OnNewAppointmentOrganizer:
                id = 'OnNewAppointmentOrganizer';
                break;
            case LaunchEventType.OnMessageAttachmentsChanged:
                id = 'OnMessageAttachmentsChanged';
                break;
            case LaunchEventType.OnAppointmentAttachmentsChanged:
                id = 'OnAppointmentAttachmentsChanged';
                break;
            case LaunchEventType.OnMessageSend:
                id = 'OnMessageSend';
                break;
            case LaunchEventType.OnAppointmentSend:
                id = 'OnAppointmentSend';
                break;
            case LaunchEventType.OnMessageRecipientsChanged:
                id = 'OnMessageRecipientsChanged';
                break;
            case LaunchEventType.OnAppointmentAttendeesChanged:
                id = 'OnAppointmentAttendeesChanged';
                break;
            case LaunchEventType.OnAppointmentTimeChanged:
                id = 'OnAppointmentTimeChanged';
                break;
            case LaunchEventType.OnAppointmentRecurrenceChanged:
                id = 'OnAppointmentRecurrenceChanged';
                break;
            case LaunchEventType.OnInfoBarDismissClicked:
                id = 'OnInfoBarDismissClicked';
                break;
            default:
                id = 'Unknown';
        }

        const control = {
            Id: id,
            Action: launchEvent,
        };
        return new AutoRunAddinCommand(launchEvent.Type, control, extension, mode);
    }
}
