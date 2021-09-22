import { ApiEventResult, getSuccessResult } from '../schema/ApiEventResult';

export function defaultEventRegistrationHandler(controlId: string, args: {}): ApiEventResult {
    return getSuccessResult();
}

export function defaultEventUnregistrationHandler(controlId: string): ApiEventResult {
    return getSuccessResult();
}

export function defaultEventOnTriggerHandler(args: any, controlId: string): ApiEventResult {
    return getSuccessResult();
}

export function defaultFormatArgsForHandler(args: any): any {
    return args;
}
