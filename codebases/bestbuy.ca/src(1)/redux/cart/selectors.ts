import { LineItemType, } from "../../business-rules/entities";
export const getLineShipmentLineItem = (state, lineItemId) => {
    for (const shipment of state.shipments) {
        for (const lineItem of shipment.lineItems) {
            if (lineItem.id === lineItemId) {
                return lineItem;
            }
        }
    }
};
export const getCurrentlyAttachedServicePlan = (state, lineItemId) => {
    const lineItem = getLineShipmentLineItem(state, lineItemId);
    return lineItem && lineItem.children
        && lineItem.children.find((child) => child.lineItemType === LineItemType.Psp);
};
export const getSkuByLineItemId = (state, lineItemId) => {
    const lineItem = getLineShipmentLineItem(state, lineItemId);
    return lineItem.sku.id;
};
export const getLineItemBySku = (state, sku) => {
    for (const shipment of state.shipments) {
        for (const lineItem of shipment.lineItems) {
            if (lineItem.sku && lineItem.sku.id === sku) {
                return lineItem;
            }
        }
    }
};
export const getSeoTextBySku = (state, sku) => {
    var _a, _b, _c;
    return (_c = (_b = (_a = getLineItemBySku(state, sku)) === null || _a === void 0 ? void 0 : _a.sku) === null || _b === void 0 ? void 0 : _b.product) === null || _c === void 0 ? void 0 : _c.seoText;
};
export const isCartStatus = (state, status) => state.status === status;
export const isSkuInCart = (state, sku) => {
    for (const shipment of state.shipments) {
        for (const lineItem of shipment.lineItems) {
            if (lineItem.sku && lineItem.sku.id === sku) {
                return true;
            }
        }
    }
    return false;
};
//# sourceMappingURL=selectors.js.map