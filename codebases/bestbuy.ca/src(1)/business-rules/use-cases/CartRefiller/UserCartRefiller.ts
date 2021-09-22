var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UnauthorizedError } from "@bbyca/cie-webapp-utilities";
import { NotFoundError } from "../../../errors";
import { isCheckoutPath } from "../../../utilities/isCheckoutPath";
export default class UserCartRefiller {
    constructor(apiBasketProviderFactory, cartStoreProvider, customerId, signOutProvider) {
        this.refillCart = (regionCode, postalCode, locale) => new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const basketProvider = this.apiBasketProviderFactory.make(regionCode, postalCode, locale);
            let cartId = this.cartStoreProvider.getCartId();
            try {
                // Currently account api and checkout api are using different formats for identifiers.
                // This is a hack and will be removed once the two apis are aligned.
                const customerCartId = this.customerId.replace("{", "").replace("}", "").toLowerCase();
                const callMergeBasket = () => {
                    return basketProvider.mergeBasket(cartId, customerCartId)
                        .then((res) => {
                        this.updateCartId(res);
                        resolve(res);
                    })
                        .catch(reject);
                };
                let basketRes;
                if (!cartId) {
                    this.cartStoreProvider.setCartId(customerCartId);
                    cartId = customerCartId;
                }
                else {
                    if (cartId.toLowerCase() !== customerCartId) {
                        if (isCheckoutPath(window && window.location && window.location.pathname) &&
                            this.customerId) {
                            basketProvider.deleteBasket(customerCartId).
                                then(callMergeBasket).
                                catch((error) => {
                                if (error && error.name === NotFoundError.NAME) {
                                    callMergeBasket();
                                }
                                else {
                                    reject(error);
                                }
                            });
                        }
                        else {
                            callMergeBasket();
                        }
                        return;
                    }
                }
                basketRes = yield basketProvider.getBasket(cartId);
                this.updateCartId(basketRes);
                resolve(basketRes);
                return;
            }
            catch (e) {
                if (e instanceof UnauthorizedError) {
                    yield this.signOutProvider.signOut();
                }
                reject(e);
            }
        }));
        this.updateCartId = (response) => {
            if (response.id) {
                this.cartStoreProvider.setCartId(response.id);
            }
            else {
                this.cartStoreProvider.deleteCartId();
            }
            return;
        };
        this.apiBasketProviderFactory = apiBasketProviderFactory;
        this.cartStoreProvider = cartStoreProvider;
        this.customerId = customerId;
        this.signOutProvider = signOutProvider;
    }
}
//# sourceMappingURL=UserCartRefiller.js.map