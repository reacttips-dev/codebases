import Divider from "@material-ui/core/Divider";
import {ChevronRight} from "@bbyca/bbyca-components";
import * as React from "react";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {connect, MapStateToProps, MapDispatchToProps} from "react-redux";
import {bindActionCreators} from "redux";
import {IBrowser as ScreenSize} from "redux-responsive";
import Link from "components/Link";
import {RoutingState, SellerState, BazaarVoiceJSState, SellerWithReviews} from "reducers";
import {
    routingActionCreators,
    RoutingActionCreators,
    sellerActionCreators,
    SellerActionCreators,
    BazaarVoiceJSActionCreators,
    bazaarVoiceJSActionCreators,
} from "actions";
import Header from "components/Header";
import OverallRatingSummary from "components/OverallRatingSummary";
import TitleHeader from "components/TitleHeader";
import {decodeHTMLEntities} from "utils/decodeString";
import HeadTags from "components/HeadTags";
import Footer from "components/Footer";
import {Policy} from "../../components/Policy";
import {SellerPolicy} from "../../components/SellerPolicy";
import {SellerProfilePlaceholder} from "../SellerProfilePage/components/SellerProfilePlaceholder/index";
import * as styles from "./style.css";
import messages from "./translations/messages";
import {Tabs, TabItem, TabStyle} from "Decide/components/Tabs";
import {SellerReviews} from "./components/SellerReviews";
import {Col, Grid, Row} from "@bbyca/bbyca-components";
import {
    convertLocaleToBazaarVoiceLocale,
    sendProductContentCollection,
    convertSellerToBVProductCatalogue,
} from "utils/productContentCollection";
import {BazaarVoice, StaticUrls, FeatureToggles} from "config";
import {State} from "store";
import PageContent from "components/PageContent";
import {isEqual} from "lodash-es";
import {getScreenSize} from "store/selectors";

export interface StateProps
    extends SellerState,
        Pick<StaticUrls, "bestbuyLogoUrl">,
        Pick<FeatureToggles, "bazaarvoiceSellerReviewsEnabled"> {
    language: Language;
    routing: RoutingState;
    screenSize: ScreenSize;
    standalone: boolean;
    bazaarvoiceConfig: BazaarVoice;
    locale: Locale;
    bazaarVoiceJS: BazaarVoiceJSState;
}

export interface DispatchProps {
    actions: SellerActionCreators;
    routingActions: RoutingActionCreators;
    bazaarVoiceJSActions: BazaarVoiceJSActionCreators;
}

export enum SellerProfileTabId {
    ShippingDetails = "shippingDetails",
    ReturnPolicy = "returnPolicy",
    CustomerReviews = "customerReviews",
}

export type SellerProfilePageProps = StateProps & DispatchProps & InjectedIntlProps;

export class SellerProfilePage extends React.Component<SellerProfilePageProps> {
    private scripts: Array<{src: string; async: boolean | undefined}> = [];
    constructor(props: SellerProfilePageProps) {
        super(props);

        if (this.props.bazaarvoiceConfig.seller.ratingsAndReviews.src) {
            this.scripts.push({
                src: this.props.bazaarvoiceConfig.seller.ratingsAndReviews.src.replace(
                    "-locale-",
                    convertLocaleToBazaarVoiceLocale(this.props.locale),
                ),
                async: this.props.bazaarvoiceConfig.seller.ratingsAndReviews.async,
            });
        }

        this.props.bazaarVoiceJSActions.loadedSellerReviewsJS();
    }

    public render() {
        const {screenSize, seller} = this.props;
        const shouldRenderPlaceholder = !seller || !seller.reviews;
        if (shouldRenderPlaceholder) {
            return (
                <div>
                    {!this.props.standalone && <Header />}
                    <SellerProfilePlaceholder />
                    <Footer />
                </div>
            );
        }
        const {id} = seller;
        const reviews = seller.reviews.reviews || [];
        const {score, reviewsCount} = seller.rating;
        let tabStyle: TabStyle;
        if (screenSize?.greaterThan?.small) {
            tabStyle = TabStyle.horizontal;
        } else {
            tabStyle = TabStyle.vertical;
        }

        return (
            <div className={styles.container}>
                {this.generateHeadTags()}
                {!this.props.standalone && <Header />}
                <PageContent>
                    {!this.props.standalone && screenSize.is.extraSmall && <Divider className={styles.backDivider} />}
                    <div className={styles.content}>
                        <Grid className={styles.grid}>
                            <Row>
                                <Col xs={12} sm={12} md={8}>
                                    <div className={styles.titleHeader}>
                                        <TitleHeader title={decodeHTMLEntities(seller.name)} />
                                    </div>
                                    <div className={styles.ratingContainer} data-automation="overall-rating">
                                        <OverallRatingSummary rate={score} count={reviewsCount} />
                                        <p
                                            className={styles.sellerDescription}
                                            dangerouslySetInnerHTML={{__html: seller.description}}
                                        />
                                        <div className={styles.seeAllProducts}>
                                            <Link
                                                to={"search"}
                                                query={this.buildSearchQuery()}
                                                extraAttrs={{"data-automation": "seeAllProductsLink"}}>
                                                {this.props.intl.formatMessage(messages.seeAllProducts)}
                                                <ChevronRight className={`${styles.rightArrowIcon} ${styles.icon}`} />
                                            </Link>
                                        </div>
                                    </div>
                                    <Tabs tabStyle={tabStyle} className={styles.tabContainer}>
                                        <TabItem
                                            tabLabel={this.props.intl.formatMessage(messages.shippingDetailsTabTitle)}
                                            dataAutomation="seller-shipping-details-tab"
                                            id={SellerProfileTabId.ShippingDetails}
                                            className={styles.tabItemContainer}>
                                            <div className={styles.summaryContainer}>
                                                {seller.policies && seller.policies.shipping && (
                                                    <SellerPolicy
                                                        sku={id}
                                                        customLink="Seller Review: Shipping Details Impression">
                                                        <Policy html={seller.policies.shipping} />
                                                    </SellerPolicy>
                                                )}
                                            </div>
                                        </TabItem>
                                        <TabItem
                                            tabLabel={this.props.intl.formatMessage(messages.returnPolicyTabTitle)}
                                            dataAutomation="seller-return-policy-tab"
                                            id={SellerProfileTabId.ReturnPolicy}
                                            className={styles.tabItemContainer}>
                                            <div className={styles.summaryContainer}>
                                                {seller.policies && seller.policies.return && (
                                                    <SellerPolicy
                                                        sku={id}
                                                        customLink="Seller Review: Return Policy Impression">
                                                        <Policy html={seller.policies.return} />
                                                    </SellerPolicy>
                                                )}
                                            </div>
                                        </TabItem>
                                        <TabItem
                                            tabLabel={this.props.intl.formatMessage(messages.customerReviewsTabTitle)}
                                            dataAutomation="seller-customer-reviews-tab"
                                            id={SellerProfileTabId.CustomerReviews}
                                            className={styles.tabItemContainer}>
                                            <SellerReviews
                                                reviews={reviews}
                                                sellerId={id}
                                                bazaarvoiceSellerReviewsEnabled={
                                                    this.props.bazaarvoiceSellerReviewsEnabled
                                                }
                                            />
                                        </TabItem>
                                    </Tabs>
                                </Col>
                            </Row>
                        </Grid>
                    </div>
                </PageContent>
                <Footer />
            </div>
        );
    }

    public componentDidMount() {
        // Due to technical limitation of BV scripts to replace another BV script's context forces
        // best buy to reload the page when cross script page visit happens in SPA. This is a
        // temporary fix which will be addressed by either BV or BBY moving to use BV API.
        if (this.props.bazaarVoiceJS.isloadedProductReviewsJS && this.props.bazaarvoiceSellerReviewsEnabled) {
            location.reload();
        }

        this.props.actions.syncSellerProfileStateWithLocation(this.props.routing.locationBeforeTransitions);
        this.props.actions.sellerProfilePageLoad();
        if (this.props.seller && this.props.seller.id && this.props.bazaarvoiceSellerReviewsEnabled) {
            this.sendDCCDataToBazaarVoice(this.props.seller, this.props.bestbuyLogoUrl, this.props.locale);
        }
    }

    public componentWillReceiveProps(nextProps: SellerProfilePageProps) {
        if (
            this.props.bazaarvoiceSellerReviewsEnabled !== nextProps.bazaarvoiceSellerReviewsEnabled &&
            this.props.bazaarVoiceJS.isloadedProductReviewsJS
        ) {
            location.reload();
        }

        if (
            !isEqual(this.props.seller, nextProps.seller) &&
            this.props.seller &&
            this.props.seller.id &&
            this.props.bazaarvoiceSellerReviewsEnabled
        ) {
            this.sendDCCDataToBazaarVoice(nextProps.seller, this.props.bestbuyLogoUrl, this.props.locale);
        }
    }

    private sendDCCDataToBazaarVoice(seller: SellerWithReviews, bestbuyLogoUrl: string, locale: Locale) {
        const sellerObj = {
            id: seller.id,
            imageUrl: bestbuyLogoUrl,
            name: seller.name,
            description: seller.description,
        };
        const bvProductCatalogue = convertSellerToBVProductCatalogue(sellerObj);
        sendProductContentCollection(bvProductCatalogue, locale);
    }

    private generateHeadTags = () => {
        const title = `${decodeHTMLEntities(this.props.seller.name)} ${this.props.intl.formatMessage(
            messages.headTitle,
        )}`;

        return <HeadTags title={title} scripts={this.scripts} />;
    };

    private buildSearchQuery = () => {
        const encodedSellerName = encodeURIComponent(decodeHTMLEntities(this.props.seller.name))
            .replace(/\%20/g, "+")
            .replace(/\'/g, "%27");

        return {
            path: encodeURIComponent("sellerName:") + encodedSellerName,
        };
    };
}

const mapStateToProps: MapStateToProps<StateProps, {}, State> = (state) => {
    return {
        language: state.intl.language,
        routing: state.routing,
        screenSize: getScreenSize(state),
        standalone: state.app.environment.standalone,
        locale: state.intl.locale,
        bazaarvoiceConfig: state.config.bazaarvoice,
        bazaarVoiceJS: state.bazaarVoiceJS,
        bestbuyLogoUrl: state.config.staticUrls.bestbuyLogoUrl,
        bazaarvoiceSellerReviewsEnabled: state.config.features.bazaarvoiceSellerReviewsEnabled,
        ...state.seller,
    };
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = (dispatch) => {
    return {
        actions: bindActionCreators(sellerActionCreators, dispatch),
        routingActions: bindActionCreators(routingActionCreators, dispatch),
        bazaarVoiceJSActions: bindActionCreators(bazaarVoiceJSActionCreators, dispatch),
    };
};

export default connect<StateProps, DispatchProps, {}, State>(
    mapStateToProps,
    mapDispatchToProps,
)(injectIntl(SellerProfilePage));
