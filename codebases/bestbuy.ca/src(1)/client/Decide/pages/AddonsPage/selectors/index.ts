import * as moment from "moment";
import {getRequiredPartsParentProduct} from "@bbyca/ecomm-checkout-components/dist/redux/requiredProducts";
import {Product} from "@bbyca/ecomm-checkout-components/dist/business-rules/entities";

import {getOffersForSku} from "store/selectors";
import {Offer} from "models";
import State from "store";

export const getParentProduct = (
    state: Pick<State, "requiredProducts" | "offers"> = {requiredProducts: {}, offers: {data: {}}},
    sku: string,
): Product | undefined => {
    const parentProduct: Product | undefined = getRequiredPartsParentProduct(state.requiredProducts, sku);
    const offer: Offer | null = getOffersForSku(sku)(state);

    if (offer && parentProduct) {
        // backend doesn't return a single field in offers with the total price
        const regularPrice = offer.pricing.priceWithoutEhf + offer.pricing.saving;
        const parentProductWithOffersData = {
            ...parentProduct,
            regularPrice: parseFloat(Number(regularPrice).toFixed(2)),
            salePrice: offer.pricing.priceWithoutEhf,
            // same logic as in ProductSaleEndDate
            // refactor in the future to keep a single source of truth and to make the format the same
            saleEndDate: parentProduct.saleEndDate && offer.pricing.saleEndDate
                ? moment(offer.pricing.saleEndDate)
                      .utcOffset("-08:00")
                      .format("MMMM D")
                : null,
        };
        return parentProductWithOffersData;
    }
    return parentProduct;
};
