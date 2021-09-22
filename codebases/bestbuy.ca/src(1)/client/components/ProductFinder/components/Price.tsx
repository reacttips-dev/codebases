import * as React from "react";
import {Loader, LoadingSkeleton} from "@bbyca/bbyca-components";
import {FormattedMessage} from "react-intl";
import ProductPrice from "../../ProductCost/ProductPrice";
import messages from "../translations/messages";
import * as styles from "../styles.css";

interface Props {
    price: number;
    includePlan: boolean;
    loading: boolean;
    disableSeoAttributes?: boolean;
}

export const PriceLoadingSkeleton = ({includePlan, loading}) => (
    <>
        <LoadingSkeleton.Line width={150} />
        <LoadingSkeleton.Line width={300} />
        <LoadingSkeleton.Price width={60} />
        {includePlan && loading && <LoadingSkeleton.Banner width={300} className={styles.skeletonLoader} />}
    </>
);

const Price = ({price, includePlan, loading = false, disableSeoAttributes}: Props) => {
    const message = includePlan ? messages.priceWithCarrier : messages.priceUnlocked;
    const messageSubText = includePlan ? messages.priceWithCarrierSubText : messages.priceUnlockedSubText;

    return (
        <Loader loading={loading} loadingDisplay={<PriceLoadingSkeleton includePlan={includePlan} loading={loading} />}>
            <h2>
                <FormattedMessage {...message} />
            </h2>
            <p>
                <FormattedMessage {...messageSubText} />
            </p>
            <ProductPrice
                className={styles.priceText}
                value={price}
                superscriptCent={true}
                size="large"
                rightEndPriceExtra={includePlan ? "*" : ""}
                disableSeoAttributes={disableSeoAttributes}
            />
            {includePlan && (
                <p className={styles.legalText}>
                    <FormattedMessage {...messages.carrierDepositLegalText} />
                </p>
            )}
        </Loader>
    );
};

export default Price;
