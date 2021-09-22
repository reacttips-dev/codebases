export class NotFoundError extends Error {
    constructor(message, innerError, context) {
        super(message);
        this.innerError = innerError;
        this.context = context;
        this.name = NotFoundError.NAME;
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}
NotFoundError.NAME = "NotFoundError";
//# sourceMappingURL=NotFoundError.js.map