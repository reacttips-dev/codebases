import ContentError from "./ContentError";
export default class ConnectionError extends ContentError {
    constructor(url, message, innerError) {
        super(message, innerError);
        this.url = url;
        Object.setPrototypeOf(this, ConnectionError.prototype);
    }
}
//# sourceMappingURL=ConnectionError.js.map