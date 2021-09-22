import {Availability, AvailabilityReduxStore, CartLineItemAvailability} from "models";

const isPurchasable = (availability: Availability | AvailabilityReduxStore | CartLineItemAvailability): boolean => {
    if (availability) {
        const shipping = availability.shipping && availability.shipping.purchasable;
        const pickup = availability.pickup && availability.pickup.purchasable;
        return !!shipping || !!pickup;
    }
    return false;
};

export default isPurchasable;
