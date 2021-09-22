import * as React from "react";
import * as styles from "./style.css";

export interface CellPhonePlanMessageProps {
    planMessage: React.ReactElement;
}

const CellPhonePlanMessage: React.FC<CellPhonePlanMessageProps> = ({planMessage}) => {
    return (
        <p className={styles.plan} data-automation="cellphone-message">
            {planMessage}
        </p>
    );
};

export default CellPhonePlanMessage;
