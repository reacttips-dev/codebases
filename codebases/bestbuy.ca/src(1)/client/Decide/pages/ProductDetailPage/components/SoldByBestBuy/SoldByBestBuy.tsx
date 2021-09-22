import * as React from "react";
import {BestBuyLogo} from "@bbyca/bbyca-components";
import {FormattedMessage} from "react-intl";

import {classname} from "utils/classname";
import * as styles from "./style.css";
import messages from "./translations/messages";

const SoldByBestBuy = (props: {isMarketplace: boolean; className?: string}) => {
    if (props.isMarketplace || typeof props.isMarketplace === "undefined") {
        return null;
    }

    return (
        <div className={classname([styles.soldByBestBuy, props.className])}>
            <BestBuyLogo className="bbyNewStyle" />
            <span>
                <FormattedMessage {...messages.soldByBestBuy} />
            </span>
        </div>
    );
};

export default SoldByBestBuy;
