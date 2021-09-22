import { messageSendingFailTitle } from 'owa-locstrings/lib/strings/messagesendingfailtitle.locstring.json';
import {
    itemSendEventAddinBlockEvent,
    itemSendEventAddinErrorExtensibilityUnavailable,
} from './allowItemSendEvent.locstring.json';
import loc, { format } from 'owa-localize';
import {
    ItemSendEventReason,
    createItemSendEventDatapoint,
    endItemSendEventWithReason,
    endItemSendEventDatpoint,
} from 'owa-addins-analytics';
import { addOrReplaceNotificationMessage, removeNotificationMessage } from 'owa-addins-apis';
import { getAdapter } from 'owa-addins-adapters';
import type { PerformanceDatapoint } from 'owa-analytics';
import { confirm } from 'owa-confirm-dialog';
import ExtensionEventType from 'owa-service/lib/contract/ExtensionEventType';
import WebExtNotificationTypeType from 'owa-service/lib/contract/WebExtNotificationTypeType';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import {
    AddinCommand,
    filterSupportsSharedFolderAddinCommands,
    setUilessExtendedAddinCommand,
    InvokeAppAddinCommandStatusCode,
    getOrderedExtensionEventAddinCommands,
    getExtensibilityState,
    isExtensibilityContextInitialized,
    IExtendedAddinCommand,
    IAddinCommandTelemetry,
    terminateUiLessExtendedAddinCommand,
} from 'owa-addins-store';
import whenExtensibilityIsAvailable from './extensibilityObserver';
import { ExtendedAddinCommand, AddinCommandTelemetry } from 'owa-addins-schema';

/**
 * Runs add-ins that support the ItemSend event
 * Returns true if add-ins allow sending, false if one of them prevents sending.
 * If the OnSendAddinsEnabled Mailbox Policy is enabled, sending will be blocked until add-ins are available.
 */
export default async function allowItemSendEvent(hostItemIndex: string): Promise<boolean> {
    const datapoint = createItemSendEventDatapoint();
    const onSendPolicyEnabled = getUserConfiguration().SegmentationSettings.OnSendAddinsEnabled;

    //whenExtensibilityIsAvailable waits until extensibility is available or timeout occurs
    if (
        onSendPolicyEnabled &&
        !(await whenExtensibilityIsAvailable()) &&
        tryPromptIfExtensibilityUnavailable(onSendPolicyEnabled)
    ) {
        endItemSendEventWithReason(datapoint, ItemSendEventReason.ExtensibilityUnavailable);
        return false;
    }

    let itemSendAddins = getOrderedExtensionEventAddinCommands(
        ExtensionEventType.ItemSend
    ) as AddinCommand[];

    const adapter = getAdapter(hostItemIndex);
    if (adapter?.isSharedItem?.()) {
        itemSendAddins = filterSupportsSharedFolderAddinCommands(itemSendAddins);
    }

    removeExistingItemSendInfobars(itemSendAddins, hostItemIndex);
    for (let i = 0; i < itemSendAddins.length; i++) {
        if (
            !(await executeItemSendEvent(
                hostItemIndex,
                itemSendAddins[i] as AddinCommand,
                datapoint
            ))
        ) {
            return false;
        }

        datapoint.addCheckmark(`ItemSend${i}`);
    }

    if (itemSendAddins.length > 0) {
        endItemSendEventWithReason(datapoint, ItemSendEventReason.AllowEventTrue);
    } else {
        // Don't log if no add-ins ran during send
        datapoint.invalidate();
    }

    return true;
}

async function executeItemSendEvent(
    hostItemIndex: string,
    addinCommand: AddinCommand,
    datapoint: PerformanceDatapoint
) {
    const extendedAddinCommand = new ExtendedAddinCommand(
        addinCommand,
        new AddinCommandTelemetry() as IAddinCommandTelemetry
    ) as IExtendedAddinCommand;
    const controlId = extendedAddinCommand.controlId;
    const result = await setUilessExtendedAddinCommand(
        controlId,
        extendedAddinCommand,
        hostItemIndex
    );
    if (result.status !== InvokeAppAddinCommandStatusCode.Success || result.allowEvent === false) {
        addOrReplaceNotificationMessage(
            hostItemIndex,
            addinCommand.extension.Id,
            false /* persistent */,
            `${addinCommand.extension.Id}ItemSend`,
            WebExtNotificationTypeType.InformationalMessage,
            format(loc(itemSendEventAddinBlockEvent), addinCommand.extension.DisplayName)
        );
        terminateUiLessExtendedAddinCommand(controlId, hostItemIndex, result.status);
        endItemSendEventDatpoint(datapoint, result, addinCommand);
        return false;
    }
    return true;
}

function tryPromptIfExtensibilityUnavailable(onSendPolicyEnabled: boolean): boolean {
    const context = getExtensibilityState().Context;
    const addinsInitialized = isExtensibilityContextInitialized();
    if (onSendPolicyEnabled && (!context || !addinsInitialized)) {
        confirm(
            loc(messageSendingFailTitle),
            loc(itemSendEventAddinErrorExtensibilityUnavailable),
            false /* resolveImmediately */,
            {
                hideCancelButton: true,
            }
        );
        return true;
    }
    return false;
}

function removeExistingItemSendInfobars(addinCommands: AddinCommand[], hostItemIndex: string) {
    addinCommands.forEach(addinCommand =>
        removeNotificationMessage(
            hostItemIndex,
            addinCommand.extension.Id,
            `${addinCommand.extension.Id}ItemSend`
        )
    );
}
