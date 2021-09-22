import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

export default function isArchiveFolder(folderId: string): boolean {
    const archiveFolderId = getUserConfiguration().UserOptions?.ArchiveFolderId;
    return !!(folderId && archiveFolderId && archiveFolderId == folderId);
}
