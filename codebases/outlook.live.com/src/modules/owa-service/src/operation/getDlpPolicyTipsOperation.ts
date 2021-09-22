import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetDlpPolicyTipsRequest from '../contract/GetDlpPolicyTipsRequest';
import type GetDlpPolicyTipsResponse from '../contract/GetDlpPolicyTipsResponse';
import getDlpPolicyTipsRequest from '../factory/getDlpPolicyTipsRequest';

export default function getDlpPolicyTipsOperation(
    req: GetDlpPolicyTipsRequest,
    options?: RequestOptions
): Promise<GetDlpPolicyTipsResponse> {
    if (req !== undefined && !req['__type']) {
        req = getDlpPolicyTipsRequest(req);
    }

    return makeServiceRequest<GetDlpPolicyTipsResponse>('GetDlpPolicyTips', req, options);
}
