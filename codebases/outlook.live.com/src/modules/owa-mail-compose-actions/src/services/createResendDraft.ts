import createResendDraftOperation from 'owa-service/lib/operation/createResendDraftOperation';

export default function createResendDraft(
    ndrMessageId: string,
    draftsFolderId: string
): Promise<string> {
    const request = {
        ndrMessageId: ndrMessageId,
        draftsFolderId: draftsFolderId,
    };
    return createResendDraftOperation(request);
}
