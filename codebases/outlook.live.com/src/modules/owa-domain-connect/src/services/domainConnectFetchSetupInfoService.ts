import { trace } from 'owa-trace';
import { makeGetRequest } from 'owa-ows-gateway';
import type { DomainConnectFetchSetupResponse } from '../contract/DomainConnectFetchSetupResponse';

const fetchSetupInformationUrl: string = 'ows/api/v1/PremiumDomain/setup';

export default function domainConnectFetchSetupInfoService(): Promise<DomainConnectFetchSetupResponse> {
    return makeGetRequest(fetchSetupInformationUrl)
        .then(resp => {
            return resp;
        })
        .catch(err => {
            trace.warn(err);
            return null;
        });
}
