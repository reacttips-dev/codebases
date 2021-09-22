import { HttpRequestType } from "./HttpRequestType";
import { RequestError } from "./RequestError";
import { StatusCode } from "./StatusCode";

export class HttpRequestError extends RequestError {
    constructor(public type: HttpRequestType, public uri: string, message?: string,
                innerError?: Error, public statusCode?: StatusCode, public headers?: Headers, public cookies?: object) {
        super(uri, message, innerError);
        this.name = "HttpRequestError";
        this.statusCode = statusCode;
        this.headers = headers;
        this.cookies = cookies;
        this.type = type;
        Object.setPrototypeOf(this, HttpRequestError.prototype);
    }
}

export default HttpRequestError;
