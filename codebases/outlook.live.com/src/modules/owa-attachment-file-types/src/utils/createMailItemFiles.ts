import { AttachmentFileType } from '../types/AttachmentFile';
import type { default as MailItemFile, MailItemFileList } from '../types/MailItemFile';
import * as trace from 'owa-trace';

export default function createMailItemFiles(
    subjects: string[],
    latestItemIds: string[],
    sizes?: number[]
): MailItemFileList | null {
    if (subjects.length != latestItemIds.length) {
        trace.errorThatWillCauseAlert('The sizes of subjects and latestItemIds are different');
        return null;
    }

    const mailItemList: MailItemFile[] = [];
    for (let i = 0; i < subjects.length; i++) {
        const conversation: MailItemFile = {
            fileType: AttachmentFileType.MailItem,
            name: subjects[i],
            size: sizes?.[i] || 0,
            itemId: latestItemIds[i],
        };

        mailItemList.push(conversation);
    }
    return mailItemList;
}
