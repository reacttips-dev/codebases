import { getPendingAttachmentString } from 'owa-attachment-block-on-send/lib/directIndex';
import { isStringNullOrWhiteSpace } from 'owa-localize';
import { hasPendingSaveAction } from 'owa-mail-compose-actions/lib/actions/trySaveMessage';
import isPrimaryAddressInFromWell from 'owa-mail-compose-actions/lib/utils/fromAddressUtils/isPrimaryAddressInFromWell';
import type { ComposeViewState } from 'owa-mail-compose-store';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import getSmimeAdminSettings from 'owa-session-store/lib/utils/getSmimeAdminSettings';
import { isSmimeAdminSettingEnabled } from 'owa-smime/lib/utils/smimeSettingsUtil';

/**
 * Disable S/MIME options toggling if
 * 1. AlwaysShowFrom setting is enabled or From is visible and not set to primary identity .
 * 2. There are any pending attachments.
 * 3. S/MIME admin settings are enabled.
 * 4. An encrypting CLP label is selected.
 */
const isSmimeOptionDisabled = (
    composeViewState: ComposeViewState,
    shouldEncryptMessageAsSmimeCheckbox: boolean
): boolean => {
    const { clpViewState } = composeViewState.protectionViewState;
    const { selectedCLPLabel } = clpViewState;
    const selectedCLPLabelHasEncryption = selectedCLPLabel
        ? selectedCLPLabel.isEncryptingLabel
        : false;

    let alwaysSign = false;
    let alwaysEncrypt = false;

    if (isSmimeAdminSettingEnabled()) {
        const smimeAdminSettings = getSmimeAdminSettings();
        alwaysSign = smimeAdminSettings.AlwaysSign;
        alwaysEncrypt = smimeAdminSettings.AlwaysEncrypt;
    }

    const fromViewState = composeViewState.fromViewState;
    return (
        ((getUserConfiguration().UserOptions.AlwaysShowFrom || fromViewState.isFromShown) &&
            !isPrimaryAddressInFromWell(fromViewState.from?.email?.EmailAddress)) ||
        !isStringNullOrWhiteSpace(
            getPendingAttachmentString(
                composeViewState.attachmentWell,
                false /* hasWaitingAttachment */
            )
        ) ||
        hasPendingSaveAction(composeViewState) ||
        (shouldEncryptMessageAsSmimeCheckbox ? alwaysEncrypt : alwaysSign) ||
        selectedCLPLabelHasEncryption
    );
};

export default isSmimeOptionDisabled;
