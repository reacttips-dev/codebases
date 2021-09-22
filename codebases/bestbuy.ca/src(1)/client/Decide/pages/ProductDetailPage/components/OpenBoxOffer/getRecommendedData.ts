import {SimpleProduct, EventTypes} from "models";
import {Key} from "@bbyca/apex-components";

import messages from "./translations/messages";

export interface OpenBoxOfferProps {
    messaging: any;
    link: OpenBoxLink;
    product: SimpleProduct;
}

interface OpenBoxLink {
    type: Key;
    query: string;
    messaging: any;
}

export const getRecommendedData = (products: SimpleProduct[], pdpIsOpenBox: boolean) => {
    const multipleProducts = products.length >= 2;
    const openBoxOptions = products.find((sku) => sku.isOpenBox);
    const brandNewOptions = products.find((sku) => !sku.isOpenBox);

    if (!multipleProducts && openBoxOptions) {
        const product = products[0];
        return {
            messaging: messages.getItFor,
            link: {
                type: EventTypes.product,
                query: product.sku,
                messaging: messages.shopOutlet,
            },
            product,
        } as OpenBoxOfferProps;
    } else if (!multipleProducts && brandNewOptions && pdpIsOpenBox) {
        const product = products[0];
        return {
            messaging: messages.brandNew,
            link: {
                type: EventTypes.product,
                query: product.sku,
                messaging: messages.shopNew,
            },
            product,
        } as OpenBoxOfferProps;
    } else if (multipleProducts && brandNewOptions && openBoxOptions) {
        const product = getLowestPriceProduct(products);
        return {
            messaging: messages.getItFor,
            link: {
                type: EventTypes.search,
                query: `modelNumber:${product.modelNumber}`,
                messaging: messages.shopOther,
            },
            product,
        } as OpenBoxOfferProps;
    } else if (multipleProducts && openBoxOptions) {
        const product = getLowestPriceProduct(products);
        return {
            messaging: messages.getItFor,
            link: {
                type: EventTypes.search,
                query: `modelNumber:${product.modelNumber}`,
                messaging: messages.shopOutlet,
            },
            product,
        } as OpenBoxOfferProps;
    } else {
        return null;
    }
};

export const getLowestPriceProduct = (products: SimpleProduct[]) => {
    return products.reduce((prev, curr) => (prev.priceWithEhf < curr.priceWithEhf ? prev : curr));
};
