import WebappError from "./WebappError";

export abstract class RequestError extends WebappError {
    constructor(public uri: string, message?: string, innerError?: Error) {
        super(message, innerError);
        this.name = "RequestError";
        Object.setPrototypeOf(this, RequestError.prototype);
    }
}

export default RequestError;
