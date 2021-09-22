import {Pricing, Region} from "models";
import * as React from "react";
import {FormattedMessage} from "react-intl";
import {connect} from "react-redux";
import State from "store";
import {PriceSize, ProductPrice} from "../ProductPrice";
import ProductSaleEndDate from "../ProductSaleEndDate";
import ProductSaving from "../ProductSaving";
import * as styles from "./style.css";
import messages from "./translations/messages";
import {classname} from "utils/classname";

export type SavingPosition = "top" | "right";

export interface StateProps {
    displayEhfRegions: Region[];
    appLocationRegionCode: Region;
}

export interface ProductPricingProps extends Pricing {
    displaySaleEndDate?: boolean;
    displaySavingPosition: SavingPosition;
    priceSize: PriceSize;
    superscriptCent?: boolean;
    availabilityStatus?: string;
    className?: string;
    disableSeoAttributes?: boolean;
}

export const ProductPricing: React.FC<StateProps & ProductPricingProps> = (props) => {
    const isSalePrice = hasSavings(props);
    const hasEHF = props.displayEhfRegions.indexOf(props.appLocationRegionCode) >= 0 && props.ehf > 0;

    return (
        <div className={classname([styles.productPricingContainer, props.className])} data-automation="product-pricing">
            {props.displaySavingPosition === "top" && <ProductSaving position="top" value={props.saving} />}
            <ProductPrice
                superscriptCent={props.superscriptCent}
                value={hasEHF ? props.priceWithEhf : props.priceWithoutEhf}
                isSalePrice={isSalePrice}
                saleEndDate={props.saleEndDate}
                size={props.priceSize}
                availabilityStatus={props.availabilityStatus}
                disableSeoAttributes={props.disableSeoAttributes}
            />

            {props.isSubscription && (
                <span className={`${styles.monthlyPayment} ${styles[props.priceSize]}`}>
                    <FormattedMessage {...messages.monthlyPayment} />
                </span>
            )}

            {props.displaySavingPosition === "right" && <ProductSaving position="right" value={props.saving} />}

            {hasEHF && (
                <div className={styles.ehf} data-automation="product-pricing-ehf">
                    <FormattedMessage
                        {...messages.ehf}
                        values={{priceWithoutEhf: props.priceWithoutEhf, ehf: props.ehf}}
                    />
                </div>
            )}

            {props.displaySaleEndDate && props.saleEndDate && (
                <ProductSaleEndDate value={props.saleEndDate} disableSeoAttributes={props.disableSeoAttributes} />
            )}
        </div>
    );
};

const mapStateToProps = (state: State) => {
    return {
        displayEhfRegions: state.config.displayEhfRegions || [],
        appLocationRegionCode: state.app.location.regionCode,
    };
};

export const hasSavings = (productPricing: ProductPricingProps) => {
    return !!productPricing && productPricing.saving > 0;
};

export default connect<StateProps, {}, ProductPricingProps, State>(mapStateToProps)(ProductPricing);
