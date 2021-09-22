// The order of the LinkContextMenuOptions controls the order in which the options will show up in the context menu
export enum LinkContextMenuOptions {
    // Show a sharing tip
    SharingTip,

    /// Option to change the permission on the attachment
    ChangePermission,

    // Preview link in SxS
    Preview,

    /// Open the link in new tab
    OpenInNewTab,

    // Creates a classic attachment for the file the link points to
    AttachACopy,

    /// Option to revert to full url instead of beautified one
    RevertToFullUrl,

    /// Option to edit the link text and url
    EditLink,

    /// Option to copy the link to clipboard
    CopyLinkToClipboard,
}

export default function getLinkContextMenuOptions(): LinkContextMenuOptions[] {
    return Object.keys(LinkContextMenuOptions)
        .filter(value => !isNaN(Number(LinkContextMenuOptions[value])))
        .map(key => LinkContextMenuOptions[key]);
}
