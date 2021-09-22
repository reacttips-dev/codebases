import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import type Item from 'owa-service/lib/contract/Item';
import isSmimeDataPackage from 'owa-smime-adapter/lib/utils/isSmimeDataPackage';

export const getFirstAttachment = (item: Item): AttachmentType =>
    item?.Attachments?.length && item.Attachments[0];
/**
 *
 * @param item An SMIME item
 * Returns the AttachmentType from the attachments of an item that contains the p7m attachment info.
 * For an S/MIME message, there should only be one attachment with a *.p7m Name (Unless decoded on server)
 * pkcs7 syntax is used to digitally sign, digest, authenticate, or encrypt arbitrary message content and
 * should be indicated in the contentType.
 */
export const getSmimeAttachmentType = (item: Item): AttachmentType => {
    const smimeAttachmentType = getFirstAttachment(item);
    return isSmimeDataPackage(smimeAttachmentType) ? smimeAttachmentType : null;
};

export default getSmimeAttachmentType;
