import { HttpRequestError } from "./HttpRequestError";
export class ConnectionError extends HttpRequestError {
    constructor(uri, message, innerError, headers, cookies) {
        super(uri, message, innerError);
        this.uri = uri;
        this.headers = headers;
        this.cookies = cookies;
        this.name = "ConnectionError";
        Object.setPrototypeOf(this, ConnectionError.prototype);
    }
}
export default ConnectionError;
//# sourceMappingURL=ConnectionError.js.map