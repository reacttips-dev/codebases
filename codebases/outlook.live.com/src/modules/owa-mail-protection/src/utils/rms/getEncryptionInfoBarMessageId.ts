import { ENCRYPT_GUID, ENCRYPT_DNF_GUID } from '../../store/schema/rms/EncryptionGUID';
import type { InfoBarMessageId } from '../protectionInfobarMessageId';
import { isConsumer } from 'owa-session-store';

export default function getEncryptionInfoBarMessageId(templateId: string): InfoBarMessageId {
    if (isConsumer()) {
        switch (templateId) {
            case ENCRYPT_GUID:
                return 'encryption';
            case ENCRYPT_DNF_GUID:
                return 'encryptionDoNotForward';
            default:
                return null;
        }
    } else {
        return 'irmInfoBar';
    }
}
