import Addin from '../store/schema/Addin';
import type AddinCommandFactory from './AddinCommandFactory';
import type Control from 'owa-service/lib/contract/Control';
import type Extension from 'owa-service/lib/contract/Extension';
import type ExtensionEvent from 'owa-service/lib/contract/ExtensionEvent';
import type ExtensionPoint from 'owa-service/lib/contract/ExtensionPoint';
import getExtensionPoint from './getExtensionPoint';
import type Group from 'owa-service/lib/contract/Group';
import type IAddin from '../store/schema/interfaces/IAddin';
import type IAddinCommand from '../store/schema/interfaces/IAddinCommand';
import type IContextualAddinCommand from '../store/schema/interfaces/IContextualAddinCommand';
import type IAutoRunAddinCommand from '../store/schema/interfaces/IAutoRunAddinCommand';
import type Tab from 'owa-service/lib/contract/Tab';
import { ExtensibilityModeEnum } from 'owa-addins-types';
import { ObservableMap } from 'mobx';
import type LaunchEventExtensionPoint from 'owa-service/lib/contract/LaunchEventExtensionPoint';
import type LaunchEvent from 'owa-service/lib/contract/LaunchEvent';
import LaunchEventType from 'owa-service/lib/contract/LaunchEventType';
import isUserInstalledStoreAddin from './isUserInstalledStoreAddin';
import { isFeatureEnabled } from 'owa-feature-flags';
export default class AddinFactory {
    constructor(private addinCommandFactory: AddinCommandFactory) {}

    CreateAddinIfEntryPointSupported(extension: Extension, mode: ExtensibilityModeEnum): IAddin {
        let commands: ObservableMap<string, IAddinCommand>;
        if (mode == ExtensibilityModeEnum.TrapOnSendEvent) {
            commands = this.GetEventsAddinCommands(
                extension.ExtensionPointCollection.Events,
                extension
            );
        } else if (mode == ExtensibilityModeEnum.DetectedEntity) {
            commands = this.GetContextualAddinCommand(
                getExtensionPoint(extension.ExtensionPointCollection, mode),
                extension
            );
        } else if (mode == ExtensibilityModeEnum.LaunchEvent) {
            commands = this.GetAutoRunAddinCommands(
                getExtensionPoint(extension.ExtensionPointCollection, mode),
                extension,
                mode
            );
        } else {
            commands = this.GetAddinCommands(
                getExtensionPoint(extension.ExtensionPointCollection, mode),
                extension
            );
        }
        return !commands ? null : new Addin(extension, commands);
    }

    GetAddinCommands(
        extensionPoint: ExtensionPoint,
        extension: Extension
    ): ObservableMap<string, IAddinCommand> {
        if (!extensionPoint) {
            return null;
        }
        const addincommands: { [key: string]: IAddinCommand } = {};
        extensionPoint.Tabs.forEach((tab: Tab) => {
            tab.Groups.forEach((group: Group) => {
                group.Controls.forEach((control: Control) => {
                    addincommands[control.Id] = this.addinCommandFactory.CreateAddinCommand(
                        control,
                        tab,
                        group,
                        extension
                    );
                });
            });
        });
        return new ObservableMap<string, IAddinCommand>(addincommands);
    }

    GetContextualAddinCommand(
        extensionPoint: ExtensionPoint,
        extension: Extension
    ): ObservableMap<string, IAddinCommand> {
        if (!extensionPoint) {
            return null;
        }
        const id = extension.Id;
        const commands = {};
        commands[id] = this.addinCommandFactory.CreateContextualAddinCommand(
            extensionPoint,
            extension
        );
        return new ObservableMap<string, IContextualAddinCommand>(commands);
    }

    GetEventsAddinCommands(
        events: ExtensionEvent[],
        extension: Extension
    ): ObservableMap<string, IAddinCommand> {
        if (!events) {
            return null;
        }

        const addincommands: { [type: number]: IAddinCommand } = {};
        events.forEach((event: ExtensionEvent) => {
            addincommands[event.Type] = this.addinCommandFactory.CreateEventAddinCommand(
                event,
                extension
            );
        });

        return new ObservableMap<string, IAddinCommand>(addincommands);
    }

    GetAutoRunAddinCommands = (
        extensionPoint: LaunchEventExtensionPoint,
        extension: Extension,
        mode: ExtensibilityModeEnum
    ): ObservableMap<string, IAutoRunAddinCommand> => {
        if (!extensionPoint) {
            return null;
        }

        const addinCommands: { [key: string]: IAutoRunAddinCommand } = {};
        const shouldBlockUserInstalledStoreAddin: boolean =
            isFeatureEnabled('addin-autoRun') &&
            isFeatureEnabled('addin-autoRun-shouldBlockUserInstalledStoreAddin');

        extensionPoint.LaunchEvents.forEach((launchEvent: LaunchEvent) => {
            if (shouldBlockUserInstalledStoreAddin && isUserInstalledStoreAddin(extension)) {
                //do nothing , AddinCommand not created for user installed store addin
            } else if (this.isLaunchEventTypeSupported(launchEvent.Type)) {
                addinCommands[
                    launchEvent.Type.toString()
                ] = this.addinCommandFactory.CreateAutoRunAddinCommand(
                    launchEvent,
                    extension,
                    mode
                );
            }
        });
        return new ObservableMap<string, IAutoRunAddinCommand>(addinCommands);
    };

    isLaunchEventTypeSupported(launchEventType: LaunchEventType): boolean {
        // We will update this later when we start supporting other LaunchEvents also
        if (
            launchEventType == LaunchEventType.OnNewMessageCompose ||
            launchEventType == LaunchEventType.OnNewAppointmentOrganizer ||
            launchEventType == LaunchEventType.OnMessageRecipientsChanged ||
            launchEventType == LaunchEventType.OnAppointmentAttendeesChanged ||
            launchEventType == LaunchEventType.OnMessageAttachmentsChanged ||
            launchEventType == LaunchEventType.OnAppointmentAttachmentsChanged ||
            launchEventType == LaunchEventType.OnInfoBarDismissClicked ||
            launchEventType == LaunchEventType.OnAppointmentTimeChanged ||
            launchEventType == LaunchEventType.OnAppointmentRecurrenceChanged
        ) {
            return true;
        }
        return false;
    }
}
