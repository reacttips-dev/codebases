import * as React from "react";
import {FormattedMessage} from "react-intl";
import AvailabilityIcon from "./components/AvailabilityIcon";
import Shipping from "./components/Shipping";
import {AvailabilityPickupStatus, AvailabilityShippingStatus} from "models/Availability";
import {Availability, CartLineItemAvailability} from "../../models";
import * as styles from "./style.css";
import messages from "./translations/messages";
import {classname as cx} from "utils/classname";

export interface AvailabilityProps {
    availability: Availability | CartLineItemAvailability;
    regionName: string;
    sku: string;
    shouldDisplayActivationMessage?: boolean;
    className?: string;
}

type messageContextProps = "pickup" | "activation";
export const soldInStore = "SoldInStore";

const shouldDisplayPickup = (status: string) =>
    status === AvailabilityPickupStatus.InStock || status === AvailabilityPickupStatus.OutOfStock;

export const ProductAvailability = (props: AvailabilityProps) => {
    const {availability, regionName, className, shouldDisplayActivationMessage = false} = props;

    if (!availability) {
        return null;
    }

    const isSoldInStore =
        availability.shipping.status === AvailabilityShippingStatus.InStoreOnly &&
        availability.pickup.status !== AvailabilityPickupStatus.InStock &&
        availability.pickup.status !== AvailabilityPickupStatus.OutOfStock;

    let shipping = availability.shipping;

    if (isSoldInStore) {
        shipping = {
            ...availability.shipping,
            status: soldInStore,
        };
    }

    const isPickupAvailable = availability.pickup && shouldDisplayPickup(availability.pickup.status);
    const renderAvailabilityMessage = (messageContext: messageContextProps) => {
        const isPickup = messageContext === "pickup";
        const message = isPickup ? {...messages[availability.pickup.status]} : {...messages.ActivateOnline};
        return (
            <p className={styles.availabilityMessageSearchPickup}>
                <AvailabilityIcon
                    ariaHidden={true}
                    purchasable={isPickup ? availability.pickup.purchasable : true}
                    className={styles.iconStyle}
                />
                <FormattedMessage {...message} />
            </p>
        );
    };

    return (
        <div
            className={cx([styles.availabilityMessageSearch, className])}
            data-automation="store-availability-messages">
            {!isPickupAvailable && shouldDisplayActivationMessage && renderAvailabilityMessage("activation")}
            <Shipping
                shipping={shipping}
                regionName={regionName}
                icon={
                    <AvailabilityIcon
                        ariaHidden={true}
                        className={styles.iconStyle}
                        purchasable={shipping.status === soldInStore || shipping.purchasable}
                    />
                }
            />
            {isPickupAvailable && renderAvailabilityMessage("pickup")}
        </div>
    );
};

export default ProductAvailability;
