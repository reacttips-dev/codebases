import { FileIcon, getIconForFile } from 'owa-file-icon';
import * as trace from 'owa-trace';
import { TEXT_DIRECTORY_MIME_TYPE } from 'owa-fileprovider-link-services';

export function getFileIcon(fileName: string, shouldBeautify: boolean, mimeType: string): string {
    if (fileName && shouldBeautify) {
        const fileIcon: FileIcon = getIconForFile(
            fileName,
            mimeType === TEXT_DIRECTORY_MIME_TYPE,
            mimeType
        );

        if (!fileIcon.cdn) {
            trace.errorThatWillCauseAlert(`Failed to get cdn fileicon for ${fileName}`);
            return '';
        }

        return fileIcon.cdn;
    }

    return '';
}
