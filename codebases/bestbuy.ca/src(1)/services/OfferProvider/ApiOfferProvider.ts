var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import "isomorphic-fetch";
export default class ApiOfferProvider {
    constructor(hostUrl) {
        this.hostUrl = hostUrl;
        this.getOffers = (sku, fetchOps = {}) => __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.hostUrl}/${sku}/offers`, fetchOps);
            return response.json();
        });
    }
}
//# sourceMappingURL=ApiOfferProvider.js.map