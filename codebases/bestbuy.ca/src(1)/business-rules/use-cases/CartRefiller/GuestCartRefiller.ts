import { NotFoundError } from "../../../errors";
export default class GuestCartRefiller {
    constructor(apiBasketProviderFactory, cartStoreProvider) {
        this.refillCart = (regionCode, postalCode, locale) => new Promise((resolve, reject) => {
            const basketProvider = this.apiBasketProviderFactory.make(regionCode, postalCode, locale);
            const cartId = this.cartStoreProvider.getCartId();
            if (!cartId) {
                resolve({});
                return;
            }
            basketProvider.getBasket(cartId)
                .then((res) => {
                if (res.id) {
                    this.cartStoreProvider.setCartId(res.id);
                }
                else {
                    this.cartStoreProvider.deleteCartId();
                }
                resolve(res);
            })
                .catch((err) => {
                if (err instanceof Error && err.name === NotFoundError.NAME) {
                    this.cartStoreProvider.deleteCartId();
                }
                reject(err);
            });
        });
        this.apiBasketProviderFactory = apiBasketProviderFactory;
        this.cartStoreProvider = cartStoreProvider;
    }
}
//# sourceMappingURL=GuestCartRefiller.js.map