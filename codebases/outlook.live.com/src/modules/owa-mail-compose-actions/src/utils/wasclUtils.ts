import { errorMessageUpgradeToPremium, errorMessageVerify } from './wasclUtils.locstring.json';
import loc from 'owa-localize';
import type { ComposeViewState } from 'owa-mail-compose-store';
import removeInfoBarMessage from 'owa-info-bar/lib/actions/removeInfoBarMessage';
import { HipCheckModal } from 'owa-mail-hip-check-modal';
import type { InfoBarCustomAction } from 'owa-info-bar/lib/schema/InfoBarMessageViewState';
import { showModal } from 'owa-modal';

let upgradeToPremiumUrl = '';
let accountRecoveryFlowUrl = '';

export function setWasclUrls(upgradeToPremium: string, accountRecoveryFlow: string) {
    if (upgradeToPremium) {
        upgradeToPremiumUrl = upgradeToPremium;
    }
    if (accountRecoveryFlow) {
        accountRecoveryFlowUrl = accountRecoveryFlow;
    }
}

export function getUpgradeToPremiumButton(viewState: ComposeViewState): InfoBarCustomAction {
    return {
        text: loc(errorMessageUpgradeToPremium),
        action: () => {
            removeInfoBarMessage(viewState, [
                'errorMessageExceededMessageLimit',
                'errorMessageExceededMaxRecipientLimit',
            ]);
            window.open(upgradeToPremiumUrl);
        },
    };
}

let showModalPromise: Promise<{ success: boolean }> = null;
function removeHipCheckInfoBars(viewState: ComposeViewState) {
    removeInfoBarMessage(viewState, [
        'errorMessageMessageSubmissionBlocked',
        'errorMessageExceededMaxRecipientLimitShowTierUpgrade',
        'errorMessageExceededMessageLimitShowTierUpgrade',
    ]);
}

export function getHipVerifyButton(
    viewState: ComposeViewState,
    targetWindow: Window
): InfoBarCustomAction {
    return {
        text: loc(errorMessageVerify),
        action: () => {
            if (showModalPromise !== null) {
                // only spawn one modal at a time;
                return;
            }

            [showModalPromise] = showModal(HipCheckModal, targetWindow);
            showModalPromise.then(
                ({ success }: { success: boolean }) => {
                    showModalPromise = null;
                    if (success) {
                        removeHipCheckInfoBars(viewState);
                    }
                },
                err => {
                    showModalPromise = null;
                }
            );
        },
    };
}

export function getAccountRecoveryFlowButton(viewState: ComposeViewState): InfoBarCustomAction {
    return {
        text: loc(errorMessageVerify),
        action: () => {
            removeInfoBarMessage(viewState, [
                'errorMessageAccountSuspend',
                'errorMessageAccountSuspendShowTierUpgrade',
            ]);
            window.open(accountRecoveryFlowUrl);
        },
    };
}
