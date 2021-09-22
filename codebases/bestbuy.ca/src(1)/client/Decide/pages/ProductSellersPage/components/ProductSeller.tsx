import * as React from "react";
import { AddToCart } from "@bbyca/ecomm-checkout-components/dist/components";
import { FeedbackStarFull, Info, WarrantyShield } from "@bbyca/bbyca-components";
import { InjectedIntl, FormattedMessage } from "react-intl";
import { injectIntl, InjectedIntlProps } from "react-intl";

import formatWarrantyText from "utils/warrantyText";
import ProductPricing from "components/ProductCost/ProductPricing";
import { SellerOffer } from "reducers";
import Link from "components/Link";
import { SellerWarranty } from "models/SellerWarranty";

import ProductSellerPlaceholder from "./ProductSellerPlaceholder";
import * as styles from "./style.css";
import messages from "./translations/messages";

export interface Props {
    isAddToCartEnabled: boolean;
    sku: string;
    sellerOffer: SellerOffer;
}

export const ProductSeller: React.SFC<Props & InjectedIntlProps> = (props) => {

    const addToCartButton = () => {
        const isAvailable = props.sellerOffer.availability
            && props.sellerOffer.availability.shipping
            && props.sellerOffer.availability.shipping.purchasable
            && props.isAddToCartEnabled;

        return (
                <div
                    className={`x-checkout-experience-new ${styles.checkoutButtonContainer}`}
                >
                    <AddToCart
                        className={styles.addToCartButton}
                        offer={{sku: props.sku, offerId: props.sellerOffer.offer.offerId}}
                        disabled={!isAvailable}
                    />
                </div>
        );
    };

    const sellerName = props.sellerOffer.seller && props.sellerOffer.seller.name || props.intl.formatMessage(messages.fallbackSellerName);

    return (
        props.sellerOffer.loading ? <ProductSellerPlaceholder /> :
            <section className={styles.sellerGrid}>

                <div className={styles.sellerPrice} role="cell">
                    <ProductPricing
                        {...props.sellerOffer.offer.pricing}
                        displaySavingPosition="top"
                        priceSize="large"
                        superscriptCent={true}
                    />
                    <div className={styles.sellerMobileAddToCartButtonContainer}>
                        {addToCartButton()}
                    </div>
                </div>
                <div className={styles.sellerWrapperRight}>
                    <div className={styles.sellerInfo} role="cell">
                        {
                            sellerName && <div className={`${styles.sellerOffer} x-seller-name`} dangerouslySetInnerHTML={{ __html: sellerName }} role="heading" aria-level={3}/>
                        }
                        {
                            props.sellerOffer.seller &&
                            <React.Fragment>
                                <div className={styles.sellerRating}>
                                    <div className={styles.sellerInfoWrapperLeft}>
                                        <FeedbackStarFull />
                                    </div>
                                    <div className={styles.sellerRatingBody}>
                                        <div className={styles.sellerInfoTitle}>
                                                <FormattedMessage {...messages.sellerRatingCaption} />
                                        </div>
                                        <div>
                                            {
                                                (props.sellerOffer.seller.rating &&
                                                props.sellerOffer.seller.rating.reviewsCount > 0) ?
                                                    <Link to="sellerReviews" params={[props.sellerOffer.seller.id]}>
                                                        <FormattedMessage
                                                            {...messages.sellerScoreAndReview}
                                                            values={{ ratingCount: props.sellerOffer.seller.rating.score, reviewCount: props.sellerOffer.seller.rating.reviewsCount }}
                                                        />
                                                    </Link>
                                                    : <FormattedMessage {...messages.sellerNoReview} />
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.sellerPolicy}>
                                    <div className={styles.sellerInfoWrapperLeft}>
                                        <Info />
                                    </div>
                                    <div>
                                            <div className={styles.sellerInfoTitle}>
                                                    <FormattedMessage {...messages.sellerReturnPolicies} />
                                            </div>
                                            <div>
                                                <Link className="x-seller-info" to="sellerProfile" params={[props.sellerOffer.seller.id]}>
                                                    <FormattedMessage {...messages.sellerReturnPoliciesLearnMore} />
                                                </Link>
                                            </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        }
                    </div>
                    {
                        props.sellerOffer.offer &&
                        <div className={styles.sellerWarranty} data-automation="x-seller-warranty" role="cell">
                            <div className={styles.sellerWarrantyWrapperLeft}>
                                <WarrantyShield />
                            </div>
                            <div>
                                <div className={`${styles.sellerInfoTitle} ${styles.sellerWarrantyTitle}`}>
                                    <FormattedMessage {...messages.sellerWarrantyTitle} />
                                </div>
                                {
                                    getWarrantyMessages(props.intl, props.sellerOffer.offer.warranty)
                                }
                            </div>

                        </div>
                    }
                    <div className={styles.sellerButtonContainer}>
                        {addToCartButton()}
                    </div>
                </div>
            </section>
    );
};

export const getWarrantyMessages = (intl: InjectedIntl, warranty?: SellerWarranty | undefined) => {
    const { parts, labourCarryIn, labourOnSite } = warranty || {} as any;
    const labour: number = Math.max(labourCarryIn, labourOnSite);

    if (!warranty) {
        return(
            <div data-automation="x-seller-warranty-fallback">
                <FormattedMessage {...messages.fallbackWarranty} />
            </div>
        );
    } else if (parts === 0 && labour === 0) {
        return(
            <div data-automation="x-seller-no-warranty">
                <FormattedMessage {...messages.sellerNoWarranty} />
            </div>
        );
    } else {
        return(
        <>
                {
                    parts > 0 &&
                    <div className={styles.sellerWarrantyMessage} data-automation="x-seller-warranty-parts">
                        <FormattedMessage {...messages.sellerWarrantyParts} values={{ warrantyParts: formatWarrantyText(parts, intl) }} />
                    </div>
                }
                {
                    labour > 0 &&
                    <div className={styles.sellerWarrantyMessage} data-automation="x-seller-warranty-labour">
                        <FormattedMessage {...messages.sellerWarrantyLabour} values={{ warrantyLabour: formatWarrantyText(labour, intl) }} />
                    </div>
                }
            </>
        );
    }
};

export default injectIntl(ProductSeller);
