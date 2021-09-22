export enum LinkActionStatus {
    none,
    refreshing,
    refreshFailed,
    refreshSucceeded,
    attachingAsACopy,
    pendingAttachAsACopy, // Used to show a spinner while we are saving a draft
}
