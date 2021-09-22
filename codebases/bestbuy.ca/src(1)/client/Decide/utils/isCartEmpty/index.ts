import {CartLineItem} from "models/Basket";

const isCartEmpty = (lineItems: CartLineItem[]) => {
    if (!lineItems?.length) {
        return true;
    }
    const hasPurchasableProduct = lineItems.some((lineItem) => {
        return !Boolean(lineItem.removed) && !Boolean(lineItem.savedForLater);
    });

    return !hasPurchasableProduct;
};

export default isCartEmpty;
