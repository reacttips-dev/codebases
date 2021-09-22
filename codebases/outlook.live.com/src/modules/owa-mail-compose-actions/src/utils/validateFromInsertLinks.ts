import { logUsage } from 'owa-analytics';
import type EditorViewState from 'owa-editor/lib/store/schema/EditorViewState';
import { isFeatureEnabled } from 'owa-feature-flags';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import {
    lazyGetAllInsertLinksIds,
    lazyGetAtLeastOneInsertLinkPendingOrFailed,
    lazyGetBlockDialogOnSendStrings,
    GetBlockDialogOnSendStringsType,
    lazyGetBlockDialogOnSaveStrings,
    GetBlockDialogOnSaveStringsType,
} from 'owa-insert-link';

let insertLinksIds: string[];
let getBlockDialogOnSendStrings: GetBlockDialogOnSendStringsType;
let getBlockDialogOnSaveStrings: GetBlockDialogOnSaveStringsType;
let getAtLeastOneInsertLinkPendingOrFailed;

/* atLeastOneInsertLinkPendingOrFailed will keep updating when the block dialog is shown;
   After the block dialog is dismissed, the value will stop changing, then we could use it to log datapoint.
   Since the block dialog is modal, one owa window will only have one block dialog,
   using one boolean is enough for tracking the scenario.
*/
let atLeastOneInsertLinkPendingOrFailed: boolean;
export async function validateFromInsertLinks(
    viewState: EditorViewState,
    isSend: boolean
): Promise<boolean> {
    if (isInsertLinksNotSupported()) {
        return true;
    }

    const getAllInsertLinksIds = await lazyGetAllInsertLinksIds.import();
    getAtLeastOneInsertLinkPendingOrFailed = await lazyGetAtLeastOneInsertLinkPendingOrFailed.import();
    insertLinksIds = getAllInsertLinksIds(viewState);
    const result: boolean = getAtLeastOneInsertLinkPendingOrFailed(insertLinksIds);
    getBlockDialogOnSendStrings = await lazyGetBlockDialogOnSendStrings.import();
    getBlockDialogOnSaveStrings = await lazyGetBlockDialogOnSaveStrings.import();

    logUsage('validateFromInsertLinks', { isSend: isSend, didFail: result });
    return !result;
}

export function isInsertLinksNotSupported(): boolean {
    if (
        !(
            isFeatureEnabled('doc-link-filePicker') ||
            !isConsumer() ||
            isFeatureEnabled('cmp-hyperlinkFileSearch') ||
            isFeatureEnabled('doc-deprecateCloudyAttachments') ||
            isFeatureEnabled('doc-deprecateCloudyNoSecondPanelSplitButton')
        )
    ) {
        return true;
    }

    return false;
}

/* Important: the following functions have to run after validateFromInsertLinks is invoked.
   getConfirmDialogOptions doesn't support async.
   So this file is responsible for preloading the related lazy functions then we can just call them synchronously during getConfirmDialogOptions.
 */
export function getAllInsertLinksIds(): string[] {
    return insertLinksIds;
}

export function getInsertLinksBlockDialogOnSendStrings(): {
    title: string;
    okButtonText: string;
    cancelButtonText: string;
} {
    updateAtLeastOneInsertLinkPendingOrFailed();
    return getBlockDialogOnSendStrings(insertLinksIds);
}

export function getInsertLinksBlockDialogOnSaveStrings(): {
    title: string;
    okButtonText: string;
    cancelButtonText: string;
} {
    updateAtLeastOneInsertLinkPendingOrFailed();
    return getBlockDialogOnSaveStrings(insertLinksIds);
}

export function didInsertLinksHaveIssuesOnBlockDialogDismiss(): boolean {
    return atLeastOneInsertLinkPendingOrFailed;
}

export function updateAtLeastOneInsertLinkPendingOrFailed() {
    atLeastOneInsertLinkPendingOrFailed = getAtLeastOneInsertLinkPendingOrFailed(insertLinksIds);
}
