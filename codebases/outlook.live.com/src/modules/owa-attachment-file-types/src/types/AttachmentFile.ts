import type AttachmentItemFile from './AttachmentItemFile';
import type {
    default as Base64InlineImageFile,
    ExpirableBase64InlineImageFile,
} from './Base64InlineImageFile';
import type CloudFile from './CloudFile';
import type LocalComputerFile from './LocalComputerFile';
import type MailItemFile from './MailItemFile';
import type UriFile from './UriFile';

type AttachmentFile =
    | LocalComputerFile
    | Base64InlineImageFile
    | ExpirableBase64InlineImageFile
    | CloudFile
    | MailItemFile
    | UriFile
    | AttachmentItemFile;

export default AttachmentFile;

/**
 * Enum is used in scorecards and reports.
 * Please add any new values at the end.
 */
export enum AttachmentFileType {
    Base64InlineImage = 0,
    Cloud = 1,
    Local = 2,
    MailItem = 3,
    Uri = 4,
    AttachmentItem = 5,
    CloudSuggestion = 6,
    AttachmentItemSuggestion = 7,
    Inline = 8,
    Smime = 9,
    FilesHub = 10,
    GroupFilesHub = 11,
    MailSearchFileSuggestion = 12,
    Unknown = 13,
    ContextualSuggestion = 14,
    ConsumerGroupFilesHub = 15,
    SmartDoc = 16,
    ExpirableBase64InlineImage = 17,
}

export interface AttachmentFileList {
    readonly length: number;
    readonly [index: number]: AttachmentFile;
}
