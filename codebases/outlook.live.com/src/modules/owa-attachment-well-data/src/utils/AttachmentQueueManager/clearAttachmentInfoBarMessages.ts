import removeInfoBarMessage from 'owa-info-bar/lib/actions/removeInfoBarMessage';
import { attachmentInfoBarMessageIds } from './AttachmentInfoBarMessageId';
import type { InfoBarHostViewState } from 'owa-info-bar/lib/schema/InfoBarMessageViewState';

export default function clearAttachmentInfoBarMessages(infoBar: InfoBarHostViewState) {
    if (infoBar) {
        removeInfoBarMessage(infoBar, attachmentInfoBarMessageIds);
    }
}
