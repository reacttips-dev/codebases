import type { AttachmentFile, AttachmentFileList, Base64InlineImageFile } from '../index';

export default function createBase64File(
    fileList: Base64InlineImageFile[] | null
): AttachmentFileList | null {
    if (!fileList) {
        return null;
    }

    const localFiles: AttachmentFile[] = [];
    for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const localFile: AttachmentFile = {
            fileType: file.fileType,
            name: file.name,
            size: file.size,
            type: file.type,
            dataUri: file.dataUri,
        };
        localFiles.push(localFile);
    }
    return localFiles;
}
