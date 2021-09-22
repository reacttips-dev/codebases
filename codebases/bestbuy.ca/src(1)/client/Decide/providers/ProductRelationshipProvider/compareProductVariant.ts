import {ProductVariant} from "models";

export const compareProductVariant = (variant1: ProductVariant, variant2: ProductVariant): number => {
    const sku1 = variant1.sku.toUpperCase();
    const sku2 = variant2.sku.toUpperCase();
    if (sku1 > sku2) {
        return 1;
    } else if (sku1 < sku2) {
        return -1;
    } else {
        return 0;
    }
};
