// Threshold time in ms for what we consider a remove favorite action to be "recent"
const RECENT_REMOVE_TIME_THRESHOLD = 10000;

let lastRemovedFolder = {
    folderId: '',
    timeRemoved: null,
};

/**
 * Records that a folder has just been removed from favorites
 */
export function recordLastRemoveFavorite(folderIdRemoved: string) {
    lastRemovedFolder = {
        folderId: folderIdRemoved,
        timeRemoved: new Date(),
    };
}

/**
 * Returns true if the given folderId was recently removed from favorites
 */
export function wasFolderUnfavoritedRecently(folderId: string): boolean {
    if (!lastRemovedFolder.folderId || lastRemovedFolder.folderId != folderId) {
        return false;
    }

    if (
        new Date().getTime() - lastRemovedFolder.timeRemoved.getTime() <
        RECENT_REMOVE_TIME_THRESHOLD
    ) {
        return true;
    }

    return false;
}
