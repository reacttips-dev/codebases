var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { cieUtilities } from "@bbyca/account-components";
import { BadRequestError, ConnectionError, HttpRequestError, InternalServerError, StatusCode, UnauthorizedError, } from "../../../business-rules/entities/errors";
export class ApiBaseProvider {
    constructor(hostUrl, csrfTokenProvider) {
        this.hostUrl = hostUrl;
        this.csrfTokenProvider = csrfTokenProvider;
        this.generateHttpHeaders = (customHeaders = {}) => __awaiter(this, void 0, void 0, function* () {
            const headers = Object.assign(Object.assign({}, customHeaders), { "Content-Type": "application/json" });
            if (cieUtilities.isUserSignedIn()) {
                this.addAccessToken(headers);
            }
            // This will be required on all request in the future
            yield this.addCsrfToken(headers);
            return headers;
        });
        this.makeNetworkRequest = (path, headers, body, method = "POST") => __awaiter(this, void 0, void 0, function* () {
            let response;
            try {
                response = yield fetch(this.hostUrl + path, {
                    body: JSON.stringify(body),
                    credentials: "include",
                    headers,
                    method,
                });
            }
            catch (error) {
                const connectionError = new ConnectionError(`${this.hostUrl}${path}`, `Error connecting to ${this.hostUrl}${path}`, error);
                return Promise.reject(connectionError);
            }
            if (response.status === StatusCode.InternalServerError) {
                const internalServerError = new InternalServerError(`${this.hostUrl}${path}`, "InternalServerError");
                return Promise.reject(internalServerError);
            }
            return response;
        });
        this.addAccessToken = (headers) => {
            const accessToken = cieUtilities.getAccessToken();
            if (accessToken) {
                headers.Authorization = "Bearer " + accessToken;
            }
        };
        this.addCsrfToken = (headers) => __awaiter(this, void 0, void 0, function* () {
            let csrfToken = cieUtilities.getCsrfToken();
            if (!csrfToken) {
                yield this.csrfTokenProvider.getCsrfToken(); // calls cie /refresh to get new csrf token
                csrfToken = cieUtilities.getCsrfToken();
            }
            if (csrfToken) {
                headers["X-TX"] = csrfToken;
            }
        });
        this.hostUrl = hostUrl;
        this.csrfTokenProvider = csrfTokenProvider;
    }
    handleError(statusCode, uri, errorMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (statusCode) {
                case StatusCode.BadRequest:
                    return Promise.reject(new BadRequestError(uri, errorMessage));
                case StatusCode.InternalServerError:
                    return Promise.reject(new InternalServerError(uri, errorMessage));
                case StatusCode.Unauthorized:
                    return Promise.reject(new UnauthorizedError(uri, errorMessage));
                default:
                    return Promise.reject(new HttpRequestError(uri, errorMessage));
            }
        });
    }
}
export default ApiBaseProvider;
//# sourceMappingURL=ApiBaseProvider.js.map