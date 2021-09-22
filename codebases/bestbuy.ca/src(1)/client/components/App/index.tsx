import Loader from "@bbyca/ecomm-webapp-content/dist/components/Loader";
import Snackbar from "components/Snackbar";
import "normalize.css/normalize.css";
import * as React from "react";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import {
    AppActionCreators,
    appActionCreators,
    ErrorActionCreators,
    errorActionCreators,
    globalContentActionCreators,
    GlobalContentActionCreators,
    NotificationActionCreators,
    notificationActionCreators,
    AppActions,
} from "../../actions";
import {GlobalCMSContexts, ContextItemTypes, GlobalContentState, AppMode, convertLocaleToLang} from "../../models";
import {ErrorState as ErrorProps, NotificationState as NotificationProps, RoutingState} from "../../reducers";
import {State} from "../../store";
import Error from "../Error";
import HeadTags from "../HeadTags";
import bestBuyTheme from "../Themes/BestBuyTheme";
import * as styles from "./style.css";
import messages from "./translations/messages";
import {MuiThemeProvider, createMuiTheme} from "@material-ui/core/styles";
import GlobalContent, {getPencilBannerContext} from "components/GlobalContent";
import {PromotionalBadges} from "models/PromotionalBadges";
import WebVitalsMetrics from "components/WebVitalsMetrics";
import DateOverride from "components/banners/components/DateOverride";
import ABTestAdSlot from "components/ABTestAdSlot";
import {AdName} from "components/Advertisement";
import {TestPencilAdIds} from "config";
import {PencilAdsABCDTest} from "config/featureToggles";
import {GoogleAds} from "reducers/adReducer";

export interface BadgePromotionGroup {
    priority: number;
    skus: string[];
    en: string;
    fr: string;
    applyConditions: boolean;
}

export enum strategies {
    replaceStore = "replace_store",
    extendStore = "extend_store",
    promoBadges = "promo_badges",
}

export interface Enhancement<T> {
    areas: string;
    strategy: strategies;
    products: T;
    [key: string]: any;
}

export interface StoreUpdate {
    path: string;
    data: any;
    updateType: strategies;
}

interface StateProps {
    appEnv: string;
    locale: Locale;
    routing: RoutingState;
    muiUserAgent: string;
    standalone: boolean;
    viewCart: boolean;
    globalContent: GlobalContentState;
    appMode: AppMode;
    testPencilAdIds: TestPencilAdIds;
    pencilAdsABCDTest: PencilAdsABCDTest;
    googleAds: GoogleAds;
    isAdBlockerActive: boolean;
}

interface Props {
    errors: ErrorProps;
    isQueueItEnabled: boolean;
    isContentProofingEnabled: boolean;
    notification: NotificationProps;
}

interface DispatchProps {
    appActions: AppActionCreators;
    errorActions: ErrorActionCreators;
    globalContentActions: GlobalContentActionCreators;
    notificationActions: NotificationActionCreators;
}

interface State {
    isPencilAdLoading: boolean;
    hasPencilAdLoaded: boolean;
}

export class App extends React.Component<Props & StateProps & DispatchProps & InjectedIntlProps, State> {
    constructor(props) {
        super(props);
        this.state = {
            isPencilAdLoading: true,
            hasPencilAdLoaded: false,
        };
    }
    public render() {
        const {routing, globalContent} = this.props;
        const pageKey = routing.pageKey;
        const links = routing && this.setAltLangTags(routing, this.props.locale);
        return (
            <MuiThemeProvider
                theme={createMuiTheme(bestBuyTheme())}
                sheetsManager={typeof window === "undefined" ? new Map() : undefined}>
                <div className={styles.container}>
                    <HeadTags
                        title={this.props.intl.formatMessage(messages.title)}
                        links={links}
                        isQueueItEnabled={this.props.isQueueItEnabled}
                    />

                    <GlobalContent context={GlobalCMSContexts.sitewide} contentType={ContextItemTypes.flexMessage} />
                    {pageKey &&
                        !this.state.isPencilAdLoading &&
                        (!this.loadPencilAdsABCDTest() || !this.state.hasPencilAdLoaded) && (
                            <GlobalContent
                                context={getPencilBannerContext(pageKey, globalContent)}
                                contentType={ContextItemTypes.pencilBanner}
                            />
                        )}
                    {this.loadPencilAdsABCDTest()}
                    <WebVitalsMetrics />
                    {this.props.errors.shouldDisplay ? <Error /> : this.props.children}
                    {this.props.viewCart && (
                        <div className={styles.pageLoader}>
                            <Loader isLoading={this.props.viewCart}></Loader>
                        </div>
                    )}
                    <Snackbar notification={this.props.notification} handleRequestClose={this.handleRequestClose} />
                </div>
                {this.props.isContentProofingEnabled && <ContentProofing />}
            </MuiThemeProvider>
        );
    }

    public componentDidMount() {
        document.addEventListener("enhancements-loaded", this.enhancementsLoadedHandler.bind(this));
        // TODO: figure out why client side is not regenerating proper styling with right jss counter
        // const jssStyles = document.getElementById("jss-server-side");
        // if (jssStyles && jssStyles.parentNode) {
        //     jssStyles.parentNode.removeChild(jssStyles);
        // }
        this.getFeatureTogglesFromStorage();
        this.props.appActions.setAdBlockerIsActive();
    }

    public componentWillUnmount() {
        document.removeEventListener("enhancements-loaded", this.enhancementsLoadedHandler.bind(this));
    }

    public componentDidUpdate(prevProps) {
        if (prevProps.routing.pageKey !== this.props.routing.pageKey) {
            this.setState({
                isPencilAdLoading: true,
                hasPencilAdLoaded: false,
            });
        }
        if (prevProps.googleAds !== this.props.googleAds && this.props.googleAds[this.getPencilAdsABCDTestId() || ""]) {
            this.setState({
                isPencilAdLoading: false,
                hasPencilAdLoaded: this.props.googleAds[this.getPencilAdsABCDTestId() || ""].adRendered,
            });
        }
    }

    private getPencilAdsABCDTestId = () => {
        const {routing} = this.props;
        const pageKey = routing.pageKey;
        if (
            this.props.pencilAdsABCDTest === PencilAdsABCDTest.browseOnly ||
            this.props.pencilAdsABCDTest === PencilAdsABCDTest.browseAndPDP
        ) {
            if (pageKey === "category") {
                return this.props.testPencilAdIds?.category;
            } else if (pageKey === "search") {
                return this.props.testPencilAdIds?.search;
            } else if (pageKey === "collection") {
                return this.props.testPencilAdIds?.collection;
            } else if (pageKey === "eventMarketing") {
                return this.props.testPencilAdIds?.marketing;
            }
        }
        if (this.props.pencilAdsABCDTest === PencilAdsABCDTest.browseAndPDP) {
            if (pageKey === "product") {
                return this.props.testPencilAdIds?.pdp;
            }
        }
        return;
    };

    private loadPencilAdsABCDTest = () => {
        const adSlotContainerId = this.getPencilAdsABCDTestId();
        if (!adSlotContainerId || this.props.pencilAdsABCDTest === PencilAdsABCDTest.control || this.props.isAdBlockerActive) {
            if (this.state.isPencilAdLoading) {
                this.setState({isPencilAdLoading: false, hasPencilAdLoaded: false});
            }
            return;
        }
        return (
            <div className={styles.pencilAdABCDTestContainer}>
                <ABTestAdSlot adName={AdName.pencilAd} adSlotContainerId={adSlotContainerId} />
            </div>
        );
    };

    private getFeatureTogglesFromStorage() {
        const featureToggles = JSON.parse(window.localStorage.getItem("toggles") as string);
        if (featureToggles && featureToggles.length) {
            this.props.appActions.batchUpdateStore(
                featureToggles.map(({areas, strategy, products}: Enhancement<any>) => ({
                    path: areas,
                    data: products,
                    updateType: strategy,
                })),
            );
        }
    }

    private saveFeatureTogglesToStorage(arr: Array<Enhancement<any>>) {
        const storedToggles = JSON.parse(window.localStorage.getItem("toggles") as string);
        if (storedToggles !== arr) {
            const featureToggles = JSON.stringify(arr);
            window.localStorage.setItem("toggles", featureToggles);
        }
    }

    private enhancementsLoadedHandler(e: CustomEvent) {
        const {enhancements = []}: {enhancements: Array<Enhancement<any>>} = e.detail || {};
        const featureToggles: Array<Enhancement<any>> = [];
        const storeUpdates: StoreUpdate[] = [];

        if (enhancements && enhancements.length) {
            const productBadges = createPromotionalBadges(enhancements, convertLocaleToLang(this.props.locale));
            enhancements
                .filter((value) => value.strategy !== strategies.promoBadges)
                .concat(productBadges || [])
                .forEach(({strategy, areas, content_type, entry_id, ...rest}) => {
                    if (strategy === strategies.replaceStore || strategy === strategies.extendStore) {
                        if (content_type && entry_id) {
                            this.props.appActions.personalizeContent(areas, content_type, entry_id, strategy);
                        } else {
                            storeUpdates.push({
                                path: areas,
                                data: rest.products,
                                updateType: strategy,
                            });
                            if (areas === "config.features") {
                                featureToggles.push({
                                    areas,
                                    ...rest,
                                    strategy,
                                });
                            }
                        }
                    }
                });
        }
        if (storeUpdates.length) {
            this.props.appActions.batchUpdateStore(storeUpdates);
        }
        this.saveFeatureTogglesToStorage(featureToggles);
    }

    private handleRequestClose = () => {
        this.props.notificationActions.close();
    };

    private setAltLangTags = (route: RoutingState, locale: Locale): any => {
        const currentLang = {
            href: route.curLangUrl,
            hrefLang: locale === "fr-CA" ? "fr-ca" : "en-ca",
            rel: "alternate",
        };

        const altLang = route.altLangUrl && {
            href: route.altLangUrl,
            hrefLang: locale === "fr-CA" ? "en-ca" : "fr-ca",
            rel: "alternate",
        };

        return [currentLang, altLang];
    };
}

const ContentProofing: React.FC = () => {
    if (typeof window !== "undefined" && window.location.search.toLowerCase().indexOf("contentproofing=true") >= 0) {
        return <DateOverride />;
    }
    return null;
};

const createPromotionalBadges = (enhancements: Array<Enhancement<any>>, locale: Language) => {
    const productBadges: Enhancement<PromotionalBadges> = (enhancements.filter(
        (value) => value.strategy === strategies.promoBadges,
    ) as [Enhancement<BadgePromotionGroup>])
        .sort((badgePromo1, badgePromo2) => badgePromo2.products.priority - badgePromo1.products.priority)
        .reduce(
            (acc: Enhancement<PromotionalBadges>, curr) => {
                acc.areas = curr.areas;
                curr.products.skus.forEach(
                    (sku) =>
                        (acc.products[sku] = {
                            text: curr.products[locale],
                            applyConditions:
                                curr.products.applyConditions === undefined ? true : curr.products.applyConditions,
                        }),
                );
                return acc;
            },
            {
                strategy: strategies.extendStore,
                products: {},
                areas: "promotionalBadges",
            },
        );
    return Object.keys(productBadges.products).length > 0 ? productBadges : null;
};

const mapStateToProps = (state: State): StateProps & Props => ({
    appEnv: state.app.environment.appEnv,
    errors: state.errors,
    isQueueItEnabled: !!state.config.remoteConfig && state.config.remoteConfig.isQueueItEnabled,
    locale: state.intl.locale,
    muiUserAgent: state.app.environment.muiUserAgent,
    appMode: state.app.environment.appMode,
    globalContent: state.app.globalContent,
    notification: state.notification,
    routing: state.routing,
    standalone: state.routing.pageKey === "homepageStandalone" || state.app.environment.standalone,
    viewCart: state.navigation.viewCart,
    isContentProofingEnabled: state.config.isContentProofingEnabled,
    testPencilAdIds: state.config.testPencilAdIds,
    pencilAdsABCDTest: state.config.features.pencilAdsABCDTest,
    googleAds: state.ads.googleAds,
    isAdBlockerActive: state.app.adBlockerIsActive,
});

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    appActions: bindActionCreators(appActionCreators, dispatch),
    errorActions: bindActionCreators(errorActionCreators, dispatch),
    globalContentActions: bindActionCreators(globalContentActionCreators, dispatch),
    notificationActions: bindActionCreators(notificationActionCreators, dispatch),
});

export default connect<StateProps, DispatchProps, Props, State>(mapStateToProps, mapDispatchToProps)(injectIntl(App));
