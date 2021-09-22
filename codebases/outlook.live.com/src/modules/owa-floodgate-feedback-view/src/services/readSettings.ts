import { FLOODGATE_API_ROOT } from './constants';
import { isSuccessStatusCode } from 'owa-http-status-codes';
import { makeGetRequest } from 'owa-ows-gateway';

export default async function readSettings(settingName: string) {
    // make server call
    const response = await makeGetRequest(
        `${FLOODGATE_API_ROOT}${settingName}`,
        undefined /* correlationId */,
        true /* returnFullResponse */
    );

    if (isSuccessStatusCode(response.status)) {
        return response.json();
    }

    return null;
}
