import type { ComposeViewState } from 'owa-mail-compose-store';
import { onSmimeOptionsChange } from '../actions/smimeActions';
import { isSmimeAdminSettingEnabled } from 'owa-smime/lib/utils/smimeSettingsUtil';
import addInfoBarMessage from 'owa-info-bar/lib/actions/addInfoBarMessage';

export default function resolveCLPSmimeConflict(composeViewState: ComposeViewState) {
    const selectedCLPLabel = composeViewState.protectionViewState.clpViewState.selectedCLPLabel;
    if (
        selectedCLPLabel?.isDefault &&
        selectedCLPLabel.isEncryptingLabel &&
        (composeViewState.smimeViewState.shouldEncryptMessageAsSmime ||
            composeViewState.smimeViewState.shouldSignMessageAsSmime) &&
        !isSmimeAdminSettingEnabled()
    ) {
        onSmimeOptionsChange(
            composeViewState,
            false /* shouldEncryptMessageAsSmime */,
            false /* shouldSignMessageAsSmime */
        );

        addInfoBarMessage(composeViewState, 'warningSmimeYieldToCLPDefaultLabel');
    }
}
