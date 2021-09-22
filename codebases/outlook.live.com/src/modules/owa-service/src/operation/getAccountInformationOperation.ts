import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetAccountInformationRequest from '../contract/GetAccountInformationRequest';
import type GetAccountInformationResponse from '../contract/GetAccountInformationResponse';
import getAccountInformationRequest from '../factory/getAccountInformationRequest';

export default function getAccountInformationOperation(
    req: GetAccountInformationRequest,
    options?: RequestOptions
): Promise<GetAccountInformationResponse> {
    if (req !== undefined && !req['__type']) {
        req = getAccountInformationRequest(req);
    }

    return makeServiceRequest<GetAccountInformationResponse>('GetAccountInformation', req, options);
}
