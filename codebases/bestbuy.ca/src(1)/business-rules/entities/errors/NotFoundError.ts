import { HttpRequestError } from "./HttpRequestError";
import { StatusCode } from "./StatusCode";
export class NotFoundError extends HttpRequestError {
    constructor(uri, message, innerError) {
        super(uri, message, innerError, StatusCode.NotFound);
        this.uri = uri;
        this.name = "NotFoundError";
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}
export default NotFoundError;
//# sourceMappingURL=NotFoundError.js.map