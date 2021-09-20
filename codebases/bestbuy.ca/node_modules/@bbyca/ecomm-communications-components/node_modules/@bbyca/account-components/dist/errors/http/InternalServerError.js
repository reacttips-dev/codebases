import { HttpRequestError } from "./HttpRequestError";
import { StatusCode } from "./StatusCode";
export class InternalServerError extends HttpRequestError {
    constructor(uri, message, innerError, headers, cookies) {
        super(uri, message, innerError, StatusCode.InternalServerError);
        this.uri = uri;
        this.headers = headers;
        this.cookies = cookies;
        this.name = "InternalServerError";
        Object.setPrototypeOf(this, InternalServerError.prototype);
    }
}
export default InternalServerError;
//# sourceMappingURL=InternalServerError.js.map