import {notificationActionCreators} from "../";
import getLogger from "../../../common/logging/getLogger";
import {
    ConnectionError,
    Error,
    GeoLocationError,
    HttpRequestError,
    HttpRequestType,
    SpecialOfferError,
} from "../../errors";
import {ActionCreatorsMapObject} from "redux";
import {ThunkResult} from "models";

export const errorActiontype = {
    clearState: "ERROR_CLEAR_STATE",
    error: "ERROR_OCCURED",
    trackPageNotFoundView: "PAGE_NOT_FOUND_LOAD",
};

export interface ErrorActionCreators extends ActionCreatorsMapObject {
    error: (error: Error, ...retryActionCreator: Array<() => void>) => ThunkResult<void>;
    clearState: () => void;
    trackPageNotFoundView: () => void;
}

export const errorActionCreators: ErrorActionCreators = (() => {
    const error = (e: Error, ...retryActionCreator: Array<() => void>): ThunkResult<void> => {
        return async (dispatch) => {
            if (e instanceof HttpRequestError) {
                const shouldDisplay: boolean = _shouldDisplayHttpRequestError(e.type);
                await dispatch(_setError(e, shouldDisplay, e.statusCode));
                if (e.type === HttpRequestType.AddToCartApi) {
                    dispatch(notificationActionCreators.addToCartError());
                }
            } else if (e instanceof ConnectionError) {
                await dispatch(_setError(e, false));
                if (e.type === HttpRequestType.AddToCartApi) {
                    dispatch(notificationActionCreators.addToCartError());
                } else if (_shouldDisplayConnectionError(e.type)) {
                    dispatch(notificationActionCreators.connectionError(...retryActionCreator));
                }
            } else if (e instanceof GeoLocationError) {
                await dispatch(_setError(e, false));
                dispatch(notificationActionCreators.geoLocationError());
            } else if (e instanceof SpecialOfferError) {
                await dispatch(_setError(e, true));
            } else {
                getLogger().error(e);
                await dispatch(_setError(e, false));
            }
        };
    };

    const clearState = () => {
        return {type: errorActiontype.clearState};
    };

    const trackPageNotFoundView = () => {
        return {
            type: errorActiontype.trackPageNotFoundView,
        };
    };

    const _setError = (e: Error, shouldDisplay: boolean, statusCode?: number) => {
        return {
            type: errorActiontype.error,
            error: e,
            shouldDisplay,
            statusCode,
        };
    };

    const _shouldDisplayHttpRequestError = (httpRequestErrorType: HttpRequestType) => {
        if (httpRequestErrorType === HttpRequestType.AvailabilityApi) {
            return false;
        }

        return _shouldDisplayError(httpRequestErrorType);
    };

    const _shouldDisplayConnectionError = (connectionErrorType: HttpRequestType) => {
        return _shouldDisplayError(connectionErrorType);
    };

    const _shouldDisplayError = (httpRequestErrorType: HttpRequestType) => {
        if (
            httpRequestErrorType === HttpRequestType.LocationApi ||
            httpRequestErrorType === HttpRequestType.RemoteConfigApi ||
            httpRequestErrorType === HttpRequestType.AddToCartApi ||
            httpRequestErrorType === HttpRequestType.ProductContentApi
        ) {
            return false;
        }

        return true;
    };

    return {
        error,
        clearState,
        trackPageNotFoundView,
    };
})();
