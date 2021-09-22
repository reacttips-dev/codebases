import { PerformanceDatapoint, DatapointStatus } from 'owa-analytics';
import { trace } from 'owa-trace';

export enum MeetNowClientErrorTypes {
    NoWindowObject,
    MakePostRequestError,
    NoMeetingUrlInResponse,
    MeetNowForbidden,
    NonSuccessStatusCodeResponse,
    UndefinedResponse,
}

export function startPerformanceDatapoint(
    correlationId: string,
    scenario: string
): PerformanceDatapoint {
    const perfDatapoint = new PerformanceDatapoint('MeetNowE2E', {
        isCore: true /* Needs to be unsampled as its being tracked as Teams referral */,
    });
    perfDatapoint.addCustomData({
        correlationId,
        scenario,
    });
    return perfDatapoint;
}

export function logMeetNowError(
    datapoint: PerformanceDatapoint,
    errorType: MeetNowClientErrorTypes,
    errorObject?: any
) {
    trace.warn(
        'MeetNowError ErrorType:' +
            errorType +
            ' / Object: ' +
            (errorObject ? errorObject.toString() : 'none')
    );
    datapoint.addCustomData({
        errorType_2: errorType,
    });
    let datapointStatus: DatapointStatus;
    switch (errorType) {
        case MeetNowClientErrorTypes.MakePostRequestError:
        case MeetNowClientErrorTypes.NoWindowObject:
            datapointStatus = DatapointStatus.ClientError;
            break;
        case MeetNowClientErrorTypes.NoMeetingUrlInResponse:
        case MeetNowClientErrorTypes.NonSuccessStatusCodeResponse:
        case MeetNowClientErrorTypes.UndefinedResponse:
            datapointStatus = DatapointStatus.ServerError;
            break;
        case MeetNowClientErrorTypes.MeetNowForbidden:
            datapointStatus = DatapointStatus.ServerExpectedError;
            break;
    }
    datapoint.endWithError(datapointStatus, errorObject);
}

export function logMeetNowSuccess(datapoint: PerformanceDatapoint, isConsumer: boolean) {
    datapoint.addCustomData({
        isConsumer,
    });
    datapoint.end();
}
