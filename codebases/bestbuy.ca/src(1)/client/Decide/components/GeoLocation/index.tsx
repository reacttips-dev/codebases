import {Button, ButtonAppearance, LocationFilled, ButtonApperanceEnum} from "@bbyca/bbyca-components";
import {classname} from "utils/classname";

import * as React from "react";
import * as styles from "./style.css";

export interface GeoLocationProps {
    appearance?: ButtonAppearance;
    className?: string;
    children?: React.ReactNode;
    dataAutomation?: string;
    iconClassName?: string;
    isDisabled?: boolean;
    onGeoLocationClicked: () => void;
}

export const GeoLocation: React.FC<GeoLocationProps> = ({
    appearance = ButtonApperanceEnum.Tertiary,
    children,
    className,
    dataAutomation = null,
    iconClassName,
    isDisabled = false,
    onGeoLocationClicked,
}) => (
    <Button
        className={classname(className, styles.geoLocateButton)}
        appearance={appearance}
        data-automation={dataAutomation}
        isDisabled={isDisabled}
        onClick={!isDisabled && typeof onGeoLocationClicked === "function" && onGeoLocationClicked}>
        {children || (
            <div className={classname(iconClassName, styles.locationIcon)}>
                <LocationFilled color={`${isDisabled ? "black" : "blue"}`} />
            </div>
        )}
    </Button>
);

export default GeoLocation;
