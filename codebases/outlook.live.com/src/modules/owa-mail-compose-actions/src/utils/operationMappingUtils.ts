import { ComposeOperation as ViewStateOperation } from 'owa-mail-compose-store';
import Message from 'owa-service/lib/contract/Message';
import SmartResponseType from 'owa-service/lib/contract/SmartResponseType';
import { ComposeOperation as SchemaOperation } from 'owa-graph-schema';
import { assertNever } from 'owa-assert';

export function getOperationFromMessageType(
    messageType: Message | SmartResponseType
): SchemaOperation {
    switch (messageType.__type) {
        case 'ReplyToItem:#Exchange':
            return 'Reply';
        case 'ReplyAllToItem:#Exchange':
            return 'ReplyAll';
        case 'ForwardItem:#Exchange':
            return 'Forward';
        case 'Message:#Exchange':
        default:
            return 'New';
    }
}

export function getOperationMapping(operation: ViewStateOperation): SchemaOperation {
    switch (operation) {
        case ViewStateOperation.New:
            return 'New';
        case ViewStateOperation.Reply:
            return 'Reply';
        case ViewStateOperation.ReplyAll:
            return 'ReplyAll';
        case ViewStateOperation.Forward:
            return 'Forward';
        case ViewStateOperation.EditDraft:
            return 'EditDraft';
        case ViewStateOperation.Approve:
        case ViewStateOperation.Reject:
            return assertNever(operation as never);
    }
}
