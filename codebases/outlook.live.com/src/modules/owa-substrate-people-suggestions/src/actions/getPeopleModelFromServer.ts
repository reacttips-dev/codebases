import type { SubstrateSearchPeopleModelResponse } from '3s-models';
import { getGuid } from 'owa-guid';
import { isSuccessStatusCode } from 'owa-http-status-codes';
import { makeGetRequest } from 'owa-ows-gateway';
import buildQueryParams from 'owa-search-service/lib/helpers/buildQueryParams';
import { trace } from 'owa-trace';

const PEOPLE_MODEL_ENDPOINT = '/search/api/v2/modelserve/people?';
const CSR_CLIENT_ENABLED = 'CSRClientEnabled';

export default async function getPeopleModelFromServer(): Promise<SubstrateSearchPeopleModelResponse> {
    return makeGetRequest(
        PEOPLE_MODEL_ENDPOINT + getParams(getGuid()),
        undefined /*correlationId*/,
        true /*returnFullResponse*/,
        null /* headers */,
        true /* throwServiceError */,
        /* 3S does not need auth cookies so omitting them will decrease request header size */
        false /* IncludeCredentials */
    )
        .then(resp => {
            if (isSuccessStatusCode(resp.status)) {
                return resp.json() as Promise<SubstrateSearchPeopleModelResponse>;
            } else {
                trace.warn('ModelServe People response failed with response code: ' + resp.status);
                return null;
            }
        })
        .catch(err => {
            trace.warn('ModelServe People response failed with error: ' + err);
            return null;
        });
}

function getParams(cvid: string): string {
    const params = {
        cvid: cvid,
        scenario: 'owa.react.compose',
        setflight: CSR_CLIENT_ENABLED,
        ...buildQueryParams(),
    };

    return Object.keys(params)
        .map(key => `${key}=${params[key]}`)
        .join('&');
}
