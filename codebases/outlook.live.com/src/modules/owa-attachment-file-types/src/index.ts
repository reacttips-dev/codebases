// Types
export { default as createFileFromImageSource } from './utils/createFileFromImageSource';
export { default as createUriFiles } from './utils/createUriFiles';
export { default as createMailItemFiles } from './utils/createMailItemFiles';
export { default as createMailItemFileForSmime } from './utils/createMailItemFileForSmime';
export { default as createLocalComputerFiles } from './utils/createLocalComputerFiles';
export { default as createBase64File } from './utils/createBase64File';
export { default as createCloudFileFromDataProviderItem } from './utils/createCloudFileFromDataProviderItem';
export { default as createAttachmentItemFileFromDataProviderItem } from './utils/createAttachmentItemFileFromDataProviderItem';
export { default as convertToAttachmentDataProviderType } from './utils/convertToAttachmentDataProviderType';
export type { UriFileList } from './types/UriFile';
export type { default as UriFile } from './types/UriFile';
export type { default as MailItemFile } from './types/MailItemFile';
export type { LocalComputerFileList } from './types/LocalComputerFile';
export type { default as LocalComputerFile } from './types/LocalComputerFile';
export type { default as CloudFile } from './types/CloudFile';

export type {
    default as Base64InlineImageFile,
    ExpirableBase64InlineImageFile,
} from './types/Base64InlineImageFile';
export type { default as AttachmentItemFile } from './types/AttachmentItemFile';
export type { default as AttachmentFileAttributes } from './types/AttachmentFileAttributes';
export { AttachmentFileType } from './types/AttachmentFile';
export type { default as AttachmentFile, AttachmentFileList } from './types/AttachmentFile';
