import * as React from "react";

import {classIf, classname} from "utils/classname";
import {CellPhoneCarrierID} from "models";

import {getCarrierDisplayName} from "../../utils/helper";
import * as styles from "./styles.css";

interface CarrierProps {
    carrierID: CellPhoneCarrierID | "";
}

export const Carrier: React.FC<CarrierProps> = ({carrierID}) => {
    const carrierClassNames = () =>
        classname([styles.carrierLabel, classIf(styles.carrierUpperCase, carrierID === CellPhoneCarrierID.Telus)]);
    return <span className={carrierClassNames()}>{getCarrierDisplayName(carrierID)}</span>;
};
