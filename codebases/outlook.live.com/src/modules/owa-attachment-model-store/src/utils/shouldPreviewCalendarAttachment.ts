import { getExtensionFromFileName } from 'owa-file';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';

const icsFileExtensions: string[] = ['.ics', '.ical', '.ifb', '.icalendar'];

export default function shouldPreviewCalendarAttachment(attachment: AttachmentType): boolean {
    const extension: string = getExtensionFromFileName(attachment.Name);

    if (extension) {
        return icsFileExtensions.indexOf(extension.toLowerCase()) !== -1;
    }

    return false;
}
