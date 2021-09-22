import {
    focusedActionButtonText,
    focusedActionThankYouMessage,
    junkActionButtonText,
    junkActionThankYouMessage,
    themeActionButtonText,
    themeActionThankYouMessage,
    layoutActionButtonText,
    layoutActionThankYouMessage,
    composeReplyActionButtonText,
    learnMoreActionButtonText,
    learnMoreCategoriesThankYouMessage,
    learnMorePremiumThankYouMessage,
    composeReplyActionThankYouMessage,
    suggestedReplyActionButtonText,
    suggestedReplyActionThankYouMessage,
} from './actionInfoMap.locstring.json';
import loc from 'owa-localize';
import * as ActionList from './actionList';

import type { ActionInfo } from 'owa-feedback-mitigation';

export const actionInfoMap: { [filter: string]: ActionInfo } = {
    ['989']: <ActionInfo>{
        buttonText: loc(focusedActionButtonText),
        onExecuteAction: ActionList.executeTurnOffFocusedInbox,
        thankYouMessage: loc(focusedActionThankYouMessage),
        isActionExecutedOnUx: false,
    },
    ['990']: <ActionInfo>{
        buttonText: loc(junkActionButtonText),
        onExecuteAction: ActionList.showJunkEmailOption,
        thankYouMessage: loc(junkActionThankYouMessage),
        isActionExecutedOnUx: true,
    },
    ['992']: <ActionInfo>{
        buttonText: loc(themeActionButtonText),
        onExecuteAction: ActionList.showThemeOption,
        thankYouMessage: loc(themeActionThankYouMessage),
        isActionExecutedOnUx: true,
    },
    ['993']: <ActionInfo>{
        buttonText: loc(layoutActionButtonText),
        onExecuteAction: ActionList.showLayoutOption,
        thankYouMessage: loc(layoutActionThankYouMessage),
        isActionExecutedOnUx: true,
    },
    ['6217']: <ActionInfo>{
        buttonText: loc(composeReplyActionButtonText),
        onExecuteAction: ActionList.turnOffTextPredictions,
        thankYouMessage: loc(composeReplyActionThankYouMessage),
        isActionExecutedOnUx: false,
    },
    ['8011']: <ActionInfo>{
        buttonText: loc(learnMoreActionButtonText),
        onExecuteAction: ActionList.learnMoreAboutCategories,
        thankYouMessage: loc(learnMoreCategoriesThankYouMessage),
        isActionExecutedOnUx: false,
    },
    ['8012']: <ActionInfo>{
        buttonText: loc(learnMoreActionButtonText),
        onExecuteAction: ActionList.learnMoreAboutPremium,
        thankYouMessage: loc(learnMorePremiumThankYouMessage),
        isActionExecutedOnUx: false,
    },
    ['12338']: <ActionInfo>{
        buttonText: loc(suggestedReplyActionButtonText),
        onExecuteAction: ActionList.turnOffSuggestedReplies,
        thankYouMessage: loc(suggestedReplyActionThankYouMessage),
        isActionExecutedOnUx: false,
    },
};
