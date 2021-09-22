import { isClientVerboseQueryStringEnabled } from './datapoints/AriaDatapoint';
import type { PerformanceDatapoint } from './datapoints/PerformanceDatapoint';
import logDatapoint from './logDatapoint';
import { DatapointStatus } from './types/DatapointEnums';
import type { TraceErrorObject } from 'owa-trace';
import getDatapointStatus, { StatusAndType } from './utils/getDatapointStatus';
import type { ErrorType } from 'owa-errors';
import { addErrorToDatapoint } from './utils/addErrorToDatapoint';
import { scrubForPii } from 'owa-config';
import { tryGetTraceObjectErrorFromApolloError } from 'owa-trace/lib/tryGetTraceObjectErrorFromApolloError';

export async function logPerformanceDatapoint(
    datapoint: PerformanceDatapoint,
    status: DatapointStatus | undefined | ((duration?: number) => DatapointStatus),
    errorType: ErrorType | 'general' | undefined,
    errorIn: TraceErrorObject | undefined
) {
    const error = tryGetTraceObjectErrorFromApolloError(errorIn);
    const statusAndType = await getStatusAndType(datapoint, error);
    const calculatedStatus =
        (typeof status == 'function' ? status(datapoint.duration) : status) ||
        statusAndType?.status ||
        DatapointStatus.Success;
    datapoint.properties.Status = calculatedStatus;
    if (
        calculatedStatus != DatapointStatus.Success &&
        calculatedStatus != DatapointStatus.BackgroundSuccess
    ) {
        datapoint.properties.ErrorType = errorType || statusAndType?.type || 'general';
    }

    if (
        (isClientVerboseQueryStringEnabled() || datapoint.options?.logVerbose) &&
        datapoint.waterfallTimings
    ) {
        datapoint.properties.Waterfall = scrubForPii(JSON.stringify(datapoint.waterfallTimings));
    }

    logDatapoint(datapoint);
}

async function getStatusAndType(
    datapoint: PerformanceDatapoint,
    error: TraceErrorObject | undefined
): Promise<StatusAndType | undefined> {
    if (error) {
        const calculatedErrorMessage = await addErrorToDatapoint(datapoint, error);
        return getDatapointStatus(calculatedErrorMessage, error);
    }
    return undefined;
}
