import type Extension from 'owa-service/lib/contract/Extension';
import {
    Addin,
    AddinCommand,
    extensibilityState,
    IAddinCommand,
    IEnabledAddinCommands,
} from 'owa-addins-store';
import type { ExtensibilityModeEnum } from 'owa-addins-types';

export function needShowMenu(addin: Addin): boolean {
    if (isSingleCommand(addin)) {
        return getFirstCommand(addin).isMenu;
    } else {
        return addin.AddinCommands.size > 1;
    }
}

export function canExecute(addin: Addin): boolean {
    if (!isSingleCommand(addin)) {
        return false;
    } else {
        return getFirstCommand(addin).isActionable;
    }
}

export function isSingleCommand(addin: Addin): boolean {
    return addin.AddinCommands.size == 1;
}

export function getFirstCommand(addin: Addin): AddinCommand {
    if (addin.AddinCommands.size > 0) {
        return [...addin.AddinCommands.values()][0] as AddinCommand;
    }
    return null;
}

export function getSupertipTitle(addin: Addin): string {
    if (isSingleCommand(addin)) {
        const firstCommand = getFirstCommand(addin);
        // Supertip is required in manifest, it won't be null or empty
        return firstCommand.control.Supertip.Title;
    }
    return '';
}

export function getAccessibilityText(addin: Addin): string {
    let accessibilityText = addin.DisplayName;
    if (isSingleCommand(addin)) {
        const firstCommand = getFirstCommand(addin);
        // Supertip is required in manifest, it won't be null or empty
        accessibilityText += ' - ' + firstCommand.control.Supertip.Title;
    }
    return accessibilityText;
}

export function getCommandWithGivenId(
    addinId: string,
    addinCommandId: string,
    mode: ExtensibilityModeEnum
): AddinCommand {
    const enabledAddinCommands: IEnabledAddinCommands = extensibilityState.EnabledAddinCommands;
    if (!enabledAddinCommands) {
        return null;
    }

    for (const addin of enabledAddinCommands.getExtensionPoint(mode)) {
        if (addin.Id == addinId && addin.AddinCommands.size > 0) {
            for (const element of addin.AddinCommands.values()) {
                if ((element as AddinCommand).control.Id == addinCommandId) {
                    return element as AddinCommand;
                }
            }
        }
    }

    return null;
}

export function isMinorForbidden(addinCommand: IAddinCommand): boolean {
    return extensibilityState.compliance.isMinor && isMinorForbiddenAddin(addinCommand.extension);
}

export function isMinorForbiddenAddin(extension: Extension): boolean {
    return (
        !isDefaultAddin(extension) &&
        !isInstalledbyOrganization(extension) &&
        !isSideLoadingAddin(extension)
    );
}

function isInstalledbyOrganization(extension: Extension): boolean {
    return extension.OriginString === 'Organization';
}

function isDefaultAddin(extension: Extension): boolean {
    return extension.TypeString === 'Default';
}

function isSideLoadingAddin(extension: Extension): boolean {
    return extension.TypeString === 'Private';
}
