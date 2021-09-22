import { AttachmentFileType } from '../types/AttachmentFile';
import type { default as UriFile, UriFileList } from '../types/UriFile';
import { getExtensionFromFileName } from 'owa-file';

export default function createUriFiles(entries: { name: string; url: string }[]): UriFileList {
    const uriList = entries.map<UriFile>(entry => {
        return {
            fileType: AttachmentFileType.Uri,
            name: entry.name,
            type: getExtensionFromFileName(entry.url) || '',
            size: 0,
            uri: entry.url,
        };
    });

    return uriList;
}
