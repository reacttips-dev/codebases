import * as React from "react";
import {FormattedMessage} from "react-intl";

import messages from "./translations/messages";
import * as styles from "./style.css";
import {hasCents} from "../../../../components/CellPhonePlanPrice/utils";

export interface ActivationGiftCardProps {
    giftCardAmount: number;
}

export const ActivationGiftCard: React.FC<ActivationGiftCardProps> = ({giftCardAmount}) => {
    const amount = hasCents(giftCardAmount) ? Number(giftCardAmount).toFixed(2) : giftCardAmount;
    return (
        <div className={styles.giftCardSection} data-automation="activation-perks">
            <h3 className={styles.activationTitle}>
                <FormattedMessage {...messages.activationTitle} />
            </h3>
            <p>
                <FormattedMessage {...messages.activationOffer} values={{giftCard: amount}} />
            </p>
        </div>
    );
};

export default ActivationGiftCard;
