import * as serializeError from "serialize-error";
export class WebappError extends Error {
    constructor(message = "-", innerError) {
        super(message);
        this.innerError = innerError;
        this.name = "WebappError";
        Object.setPrototypeOf(this, WebappError.prototype);
    }
    toJSON() {
        return serializeError(this);
    }
}
export default WebappError;
//# sourceMappingURL=WebappError.js.map