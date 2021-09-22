import addInfoBarMessage from 'owa-info-bar/lib/actions/addInfoBarMessage';
import removeInfoBarMessage from 'owa-info-bar/lib/actions/removeInfoBarMessage';
import type { ComposeViewState } from 'owa-mail-compose-store';
import getComposeTarget from '../utils/getComposeTarget';
import onSmimeModeDisabled from '../utils/onSmimeModeDisabled';
import { logUsage } from 'owa-analytics';
import clearAttachmentInfoBarMessages from 'owa-attachment-well-data/lib/utils/AttachmentQueueManager/clearAttachmentInfoBarMessages';
import truncateCountForDataPointAggregation from 'owa-mail-store/lib/utils/truncateCountForDataPointAggregation';
import { lazySmimeAdapter } from 'owa-smime-adapter';
import SmimeInstallationStatus from 'owa-smime-adapter/lib/store/schema/SmimeInstallationStatus';
import smimeStore from 'owa-smime-adapter/lib/store/store';
import type SmimeViewState from 'owa-smime-types/lib/schema/SmimeViewState';
import * as trace from 'owa-trace';
import { orchestrator } from 'satcheljs';
import {
    onSmimeOptionsChange,
    onSmimeOptionsDirty,
    onSmimeModeEnabled,
} from '../actions/smimeActions';
import {
    isInitialized,
    getSmimeTypeFromSelectedMessageOptions,
} from 'owa-smime-adapter/lib/utils/smimeUtils';
import { isDeepLink } from 'owa-url';

export const SMIME_CONTROL_ERROR_MESSAGE_ID = 'smimeAdapterInitializationError';

/**
 * Orchestrator that fetches the S/MIME adapter if S/MIME options are set
 */
export default orchestrator(onSmimeOptionsChange, async actionMessage => {
    const { viewState, shouldEncryptMessageAsSmime, shouldSignMessageAsSmime } = actionMessage;
    const { operation, smimeViewState } = viewState;
    const isPopout = isDeepLink();
    // Do not perform any action if the viewState is same
    if (
        !isSmimeViewStateDirty(
            smimeViewState,
            shouldEncryptMessageAsSmime,
            shouldSignMessageAsSmime
        )
    ) {
        return;
    }
    clearAttachmentInfoBarMessages(viewState);
    removeInfoBarMessage(viewState, 'warningSmimeYieldToCLPDefaultLabel');
    const isSmimeModeDisabled = !shouldEncryptMessageAsSmime && !shouldSignMessageAsSmime;
    const isSmimeModeEnabled =
        !smimeViewState.shouldEncryptMessageAsSmime && !smimeViewState.shouldSignMessageAsSmime;

    const composeTarget = getComposeTarget();
    const smimeType = getSmimeTypeFromSelectedMessageOptions(
        smimeViewState.shouldSignMessageAsSmime,
        smimeViewState.shouldEncryptMessageAsSmime
    );
    const {
        docViewAttachments,
        imageViewAttachments,
        inlineAttachments,
    } = viewState.attachmentWell;
    const attachmentsCount = truncateCountForDataPointAggregation(
        docViewAttachments.length + imageViewAttachments.length + inlineAttachments.length
    );

    // Log the datapoint if its a toggle
    (isSmimeModeEnabled || isSmimeModeDisabled) &&
        logUsage(
            'SmimeToggleActionDatapoint',
            {
                smimeType,
                isSmimeModeEnabled,
                isSmimeModeDisabled,
                operation,
                composeTarget,
                isPopout,
                attachmentsCount,
            },
            { isCore: true }
        );

    onSmimeOptionsDirty(viewState, shouldEncryptMessageAsSmime, shouldSignMessageAsSmime);

    // S/MIME to non-S/MIME scenario
    isSmimeModeDisabled && (await onSmimeModeDisabled(viewState));

    // Non-S/MIME to S/MIME scenario
    isSmimeModeEnabled && onSmimeModeEnabled(viewState);

    const isSmimeMessage = shouldEncryptMessageAsSmime || shouldSignMessageAsSmime;
    isSmimeMessage && (await tryInitializeSmimeControl(viewState));
});

async function tryInitializeSmimeControl(viewState: ComposeViewState) {
    // Initialize the control, if not already initialized.
    if (!isInitialized(smimeStore.installationStatus)) {
        try {
            await lazySmimeAdapter.import();
        } catch (e) {
            trace.errorThatWillCauseAlert(
                'SmimeTraceError: Unable to initialize the control on Smime options change'
            );
        }
    }

    // Display infobar if control installation status is any value other than installed.
    if (smimeStore.installationStatus != SmimeInstallationStatus.Installed) {
        addInfoBarMessage(viewState, SMIME_CONTROL_ERROR_MESSAGE_ID);
    }
}

/**
 * This util will return
 * True - if the smimeViewState is dirty, False - otherwise
 */
function isSmimeViewStateDirty(
    smimeViewState: SmimeViewState,
    isMessageEncrypted: boolean,
    isMessageSigned: boolean
): boolean {
    if (smimeViewState) {
        const { shouldEncryptMessageAsSmime, shouldSignMessageAsSmime } = smimeViewState;
        return (
            shouldEncryptMessageAsSmime != isMessageEncrypted ||
            shouldSignMessageAsSmime != isMessageSigned
        );
    }
    return false;
}
