import findComposeViewStateById, { IdSource } from '../utils/findComposeViewStateById';
import getComposeTarget from '../utils/getComposeTarget';
import { logUsage } from 'owa-analytics';
import type { AttachmentState } from 'owa-attachment-full-data';
import truncateCountForDataPointAggregation from 'owa-mail-store/lib/utils/truncateCountForDataPointAggregation';
import logSmimeSendSaveActionDatapoint from 'owa-smime/lib/actions/logSmimeSendSaveActionDatapoint';
import { orchestrator } from 'satcheljs';
import { isDeepLink } from 'owa-url';

export default orchestrator(logSmimeSendSaveActionDatapoint, actionMessage => {
    const { composeId, isSend, smimeType, error } = actionMessage;
    const viewState = findComposeViewStateById(composeId, IdSource.Compose);
    const isError = !!error;
    const errorCode = isError ? error.errorCode : null;
    const errorContext = isError ? error.errorContext : null;
    const errorMessage = isError ? error.message : null;
    const errorStack = isError ? error.stack : null;

    if (viewState) {
        const { operation } = viewState;
        const { docViewAttachments, inlineAttachments } = viewState.attachmentWell;
        const composeTarget = getComposeTarget();
        const isPopout = isDeepLink();
        let attachments: AttachmentState[];
        attachments = docViewAttachments.slice(0);
        attachments.push(...inlineAttachments);

        const attachmentCount = truncateCountForDataPointAggregation(attachments.length);

        logUsage(
            'SmimeSendSaveActionDatapoint',
            {
                isSend,
                smimeType,
                composeTarget,
                isPopout,
                operation,
                attachmentCount,
                isError,
                errorCode,
                errorContext,
                errorMessage,
                errorStack,
            },
            { isCore: true }
        );
    } else {
        logUsage(
            'SmimeSendSaveActionDatapoint',
            {
                isSend,
                smimeType,
                isError,
                errorCode,
                errorContext,
                errorMessage,
                errorStack,
            },
            { isCore: true }
        );
    }
});
