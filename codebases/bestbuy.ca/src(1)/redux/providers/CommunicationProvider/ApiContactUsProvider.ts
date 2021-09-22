var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { StatusCode } from "../../../business-rules/entities/errors";
import { BaseProvider } from "../BaseProvider";
export default class ApiContactUsProvider extends BaseProvider {
    constructor(hostUrl, csrfTokenProvider) {
        super(hostUrl, csrfTokenProvider);
        this.sendContactUsMessage = (locale, message) => __awaiter(this, void 0, void 0, function* () {
            const customHeaders = {
                "Accept": "application/json",
                "Accept-Language": locale,
            };
            const path = `/bbyc/contact-us/messages`;
            const headers = yield this.generateHttpHeaders(customHeaders);
            const response = yield this.makeNetworkRequest(path, headers, message);
            if (response.status !== StatusCode.OK && response.status !== StatusCode.Created) {
                return this.handleError(response.status, this.hostUrl + path);
            }
            return response;
        });
    }
}
//# sourceMappingURL=ApiContactUsProvider.js.map