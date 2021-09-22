import type GetSharePointTextFileContentResponse from 'owa-service/lib/contract/GetSharePointTextFileContentResponse';
import getSharePointTextFileContentOperation from 'owa-service/lib/operation/getSharePointTextFileContentOperation';
import type GetSharePointTextFileContentRequest from 'owa-service/lib/contract/GetSharePointTextFileContentRequest';
import { getHeaders } from 'owa-headers';

export function getSharePointTextFileContent(
    id: string,
    url: string,
    clientActionName: string = 'GetSharePointTextFileContent-FH-REACT'
): Promise<GetSharePointTextFileContentResponse> {
    const request: GetSharePointTextFileContentRequest = {
        FileId: id,
        FileUrl: url,
    };

    return getSharePointTextFileContentOperation(
        {
            request: request,
        },
        {
            headers: getHeaders(null, clientActionName),
        }
    );
}
