import { AddinsSupportedAttachmentType, AttachmentDetails } from 'owa-addins-apis-types';

export function createAttachmentFromDisplayFormArgs(args: (string | boolean)[]): AttachmentDetails {
    switch (args[0]) {
        case 'file':
            return createFileAttachment(args);
        case 'item':
            return createItemAttachment(args);
        default:
            return null;
    }
}

function createFileAttachment(args: (string | boolean)[]): AttachmentDetails {
    return <AttachmentDetails>{
        id: args[2],
        name: args[1],
        attachmentType: AddinsSupportedAttachmentType.File,
        isInline: args[3],
    };
}

function createItemAttachment(args: (string | boolean)[]): AttachmentDetails {
    return <AttachmentDetails>{
        id: args[2],
        name: args[1],
        attachmentType: AddinsSupportedAttachmentType.Item,
        isInline: false,
    };
}
