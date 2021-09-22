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
import removeDuplicateSlashInURL from "../../utilities/removeDuplicateSlashInURL";
import { formatDate } from "./dateFormatter";
export default class ApiRequiredProductsProvider {
    constructor(hostUrl, availabilityProvider, offerProvider) {
        this.hostUrl = hostUrl;
        this.availabilityProvider = availabilityProvider;
        this.offerProvider = offerProvider;
        this.getSimpleRequiredProducts = (sku, locale, regionCode) => __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch(removeDuplicateSlashInURL(`${this.hostUrl}/${sku}?currentRegion=${regionCode}&lang=${locale}&include=all`));
            const product = yield res.json();
            const { warranties } = product;
            const requiredProducts = product.requiredProducts ?
                product.requiredProducts.map((requiredProduct) => ({
                    availability: null,
                    name: requiredProduct.name,
                    offer: null,
                    sku: requiredProduct.sku,
                    status: "initial",
                    thumbnailUrl: requiredProduct.thumbnailImage,
                })) : [];
            const saleEndDate = product.SaleEndDate && formatDate(product.SaleEndDate, locale);
            const productImageUrl = product.additionalMedia && product.additionalMedia.length &&
                product.additionalMedia[0].url;
            return {
                parentProduct: {
                    ehf: product.ehf,
                    hideSaleEndDate: product.hideSaleEndDate,
                    name: product.name,
                    productImageUrl,
                    regularPrice: product.regularPrice,
                    saleEndDate,
                    salePrice: product.salePrice,
                    sku: product.sku,
                },
                requiredProducts,
                warranties,
            };
        });
        this.getDetailedRequiredProducts = (sku, locale, regionCode, postalCode, offerFetchOps) => __awaiter(this, void 0, void 0, function* () {
            const requiredProductDetails = yield this.getSimpleRequiredProducts(sku, locale, regionCode);
            const { parentProduct, requiredProducts, warranties } = requiredProductDetails;
            const requiredProductsSkus = requiredProducts
                .reduce((acc, p) => acc.concat(p.sku), []);
            const getAvailabilitiesPromise = (requiredProducts === null || requiredProducts === void 0 ? void 0 : requiredProducts.length) > 0 && this.availabilityProvider.getAvailabilities(requiredProductsSkus, [], locale, postalCode).catch(() => ({ availabilities: [] }));
            const getOffersPromises = requiredProducts.map((product) => this.offerProvider.getOffers(product.sku, offerFetchOps).catch(() => null));
            const [availabilities, offers] = yield Promise.all([
                getAvailabilitiesPromise || Promise.resolve({}),
                Promise.all(getOffersPromises),
            ]);
            const hydratedRequiredProducts = requiredProducts.map((product, index) => (Object.assign(Object.assign({}, product), { availability: this.mapAvailability(availabilities, index), offer: this.mapOffer(offers, index, regionCode) })));
            return {
                parentProduct,
                requiredProducts: hydratedRequiredProducts,
                warranties,
            };
        });
        this.mapAvailability = (availabilities, index) => {
            if (availabilities && availabilities.availabilities && availabilities.availabilities[index]) {
                return {
                    shipping: {
                        purchasable: availabilities.availabilities[index].shipping.purchasable,
                    },
                };
            }
            return null;
        };
        this.mapOffer = (offers, index, regionCode) => {
            if (offers && offers[index]) {
                const bbycaOffer = offers[index].find(({ sellerId }) => sellerId === "bbyca");
                if (!bbycaOffer) {
                    return null;
                }
                const ehf = bbycaOffer.ehf && bbycaOffer.ehf.find(({ province }) => province === regionCode);
                return {
                    ehf: ehf && ehf.amount || 0,
                    hideSavings: bbycaOffer.hideSavings,
                    regularPrice: bbycaOffer.regularPrice,
                    saleEndDate: bbycaOffer.saleEndDate,
                    salePrice: bbycaOffer.salePrice,
                };
            }
            return null;
        };
    }
}
//# sourceMappingURL=ApiRequiredProductsProvider.js.map