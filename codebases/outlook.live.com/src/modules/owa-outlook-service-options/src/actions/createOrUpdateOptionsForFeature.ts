import { format } from 'owa-localize';
import {
    getStore,
    setOptionValue,
    OwsOptionsBase,
    OwsOptionsFeatureType,
} from 'owa-outlook-service-option-store';
import type OwsOptionsRequest from '../service/OwsOptionsRequest';
import type OwsOptionsResponse from '../service/OwsOptionsResponse';
import { getGuid } from 'owa-guid';
import { makePatchRequest, makePostRequest } from 'owa-ows-gateway';
import { trace, TraceErrorObject } from 'owa-trace';
import { getOptionsLoadState, LoadState } from '../store/store';
import loadOptions from './loadOptions';

const OUTLOOK_OPTIONS_URL: string = 'ows/v1.0/OutlookOptions/{0}';

const enum RequestMethod {
    POST,
    PATCH,
}

export default async function createOrUpdateOptionsForFeature(
    feature: OwsOptionsFeatureType,
    options: OwsOptionsBase
): Promise<void> {
    let endpointUrl = format(OUTLOOK_OPTIONS_URL, OwsOptionsFeatureType[feature]);

    if (getOptionsLoadState().loadState !== LoadState.OptionsLoaded) {
        // Try to load the options so we know whether to PATCH or POST
        await loadOptions();
    }

    if (getOptionsLoadState().loadState === LoadState.OptionsLoaded) {
        if (getStore().options[feature] && getStore().options[feature].lastModifiedDateTime) {
            if (options && Object.keys(options).length !== 0) {
                // Remove some fields from the options that shouldn't be sent to the server because they must not be changed by the client
                let {
                    'feature@is.Queryable': queryable,
                    'feature@odata.type': type,
                    createdDateTime,
                    lastModifiedDateTime,
                    ...trimmedOptions
                } = <any>options;
                return makePostOrPatchRequest(RequestMethod.PATCH, endpointUrl, trimmedOptions);
            } else {
                trace.info('createOrUpdateOptionsForFeature called with no changes to options');
                return Promise.resolve();
            }
        } else {
            return makePostOrPatchRequest(RequestMethod.POST, endpointUrl, options);
        }
    } else {
        return Promise.reject(new Error('Options are not loaded. Cannot update options.'));
    }
}

function processCreateOrUpdateResponse(responseObject: OwsOptionsResponse): boolean {
    if (responseObject?.options && responseObject.options.length == 1) {
        let options = responseObject.options[0];
        setOptionValue(options.feature, options);
        return true;
    }

    return false;
}

function makePostOrPatchRequest(
    methodType: RequestMethod,
    endpointUrl: string,
    options: OwsOptionsBase
): Promise<void> {
    let requestObject: OwsOptionsRequest = { correlationId: getGuid(), options: options };
    let request =
        methodType == RequestMethod.PATCH
            ? makePatchRequest(endpointUrl, requestObject, requestObject.correlationId)
            : makePostRequest(endpointUrl, requestObject, requestObject.correlationId);
    return request.then((responseObject: OwsOptionsResponse) => {
        if (!processCreateOrUpdateResponse(responseObject)) {
            const error: TraceErrorObject = new Error('Error processing options response');
            error.networkError = true;
            throw error;
        }
    });
}
