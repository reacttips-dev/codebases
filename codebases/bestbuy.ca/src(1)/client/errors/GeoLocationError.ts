import WebappError from "./WebappError";

export class GeoLocationError extends WebappError {
    constructor(code: number, message: string) {
        super(message);
        this.name = "GeoLocationError";
        Object.setPrototypeOf(this, GeoLocationError.prototype);
    }
}

export default GeoLocationError;
