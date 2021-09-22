import { turnOffFocusedInbox } from '../actions/turnOffFocusedInbox';
import { logFmsActionClick } from './logFmsActionClick';
import { lazyMountAndShowFullOptions } from 'owa-options-view';
import { lazyUpdateSettingDirectly } from 'owa-proofing-option';
import isBusiness from 'owa-session-store/lib/utils/isBusiness';
import { lazyTurnSuggestedRepliesOnOff } from 'owa-suggested-replies-option';

export function executeTurnOffFocusedInbox(requestId: string) {
    logFmsActionClick(requestId);
    turnOffFocusedInbox();
}

export function showThemeOption(requestId: string) {
    logFmsActionClick(requestId);
    lazyMountAndShowFullOptions.importAndExecute('general', 'appAppearance');
}

export function showLayoutOption(requestId: string) {
    logFmsActionClick(requestId);
    lazyMountAndShowFullOptions.importAndExecute('mail', 'layout');
}

export function showJunkEmailOption(requestId: string) {
    logFmsActionClick(requestId);
    lazyMountAndShowFullOptions.importAndExecute('mail', 'junkEmail');
}

export function turnOffTextPredictions(requestId: string) {
    logFmsActionClick(requestId);
    lazyUpdateSettingDirectly.importAndExecute('textPredictionEnabled', false);
}

export function turnOffSuggestedReplies(requestId: string) {
    logFmsActionClick(requestId);
    lazyTurnSuggestedRepliesOnOff.import().then(turnOffSuggestedReply => {
        turnOffSuggestedReply(false);
    });
}

export function learnMoreAboutCategories(requestId: string) {
    logFmsActionClick(requestId);
    if (isBusiness()) {
        window.open(
            'https://support.microsoft.com/en-us/office/use-categories-in-outlook-on-the-web-87f27f03-4d9f-48dd-9623-2702692a4480',
            '_blank'
        );
    } else {
        window.open(
            'https://support.microsoft.com/en-us/office/use-categories-in-outlook-com-a0f709a4-9bd8-45d7-a2b3-b6f8c299e079',
            '_blank'
        );
    }
}

export function learnMoreAboutPremium(requestId: string) {
    logFmsActionClick(requestId);
    window.open('https://go.microsoft.com/fwlink/?linkid=2149838&clcid=0x409', '_blank');
}
