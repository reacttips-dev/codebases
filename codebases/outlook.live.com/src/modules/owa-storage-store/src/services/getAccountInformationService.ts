import type GetAccountInformationResponse from 'owa-service/lib/contract/GetAccountInformationResponse';
import getAccountInformationRequest from 'owa-service/lib/factory/getAccountInformationRequest';
import getAccountInformationOperation from 'owa-service/lib/operation/getAccountInformationOperation';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';

/**
 * Get account information service
 */
export default function getAccountInformationService(): Promise<GetAccountInformationResponse> {
    let requestBody = getAccountInformationRequest({
        Header: getJsonRequestHeader(),
    });

    return getAccountInformationOperation(requestBody);
}
