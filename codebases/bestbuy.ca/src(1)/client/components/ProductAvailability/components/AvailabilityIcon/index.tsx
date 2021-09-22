import * as React from "react";
import * as styles from "./style.css";
import {Checkmark, Unavailable} from "@bbyca/bbyca-components";
import {classname} from "utils/classname";

export interface AvailabilityIconProps {
    purchasable: boolean;
    className?: string;
    ariaHidden?: boolean;
}

export default ({ariaHidden = false, className, purchasable}: AvailabilityIconProps) => {
    return purchasable ? (
        <span data-automation="store-availability-checkmark" aria-hidden={ariaHidden}>
            <Checkmark color="green" className={classname([styles.icon, className])} />
        </span>
    ) : (
        <span data-automation="store-availability-not-allowed" aria-hidden={ariaHidden}>
            <Unavailable className={classname([styles.icon, className])} viewBox="0 0 32 32" />
        </span>
    );
};
