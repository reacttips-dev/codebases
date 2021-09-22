import { HttpRequestType } from "./HttpRequestType";
import RequestError from "./RequestError";

export class ConnectionError extends RequestError {

    constructor(public type: HttpRequestType, uri: string, message?: string, public innerError?: Error) {
        super(uri, message, innerError);
        this.name = "ConnectionError";
        this.type = type;
        Object.setPrototypeOf(this, ConnectionError.prototype);
    }
}

export default ConnectionError;
