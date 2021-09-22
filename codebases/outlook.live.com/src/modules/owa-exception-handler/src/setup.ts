let backfilledErrors: any[] = (<any>window).owaBackfilledErrors;
type ErrorCb = (message: string, file?: string, line?: number, col?: number, error?: any) => void;
export function setErrorHandler(handler: ErrorCb) {
    for (var ii = 0; backfilledErrors && ii < backfilledErrors.length; ii++) {
        handler.apply(null, backfilledErrors[ii]);
    }
    (<any>window).owaErrorHandler = handler;
    backfilledErrors = [];
}
