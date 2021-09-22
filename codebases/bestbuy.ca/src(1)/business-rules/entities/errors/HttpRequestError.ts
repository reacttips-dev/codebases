export class HttpRequestError extends Error {
    constructor(uri, message, innerError, statusCode) {
        super(message);
        this.uri = uri;
        this.statusCode = statusCode;
        this.name = "HttpRequestError";
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpRequestError.prototype);
    }
}
export default HttpRequestError;
//# sourceMappingURL=HttpRequestError.js.map