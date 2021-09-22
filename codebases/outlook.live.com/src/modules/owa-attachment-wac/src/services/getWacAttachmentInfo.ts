import type WacAttachmentType from 'owa-service/lib/contract/WacAttachmentType';
import getWacAttachmentInfoOperation from 'owa-service/lib/operation/getWacAttachmentInfoOperation';
import type RequestOptions from 'owa-service/lib/RequestOptions';

export default function getWacAttachmentInfo(
    attachmentId: string,
    isEdit: boolean,
    draftId: string,
    requestOptions: RequestOptions,
    actionSource?: string
): Promise<WacAttachmentType> {
    // if action source is provided, add it to the client action name header of the call.
    if (actionSource) {
        const actionName: string = 'getWacAttachmentInfo' + actionSource;
        requestOptions = requestOptions || {};
        requestOptions.headers = requestOptions.headers || new Headers();
        requestOptions.headers.set('X-OWA-ActionName', actionName);
    }

    return getWacAttachmentInfoOperation(
        {
            attachmentId: attachmentId,
            isEdit: isEdit,
            draftId: draftId,
            appId: null,
        },
        requestOptions
    );
}
