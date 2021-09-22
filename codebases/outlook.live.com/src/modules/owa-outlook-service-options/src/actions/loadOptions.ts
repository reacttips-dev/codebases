import applyDefaultOptions from './applyDefaultOptions';
import { applyDefaultOptionsOnLoadFail } from './applyDefaultOptionsOnLoadFail';
import {
    setOptionValue,
    OwsOptionsFeatureType,
    SurfaceActionsOptions,
} from 'owa-outlook-service-option-store';
import type OwsOptionsResponse from '../service/OwsOptionsResponse';
import { LoadState, getOptionsLoadState } from '../store/store';
import { makeGetRequest } from 'owa-ows-gateway';
import { trace } from 'owa-trace';
import { mutatorAction } from 'satcheljs';

const GET_OUTLOOK_OPTIONS_URL: string = 'ows/v1.0/OutlookOptions';

var onOptionsLoadedPromise: Promise<void> = null;

let setLoadState = mutatorAction('setOptionLoadState', function (loadState: LoadState) {
    getOptionsLoadState().loadState = loadState;
});

export default function loadOptions(): Promise<void> {
    switch (getOptionsLoadState().loadState) {
        case LoadState.OptionsLoading:
            return onOptionsLoadedPromise;
        case LoadState.OptionsLoaded:
            return Promise.resolve();
        case LoadState.OptionsNotLoaded:
        default:
            setLoadState(LoadState.OptionsLoading);
            return (onOptionsLoadedPromise = makeGetRequest(GET_OUTLOOK_OPTIONS_URL).then(
                outlookOptionsResponse => {
                    processResponse(outlookOptionsResponse);
                    onOptionsLoadedPromise = null;
                }
            ));
    }
}

function processResponse(outlookOptionsResponse: OwsOptionsResponse) {
    if (outlookOptionsResponse) {
        if (outlookOptionsResponse.options) {
            outlookOptionsResponse.options.forEach(options => {
                if (options != null) {
                    if (options.feature == OwsOptionsFeatureType.SurfaceActions) {
                        options = GetFallBackSurfaceActionsIfNull(options as SurfaceActionsOptions);
                    }

                    setOptionValue(options.feature, options);
                }
            });
        }

        applyDefaultOptions();
        setLoadState(LoadState.OptionsLoaded);
    } else {
        trace.info('Error loading options');
        applyDefaultOptionsOnLoadFail();
        setLoadState(LoadState.OptionsNotLoaded);
    }
}

function GetFallBackSurfaceActionsIfNull(options: SurfaceActionsOptions): SurfaceActionsOptions {
    options.readSurfaceActions = options.readSurfaceActions ? options.readSurfaceActions : [];
    options.readSurfaceAddins = options.readSurfaceAddins ? options.readSurfaceAddins : [];
    options.composeSurfaceActions = options.composeSurfaceActions
        ? options.composeSurfaceActions
        : [];
    options.composeSurfaceAddins = options.composeSurfaceAddins ? options.composeSurfaceAddins : [];
    return options;
}
