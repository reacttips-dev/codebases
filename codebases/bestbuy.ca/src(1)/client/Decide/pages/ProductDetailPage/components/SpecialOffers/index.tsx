import {Link as BBYLink} from "@bbyca/bbyca-components";
import {Key} from "@bbyca/apex-components";
import {tracker} from "@bbyca/ecomm-utilities";
import * as React from "react";
import {Offer} from "@bbyca/bbyca-components";
import {FormattedMessage, FormattedPlural} from "react-intl";

import Link from "components/Link";
import {SpecialOffer as SpecialOffersType} from "models/DetailedProduct";

import * as styles from "./style.css";
import messages from "./translations/messages";

export interface SpecialOffersProps {
    seoName: string;
    sku: string;
    specialOffers: SpecialOffersType[];
    trackSpecialOfferClick: (discountId: string) => any;
}

export interface SpecialOffersState {
    toggleOffer: boolean;
}
export class SpecialOffers extends React.Component<SpecialOffersProps, SpecialOffersState> {
    constructor(props) {
        super(props);
        this.state = {
            toggleOffer: false,
        };
    }

    public render() {
        const firstSpecialOffer = this.props.specialOffers.length > 0 && this.props.specialOffers[0];

        const showMoreOffers = this.props.specialOffers.filter((offer) => !!offer.promotionText ).length > 1;

        const toggleButton = (
            <BBYLink
                className={styles.showClickable}
                data-automation="show-offer-label"
                chevronType={this.state.toggleOffer ? "up" : "down"}
                targetSelf={true}
                onClick={(e) => this.handleClick()}>
                {this.renderToggleButtonText()}
            </BBYLink>
        );

        return (
            <div className={styles.container} data-automation="show-offer-container">
                <Offer className={styles.addToCartIcon} data-automation="show-offer-icon" />
                {/* This <div/> is to group the text for display flex */}
                <div>
                    <div className={styles.callOutTitle} data-automation="show-offer-heading">
                        <span>{this.numberOfSpecialOffersShown()} </span>
                        <FormattedPlural
                            one={<FormattedMessage {...messages.callOutTitle} />}
                            other={<FormattedMessage {...messages.callOutTitlePlural} />}
                            value={this.numberOfSpecialOffersShown()}
                        />
                    </div>

                    <ul className={styles.offersContainer}>
                        {firstSpecialOffer && this.clickableSpecialOfferItem(firstSpecialOffer, 0)}

                        {this.state.toggleOffer &&
                            this.props.specialOffers.slice(1).map((offer, index) => {
                                return this.clickableSpecialOfferItem(offer, index);
                            })}
                    </ul>

                    {showMoreOffers ? toggleButton : null}
                </div>
            </div>
        );
    }

    private numberOfSpecialOffersShown = (): number => {
        return this.props.specialOffers.filter((offer) => !!offer.promotionText).length;
    };

    private onOfferClick = (contentUrl) => (e) => {
        this.props.trackSpecialOfferClick(contentUrl);
    };

    private clickableSpecialOfferItem = (offer: SpecialOffersType) => {
        if (!!offer.promotionText) {
            let child = offer.promotionText as JSX.Element | string;
            if (offer.promotionDetails) {
                child = (
                    <Link
                        to={"productOffers" as Key}
                        params={[this.props.seoName, this.props.sku]}
                        query={{contentUrl: offer.promotionId}}
                        onClick={this.onOfferClick(offer.promotionId)}>
                        {child}
                    </Link>
                );
            }
            return (
                <li key={`specialOffer-${offer.promotionId}`} className={styles.offerItem}>
                    {child}
                </li>
            );
        } else {
            return null;
        }
    };

    private handleClick = () => {
        const toggleOffer = !this.state.toggleOffer;
        this.setState({toggleOffer});
        if (toggleOffer) {
            tracker.dispatchEvent({category: "PDP", action: "Click", label: "SpecialOffers"});
        }
    };

    private renderToggleButtonText = (): JSX.Element => {
        // Show More Offers / Show Less Offers
        return this.state.toggleOffer ? (
            <FormattedMessage {...messages.hideOffers} />
        ) : (
            <FormattedMessage {...messages.showOffers} />
        );
    };
}

export default SpecialOffers;
