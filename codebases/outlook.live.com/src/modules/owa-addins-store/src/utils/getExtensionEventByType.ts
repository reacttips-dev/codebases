import type ExtensionEventType from 'owa-service/lib/contract/ExtensionEventType';
import { ExtensibilityModeEnum } from 'owa-addins-types';
import getExtensibilityState from '../store/getExtensibilityState';
import type IAddinCommand from '../store/schema/interfaces/IAddinCommand';
import type ExtensionInstallScope from 'owa-service/lib/contract/ExtensionInstallScope';

const UserInstallScope: ExtensionInstallScope = 'User';
const OrgInstallScope: ExtensionInstallScope = 'Organization';
const DefaultInstallScope: ExtensionInstallScope = 'Default';

export default function getExtensionEventByType(type: ExtensionEventType): IAddinCommand[] {
    const enabledAddinCommands = getExtensibilityState().EnabledAddinCommands;
    if (!enabledAddinCommands) {
        return [];
    }

    const eventAddins = enabledAddinCommands.getExtensionPoint(
        ExtensibilityModeEnum.TrapOnSendEvent
    );
    return eventAddins.map(addin => {
        return addin.AddinCommands.get(type.toString());
    });
}

/*
    OnSend Addin execution Order: User -> Default -> Organization
    Sorting within each scope: Increasing order by Addin Id
*/
export function getOrderedExtensionEventAddinCommands(type: ExtensionEventType): IAddinCommand[] {
    const itemSendAddinCommands = getExtensionEventByType(type) as IAddinCommand[];

    const userInstalledAddinCommands = itemSendAddinCommands.filter(
        addinCommand => addinCommand.extension.OriginString == UserInstallScope
    );
    const defaultInstalledAddinCommands = itemSendAddinCommands.filter(
        addinCommand => addinCommand.extension.OriginString == DefaultInstallScope
    );
    const organizationInstalledAddinCommands = itemSendAddinCommands.filter(
        addinCommand => addinCommand.extension.OriginString == OrgInstallScope
    );

    userInstalledAddinCommands.sort((left, right) => {
        return addinIdCompare(left, right);
    });
    defaultInstalledAddinCommands.sort((left, right) => {
        return addinIdCompare(left, right);
    });
    organizationInstalledAddinCommands.sort((left, right) => {
        return addinIdCompare(left, right);
    });

    const orderedItemSendAddinCommands: IAddinCommand[] = [
        ...userInstalledAddinCommands,
        ...defaultInstalledAddinCommands,
        ...organizationInstalledAddinCommands,
    ];
    return orderedItemSendAddinCommands;
}

function addinIdCompare(leftAddinCommand: IAddinCommand, rightAddinCommand: IAddinCommand): number {
    const leftAddinCommandId = leftAddinCommand.get_Id();
    const rightAddinCommandId = rightAddinCommand.get_Id();

    if (leftAddinCommandId < rightAddinCommandId) {
        return -1;
    } else if (leftAddinCommandId > rightAddinCommandId) {
        return 1;
    }
    return 0;
}
