var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as fetch from "isomorphic-fetch";
import ConnectionError from "../../errors/ConnectionError";
export class ApiStoreProvider {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    static toNearbyStore(location) {
        return {
            address: {
                city: location.city,
                line1: location.address1,
                line2: location.address2 || undefined,
                postalCode: location.postalCode,
                province: location.region,
            },
            distance: location.distance,
            id: location.locationId,
            name: location.name,
        };
    }
    getNearbyStores(postalCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${this.baseUrl}?postalcode=${postalCode}`;
            let json;
            try {
                const response = yield fetch(url);
                json = yield response.json();
            }
            catch (error) {
                throw new ConnectionError(url, undefined, error);
            }
            const nearbyStores = json.locations.map(ApiStoreProvider.toNearbyStore);
            return nearbyStores;
        });
    }
}
export default ApiStoreProvider;
//# sourceMappingURL=ApiStoreProvider.js.map