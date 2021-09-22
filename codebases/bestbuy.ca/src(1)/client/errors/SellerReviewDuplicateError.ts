import * as serializeError from "serialize-error";

export class SellerReviewDuplicateError extends Error {

    constructor(message?: string, public innerError?: Error) {
        super(message);
        this.name = "SellerReviewDuplicateError";
        Object.setPrototypeOf(this, SellerReviewDuplicateError.prototype);
    }

    public toJSON() {
        return serializeError(this);
    }
}

export default SellerReviewDuplicateError;
