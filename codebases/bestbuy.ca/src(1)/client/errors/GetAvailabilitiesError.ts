import HttpRequestError from "./HttpRequestError";
import HttpRequestType from "./HttpRequestType";

export class GetAvailabilitiesError extends HttpRequestError {
    constructor(code: number, message: string) {
        super(HttpRequestType.AvailabilityApi, "");
        this.name = "GetAvailabilitiesError";
        Object.setPrototypeOf(this, GetAvailabilitiesError.prototype);
    }
}

export default GetAvailabilitiesError;
