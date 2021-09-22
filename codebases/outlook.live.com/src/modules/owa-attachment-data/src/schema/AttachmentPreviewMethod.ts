enum AttachmentPreviewMethod {
    // Side-by-side preview not supported.
    Unsupported,

    // Use the image lightbox UI to render the attachment.
    Image,

    // Use OWA to render an embedded mail item.
    MailItem,

    // Use OWA's calendar UI to reder the file (e.g. ICS).
    CalendarEvent,

    // Use the WAC to render the file (e.g. Office docs).
    Wac,

    // Use Suite Extensions to render the file (e.g. GPX).
    SuiteExtensions,

    // Use the audio player to render the file (e.g. MP3).
    Audio,

    // Render the file as plain text.
    Text,

    // Use the native view for pdf files.
    NativeView,

    // View Google docs in iframe
    GoogleDoc,

    // Use the PDF.js for pdf files.
    PdfJs,

    // Use ItemReadingPane to render item attachment
    ItemAttachment,

    // Use the video player to render the file (e.g. MP4)
    Video,
}

export default AttachmentPreviewMethod;
