import * as React from "react";
import * as styles from "./style.css";

export const CellPhonePlanPricePlaceHolder: React.FC = () => {
    return (
        <div className={styles.cellPhonePricePlaceholder} data-automation="cellphone-price-placeholder">
            <div className={styles.pricing}>
                <div className={styles.half}>
                    <div className={styles.pricePlaceholder}></div>
                    <div className={styles.downPlaceholder}></div>
                </div>
                <div className={styles.half}>
                    <div className={styles.pricePlaceholder}></div>
                    <div className={styles.monthlyPlaceholder}></div>
                </div>
            </div>
            <div className={styles.CellPhonePlanPricePlaceHolder}></div>
        </div>
    );
};

export default CellPhonePlanPricePlaceHolder;
