import ApiLimits from '../ApiLimits';
import type DisplayReplyFormArgs from './DisplayReplyFormArgs';
import trySanitizeHtml from '../body/trySanitizeHtml';
import type { ApiMethodCallback } from '../ApiMethod';
import { createAttachmentFromDisplayFormArgs } from '../attachments/AttachmentsFactory';
import { createErrorResult, createSuccessResult } from '../ApiMethodResponseCreator';
import { getAdapter, MessageReadAdapter } from 'owa-addins-adapters';

export default async function displayReplyFormApiMethodBase(
    hostItemIndex: string,
    controlId: string,
    data: DisplayReplyFormArgs,
    callback: ApiMethodCallback,
    isReplyAll: boolean
) {
    let htmlBody = '';
    let attachments = [];
    if (data.htmlBody) {
        if (data.htmlBody.length > ApiLimits.MaxBodyLengthOnDisplayApis) {
            callback(createErrorResult());
            return;
        }

        htmlBody = await trySanitizeHtml(data.htmlBody);
        if (htmlBody == null) {
            callback(createErrorResult());
            return;
        }
    }

    if (data.attachments) {
        if (data.attachments.length > ApiLimits.MaxAttachmentNumberOnDisplayApis) {
            callback(createErrorResult());
            return;
        }
        attachments = data.attachments.map(createAttachmentFromDisplayFormArgs);
    }

    const adapter: MessageReadAdapter = getAdapter(hostItemIndex) as MessageReadAdapter;
    await adapter.displayReplyForm(await adapter.getItemId(), isReplyAll, htmlBody, attachments);
    callback(createSuccessResult());
}
