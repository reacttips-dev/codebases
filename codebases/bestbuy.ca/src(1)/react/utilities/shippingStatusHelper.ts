import { ShippingStatus } from "../../business-rules/entities";
// the overall shipping status for the whole basket
export var BasketShippingStatus;
(function (BasketShippingStatus) {
    BasketShippingStatus["EverythingPurchasable"] = "EverythingPurchasable";
    BasketShippingStatus["EverythingSoldOutOnline"] = "EverythingSoldOutOnline";
    BasketShippingStatus["EverythingOutOfStockInRegion"] = "EverythingOutOfStockInRegion";
    BasketShippingStatus["EverythingRegionRestricted"] = "EverythingRegionRestricted";
    BasketShippingStatus["MixOfNonPurchasable"] = "MixOfNonPurchasable";
    BasketShippingStatus["SomePurchasable"] = "SomePurchasable";
    BasketShippingStatus["EmptyCart"] = "EmptyCart";
})(BasketShippingStatus || (BasketShippingStatus = {}));
export class BasketShippingStatusInfo {
}
export const isOneOfCannotCheckoutShippingStatus = (shippingStatus) => {
    return shippingStatus === ShippingStatus.SoldOutOnline || shippingStatus === ShippingStatus.OutofStockInRegion
        || shippingStatus === ShippingStatus.RegionRestricted;
};
export const getBasketShippingStatusInfo = (cart) => {
    const result = {
        numOfOutOfStockInRegion: 0, numOfPurchasable: 0, numOfRegionRestricted: 0,
        numOfSoldOutOnline: 0, totalNumOfLineItems: 0
    };
    if (!cart.shipments || cart.shipments.length === 0) {
        return result;
    }
    for (const shipment of cart.shipments) {
        for (const lineItem of shipment.lineItems) {
            if (lineItem.removed) {
                continue;
            }
            const shippingStatus = lineItem.shippingStatus;
            if (lineItem.purchasable) {
                // this includes in-stock, pre-order, back-order etc
                result.numOfPurchasable++;
            }
            else if (shippingStatus === ShippingStatus.SoldOutOnline) {
                result.numOfSoldOutOnline++;
            }
            else if (shippingStatus === ShippingStatus.OutofStockInRegion) {
                result.numOfOutOfStockInRegion++;
            }
            else if (shippingStatus === ShippingStatus.RegionRestricted) {
                result.numOfRegionRestricted++;
            }
            result.totalNumOfLineItems++;
        }
    }
    return result;
};
export const getBasketShippingStatus = (basketShippingStatusInfo) => {
    let result;
    if (basketShippingStatusInfo.totalNumOfLineItems === 0) {
        result = BasketShippingStatus.EmptyCart;
    }
    else if (basketShippingStatusInfo.totalNumOfLineItems === basketShippingStatusInfo.numOfPurchasable) {
        result = BasketShippingStatus.EverythingPurchasable;
    }
    else if (basketShippingStatusInfo.totalNumOfLineItems === basketShippingStatusInfo.numOfOutOfStockInRegion) {
        result = BasketShippingStatus.EverythingOutOfStockInRegion;
    }
    else if (basketShippingStatusInfo.totalNumOfLineItems === basketShippingStatusInfo.numOfRegionRestricted) {
        result = BasketShippingStatus.EverythingRegionRestricted;
    }
    else if (basketShippingStatusInfo.totalNumOfLineItems === basketShippingStatusInfo.numOfSoldOutOnline) {
        result = BasketShippingStatus.EverythingSoldOutOnline;
    }
    else if (basketShippingStatusInfo.numOfPurchasable === 0) {
        result = BasketShippingStatus.MixOfNonPurchasable;
    }
    else {
        result = BasketShippingStatus.SomePurchasable;
    }
    return result;
};
export const getShippingStatusSummaryForBasket = (cart) => {
    const status = getBasketShippingStatusInfo(cart);
    return getBasketShippingStatus(status);
};
//# sourceMappingURL=shippingStatusHelper.js.map