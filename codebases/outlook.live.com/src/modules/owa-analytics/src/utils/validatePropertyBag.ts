import type { AriaDatapoint } from '../datapoints/AriaDatapoint';
import { isFeatureEnabled } from 'owa-feature-flags';
import * as trace from 'owa-trace';
import { scrubForPii } from 'owa-config';

const htmlRegex = new RegExp(/<((div)|(span)|(table)|(ul)|(body))>/);

export function safeStringify(input: any): string {
    try {
        return JSON.stringify(input);
    } catch (e) {
        return e.message;
    }
}

export function validatePropertyBag(datapoint: AriaDatapoint): string {
    if (isFeatureEnabled('fwk-turnOffCustomData')) {
        return 'emergency flight on';
    }

    if (datapoint.propertyBag) {
        var keys = Object.keys(datapoint.propertyBag);
        for (var ii = 0; ii < keys.length; ii++) {
            var propertyKey = keys[ii];
            var propertyValue = datapoint.propertyBag[propertyKey];
            var errorMessage: string | null = null;
            if (
                propertyKey.toLowerCase().indexOf('subject') > -1 &&
                typeof propertyValue == 'string'
            ) {
                errorMessage = "'s key contains subject";
            } else if (propertyValue) {
                if (typeof propertyValue == 'object' && !(propertyValue instanceof Date)) {
                    errorMessage = ' is an object';
                } else if (htmlRegex.test(propertyValue.toString())) {
                    errorMessage = ' contains html';
                }
            }

            if (errorMessage) {
                trace.errorThatWillCauseAlert(
                    propertyKey +
                        ' of datapoint ' +
                        datapoint.eventName +
                        errorMessage +
                        ' which is pii'
                );
                return errorMessage;
            }
            if (typeof propertyValue == 'string') {
                datapoint.propertyBag[propertyKey] = scrubForPii(propertyValue);
            }
        }
    }

    return safeStringify(datapoint.propertyBag);
}
