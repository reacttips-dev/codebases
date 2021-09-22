import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';

/* ADDABLE_FILE_PROVIDERS_LIST: file providers that we allow the users to add account information for.
by adding an account they allow us to fetch files from that provider
FILE_PROVIDERS_LIST/ FileProviderType: file providers that we can fetch files from. This is all the addable provders +
OneDrivePro and Mailbox providers which the user does not have to add to fetch files from */

// TODO VSO# 33055 Consider supporting groups file provider on server
export enum ClientOnlyFileProviderType {
    Groups = 10000,
}

export type FileProviderType =
    | AttachmentDataProviderType.OneDriveConsumer
    | AttachmentDataProviderType.Box
    | AttachmentDataProviderType.Dropbox
    | AttachmentDataProviderType.Facebook
    | AttachmentDataProviderType.GDrive
    | AttachmentDataProviderType.OneDrivePro
    | AttachmentDataProviderType.Mailbox
    | AttachmentDataProviderType.MailMessage
    | AttachmentDataProviderType.WopiBox
    | AttachmentDataProviderType.WopiEgnyte
    | AttachmentDataProviderType.WopiDropbox;

export const ADDABLE_FILE_PROVIDERS_LIST = Object.freeze([
    AttachmentDataProviderType.OneDriveConsumer,
    AttachmentDataProviderType.Box,
    AttachmentDataProviderType.Dropbox,
    AttachmentDataProviderType.Facebook,
    AttachmentDataProviderType.GDrive,
    AttachmentDataProviderType.WopiBox,
    AttachmentDataProviderType.WopiEgnyte,
    AttachmentDataProviderType.WopiDropbox,
] as FileProviderType[]);

export const FILE_PROVIDERS_LIST = Object.freeze([
    ...ADDABLE_FILE_PROVIDERS_LIST,
    AttachmentDataProviderType.OneDrivePro,
    AttachmentDataProviderType.Mailbox,
    AttachmentDataProviderType.MailMessage,
] as AttachmentDataProviderType[]);

export type FileProviderViewType = FileProviderType | ClientOnlyFileProviderType.Groups;

export const OUTLOOK: string = 'Outlook';
