import HttpRequestError from "./HttpRequestError";
import StatusCode from "./StatusCode";
export class BadRequestError extends HttpRequestError {
    constructor(uri, message, innerError) {
        super(uri, message, innerError, StatusCode.BadRequest);
        this.uri = uri;
        this.name = "BadRequestError";
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}
export default BadRequestError;
//# sourceMappingURL=BadRequestError.js.map