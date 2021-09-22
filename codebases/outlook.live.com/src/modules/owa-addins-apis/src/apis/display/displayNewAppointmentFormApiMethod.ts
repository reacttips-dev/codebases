import ApiLimits from '../ApiLimits';
import convertToEmailAddressWrappers from '../../utils/convertToEmailAddressWrappers';
import type { ApiMethodCallback } from '../ApiMethod';
import { createErrorResult, createSuccessResult } from '../ApiMethodResponseCreator';
import type { EmailAddressDetails } from '../getInitialData/EmailAddressDetails';
import { getAdapter, ReadDisplayAdapter } from 'owa-addins-adapters';

export interface DisplayNewAppointmentFormArgs {
    requiredAttendees?: string[] | EmailAddressDetails[];
    optionalAttendees?: string[] | EmailAddressDetails[];
    start?: number;
    end?: number;
    location?: string;
    resources?: string[]; // not currently used
    subject?: string;
    body?: string;
}

export interface PopOutContext {
    extId: string;
    requiredAttendees: string[] | EmailAddressDetails[];
    optionalAttendees: string[] | EmailAddressDetails[];
    start: number;
    end: number;
    location: string;
    subject: string;
    body: string;
}

export default function displayNewAppointmentFormApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: DisplayNewAppointmentFormArgs,
    callback: ApiMethodCallback
) {
    if (!data || !areParametersValid(data)) {
        callback(createErrorResult());
        return;
    }

    const adapter = getAdapter(hostItemIndex);
    const readAdapter = adapter as ReadDisplayAdapter;
    readAdapter.displayNewAppointmentForm(
        convertToEmailAddressWrappers(data.requiredAttendees),
        convertToEmailAddressWrappers(data.optionalAttendees),
        data.start,
        data.end,
        data.location,
        data.resources,
        data.subject,
        data.body
    );

    callback(createSuccessResult());
}

function areParametersValid(params: DisplayNewAppointmentFormArgs): boolean {
    return !(
        isLimitExceeded(params.requiredAttendees, ApiLimits.MaxRecipientsOnDisplayNewAppointment) ||
        isLimitExceeded(params.optionalAttendees, ApiLimits.MaxRecipientsOnDisplayNewAppointment) ||
        isLimitExceeded(params.subject, ApiLimits.MaxSubjectLength) ||
        isLimitExceeded(params.body, ApiLimits.MaxBodyLengthOnDisplayApis) ||
        isLimitExceeded(params.location, ApiLimits.MaxLocationLengthOnDisplayNewAppointment)
    );
}

function isLimitExceeded(param: string | any[], limit: number): boolean {
    return param && param.length > limit;
}
