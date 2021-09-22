enum AttachmentOpenAction {
    /// Take no action (e.g. completely unsupported)
    NoAction,

    /// View in side-by-side - see the AttachmentPreviewMethod enum for side-by-side rendering methods
    Preview,

    /// Download
    Download,

    /// Open in a new tab
    OpenInNewTab,
}

export default AttachmentOpenAction;
