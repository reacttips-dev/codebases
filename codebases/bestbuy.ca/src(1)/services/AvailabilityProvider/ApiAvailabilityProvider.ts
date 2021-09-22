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
export default class ApiAvailabilityProvider {
    constructor(hostUrl) {
        this.hostUrl = hostUrl;
        this.getAvailabilities = (skus, locations, locale, postalCode) => __awaiter(this, void 0, void 0, function* () {
            const joinedSkus = skus.join("|");
            const joinedLocations = locations.join("|");
            const url = `${this.hostUrl}?` +
                `accept=${encodeURIComponent("application/vnd.bestbuy.simpleproduct.v1+json")}&` +
                `accept-language=${locale}&` +
                `locations=${encodeURIComponent(joinedLocations)}&` +
                `postalCode=${postalCode.slice(0, 3)}&` +
                `skus=${encodeURIComponent(joinedSkus)}`;
            const response = yield fetch(url);
            return yield response.json();
        });
    }
}
//# sourceMappingURL=ApiAvailabilityProvider.js.map