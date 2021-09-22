let GenericKeys = {
    requestIds: 'RequestIds',
    correlationVectors: 'cV', // this needs to be cV so we can correlate with other databases
    cache: 'Cache',
    e2eTimeElapsed: 'E2ETimeElapsed',
};

export { GenericKeys };

export const enum DatapointStatus {
    Success = 'Success',
    ServerError = 'ServerError',
    UserError = 'UserError',
    ServerExpectedError = 'ServerExpectedError',
    ClientError = 'ClientError',
    RequestNotComplete = 'RequestNotComplete',
    Timeout = 'Timeout',
    BackgroundSuccess = 'BackgroundSuccess',
}

export interface AnalyticsOptions {
    ariaTenantTokens: string[];
    isTesting?: boolean; // This will never log any datapoints
    maxErrorsPerSession?: number;
    flightControls?: {
        [index: string]: FlightControl;
    };
    verboseWhiteListEvents?: string[];
    qosDatapointNames?: string[];
    sampledQosDatapointNames?: string[];
    shouldIncludeUserInfoId?: boolean;
}

export interface FlightControl {
    flight: string;
    rate?: number;
}

export const enum DataPointEventType {
    ClientVerbose = 'client_verbose',
    ClientError = 'client_error',
    ClientCosmos = 'client_cosmos',
    ClientEvent = 'client_event',
    ClientTrace = 'client_trace',
    ClientEventDevOnly = 'client_event_dev_only',
    ClientErrorExternal = 'client_error_external',
    ClientNetworkRequest = 'client_network_request',
}
