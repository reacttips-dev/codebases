var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { NotFoundError } from "../../errors";
import { mergePrevShipment } from "./cartMerger";
export default class CartUpdater {
    constructor(apiBasketProviderFactory, cartStoreProvider) {
        this.addChildItem = (lineItemId, childItem, regionCode, postalCode, locale) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const cartId = this.cartStoreProvider.getCartId();
                if (!cartId) {
                    throw new NotFoundError("No cart id");
                }
                this.apiBasketProviderFactory.make(regionCode, postalCode, locale)
                    .addChildCartItem(cartId, lineItemId, childItem)
                    .then((response) => resolve(response))
                    .catch(reject);
            });
        });
        this.updateItemQuantity = (lineItemId, quantity, prevCart, regionCode, postalCode, locale) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const cartId = this.cartStoreProvider.getCartId();
                if (!cartId) {
                    throw new NotFoundError("No cart id");
                }
                this.apiBasketProviderFactory.make(regionCode, postalCode, locale)
                    .updateCartItemQuantity(cartId, lineItemId, quantity)
                    .then((res) => {
                    res.shipments = mergePrevShipment(res.shipments, prevCart.shipments);
                    resolve(res);
                })
                    .catch(reject);
            });
        });
        this.apiBasketProviderFactory = apiBasketProviderFactory;
        this.cartStoreProvider = cartStoreProvider;
    }
}
//# sourceMappingURL=CartUpdater.js.map