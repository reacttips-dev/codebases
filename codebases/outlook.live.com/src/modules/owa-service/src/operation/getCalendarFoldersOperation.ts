import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetCalendarFoldersResponse from '../contract/GetCalendarFoldersResponse';

export default function getCalendarFoldersOperation(
    req: {},
    options?: RequestOptions
): Promise<GetCalendarFoldersResponse> {
    return makeServiceRequest<GetCalendarFoldersResponse>('GetCalendarFolders', req, options);
}
