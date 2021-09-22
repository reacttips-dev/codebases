import {CartLineItem} from "models/Basket";

const hasQPUableItem = (lineItems: CartLineItem[]): boolean => {
    return (
        lineItems.filter(({removed, savedForLater, availability}) => {
            return availability?.pickup?.purchasable && removed !== true && savedForLater !== true;
        }).length > 0
    );
};

export default hasQPUableItem;
