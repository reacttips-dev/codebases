import * as React from "react";
import {InjectedIntlProps} from "react-intl";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import {Key} from "@bbyca/apex-components";

import Link from "components/Link";

import {ProductReturnPolicyProps} from "./ProductReturnPolicy";
import messages from "./translations/messages";
import * as styles from "./style.css";
import ProductSpecItem from "../../ProductSpecs/ProductSpecItem";

export type ProductReturnPolicySpecsProps = Pick<ProductReturnPolicyProps, "overwrite"> & InjectedIntlProps;

export const ReturnPolicySpecs: React.FC<ProductReturnPolicySpecsProps> = ({overwrite, intl}) => {
    const specs = [
        {
            name: intl.formatMessage(messages.productCategory),
            value: overwrite.productCategory,
        },
        {
            name: intl.formatMessage(messages.returnExchangePeriod),
            value: overwrite.returnExchangePeriod,
        },
        {
            name: intl.formatMessage(messages.condition),
            value: overwrite.condition,
        },
    ];

    return (
        <>
            <div className={`${styles.specContainer} ${styles.specCategory}`}>
                {specs.map((spec, index) => (
                    <ProductSpecItem key={index} item={spec} />
                ))}
            </div>
            <div className={styles.overwriteContainer}>
                <p className={styles.disclaimer}>{overwrite.returnDisclaimer}</p>
                {overwrite.event && (
                    <Link
                        className={styles.ctaContainer}
                        to={overwrite.event.eventType as Key}
                        params={[overwrite.event.eventId]}
                        query={overwrite.event.query}>
                        {overwrite.event.ctaText}
                        <KeyboardArrowRight className={styles.icon} />
                    </Link>
                )}
            </div>
        </>
    );
};

export default ReturnPolicySpecs;
