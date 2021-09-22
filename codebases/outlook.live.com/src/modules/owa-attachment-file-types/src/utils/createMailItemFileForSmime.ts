import { AttachmentFileType } from '../types/AttachmentFile';
import type { default as MailItemFile, MailItemFileList } from '../types/MailItemFile';

export default function createMailItemFileForSmime(
    subject: string,
    mimeContent?: string,
    size?: number
): MailItemFileList {
    const mailItemList: MailItemFile[] = [];

    const conversation: MailItemFile = {
        fileType: AttachmentFileType.MailItem,
        name: subject,
        size: size || 0,
        mimeContent: mimeContent,
    };
    mailItemList.push(conversation);
    return mailItemList;
}
