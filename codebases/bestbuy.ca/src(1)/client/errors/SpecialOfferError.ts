import WebappError from "./WebappError";

export class SpecialOfferError extends WebappError {

    constructor(code: number, message?: string) {
        super(message);
        this.name = "SpecialOfferError";
        this.statusCode = code;
        Object.setPrototypeOf(this, SpecialOfferError.prototype);
    }
}

export default SpecialOfferError;
