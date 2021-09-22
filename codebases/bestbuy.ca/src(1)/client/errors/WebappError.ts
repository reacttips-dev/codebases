import * as serializeError from "serialize-error";

export class WebappError extends Error {

    constructor(message?: string, public innerError?: Error) {
        super(message);
        this.name = "WebappError";
        Object.setPrototypeOf(this, WebappError.prototype);
    }

    public toJSON() {
        return serializeError(this);
    }
}

export default WebappError;
