import logDatapoint from './logDatapoint';
import type CalculatedResourceTimings from './types/CalculatedResourceTimings';
import { ServiceActionDatapoint } from './datapoints/ServiceActionDatapoint';
import { isFeatureEnabled } from 'owa-feature-flags';
import endsWith from 'lodash-es/endsWith';
import { DataPointEventType } from './types/DatapointEnums';

export default function captureAssetsOptics(timings: (CalculatedResourceTimings | undefined)[]) {
    if (isFeatureEnabled('an-log-assets')) {
        timings.forEach(timing => {
            if (timing && (endsWith(timing.name, '.js') || endsWith(timing.name, '.json'))) {
                const nameParts = timing.name.split('/');
                const resourceName = nameParts[nameParts.length - 1];
                const datapoint = new ServiceActionDatapoint(resourceName);
                datapoint.addResourceTimings('Asset', timing);
                logDatapoint(datapoint, DataPointEventType.ClientNetworkRequest);
            }
        });
    }
}
