export default class ContentError extends Error {
    constructor(message, innerError) {
        super(message);
        this.innerError = innerError;
        Object.setPrototypeOf(this, ContentError.prototype);
    }
}
//# sourceMappingURL=ContentError.js.map