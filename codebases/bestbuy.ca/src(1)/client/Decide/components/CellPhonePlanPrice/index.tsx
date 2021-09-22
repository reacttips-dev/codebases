import * as React from "react";
import {useState, useEffect} from "react";
import {FormattedMessage} from "react-intl";

import {CellPhoneCarrierID} from "models";
import {CellPhonePlanStore} from "models/CellPhonePlan";

import * as styles from "./style.css";
import messages from "./translations/messages";
import CellPhonePlanMessage from "./CellPhonePlanMessage";
import CellPhonePriceDown from "./CellPhonePriceDown";
import CellPhoneMonthlyPayment from "./CellPhoneMonthlyPayment";

export interface CellPhonePlanProps {
    plan: CellPhonePlanStore;
}

export const CellPhonePlanPrice: React.FC<CellPhonePlanProps> = ({plan}: CellPhonePlanProps) => {
    const [carrierID, setCarrierID] = useState("");

    useEffect(() => {
        if (plan && !plan.loading) {
            setCarrierID(plan.carrierID);
        }
    }, [plan]);

    const getPlanMessage = React.useCallback(() => {
        if (carrierID === CellPhoneCarrierID.Koodo) {
            return <FormattedMessage {...messages.koodoPlan} />;
        } else {
            return <FormattedMessage {...messages.genericPlan} />;
        }
    }, [carrierID]);

    const getPriceDownMessage = React.useCallback(() => {
        if (carrierID !== CellPhoneCarrierID.Telus) {
            return (
                <p className={styles.down}>
                    <FormattedMessage {...messages.down} />
                </p>
            );
        }
    }, [carrierID]);

    const getTaxMessage = React.useCallback(() => {
        if (carrierID === CellPhoneCarrierID.Telus) {
            return (
                <p className={styles.taxes}>
                    <FormattedMessage {...messages.plusTax} />
                </p>
            );
        }
    }, [carrierID]);

    return (
        <div className={styles.cellPhonePrice} data-automation="cellphone-price">
            <div className={styles.priceSection}>
                {typeof plan.downPayment === "number" && (
                    <CellPhonePriceDown
                        price={plan.downPayment}
                        priceDownMessage={getPriceDownMessage()}
                        taxMessage={getTaxMessage()}
                    />
                )}
                {!!plan.monthly && <CellPhoneMonthlyPayment monthly={plan.monthly} />}
            </div>
            {!!plan.planTier && <CellPhonePlanMessage planMessage={getPlanMessage()} />}
        </div>
    );
};

export default CellPhonePlanPrice;
