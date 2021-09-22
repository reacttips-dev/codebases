import ApiEventResponseCode from './ApiEventResponseCode';

export interface ApiEventResult {
    // ErrorClassification was used for CTQs in jsMVVM, currently unused until we add telemetry
    ErrorClassification: string;
    // ErrorDetails was used for CTQs in jsMVVM, currently unused until we add telemetry
    ErrorDetails: string;
    EventResponseCode: ApiEventResponseCode;
}

const DIALOG_EVENT_ERROR_CLASSIFICATION: string = 'DialogApiEventError';
const ERROR_CLASSIFICATION: string = 'ApiEventError';

function createApiEventResult(
    EventResponseCode: ApiEventResponseCode,
    classification?: string,
    details?: string
): ApiEventResult {
    const apiEventResult = {
        EventResponseCode: EventResponseCode,
        ErrorClassification: classification,
        ErrorDetails: details,
    };
    return apiEventResult;
}

export function getSuccessResult(): ApiEventResult {
    return createApiEventResult(ApiEventResponseCode.SUCCESS);
}

export function getGenericErrorResult(): ApiEventResult {
    return createApiEventResult(ApiEventResponseCode.INTERNAL_ERROR);
}

export function getApiCallNotSupportedByExtPointErrorResult(): ApiEventResult {
    return createApiEventResult(ApiEventResponseCode.API_CALL_NOT_SUPPORTED_BY_EXTENSIONPOINT);
}

export function getControlAlreadyRegisteredResult(): ApiEventResult {
    const ControlAlreadyRegisteredDetails: string = 'ControlAlreadyRegistered';
    return createApiEventResult(
        ApiEventResponseCode.INTERNAL_ERROR,
        ERROR_CLASSIFICATION,
        ControlAlreadyRegisteredDetails
    );
}

export function getControlNotRegisteredResult(): ApiEventResult {
    const ControlNotRegisteredDetails: string = 'ControlNotRegistered';
    return createApiEventResult(
        ApiEventResponseCode.INTERNAL_ERROR,
        ERROR_CLASSIFICATION,
        ControlNotRegisteredDetails
    );
}

export function getHandlerNotRegisteredResult(): ApiEventResult {
    const HandlerNotRegisteredDetails: string = 'HandlerNotRegistered';
    return createApiEventResult(
        ApiEventResponseCode.INTERNAL_ERROR,
        ERROR_CLASSIFICATION,
        HandlerNotRegisteredDetails
    );
}

export function getDialogAlreadyOpenResult(): ApiEventResult {
    return createApiEventResult(
        ApiEventResponseCode.DIALOG_ALREADY_OPEN,
        DIALOG_EVENT_ERROR_CLASSIFICATION,
        ApiEventResponseCode[ApiEventResponseCode.DIALOG_ALREADY_OPEN]
    );
}

export function getUrlNotInAppDomainsResult(): ApiEventResult {
    return createApiEventResult(
        ApiEventResponseCode.URL_NOT_IN_APP_DOMAINS,
        DIALOG_EVENT_ERROR_CLASSIFICATION,
        ApiEventResponseCode[ApiEventResponseCode.URL_NOT_IN_APP_DOMAINS]
    );
}

export function isSuccess(result: ApiEventResult): boolean {
    return result.EventResponseCode === ApiEventResponseCode.SUCCESS;
}
