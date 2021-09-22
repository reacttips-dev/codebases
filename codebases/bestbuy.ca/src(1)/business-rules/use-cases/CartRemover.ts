var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { mergePrevShipment } from "./cartMerger";
export default class CartRemover {
    constructor(apiBasketProviderFactory, cartStoreProvider) {
        this.removeItem = (lineItemId, prevCart, regionCode, postalCode, locale) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const cartId = this.cartStoreProvider.getCartId();
                if (!cartId) {
                    resolve({});
                    return;
                }
                this.apiBasketProviderFactory.make(regionCode, postalCode, locale).removeCartItem(cartId, lineItemId)
                    .then((res) => {
                    if (res.id) {
                        this.cartStoreProvider.setCartId(res.id);
                    }
                    else {
                        this.cartStoreProvider.deleteCartId();
                    }
                    const prevShipments = this.flagRemovedLineItem(prevCart.shipments, lineItemId);
                    res.shipments = mergePrevShipment(res.shipments, prevShipments);
                    resolve(res);
                })
                    .catch(reject);
            });
        });
        this.removeChildItem = (lineItemId, childItemId, regionCode, postalCode, locale) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const cartId = this.cartStoreProvider.getCartId();
                if (!cartId) {
                    resolve({});
                    return;
                }
                this.apiBasketProviderFactory.make(regionCode, postalCode, locale)
                    .removeChildCartItem(cartId, lineItemId, childItemId)
                    .then((res) => resolve(res))
                    .catch(reject);
            });
        });
        this.flagRemovedLineItem = (shipments, lineItemId) => shipments.map((shipment) => {
            if (!shipment.lineItems || !shipment.lineItems.length) {
                return shipment;
            }
            shipment.lineItems = shipment.lineItems.map((lineItem) => {
                if (lineItem.id === lineItemId) {
                    return Object.assign(Object.assign({}, lineItem), { removed: true });
                }
                return lineItem;
            });
            return shipment;
        });
        this.apiBasketProviderFactory = apiBasketProviderFactory;
        this.cartStoreProvider = cartStoreProvider;
    }
}
//# sourceMappingURL=CartRemover.js.map