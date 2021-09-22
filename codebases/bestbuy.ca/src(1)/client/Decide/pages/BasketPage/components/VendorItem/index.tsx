import * as React from "react";
import {FormattedMessage} from "react-intl";
import {BestBuyLogo, MarketplaceLogo} from "@bbyca/bbyca-components";

import {classname as cs} from "utils/classname";
import { decodeHTMLEntities } from "utils/decodeString";

import {BBYCA} from "../../constants/constants";
import messages from "./translations/messages";
import * as styles from "./styles.css";

interface VendorItemProps {
    sellerId: string;
    sellerName: string;
    className?: string;
    lineItems: React.ReactNode[];
    shouldDisplayHeader: boolean;
}

const VendorItem: React.FC<VendorItemProps> = ({sellerId, sellerName, className, lineItems, shouldDisplayHeader}) => {
    return (
        <div className={cs([className, styles.vendor])} data-automation="vendor-items">
            {shouldDisplayHeader && (
                <h3 className={styles.header}>
                    <span className={styles.soldBy} data-seller-id={sellerId}>
                        {sellerId === BBYCA ? (
                            <BestBuyLogo className={styles.sellerLogo} />
                        ) : (
                            <MarketplaceLogo className={styles.sellerLogo} />
                        )}
                        <FormattedMessage
                            {...messages.soldByEWA}
                            values={{
                                sellerName: decodeHTMLEntities(sellerName)
                            }}
                        />
                    </span>
                </h3>
            )}
            <ul className={styles.lineItems}>{lineItems}</ul>
        </div>
    );
};

export default VendorItem;
