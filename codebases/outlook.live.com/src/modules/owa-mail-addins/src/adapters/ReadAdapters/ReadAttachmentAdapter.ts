import type ItemViewState from 'owa-mail-reading-pane-store/lib/store/schema/ItemViewState';
import type { AttachmentContent } from 'owa-addins-common-utils/lib/getAttachmentContentHelper';
import { getAttachmentContentUtil } from '../../utils/getAttachmentContentUtil';

export const getAttachmentContent = (viewState: ItemViewState) => (
    attachmentId: string
): Promise<AttachmentContent> => {
    return getAttachmentContentUtil(viewState.attachmentWell, attachmentId);
};
