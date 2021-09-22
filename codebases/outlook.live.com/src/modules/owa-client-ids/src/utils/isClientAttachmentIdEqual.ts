import type ClientAttachmentId from '../schema/ClientAttachmentId';

export default function isClientAttachmentIdEqual(
    lhs: ClientAttachmentId,
    rhs: ClientAttachmentId
): boolean {
    return lhs === rhs || (lhs != null && rhs != null && lhs.Id === rhs.Id);
}
