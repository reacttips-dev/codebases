import addInfoBarMessage from 'owa-info-bar/lib/actions/addInfoBarMessage';
import removeInfoBarMessage from 'owa-info-bar/lib/actions/removeInfoBarMessage';
import triggerPolicyTips from '../actions/triggerPolicyTips';
import datapoints from '../datapoints';
import type { ComposeViewState } from 'owa-mail-compose-store';
import { sendAndSaveInfobarIdsToRemove } from '../utils/InfoBarMessageId';
import getErrorMessageFromResponseCode from '../utils/getErrorMessageFromResponseCode';
import { handleSuccessResponse, saveMessage } from '../utils/sendSaveUtils';
import { getTotalRecipientCount } from '../utils/viewStateUtils';
import { isPolicyTipsEnabled } from 'owa-policy-tips/lib/utils/isPolicyTipsEnabled';
import EventTrigger from 'owa-service/lib/contract/EventTrigger';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { wrapFunctionForDatapoint } from 'owa-analytics';
import isCLPEnabled from 'owa-mail-protection/lib/utils/clp/isCLPEnabled';
import { lazyTriggerCLPAutoLabeling } from 'owa-mail-protection';
import { isFeatureEnabled } from 'owa-feature-flags';
import { mutatorAction } from 'satcheljs';

interface SaveActionManager {
    activeSaveAction: Promise<any>;
    hasPendingSaveAction: boolean;
}

const saveActionManagerMap: { [key: number]: SaveActionManager } = {};

function ensureActionManager(viewState: ComposeViewState): SaveActionManager {
    let manager = saveActionManagerMap[viewState.composeId];
    if (!manager) {
        manager = {
            activeSaveAction: null,
            hasPendingSaveAction: false,
        };
        saveActionManagerMap[viewState.composeId] = manager;
    }

    return manager;
}

export function hasPendingSaveAction(viewState: ComposeViewState): boolean {
    const manager = saveActionManagerMap[viewState.composeId];
    return manager && !!manager.activeSaveAction;
}

// When saving cost a longer time due to server side delay, it is possible that user triggered another saving or even more
// What we do here is:
// 1. If there's no active saving, return true to trigger a saving action
// 2. If there is active saving, we want to queue only one saving action. So check hasPendingSaveAction,
//    if it is true, it means another pending saving is queued, so return false here to avoid queue a 3rd saving.
//    if it is false, it means there is only one active saving and not pending saving queued, so set hasPendingSaveAction to true
//    to avoid another pending saving queued, and wait for current active saving then return true to save again
async function waitForCurrentSavingAndCheckIfNeedToSaveAgain(
    viewState: ComposeViewState
): Promise<boolean> {
    const manager = ensureActionManager(viewState);

    if (!manager.activeSaveAction) {
        // no active save, so we should save now
        return Promise.resolve(true);
    } else if (manager.hasPendingSaveAction) {
        // there is already another pending save action, just wait for active saving but no need to save again
        await manager.activeSaveAction;
        return Promise.resolve(false);
    } else {
        // otherwise, need to save again after current saving finished, so wait it then return true
        // set hasPendingSaveAction to true so if this is called again before the active saving is finished,
        // the caller doesn't need to save the 3rd time
        manager.hasPendingSaveAction = true;
        await manager.activeSaveAction;
        manager.hasPendingSaveAction = false;
        return Promise.resolve(true);
    }
}

// Save with a given saving action, wait until it finishes
// This will set activeSavingAction to saveActionManager so that other places will know a saving action is active
export async function saveWithAction(
    viewState: ComposeViewState,
    saveAction: Promise<any>
): Promise<any> {
    const manager = ensureActionManager(viewState);
    manager.activeSaveAction = saveAction;
    await saveAction
        .then(result => {
            manager.activeSaveAction = null;
            return Promise.resolve(result);
        })
        .catch(error => {
            manager.activeSaveAction = null;
            return Promise.reject(error);
        });
}

// Wait for active saving if any. Return true if there is active saving action, otherwise return false
export async function waitForActiveSaving(viewState: ComposeViewState): Promise<boolean> {
    const manager = saveActionManagerMap[viewState.composeId];

    if (manager?.activeSaveAction) {
        await manager.activeSaveAction;
        return Promise.resolve(true);
    } else {
        return Promise.resolve(false);
    }
}

export function isSaving(viewState: ComposeViewState): boolean {
    const manager = saveActionManagerMap[viewState.composeId];
    return manager && !!manager.activeSaveAction;
}

export function cleanUpSaveActionManager(viewState: ComposeViewState) {
    if (saveActionManagerMap[viewState.composeId]) {
        delete saveActionManagerMap[viewState.composeId];
    }
}

function validateMaxRecipients(viewState: ComposeViewState): boolean {
    const totalRecipients = getTotalRecipientCount(viewState);
    return totalRecipients <= getUserConfiguration().MaxRecipientsPerMessage;
}

export default wrapFunctionForDatapoint(
    datapoints.MailComposeSave,
    async function trySaveMessage(
        viewState: ComposeViewState,
        isAutoSave: boolean = false,
        rejectWhenFail: boolean = false
    ): Promise<void> {
        // Check if there is active saving and if need to save again
        if (!(await waitForCurrentSavingAndCheckIfNeedToSaveAgain(viewState))) {
            return Promise.resolve();
        }

        if (!viewState) {
            return Promise.reject('could not save message if view state does not exist');
        }

        if (viewState.isSending || isSaving(viewState)) {
            // Already sending or saving, so no need to save again
            return Promise.resolve();
        }

        if (!isAutoSave) {
            removeInfoBarMessage(viewState, sendAndSaveInfobarIdsToRemove);
            resetIsManuallySaved(viewState);
        }

        removeInfoBarMessage(viewState, 'warningMessageMaxRecipientsExceed');
        if (!validateMaxRecipients(viewState)) {
            addInfoBarMessage(viewState, 'warningMessageMaxRecipientsExceed');
            return Promise.resolve();
        }

        return saveWithAction(
            viewState,
            saveMessage(viewState)
                .then(responseMessage => {
                    // Ignore any UI interactions if this session is being sent since user doesn't have chance to see it
                    if (!viewState.isSending) {
                        handleSuccessResponse(responseMessage, viewState);
                        if (isPolicyTipsEnabled()) {
                            triggerPolicyTips(
                                viewState,
                                isAutoSave ? EventTrigger.AutoSave : EventTrigger.Save
                            );
                        }

                        if (isCLPEnabled() && isFeatureEnabled('cmp-clp-auto-labeling')) {
                            lazyTriggerCLPAutoLabeling.import().then(triggerCLPAutoLabeling => {
                                triggerCLPAutoLabeling(
                                    viewState,
                                    viewState.protectionViewState.clpViewState,
                                    viewState.itemId,
                                    viewState.content
                                );
                            });
                        }
                    }

                    return Promise.resolve();
                })
                .catch(error => {
                    // Ignore any error if this session is being sent since:
                    // If send succeeds, it is safe to ignore any saving error
                    // If send fails, we will show sending failure info which is more useful to user
                    if (!isAutoSave && !viewState.isSending) {
                        // Add infobar messages on failure.
                        const messageId = getErrorMessageFromResponseCode(
                            error ? error.message : null,
                            false //isSend
                        );
                        addInfoBarMessage(viewState, messageId);
                    }
                    return rejectWhenFail && !viewState.isSending
                        ? Promise.reject(error)
                        : Promise.resolve();
                })
        );
    }
);

const resetIsManuallySaved = mutatorAction(
    'resetIsManuallySaved',
    (viewState: ComposeViewState) => {
        viewState.isManuallySaved = true;
    }
);
