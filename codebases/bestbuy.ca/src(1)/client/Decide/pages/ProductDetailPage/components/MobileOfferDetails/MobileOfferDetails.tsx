import * as React from "react";
import Divider from "@material-ui/core/Divider";
import {connect} from "react-redux";
import {IBrowser as ScreenSize} from "redux-responsive/types";
import {injectIntl, InjectedIntlProps} from "react-intl";
import {StoreStatusMessage} from "@bbyca/bbyca-components";
import {routeManager} from "@bbyca/apex-components";
import {EventTypes} from "@bbyca/apex-components/dist/models";
import {getHelpTopicsId} from "@bbyca/apex-components/dist/utils/helpTopics";

import {hasSavings} from "components/ProductCost/ProductPricing";
import {State} from "store";
import {ProductPricingProps} from "components/ProductCost/ProductPricing";
import {bindActionCreators} from "redux";
import {configActionCreators, ConfigActionCreators} from "actions";
import {
    Region,
    RemoteConfig,
    ProductContent,
    AvailabilityReduxStore,
    DetailedProduct as Product,
    Recommendations,
    User,
} from "models";
import BadgeWrapper from "components/BadgeWrapper";
import isPurchasable from "utils/isPurchasable";

import {offerActionCreators, OfferActionCreators} from "../../../../actions";
import * as styles from "./style.css";
import SpecialOffers from "../SpecialOffers";
import {OpenBoxOffer} from "../OpenBoxOffer";
import messages from "./translations/messages";
import SaleMessageBox from "../SaleMessageBox";
import CorrectionNotice from "../CorrectionNotice";
import {SoldByBestBuy} from "../SoldByBestBuy";
import {MobilePlansInquiryButton} from ".";
import {CellPhonePlanOffer} from "../CellPhonePlanOffer";
import {Variants} from "../Variants";
import {getScreenSize} from "store/selectors";

interface StateProps {
    appLocationRegionCode: Region;
    availability: AvailabilityReduxStore;
    baseSwatchUrl: string;
    environment: string;
    geekSquadSubscriptionSKU: string;
    language: Language;
    loadingStores: boolean;
    loadingVariants: boolean;
    locale: Locale;
    product: Product;
    screenSize: ScreenSize;
    recommendations: Recommendations;
    remoteConfig: RemoteConfig;
    targettedContent: ProductContent;
    user: User;
    variantThumbnailEnabled: boolean;
}

interface DispatchProps {
    actions: OfferActionCreators;
    configActions: ConfigActionCreators;
}

export type MobileOfferDetailsProps = DispatchProps & StateProps & InjectedIntlProps;

export const MobileOfferDetails: React.FC<MobileOfferDetailsProps> = ({
    product,
    availability,
    baseSwatchUrl,
    geekSquadSubscriptionSKU,
    language,
    loadingVariants,
    screenSize,
    actions,
    locale,
    environment,
    intl,
    recommendations,
    appLocationRegionCode,
    targettedContent,
    variantThumbnailEnabled,
}) => {
    if (!product) {
        return null;
    }
    const {sku, seoText, productVariants, specialOffers} = product;
    const helpTopicId: string[] = getHelpTopicsId(environment).mobileActivation;

    const isSubscription = () => product.sku === geekSquadSubscriptionSKU;

    const getProductPricingProps = (): ProductPricingProps => ({
        displaySaleEndDate: true,
        displaySavingPosition: "top",
        ehf: product.ehf,
        isSubscription: isSubscription(),
        priceSize: "large",
        priceWithEhf: product.priceWithEhf,
        priceWithoutEhf: product.priceWithoutEhf,
        saleEndDate: product.saleEndDate,
        saving: product.saving,
        superscriptCent: true,
        availabilityStatus: availability && availability.shipping && availability.shipping.status,
    });

    const productPricingProps = getProductPricingProps();
    const showBadge: boolean = hasSavings(productPricingProps) && isPurchasable(availability);

    return (
        <>
            <Divider className={styles.dividerWithMargin} />
            <CorrectionNotice targettedContent={targettedContent} />
            <BadgeWrapper className={styles.badgeWrp} sku={sku} locale={intl.locale as Locale} display={showBadge} />
            <div className={styles.pricingContainer}>
                <CellPhonePlanOffer />
                <OpenBoxOffer
                    recommendations={recommendations}
                    appLocationRegionCode={appLocationRegionCode}
                    locale={locale}
                />
            </div>
            {specialOffers && specialOffers.length !== 0 && (
                <SpecialOffers
                    trackSpecialOfferClick={actions.trackSpecialOfferClick}
                    specialOffers={specialOffers}
                    seoName={seoText}
                    sku={sku}
                />
            )}
            {productVariants && productVariants.length > 0 && productVariants[0].length > 0 && (
                <>
                    <Divider />
                    <Variants
                        baseSwatchUrl={baseSwatchUrl}
                        pageSku={sku}
                        productVariants={productVariants}
                        loadingVariants={loadingVariants}
                        variantThumbnailEnabled={variantThumbnailEnabled}
                        locale={locale}
                    />
                </>
            )}

            <SaleMessageBox targettedContent={targettedContent} />
            {screenSize.greaterThan.extraSmall && (
                <MobilePlansInquiryButton sku={sku} seoText={seoText} className={styles.mobilePlanInquiryButton} />
            )}

            <SoldByBestBuy isMarketplace={product.isMarketplace} className={styles.soldByBestBuy} />
            <StoreStatusMessage
                className={styles.mobileOfferDetailsStoreStatusMessage}
                message={intl.formatMessage(messages.storeStatusMessage)}
                linkProps={{
                    ctaText: intl.formatMessage(messages.storeStatusMessageCta),
                    href: routeManager.getPathByKey(language, EventTypes.help, ...helpTopicId),
                    targetSelf: true,
                }}
            />
        </>
    );
};

const mapStateToProps = (state: State): StateProps => {
    const dataSources = state.config.dataSources;
    return {
        appLocationRegionCode: state.app.location.regionCode,
        availability: state.product.availability,
        baseSwatchUrl: dataSources && dataSources.baseSwatchUrl,
        environment: state.config.environment,
        geekSquadSubscriptionSKU: state.config.checkout.geekSquadSubscriptionSKU,
        loadingStores: state.product.loadingStores,
        language: state.intl.language,
        loadingVariants: state.product.loadingVariants,
        locale: state.intl.locale,
        screenSize: getScreenSize(state),
        product: state.product.product,
        recommendations: state.product.recommendations,
        remoteConfig: state.config.remoteConfig,
        targettedContent: state.product.targettedContent,
        user: state.user,
        variantThumbnailEnabled: state.config.features.variantThumbnailEnabled,
    };
};

const mapDispatchToProps = (dispatch) => ({
    configActions: bindActionCreators(configActionCreators, dispatch),
    actions: bindActionCreators(offerActionCreators, dispatch),
});

export default connect<StateProps, DispatchProps>(
    mapStateToProps,
    mapDispatchToProps,
)(injectIntl<StateProps & DispatchProps>(MobileOfferDetails));
