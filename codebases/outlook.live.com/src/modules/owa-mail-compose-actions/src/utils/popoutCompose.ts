import closeCompose from '../actions/closeCompose';
import { addPopoutV2 } from 'owa-popout-v2';
import type { AttachmentModel } from 'owa-attachment-model-store';
import getAttachment from 'owa-attachment-model-store/lib/selectors/getAttachment';
import clearDomProperties from 'owa-editor-docking-plugin/lib/actions/clearDomProperties';
import { protectionStore } from 'owa-mail-protection/lib/store/protectionStore';
import type { ComposeViewState, ComposePopoutData } from 'owa-mail-compose-store';
import mailTipsCacheStore from 'owa-mail-tips/lib/store/store';
import { FluidOwaSource, isFluidEnabledForSource } from 'owa-fluid-validations';
import { findTabByData } from 'owa-tab-store';
import { isFeatureEnabled } from 'owa-feature-flags';
import { logPopoutInsertLinksDatapoints } from './logPopoutInsertLinksDatapoints';
import moveComposeToTab from '../actions/moveComposeToTab';
import { logUsage } from 'owa-analytics';

/**
 * Popout compose to a new window
 * @param viewState The ComposeViewState for the compose session to popout
 * @param targetWindow The target window to popout to
 */
export default function popoutCompose(viewState: ComposeViewState, targetWindow?: Window) {
    logUsage('mailPopout', { type: 'Compose' });
    logPopoutInsertLinksDatapoints(viewState);
    const projectionTabId =
        isFeatureEnabled('mail-popout-projection') && getComposeTabIdForPopout(viewState);
    addPopoutV2('mail', 'compose', {
        deeplinkData: () => {
            closeCompose(viewState, 'PoppedOut');
            return createComposePopoutData(viewState);
        },
        projectionTabId,
        projectionTargetWindow: targetWindow,
    });
}

function getComposeTabIdForPopout(viewState: ComposeViewState) {
    // If compose is already in a secondary tab, this will be no op
    // otherwise it will move compose from primary tab to secondary tab
    moveComposeToTab(viewState, false /*isShown*/, false /*makeActive*/);

    const tab = findTabByData(viewState.composeId);
    return tab?.id;
}

function createComposePopoutData(viewState: ComposeViewState): ComposePopoutData {
    const attachments: AttachmentModel[] = [];

    if (viewState.attachmentWell) {
        viewState.attachmentWell.docViewAttachments.forEach(element => {
            attachments.push(getAttachment(element.attachmentId));
        });
        viewState.attachmentWell.imageViewAttachments.forEach(element => {
            attachments.push(getAttachment(element.attachmentId));
        });
        viewState.attachmentWell.inlineAttachments.forEach(element => {
            attachments.push(getAttachment(element.attachmentId));
        });
    }

    const mailtips = mailTipsCacheStore.mailTips
        ? mailTipsCacheStore.mailTips.returnAllMailTipsCacheEntries()
        : null;

    const composeViewState = {
        ...viewState,
    };

    if (composeViewState?.docking) {
        clearDomProperties(composeViewState.docking);
    }

    return {
        composeViewState,
        attachments,
        mailtips,
        protectionStore,
        includeFluidOnPopout: isFluidEnabledForSource(FluidOwaSource.MailCompose),
    };
}
