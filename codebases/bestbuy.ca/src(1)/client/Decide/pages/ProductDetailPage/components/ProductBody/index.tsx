import * as React from "react";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Divider} from "@material-ui/core";
import {IBrowser as ScreenSize} from "redux-responsive/types";

import {ErrorState, RoutingState} from "reducers";
import {State} from "store";
import {
    AvailabilityReduxStore,
    CustomerReviews,
    RemoteConfig,
    Region,
    Warranty,
    DetailedProduct as Product,
    Recommendations,
    ProductContent,
    SectionItemTypes,
    FlexBannerType,
    ContentContexts,
    Offer,
} from "models";
import {FeatureToggles} from "config";

import {basketActionCreators, recommendationActionCreators, RecommendationActionCreators} from "../../../../actions";
import {SupportContent} from "../SupportContent";
import BoughtAlsoBought from "../../../../components/BoughtAlsoBought";
import ProductDetailTab, {ProductDetailTabId} from "../ProductDetailTab/ProductDetailTab";
import {getScreenSize} from "store/selectors";

export interface StateProps {
    appLocationRegionCode: Region;
    availability: AvailabilityReduxStore;
    customerReviews: CustomerReviews;
    errors: ErrorState;
    geekSquadSubscriptionSKU: string;
    language: Language;
    loadingProduct: boolean;
    locale: Locale;
    offer?: Offer;
    product: Product;
    recommendations: Recommendations;
    remoteConfig: RemoteConfig;
    routing: RoutingState;
    screenSize: ScreenSize;
    targettedContent: ProductContent;
    user: any;
    features: FeatureToggles;
}

export interface DispatchProps {
    actions: RecommendationActionCreators;
    goToCartPage: () => void;
}

export interface OwnState {
    selectedWarranty: Warranty;
}

export interface ProductBodyProps extends DispatchProps, StateProps, InjectedIntlProps {
    scrollIntoViewTabId?: ProductDetailTabId;
    disableSeoAttributes?: boolean;
}

export class ProductBody extends React.Component<ProductBodyProps, OwnState> {
    constructor(props: ProductBodyProps) {
        super(props);
        this.props.actions.resetBoughtAlsoBought?.();
    }

    public render() {
        if (!this.props.product) {
            return null;
        }
        return (
            <React.Fragment>
                {this.props.recommendations?.boughtAlsoBought && (
                    <BoughtAlsoBought
                        screenSize={this.props.screenSize}
                        regionName={this.props.user.shippingLocation.regionName}
                        recommendationProducts={this.props.recommendations?.boughtAlsoBought}
                        getRecommendationAvailabilities={this.props.actions.getRecommendationAvailabilities}
                        onGotoBasketPage={this.onGotoViewCartHandler}
                        errors={this.props.errors}
                        noCrawl={true}
                        showAddToCartButton={this.props.features.showRecosAddToCart}
                        disableSeoAttributes={this.props.disableSeoAttributes}
                        locale={this.props.locale}
                        appLocationRegionCode={this.props.appLocationRegionCode}
                    />
                )}
                <div id="productDetails">
                    {!this.props.loadingProduct && (
                        <ProductDetailTab
                            getSupportContent={this.getSupportContent()}
                            product={this.props.product}
                            offer={this.props.offer}
                            customerReviews={this.props.customerReviews}
                            targettedContent={this.props.targettedContent}
                            scrollIntoViewTabId={this.props.scrollIntoViewTabId}
                            showAddToCartButton={this.props.features.showRecosAddToCart}
                            disableSeoAttributes={this.props.disableSeoAttributes}
                        />
                    )}
                </div>
                {this.props.screenSize.lessThan.medium && this.getSupportContent()}
            </React.Fragment>
        );
    }

    private getSupportContent = () => {
        const recommendations = (this.props as any).recommendations;
        const data = [];
        if (recommendations) {
            if (recommendations.supportContent && Object.keys(recommendations.supportContent).length) {
                data.push(recommendations.supportContent);
            }
            if (recommendations.showcaseContent) {
                data.push(recommendations.showcaseContent);
            }
        }

        const flexBannerData = this.getFlexBannerData();
        if (flexBannerData) {
            data.push(flexBannerData);
        }

        if (!data.length) {
            return null;
        }

        return (
            <SupportContent
                data={data}
                screenSize={this.props.screenSize}
                disableSeoAttributes={this.props.disableSeoAttributes}
            />
        );
    };

    private getFlexBannerData() {
        if (
            this.props.targettedContent &&
            this.props.targettedContent.contexts &&
            this.props.targettedContent.contexts[ContentContexts.vendorFunded] &&
            this.props.targettedContent.contexts[ContentContexts.vendorFunded].items
        ) {
            return this.props.targettedContent.contexts[ContentContexts.vendorFunded].items.find(
                (item) => item.type === SectionItemTypes.flexBanner,
            ) as FlexBannerType;
        }
        return null;
    }

    private onGotoViewCartHandler = () => {
        this.props.goToCartPage();
    };
}

const mapStateToProps = (state: State) => ({
    appLocationRegionCode: state.app.location.regionCode,
    availability: state.product.availability,
    customerReviews: state.product.customerReviews,
    errors: state.errors,
    geekSquadSubscriptionSKU: state.config.checkout.geekSquadSubscriptionSKU,
    language: state.intl.language,
    loadingProduct: state.product.loadingProduct,
    locale: state.intl.locale,
    offer: state.product.offer,
    product: state.product.product,
    recommendations: state.product.recommendations,
    remoteConfig: state.config.remoteConfig,
    routing: state.routing,
    screenSize: getScreenSize(state),
    targettedContent: state.product.targettedContent,
    user: state.user,
    features: state.config.features,
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(recommendationActionCreators, dispatch),
    goToCartPage: () => dispatch(basketActionCreators.goToCartPage()),
});

export default connect<StateProps, DispatchProps>(mapStateToProps, mapDispatchToProps)(injectIntl(ProductBody));
