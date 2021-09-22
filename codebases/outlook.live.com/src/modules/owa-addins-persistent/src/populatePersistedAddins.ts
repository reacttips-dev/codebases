import { isStringNullOrWhiteSpace } from 'owa-localize';
import type PersistedAddinCommand from './schema/PersistedAddinCommand';
import persistedAddins from './persistedAddins';
import { ExtensibilityModeEnum } from 'owa-addins-types';
import { isPersistentTaskpaneEnabled } from 'owa-addins-feature-flags';

import { loadPersistedAddins } from 'owa-addins-services';

interface ServerPersistedAddin {
    mode: string;
    addinId: string;
    commandId: string;
}

let didLoad = false;

function persistedAddinContentsIsValid(addin: ServerPersistedAddin) {
    return (
        !isStringNullOrWhiteSpace(addin.mode) &&
        !isStringNullOrWhiteSpace(addin.addinId) &&
        !isStringNullOrWhiteSpace(addin.commandId)
    );
}

export default async function populatePersistedAddins(mode: ExtensibilityModeEnum): Promise<void> {
    if (!isPersistentTaskpaneEnabled()) {
        return;
    }

    if (
        mode === ExtensibilityModeEnum.AppointmentAttendee ||
        mode === ExtensibilityModeEnum.AppointmentOrganizer
    ) {
        return;
    }

    if (!didLoad) {
        const text = await loadPersistedAddins();
        const body = JSON.parse(text);
        if (body.addins) {
            didLoad = true;
            body.addins.forEach((addin: ServerPersistedAddin) => {
                if (persistedAddinContentsIsValid(addin)) {
                    let persistedAddin: PersistedAddinCommand = {
                        addinId: addin.addinId,
                        commandId: addin.commandId,
                    };
                    persistedAddins()[addin.mode] = persistedAddin;
                }
            });
        }
    }
}

export function isPersistedAddinsInitialized(): boolean {
    return didLoad;
}
