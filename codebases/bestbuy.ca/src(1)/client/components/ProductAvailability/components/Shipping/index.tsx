import * as React from "react";
import {classname} from "utils/classname";
import {Shipping as ShippingModel} from "../../../../models";
import ShippingMessage from "../ShippingMessage";
import * as styles from "./style.css";

export interface ShippingProps {
    shipping: ShippingModel;
    regionName: string;
    className?: string;
    icon?: React.ReactNode;
    availabilityTitleClass?: string;
}

const Shipping: React.FC<ShippingProps> = (props: ShippingProps) => {
    const {shipping, regionName, className, availabilityTitleClass} = props;
    if (props.shipping.status && props.shipping.status !== "Unknown") {
        return (
            <p className={classname([styles.shippingAvailability, availabilityTitleClass])}>
                {props.icon}
                <ShippingMessage status={shipping.status} regionName={regionName} className={className} />
            </p>
        );
    }
    return null;
};

Shipping.displayName = "Shipping";

export default Shipping;
