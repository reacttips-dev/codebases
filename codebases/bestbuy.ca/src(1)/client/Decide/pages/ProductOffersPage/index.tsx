import * as React from "react";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import Divider from "@material-ui/core/Divider";

import Header from "components/Header";
import HeadTags from "components/HeadTags";
import PageContent from "components/PageContent";
import Link from "components/Link";
import {State} from "store";
import {StatusCode, SpecialOfferError} from "errors";
import {offerActionCreators, errorActionCreators, OfferActionCreators, ErrorActionCreators} from "actions";
import Footer from "components/Footer";

import messages from "./translations/messages";
import * as styles from "./style.css";

export interface StateProps {
    offer: object;
    loadingProduct: boolean;
    hasMatchingProduct: boolean;
    language: Language;
    productName: string;
}

export interface OwnProps {
    location: object;
    params: object;
}

export interface DispatchProps {
    offerActions: OfferActionCreators;
    errorActions: ErrorActionCreators;
}

export class ProductOffersPage extends React.Component<StateProps & OwnProps & DispatchProps & InjectedIntlProps> {
    public render() {
        const {loadingProduct, offer, params, productName} = this.props;

        return (
            <React.Fragment>
                {this.props.productName && (
                    <HeadTags title={this.props.intl.formatMessage(messages.title, {name: productName})} />
                )}
                <Header />
                <PageContent>
                    <div className={styles.offerContainer}>
                        <Link to="product" params={[params.seoName, params.sku]} className={styles.link}>
                            <KeyboardArrowLeft className={styles.backArrow} />
                            <span property="name">{this.props.intl.formatMessage(messages.back)}</span>
                        </Link>
                        <Divider className={styles.divider} />
                        {loadingProduct || !offer ? (
                            this.renderLoading()
                        ) : (
                            <div
                                className={styles.content}
                                dangerouslySetInnerHTML={{__html: offer.promotionDetails}}
                            />
                        )}
                    </div>
                </PageContent>
                <Footer />
            </React.Fragment>
        );
    }

    public async componentDidMount() {
        await this.props.offerActions.syncProductOfferStateWithLocation(this.props.location);
        this.trackPageLoad();
    }

    public async componentWillReceiveProps(nextProps: StateProps & OwnProps & DispatchProps) {
        if (!nextProps.hasMatchingProduct) {
            await this.props.offerActions.syncProductOfferStateWithLocation(this.props.location);
        }
        if (!this.props.loadingProduct && nextProps.hasMatchingProduct && !nextProps.offer) {
            this.props.errorActions.error(new SpecialOfferError(StatusCode.NotFound, "Special Offer Not Found"));
        }

        const currentLocation = this.props.location.pathname + this.props.location.search;
        const nextLocation = nextProps.location.pathname + nextProps.location.search;
        if (currentLocation !== nextLocation) {
            this.trackPageLoad();
        }
    }

    private trackPageLoad() {
        const contentUrl = this.props.location.query.contentUrl;
        this.props.offerActions.trackSpecialOfferPageView(contentUrl);
    }

    private renderLoading = () => (
        <div className={styles.loadingIndicator}>
            <CircularProgress />
        </div>
    );
}

function mapStateToProps(state: State, props: OwnProps) {
    const product = state.product.product;
    const offer = state.product?.specialOffers?.find((specialOffer) => specialOffer.promotionId === props.location.query.contentUrl);
    return {
        language: state.intl.language,
        hasMatchingProduct: (product && product.sku) === props.params.sku,
        loadingProduct: state.product.loadingProduct,
        productName: product && product.name,
        offer,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        offerActions: bindActionCreators(offerActionCreators, dispatch),
        errorActions: bindActionCreators(errorActionCreators, dispatch),
    };
}

export default connect<StateProps, DispatchProps, OwnProps>(
    mapStateToProps,
    mapDispatchToProps,
)(injectIntl(ProductOffersPage));
