import WebappError from "./WebappError";

export class RedirectError extends WebappError {
    constructor(public url: string, message?: string, innerError?: Error) {
        super(message, innerError);
        this.name = "RedirectError";
        Object.setPrototypeOf(this, RedirectError.prototype);
    }
}

function handleRedirectError(path: string) {
    if (typeof window === "undefined") {
        throw new RedirectError(path);
    }
}

export { handleRedirectError };
export default RedirectError;
