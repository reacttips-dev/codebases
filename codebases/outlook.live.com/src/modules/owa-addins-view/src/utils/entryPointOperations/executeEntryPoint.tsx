import {
    restrictedItemDialogHeader,
    restrictedItemDialogLabel,
} from './executeEntryPoint.locstring.json';
import loc from 'owa-localize';
import * as ControlTypeChecker from 'owa-addins-store/lib/utils/ControlTypeChecker';
import * as React from 'react';
import executeUiless from './executeUiless';
import openNonPersistentTaskPaneAddinCommand from './openNonPersistentTaskPaneAddinCommand';
import showGDPRMinorDialog from './showGDPRMinorDialog';

import { AddinCommand, shouldAddinsActivate } from 'owa-addins-store';
import { confirm } from 'owa-confirm-dialog';
import { ExtensibilityModeEnum } from 'owa-addins-types';
import { getAdapter, MessageReadAdapter } from 'owa-addins-adapters';
import { isMinorForbidden } from './AddinChecker';

export default async function executeEntryPoint(
    hostItemIndex: string,
    addinCommand: AddinCommand,
    initializationContext?: string
) {
    if (isMinorForbidden(addinCommand)) {
        await showGDPRMinorDialog();
        return;
    }

    const adapter = getAdapter(hostItemIndex);
    let shouldActivate = true;
    if (
        adapter &&
        (adapter.mode === ExtensibilityModeEnum.MessageRead ||
            adapter.mode === ExtensibilityModeEnum.AppointmentAttendee)
    ) {
        const item = await (adapter as MessageReadAdapter).getItem();
        shouldActivate = shouldAddinsActivate(item);
    }

    await confirm(loc(restrictedItemDialogHeader), '', shouldActivate /* resolveImmediately */, {
        bodyElement: <p>{loc(restrictedItemDialogLabel)}</p>,
        hideCancelButton: true,
    });

    if (!shouldActivate) {
        return;
    }

    if (ControlTypeChecker.isTaskPaneAction(addinCommand.control)) {
        openNonPersistentTaskPaneAddinCommand(
            hostItemIndex,
            addinCommand,
            adapter?.mode,
            initializationContext
        );
    } else if (ControlTypeChecker.isExecuteFunctionAction(addinCommand.control)) {
        executeUiless(addinCommand, hostItemIndex);
    }
}
