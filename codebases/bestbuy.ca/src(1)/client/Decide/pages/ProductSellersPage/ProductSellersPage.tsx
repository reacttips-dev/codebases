import * as React from "react";
import Divider from "@material-ui/core/Divider";
import { InjectedIntlProps, injectIntl, FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { IBrowser as ScreenSize } from "redux-responsive";

import State from "store";
import BackButton from "components/BackButton";
import PageContent from "components/PageContent";
import {
    routingActionCreators,
    RoutingActionCreators,
} from "actions";
import Header from "components/Header";
import ProductImage from "components/ProductImage";
import { ImageProps as ProductImageProps } from "components/Image";
import { RoutingState } from "reducers";
import routeManager from "utils/routeManager";
import Footer from "components/Footer";

import { ProductSellersState} from "../../reducers";
import {
    productSellersActionCreators,
    ProductSellersActionCreators,
} from "../../actions";
import ProductSeller from "./components/ProductSeller";
import ProductSellersPlaceholder from "./components/ProductSellersPlaceholder";
import * as styles from "./style.css";
import messages from "./translations/messages";
import {getScreenSize} from "store/selectors";

export interface StateProps {
    isAddToCartEnabled: boolean;
    language: Language;
    productSellers: ProductSellersState;
    routing: RoutingState;
    screenSize: ScreenSize;
}

export interface DispatchProps {
    productSellersActions: ProductSellersActionCreators;
    routingActions: RoutingActionCreators;
}

export class ProductSellersPage extends React.Component<DispatchProps & StateProps & InjectedIntlProps, State> {

    public render() {
        return (
            <div className={styles.container}>
                <Header />
                <PageContent>
                <BackButton canGoBack={!!this.props.routing.previousLocationBeforeTransitions} onClick={this.props.routingActions.goBack} />

                { this.props.screenSize.lessThan.small && <Divider /> }

                {
                    this.props.productSellers.loading ? <ProductSellersPlaceholder/> :
                        this.props.productSellers.product && this.sellersPageContent(this.props.productSellers.sellerOffers, this.props.productSellers.product)

                }
                </PageContent>
                <Footer />
            </div>
        );
    }

    public async componentDidMount() {
        const location = this.props.routing.locationBeforeTransitions;
        const params = routeManager.getParams(this.props.language, location.pathname);

        this.props.routingActions.setAltLangHrefs({
            altLangUrl: routeManager.getAltLangPathByKey(this.props.language, "productSellers", params.sku),
            curLangUrl: routeManager.getCurrLang(location.pathname),
        });

        await this.props.productSellersActions.getOffers(params.sku);
        this.props.productSellers.sellerOffers.forEach((sellerOffer) => this.props.productSellersActions.getSeller(sellerOffer.offer.sellerId));
        await this.props.productSellersActions.getAvailabilities();
    }

    private sellersPageContent(sellerOffers, product) {
        const offers = sellerOffers.map((sellerOffer) =>
            <div key={sellerOffer.offer.offerId} role="row">
                <ProductSeller
                    isAddToCartEnabled={this.props.isAddToCartEnabled}
                    key={sellerOffer.offer.offerId}
                    sku={product.sku}
                    sellerOffer={sellerOffer}
                />
            </div>);

        const productImageProps: ProductImageProps = {
            alt: product.name,
            className: styles.productItemImage,
            src: product.productImage,
            srcSet: "",
        };

        return (
            <div role="table">
                <div className={styles.productGrid}>
                    <div className={styles.productGridImage}>
                        <div className={styles.imageWrapper}>
                            <ProductImage {...productImageProps} />
                        </div>
                    </div>
                    <div className={`${styles.productGridName} x-product-name`} role="heading" aria-level={2} >{product.name}</div>
                </div>
                <div role="rowgroup">
                    <div className={styles.productSellerHeader} role="row">
                        <div className={styles.productSellerHeaderItem} role="columnheader">
                            <FormattedMessage {...messages.sellerPrice} />
                        </div>
                        <div className={styles.productSellerWrapperRight}>
                            <div className={styles.productSellerNameHeaderItem} role="columnheader">
                                <FormattedMessage {...messages.sellerName} />
                            </div>
                            <div className={styles.productSellerHeaderItem} role="columnheader">
                                <FormattedMessage {...messages.sellerWarranty} />
                            </div>
                            <div className={styles.productSellerEmptyHeaderItem}>
                            </div>
                        </div>
                    </div>
                </div>
                <div role="rowgroup">
                    {offers}
                </div>
                <div className={styles.productSellerPriceCondition}>
                    <FormattedMessage {...messages.sellerPriceCondition} />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: State) => {
    return {
        language: state.intl.language,
        productSellers: state.productSellers,
        routing: state.routing,
        isAddToCartEnabled: state.config.remoteConfig.isAddToCartEnabled,
        screenSize: getScreenSize(state),
        ...state.product,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        productSellersActions: bindActionCreators(productSellersActionCreators, dispatch),
        routingActions: bindActionCreators(routingActionCreators, dispatch),
    };
};

export default connect<StateProps, DispatchProps>
    (mapStateToProps, mapDispatchToProps)(injectIntl(ProductSellersPage));
