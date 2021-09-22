export { default as getUserMailboxId } from './utils/getUserMailboxId';
export { default as getUserMailboxInfo } from './utils/getUserMailboxInfo';
export { default as removeUserMailboxInfo } from './utils/removeUserMailboxInfo';
export { default as isClientAttachmentIdEqual } from './utils/isClientAttachmentIdEqual';
export { default as getDefaultRoutingKey } from './utils/getDefaultRoutingKey';

export { default as getRoutingKeyPrefixForSmtpAddress } from './utils/getRoutingKeyPrefixForSmtpAddress';

export type { default as MailboxType } from './schema/MailboxType';
export type { default as MailboxInfo } from './schema/MailboxInfo';
export type { default as ClientItemId } from './schema/ClientItemId';
export type { default as ClientFolderId } from './schema/ClientFolderId';
export type { default as ClientAttachmentId } from './schema/ClientAttachmentId';
