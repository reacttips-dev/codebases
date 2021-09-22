export default class CartAdder {
    constructor(apiBasketProviderFactory, cartStoreProvider) {
        this.addItem = (offer, regionCode, postalCode, locale) => new Promise((resolve, reject) => {
            const basketProvider = this.apiBasketProviderFactory.make(regionCode, postalCode, locale);
            basketProvider.addToBasket(offer, this.cartStoreProvider.getCartId())
                .then((res) => {
                if (res) {
                    this.cartStoreProvider.setCartId(res.id);
                }
                resolve(res);
            })
                .catch(reject);
        });
        this.apiBasketProviderFactory = apiBasketProviderFactory;
        this.cartStoreProvider = cartStoreProvider;
    }
}
//# sourceMappingURL=CartAdder.js.map