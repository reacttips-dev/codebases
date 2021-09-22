import { HttpRequestError } from "./HttpRequestError";
import { StatusCode } from "./StatusCode";
export class UnauthorizedError extends HttpRequestError {
    constructor(uri, message, innerError) {
        super(uri, message, innerError, StatusCode.Unauthorized);
        this.uri = uri;
        this.name = "UnauthorizedError";
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}
export default UnauthorizedError;
//# sourceMappingURL=UnauthorizedError.js.map