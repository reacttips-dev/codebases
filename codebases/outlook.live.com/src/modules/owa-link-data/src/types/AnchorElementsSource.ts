export enum AnchorElementsSource {
    // The user pastes html. Is a new link
    PasteHtml = 'PasteHtml',

    // The user inserts a link from the 'insert link' dialog in the compose toolbar. Is a new link.
    InsertLinkFromToolbar = 'InsertLinkFromToolbar',

    // Links inserted from the attach menu as we move from reference attachments to links. New link
    InsertLinkFromAttachMenu = 'InsertLinkFromAttachMenu',

    // The user inserts an html blob. This is autolink, where the user did not paste an anchor element
    // but we detected one and made part of the text into an anchor element. Is a new link.
    AutoLink = 'AutoLink',

    // The user forwards an email, or replies to an email . Not a new link
    // Only reply in item view, not in conversation view
    ReplyOrForward = 'ReplyOrForward',

    // Rehydrate after undo beautification from context menu. Not a new link
    LinkContextMenu = 'LinkContextMenu',

    // Now only happens for undo. Name is left for legacy reasons. Not a new link
    Undo = 'Undo',

    // Links detected by the time the editor is finished loading. Happens for resume draft,
    // and for reply in conversation view. Not a new link.
    EditorLoadedOrDraftOrReply = 'EditorLoadedOrDraftOrReply',

    // Editor content operation to restore cursor. This is when the user navigates between OWA tabs. Should not be a new link
    RestoreCursor = 'RestoreCursor',

    // Office Online clients (Word or PowerPoint) share link compose. This occurs when a user does 'Share by email'
    // in word or ppt online, which will open a deeplink to a new compose that contains a link in the body.
    // It should be considered a newly pasted link, since the draft is being loaded with a new link already inserted
    // and the draft was started to share the link. Is a new link.
    ShareLinkCompose = 'ShareLinkCompose',

    // User creates a new fluid file and inserts it into the editor
    NewFluidFile = 'NewFluidFile',

    // Source not known
    Unknown = 'Unknown',
}
