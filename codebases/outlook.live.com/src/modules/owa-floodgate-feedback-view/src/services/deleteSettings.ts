import { FLOODGATE_API_ROOT, FloodgateSettingDataType } from './constants';
import { makeDeleteRequest } from 'owa-ows-gateway';
import prefetch from 'owa-service/lib/prefetch';
import { isSuccessStatusCode } from 'owa-http-status-codes';
import { logUsage } from 'owa-analytics';

export default function deleteSettings(request: FloodgateSettingDataType) {
    prefetch(() => {
        deleteSettingsInternal(request);
    });
}

async function deleteSettingsInternal(request: FloodgateSettingDataType) {
    const response = await makeDeleteRequest(
        FLOODGATE_API_ROOT,
        request,
        undefined /* correlationId */,
        true /* returnFullResponse */,
        undefined /* customHeaders */,
        undefined /* throwServiceError */,
        true /* isThrottled */
    );

    if (!isSuccessStatusCode(response.status)) {
        logUsage('FoodgateDeleteSettings', [response.status, JSON.stringify(request)]);
    }
}
