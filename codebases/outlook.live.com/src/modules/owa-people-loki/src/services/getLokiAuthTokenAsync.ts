import { DatapointStatus, PerformanceDatapoint } from 'owa-analytics';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getApplicationSettings } from 'owa-application-settings';
import { getAccessTokenforResource, getDelegationTokenForOwa } from 'owa-tokenprovider';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import { getGuid } from 'owa-guid';
import { getVariantEnvironment } from 'owa-metatags';

const MsaTokenScope = 'liveprofilecard.access';
const AAD_LOGGING_SCENARIO_NAME = 'OwaPeopleLoki_GetLokiAadAuthTokenOperation';

export const getLokiAuthTokenAsync = async (): Promise<string> => {
    const requestId = getGuid();
    const dataPoint = new PerformanceDatapoint(AAD_LOGGING_SCENARIO_NAME);

    // Used to correlate logs from this datapoint and internal token fetcher  logs
    dataPoint.addCustomProperty('RequestId', requestId);

    try {
        let token = null;
        if (isConsumer()) {
            // Consumer MSA token
            token = await getDelegationTokenForOwa(MsaTokenScope, 'loki', requestId);
        } else {
            // Enterprise AAD token
            const lokiResourceUrl = isFeatureEnabled('fwk-application-settings')
                ? getApplicationSettings('Loki').resourceUrl
                : getLokiResourceUrl();

            token = await getAccessTokenforResource(lokiResourceUrl, 'loki', requestId);
        }

        if (token) {
            dataPoint.end();
            return token;
        }

        dataPoint.endWithError(DatapointStatus.ServerError, Error('Token is empty.'));
        return null;
    } catch (e) {
        dataPoint.endWithError(DatapointStatus.ClientError, Error('Unexpected error.'));
        return null;
    }
};

function getLokiResourceUrl(): string {
    switch (getVariantEnvironment()) {
        case 'BlackForest':
            return 'https://loki.delve.office.de/';

        case 'GccHigh':
            return 'https://gcchigh.loki.office365.us/';

        case 'DoD':
            return 'https://dod.loki.office365.us/';

        case 'Gallatin':
            return 'https://loki.office365.cn/';

        case 'AG08':
        case 'AG09':
            return 'https://loki.delve.office.com/';

        default: {
            if (isFeatureEnabled('lpc-isInGccModerate')) {
                return 'https://gcc.loki.delve.office.com/';
            }

            return 'https://loki.delve.office.com/';
        }
    }
}
