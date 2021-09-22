import {utils as adobeLaunch} from "@bbyca/adobe-launch";
import {Warranty, CartLineItem, ChildLineItem, ServicePlan} from "models";
import {sessionStorage} from "../../providers/SessionStorageProvider";

export const trackExpand = (): void => {
    adobeLaunch.customLink("See Benefits", {eVar: {111: "See benefits"}, event: {2: ""}});
};

export const trackEngagement = (warranty: Warranty): void => {
    const {title, regularPrice} = warranty;
    const eVar = {
        111: `Warranty:Click:${title} ${regularPrice}`,
    };
    adobeLaunch.customLink("warantyengagement_c", {eVar, event: {2: ""}});
};

export const getGspPlan = (lineItem: CartLineItem): ChildLineItem | undefined => {
    return lineItem.childLineItems && lineItem.childLineItems.find((child) => child.type === "PSP");
};

type TrackingCallback = (lineItem: CartLineItem) => void;

export const loopThroughLineItems = (lineItems: CartLineItem[], callback: TrackingCallback): void => {
    lineItems.forEach((lineItem) => {
        callback(lineItem);
    });
};

export const setGspTracking = (lineItems: CartLineItem[]): void => {
    const snapshot = sessionStorage.getItem("initialGspState") || {};

    const setTracking = (lineItem: CartLineItem): void => {
        const {id, product} = lineItem;

        if (product && product.availableServicePlans && !snapshot[id]) {
            const gspPlan = getGspPlan(lineItem);
            snapshot[id] = gspPlan ? gspPlan.summary.total : 0;
        }
    };

    loopThroughLineItems(lineItems, setTracking);

    sessionStorage.setItem("initialGspState", snapshot);
};

enum Event {
    Upgrade = "warranty-upgrade-click",
    Downgrade = "warranty-downgrade-click",
    Add = "warranty-add-click",
    Remove = "warranty-remove-click",
    None = "",
}

export const getGspTerm = (options: ServicePlan[], sku: string): number => {
    const selectedPlan = options.find((plan) => plan.sku === sku);
    return selectedPlan ? selectedPlan.termMonths / 12 : 0;
};

export const trackGsp = (lineItems: CartLineItem[]): void => {
    const snapshot = sessionStorage.getItem("initialGspState") || {};

    const dispatchTrackingEvent = (lineItem: CartLineItem): void => {
        let event: Event = Event.None;
        const payload = {
            warrantyTerm: 0,
        };

        const {id, product} = lineItem;
        const initialPurchasePrice = snapshot[id];

        if (initialPurchasePrice >= 0) {
            const gspPlan = getGspPlan(lineItem);
            const finalPurchasePrice = gspPlan ? gspPlan.summary.total : 0;

            if (gspPlan && product && product.availableServicePlans) {
                payload.warrantyTerm = getGspTerm(product.availableServicePlans, gspPlan.product.sku);
            }

            if (initialPurchasePrice === 0 && finalPurchasePrice > 0) {
                event = Event.Add;
            } else if (finalPurchasePrice === 0 && initialPurchasePrice > 0) {
                event = Event.Remove;
            } else if (initialPurchasePrice > 0 && finalPurchasePrice > initialPurchasePrice) {
                event = Event.Upgrade;
            } else if (initialPurchasePrice > 0 && finalPurchasePrice < initialPurchasePrice) {
                event = Event.Downgrade;
            }
        }
        if (event) {
            adobeLaunch.pushEventToDataLayer({event, payload});
        }
    };

    loopThroughLineItems(lineItems, dispatchTrackingEvent);
};
