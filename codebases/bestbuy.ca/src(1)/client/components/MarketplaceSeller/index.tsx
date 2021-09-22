import * as React from "react";
import {FormattedMessage} from "react-intl";
import {MarketplaceLogo} from "@bbyca/bbyca-components";
import * as styles from "./style.css";
import messages from "./translations/messages";

export interface Props {
    isMarketplaceSeller: boolean;
}

export const MarketplaceSeller = ({isMarketplaceSeller}: Props) => {
    if (!isMarketplaceSeller) {
        return null;
    }

    return (
        <div className={styles.soldAndShippedBy} id="MarketplaceSeller">
            <MarketplaceLogo className={styles.marketplaceLogo} />
            <span className={styles.marketplaceName}>
                <FormattedMessage {...messages.marketplaceSeller} />
            </span>
        </div>
    );
};

export default MarketplaceSeller;
