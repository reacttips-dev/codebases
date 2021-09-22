import type { InfoBarHostViewState } from 'owa-info-bar/lib/schema/InfoBarMessageViewState';
import type ProtectionViewState from 'owa-mail-protection-types/lib/schema/ProtectionViewState';
import addInfoBarMessage from 'owa-info-bar/lib/actions/addInfoBarMessage';

const CLP_LABEL_INFOBAR_MESSAGE_ID = 'CLPLabel';

export default function addCLPLabelInfoBar(
    infoBarViewState: InfoBarHostViewState,
    protectionViewState: ProtectionViewState
) {
    if (
        protectionViewState?.clpViewState?.selectedCLPLabel &&
        !protectionViewState.clpViewState.selectedCLPLabel.isDefault
    ) {
        // the item should show info bar of CLP Label
        addInfoBarMessage(infoBarViewState, CLP_LABEL_INFOBAR_MESSAGE_ID);
    }
}
