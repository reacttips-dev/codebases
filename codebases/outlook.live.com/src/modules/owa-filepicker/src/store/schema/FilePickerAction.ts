enum FilePickerAction {
    /* None of the action can be 0 as it would fail the null check */
    Attach = 1, // Add as a classic attachment
    Share = 2, // Share as a reference attachment or a beautiful link
    InsertInlineImage = 3, // Insert as an inline image
    AttachAndShare = 4, // This action is responsible to attach the classic attachments and share the reference attachments selected in File Picker
    InsertAsLink = 5, // Insert as a beautiful link
}

export default FilePickerAction;
