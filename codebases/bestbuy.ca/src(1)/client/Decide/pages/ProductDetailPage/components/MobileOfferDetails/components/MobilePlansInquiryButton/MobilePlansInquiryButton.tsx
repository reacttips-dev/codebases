import * as React from "react";
import {Button} from "@bbyca/bbyca-components";
import {Key} from "@bbyca/apex-components";
import {utils as adobeLaunch} from "@bbyca/adobe-launch";
import {FormattedMessage} from "react-intl";

import Link from "components/Link";
import {classname} from "utils/classname";

import messages from "./translations/messages";
import * as styles from "./style.css";

interface MobilePlansInquiryButtonProps {
    seoText: string;
    sku: string;
    className?: string;
    onClick?: () => void;
}

export const MobilePlansInquiryButton: React.FC<MobilePlansInquiryButtonProps> = ({
    seoText,
    sku,
    className = "",
    onClick,
}) => {
    const onClickHandler = () => {
        adobeLaunch.pushEventToDataLayer({
            event: "mobile-activation-click",
        });
        if (onClick && typeof onClick === "function") {
            onClick();
        }
    };

    return (
        <Link
            onClick={onClickHandler}
            to={"cellphonePlanInquiry" as Key}
            params={[seoText, sku]}
            className={classname([styles.mobileFormLink, className])}
            extraAttrs={{"data-automation": "mobile-plans-inquiry-button"}}>
            <Button size={"regular"} appearance={"secondary"} className={styles.mobileFormButton}>
                <FormattedMessage {...messages.mobileFormButton} />
            </Button>
        </Link>
    );
};

export default MobilePlansInquiryButton;
