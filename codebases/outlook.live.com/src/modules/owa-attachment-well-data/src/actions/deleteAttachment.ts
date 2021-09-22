import { wrapFunctionForDatapoint } from 'owa-analytics';
import type { AttachmentFileType } from 'owa-attachment-file-types';
import type { AttachmentState } from 'owa-attachment-full-data';
import type ItemId from 'owa-service/lib/contract/ItemId';
import datapoints from '../datapoints';
import type AttachmentWellViewState from '../schema/AttachmentWellViewState';
import removeAttachmentFromWell from './removeAttachmentFromWell';
import updateChangeKeyOnItemId from './updateChangeKeyOnItemId';
import { getApolloClient } from 'owa-apollo';
import { DeleteAttachmentFromDraftDocument } from '../graphql/__generated__/DeleteAttachmentFromDraftMutation.interface';
import type { ClientAttachmentId } from 'owa-client-ids';
import type RequestOptions from 'owa-service/lib/RequestOptions';

export default wrapFunctionForDatapoint(
    datapoints.AttachmentDeletionAction,
    async function deleteAttachment(
        attachmentWellViewState: AttachmentWellViewState,
        attachmentState: AttachmentState,
        parentItemId: ItemId,
        attachmentFileType: AttachmentFileType /* this parameter is used in datapoint logging */
    ): Promise<void> {
        const result = await invokeDeleteAttachmentFromDraftMutationFn(
            attachmentState.attachmentId,
            parentItemId
        );

        removeAttachmentFromWell(attachmentWellViewState, attachmentState);
        updateChangeKeyOnItemId(parentItemId, result.RootItemId.RootItemChangeKey);
    }
);

const invokeDeleteAttachmentFromDraftMutationFn = async function invokeDeleteAttachmentFromDraftMutation(
    attachmentId: ClientAttachmentId,
    parentItemId: ItemId,
    requestOptions?: RequestOptions
) {
    const client = getApolloClient();
    const result = await client.mutate({
        variables: {
            attachmentId: {
                Id: attachmentId.Id,
                mailboxInfo: attachmentId.mailboxInfo,
                RootItemId: attachmentId.RootItemId || parentItemId.Id,
                RootItemChangeKey: attachmentId.RootItemChangeKey,
            },
        },
        context: {
            requestOptions: requestOptions,
        },
        mutation: DeleteAttachmentFromDraftDocument,
    });

    return result?.data?.deleteAttachmentFromDraft;
};

export const exportedHelperFunctions = {
    invokeDeleteAttachmentFromDraftMutation: invokeDeleteAttachmentFromDraftMutationFn,
};
