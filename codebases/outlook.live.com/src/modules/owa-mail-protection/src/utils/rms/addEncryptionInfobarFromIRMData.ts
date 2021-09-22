import type ProtectionViewState from 'owa-mail-protection-types/lib/schema/ProtectionViewState';
import addInfoBarMessage from 'owa-info-bar/lib/actions/addInfoBarMessage';
import getEncryptionInfoBarMessageId from './getEncryptionInfoBarMessageId';
import type { InfoBarHostViewState } from 'owa-info-bar/lib/schema/InfoBarMessageViewState';
import isEncryptionEnabled from 'owa-encryption-common/lib/utils/isEncryptionEnabled';

export default function addEncryptionInfobarFromIRMData(
    infoBarViewState: InfoBarHostViewState,
    protectionViewState: ProtectionViewState
) {
    const infobarIdForEncryption =
        isEncryptionEnabled() && protectionViewState?.IRMData
            ? getEncryptionInfoBarMessageId(protectionViewState.IRMData.RmsTemplateId)
            : null;

    if (infobarIdForEncryption && infoBarViewState.infoBarIds.indexOf(infobarIdForEncryption) < 0) {
        addInfoBarMessage(infoBarViewState, infobarIdForEncryption);
    }
}
