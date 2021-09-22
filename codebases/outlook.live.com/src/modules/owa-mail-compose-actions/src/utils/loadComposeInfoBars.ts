import loadSmimeComposeInfobars from '../actions/loadSmimeComposeInfobars';
import loadAttachmentPolicyInfoBars from '../orchestrators/loadAttachmentPolicyInfoBars';
import type { ComposeViewState, AddInfoBarTask } from 'owa-mail-compose-store';
import addCLPLabelInfoBar from 'owa-mail-protection/lib/utils/clp/addCLPLabelInfoBar';
import addEncryptionInfobarFromIRMData from 'owa-mail-protection/lib/utils/rms/addEncryptionInfobarFromIRMData';
import addMessageClassificationInfoBar from 'owa-mail-protection/lib/utils/classification/addMessageClassificationInfoBar';
import updateSensitivityInfoBar from '../utils/updateSensitivityInfoBar';
import showErrorForCloudOrUriAttachments from 'owa-smime/lib/utils/attachments/showErrorForCloudOrUriAttachments';
import isCLPEnabled from 'owa-mail-protection/lib/utils/clp/isCLPEnabled';
import { pendingLoadLabelPromise } from 'owa-mail-protection/lib/actions/clp/loadCLPUserLabels';
import { action } from 'satcheljs/lib/legacy';

export default action('loadComposeInfoBars')(function loadComposeInfoBars(
    viewState: ComposeViewState,
    task: AddInfoBarTask
) {
    loadAttachmentPolicyInfoBars(viewState);
    updateSensitivityInfoBar(viewState);

    if (viewState.protectionViewState?.classificationViewState?.messageClassification) {
        addMessageClassificationInfoBar(viewState);
    }

    loadSmimeComposeInfobars(viewState);
    showErrorForCloudOrUriAttachments(task.unsupportedSmimeAttachmentNames, viewState);

    // Scenarios:
    // New Compose, CLP enabled ---> should show default label.
    // Reply/forward, CLP enabled, reference item has RMS and has label ---> should only show label.
    // Reply/forward, CLP enabled, reference item has RMS and does not have label ---> should show RMS template and default label.
    // Reply/forward, CLP enabled, reference item does not have RMS and have label ---> only label should show.
    // Reply/forward, CLP not enabled, reference item has RMS and does have label ---> should only show RMS template.
    // Reply/forward, CLP not enabled, reference item does not have RMS and does/does not have label ---> should not show any infobar.

    if (!isCLPEnabled()) {
        addEncryptionInfobarFromIRMData(viewState, viewState.protectionViewState);
    }

    if (pendingLoadLabelPromise) {
        pendingLoadLabelPromise.then(() => {
            addCLPLabelInfoBar(viewState, viewState.protectionViewState);
        });
    } else {
        addCLPLabelInfoBar(viewState, viewState.protectionViewState);
    }
});
