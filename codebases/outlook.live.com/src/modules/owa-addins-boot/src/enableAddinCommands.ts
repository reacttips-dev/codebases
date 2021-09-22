import type AddinActivator from './AddinActivator';
import type Extension from 'owa-service/lib/contract/Extension';
import setAddinCommandsForOptions from './utils/setAddinCommandsForOptions';
import { IAddin, setEnabledAddinCommands } from 'owa-addins-store';
import { EnabledAddinCommands } from 'owa-addins-schema';
import { ExtensibilityModeEnum } from 'owa-addins-types';
import { removeUninstalledPersistedAddins } from 'owa-addins-persistent';

export default function enableAddinCommands(
    activeExtensions: Extension[],
    addinActivator: AddinActivator
) {
    const enabledAddinCommands: EnabledAddinCommands = new EnabledAddinCommands();
    return addinActivator
        .activate(activeExtensions)
        .then((enabledAddins: Map<ExtensibilityModeEnum, IAddin[]>) => {
            Object.values(ExtensibilityModeEnum).forEach((mode: ExtensibilityModeEnum) => {
                enabledAddinCommands.setExtensionPoint(enabledAddins.get(mode), mode);
            });
        })
        .then(() => {
            enabledAddinCommands.isInitialized = true;
            setEnabledAddinCommands(enabledAddinCommands);
            setAddinCommandsForOptions(enabledAddinCommands);
            const addinIds = activeExtensions.map((extension: Extension) => extension.Id);
            removeUninstalledPersistedAddins(addinIds);
        });
}
