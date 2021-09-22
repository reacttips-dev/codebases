import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type Datapoint from '../contract/Datapoint';
import datapoint from '../factory/datapoint';

export default function logDatapointOperation(
    req: { datapoints: Datapoint[] },
    options?: RequestOptions
): Promise<boolean> {
    if (req.datapoints !== undefined) {
        for (var i = 0; i < req.datapoints.length; i++) {
            if (req.datapoints[i] !== undefined && !req.datapoints[i]['__type']) {
                req.datapoints[i] = datapoint(req.datapoints[i]);
            }
        }
    }

    return makeServiceRequest<boolean>('LogDatapoint', req, options);
}
