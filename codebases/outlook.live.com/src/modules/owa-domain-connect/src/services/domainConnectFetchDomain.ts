import { trace } from 'owa-trace';
import type { DomainConnectFetchSetupResponse } from '../contract/DomainConnectFetchSetupResponse';
import { makeGetRequest } from 'owa-ows-gateway';

const fetchDomainUrl: string = 'ows/api/v1/PremiumDomain/';

export function domainConnectFetchDomainService(): Promise<DomainConnectFetchSetupResponse> {
    return makeGetRequest(fetchDomainUrl)
        .then(resp => {
            return resp;
        })
        .catch(err => {
            trace.warn(err);
            return null;
        });
}
