import loadAttachmentSuggestions from './loadAttachmentSuggestions';
import { ComposeViewState, ComposeOperation } from 'owa-mail-compose-store';
import { isPolicyTipsEnabled } from 'owa-policy-tips/lib/utils/isPolicyTipsEnabled';
import triggerPolicyTips from '../actions/triggerPolicyTips';
import EventTrigger from 'owa-service/lib/contract/EventTrigger';
import isCLPEnabled from 'owa-mail-protection/lib/utils/clp/isCLPEnabled';
import { isFeatureEnabled } from 'owa-feature-flags';
import { lazyTriggerCLPAutoLabeling } from 'owa-mail-protection';
import { getAllRecipientsAsEmailAddressStrings } from './getAllRecipientsAsEmailAddressStrings';
import startSession from 'owa-controls-findpeople-feedback-manager/lib/actions/startSession';
import getCurrentFromAddress from './getFromAddressFromRecipientWell';
import updateMailtips from 'owa-mail-tips/lib/actions/updateMailtips';
import isSmimeEnabledInViewState from 'owa-smime/lib/utils/isSmimeEnabledInViewState';
import { applySmimeSettings, onSmimeModeEnabled } from '../actions/smimeActions';
import { isSmimeSettingEnabled } from 'owa-smime/lib/utils/smimeSettingsUtil';
import setIsSxSDisplayed from 'owa-expressions-store/lib/actions/setIsSxSDisplayed';
import { isSxSDisplayed } from 'owa-sxs-store';
import { lazyAddNotification } from 'owa-header-toast-notification';
import { lazyLoadSignature } from 'owa-mail-signature';
import attachBeforeUnloadHandler from './beforeUnloadHandler';
import { lazyPreloadRoamingDictionary } from 'owa-roaming-dictionary';

export default async function preload(viewState: ComposeViewState) {
    attachBeforeUnloadHandler();

    // Preload attachment suggestions
    loadAttachmentSuggestions(viewState);

    if (viewState.operation == ComposeOperation.EditDraft) {
        if (isPolicyTipsEnabled()) {
            triggerPolicyTips(viewState, EventTrigger.OpenDraft);
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

    const recipientEmailAddresses: string[] = getAllRecipientsAsEmailAddressStrings(viewState);
    startSession(viewState.toRecipientWell.findPeopleFeedbackManager, recipientEmailAddresses);

    const fromEmailAddress = getCurrentFromAddress(viewState.toRecipientWell);
    updateMailtips(viewState.composeId, fromEmailAddress, recipientEmailAddresses);

    if (isSmimeEnabledInViewState(viewState.smimeViewState)) {
        onSmimeModeEnabled(viewState);
    }

    // update S/MIME viewState for new compose based on S/MIME admin/user settings
    if (viewState.operation === ComposeOperation.New && isSmimeSettingEnabled()) {
        applySmimeSettings(viewState);
    }

    // Save isSxSDisplayed in expression store so we know if we need to show the
    // expression pane in SxS view (VSO 59744)
    setIsSxSDisplayed(isSxSDisplayed()); // need to pass sxsId if SxS is supported and can be supported with multiple views

    if (viewState.preferAsyncSend) {
        lazyAddNotification.import();
    }

    await lazyLoadSignature.importAndExecute();

    // Start loading the roaming dictionary
    lazyPreloadRoamingDictionary.importAndExecute();
}
