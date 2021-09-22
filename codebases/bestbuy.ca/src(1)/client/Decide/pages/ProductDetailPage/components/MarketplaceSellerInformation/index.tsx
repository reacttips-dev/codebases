import * as React from "react";
import {FormattedMessage, InjectedIntlProps, injectIntl} from "react-intl";

import {MarketplaceLogo} from "@bbyca/bbyca-components";
import Link from "components/Link";
import {Seller} from "models/Seller";

import * as styles from "./style.css";
import messages from "./translations/messages";

export interface Props {
    seller: Seller;
}

export const MarketplaceSellerInformation = (props: Props & InjectedIntlProps) => {
    const marketPlaceHasRating = props.seller && props.seller.rating && props.seller.rating.reviewsCount > 0;

    return (
        <>
            <Link itemProp="url" to="sellerProfile" params={[props.seller?.id]} className={styles.secondarySellerLink}>
                <div className={styles.container}>
                    <MarketplaceLogo className={styles.marketplaceLogo} />
                    <div className={styles.marketplaceInfo}>
                        <div className={styles.soldBy}>
                            <FormattedMessage {...messages.soldAndShippedBy} />
                            {/* dangerouslySetInnerHTML is used in this cases because there is mark-up coming from our API that includes special character encoding */}
                            <span
                                dangerouslySetInnerHTML={{__html: props.seller?.name}}
                                className={styles.marketplaceNameLink}></span>
                        </div>

                        {marketPlaceHasRating && (
                            <div className={styles.marketplaceRating}>
                                <FormattedMessage
                                    {...messages.sellerRating}
                                    values={{
                                        ...props.seller.rating,
                                        score: props.intl.formatNumber(props.seller.rating.score, {
                                            maximumFractionDigits: 1,
                                            minimumFractionDigits: 1,
                                        }),
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </>
    );
};

export default injectIntl(MarketplaceSellerInformation);
