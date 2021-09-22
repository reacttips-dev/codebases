export interface AttachmentContent {
    format: AttachmentContentFormat;
    content: string;
}

export enum AttachmentContentFormat {
    Base64 = 'base64',
    Eml = 'eml',
    Url = 'url',
    Ical = 'iCalendar',
}
