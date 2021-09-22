import { ExtensibilityModeEnum } from 'owa-addins-types';
import {
    ContextualAddinCommand,
    extensibilityState,
    filterSupportsSharedFolderAddins,
    IAddin,
    IAddinCommand,
    IEnabledAddinCommands,
} from 'owa-addins-store';

/**
 * Returns the contextual add-in commands for all add-ins
 * @return The contextual add-in commands
 */
export function getContextualAddinCommand(isSharedItem?: boolean): ContextualAddinCommand[] {
    const enabledAddinCommands: IEnabledAddinCommands = extensibilityState.EnabledAddinCommands;
    if (!enabledAddinCommands) {
        return [];
    }

    let addinsWithDetectedEntities: IAddin[] = enabledAddinCommands.getExtensionPoint(
        ExtensibilityModeEnum.DetectedEntity
    );

    if (addinsWithDetectedEntities.length == 0) {
        return [];
    }

    if (isSharedItem) {
        // Only return add-ins that support shared items
        addinsWithDetectedEntities = filterSupportsSharedFolderAddins(addinsWithDetectedEntities);
    }

    return addinsWithDetectedEntities.map<ContextualAddinCommand>(addin => {
        const commands: ContextualAddinCommand[] = ([
            ...addin.AddinCommands.values(),
        ] as IAddinCommand[]) as ContextualAddinCommand[];
        return commands[0];
    });
}

/**
 * Returns true if the Extensibility scenario is supported for contextual activation
 * @param mode The current extensibility scenario
 * @return true if the Extensibility scenario is supported for contextual activation
 */
export function isContextualScenario(mode: ExtensibilityModeEnum): boolean {
    return (
        mode == ExtensibilityModeEnum.MessageRead ||
        mode == ExtensibilityModeEnum.MeetingRequest ||
        mode == ExtensibilityModeEnum.AppointmentAttendee
    );
}
