import type {
    default as LocalComputerFile,
    LocalComputerFileList,
} from '../types/LocalComputerFile';
import { AttachmentFileType } from '../types/AttachmentFile';

export default function createLocalComputerFiles(
    fileList: FileList | File[] | null
): LocalComputerFileList | null {
    if (!fileList) {
        return null;
    }

    let localFiles: LocalComputerFile[] = [];
    for (var i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const localFile: LocalComputerFile = {
            fileType: AttachmentFileType.Local,
            name: file.name,
            size: file.size,
            type: file.type,
            fileObject: file,
        };
        localFiles.push(localFile);
    }
    return localFiles;
}
