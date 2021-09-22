var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { cieUtilities, UnauthorizedError } from "@bbyca/cie-webapp-utilities";
import GuestCartRefiller from "./GuestCartRefiller";
import UserCartRefiller from "./UserCartRefiller";
export default class CartRefiller {
    constructor(apiBasketProviderFactory, cartStoreProvider, customerInfoProvider, signOutProvider) {
        this.refillCart = (regionCode, postalCode, locale) => __awaiter(this, void 0, void 0, function* () {
            try {
                const customerId = yield this.getCustomerId();
                return new UserCartRefiller(this.apiBasketProviderFactory, this.cartStoreProvider, customerId, this.signOutProvider).refillCart(regionCode, postalCode, locale);
            }
            catch (e) {
                if (e instanceof UnauthorizedError) {
                    this.signOutProvider.signOut();
                }
                return new GuestCartRefiller(this.apiBasketProviderFactory, this.cartStoreProvider).refillCart(regionCode, postalCode, locale);
            }
        });
        this.apiBasketProviderFactory = apiBasketProviderFactory;
        this.cartStoreProvider = cartStoreProvider;
        this.customerInfoProvider = customerInfoProvider;
        this.signOutProvider = signOutProvider;
    }
    getCustomerId() {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = cieUtilities.getAccessToken();
            if (accessToken) {
                const customerInfo = yield this.customerInfoProvider.getCustomerInfo({ accessToken });
                if (customerInfo && customerInfo.id) {
                    return customerInfo.id;
                }
                return Promise.reject("Invalid customerInfo");
            }
            return Promise.reject("Invalid access token");
        });
    }
}
//# sourceMappingURL=index.js.map