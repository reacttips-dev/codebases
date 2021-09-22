import * as React from "react";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {IBrowser as ScreenSize} from "redux-responsive";
import {SingleColumn} from "pages/PageLayouts";
import {DynamicContentFeatureToggles} from "config/featureToggles";
import {HomePageLayout} from "../";
import {ClientConfig, ServerConfig} from "../../../../../config";
import {
    homeActionCreators,
    HomeActionCreators,
    routingActionCreators,
    RoutingActionCreators,
    adActionCreators,
    AdActionCreators,
} from "../../../../actions";
import HeadTags from "../../../../components/HeadTags";
import {HomePageState, AppMode} from "../../../../models";
import {RoutingState} from "../../../../reducers";
import {State as StoreState} from "../../../../store";
import routeManager from "../../../../utils/routeManager";
import messages from "../../translations/messages";
import * as styles from "./style.css";
import {isMobileApp} from "../../../../utils/isMobileApp";
import {getScreenSize} from "store/selectors";

export interface StateProps {
    language: Language;
    routing: RoutingState;
    config: ClientConfig & ServerConfig;
    homePage: HomePageState;
    isStandalone: boolean;
    regionName: string;
    screenSize: ScreenSize;
    appMode: AppMode;
    appEnv: string;
    locale: Locale;
    adBlockerIsActive: boolean;
    dynamicContentFeatureToggles: DynamicContentFeatureToggles;
}

export interface DispatchProps {
    actions: HomeActionCreators;
    adActions: AdActionCreators;
    routingActions: RoutingActionCreators;
}

export class HomePage extends React.Component<DispatchProps & StateProps & InjectedIntlProps, {}> {
    private imageElementCount: number;
    private loadedImageElementCount: number;

    constructor(props: (DispatchProps & StateProps & InjectedIntlProps)) {
        super(props);
        this.imageElementCount = 0;
        this.loadedImageElementCount = 0;
    }

    public render() {
        const canonical = routeManager.getCanonicalUrlByKey(this.props.language, "homepage");
        const links = [];
        if (canonical) {
            links.push({rel: "canonical", href: canonical});
        }

        const {content} = this.props.homePage;

        const description =
            (content && content.seo && content.seo.description) ||
            this.props.intl.formatMessage(messages.description) ||
            "";
        const title =
            (content && content.seo && content.seo.headerTitle) || this.props.intl.formatMessage(messages.title);

        const metaTags = [{name: "description", content: description}];

        return (
            <>
                <HeadTags title={title} links={links} metaTags={metaTags} />
                <div className={styles.pageContentContainer}>
                    <SingleColumn.Container isStandalone={this.props.isStandalone}>
                        {content && (
                            <HomePageLayout
                                appEnv={this.props.appEnv}
                                content={this.props.homePage.content}
                                screenSize={this.props.screenSize}
                                regionName={this.props.regionName}
                                isMobileApp={isMobileApp(this.props.appMode)}
                                loading={this.props.homePage.loading}
                                language={this.props.language}
                                locale={this.props.locale}
                                updateDynamicContentAdStatus={this.props.adActions.adLoaded}
                                dynamicContentFeatureToggles={this.props.dynamicContentFeatureToggles}
                            />
                        )}
                    </SingleColumn.Container>
                </div>
            </>
        );
    }

    public componentWillMount() {
        if (typeof window !== "undefined") {
            (window as any).addEventListener("RegisterImageElement", this.imageEventHandler);
            (window as any).addEventListener("LoadedImageElement", this.imageEventHandler);
        }
    }

    public async componentDidMount() {
        if (!this.isHomepageError() && !this.isHomePageContentLoaded()) {
            await this.props.actions.loadContent(this.props.routing.locationBeforeTransitions);
        }

        if (this.isHomepageError()) {
            this.props.actions.retryGetHomepage();
        }

        this.props.actions.trackHomePageLoad();

        this.props.routingActions.setAltLangHrefs({
            altLangUrl: routeManager.getAltLangPathByKey(this.props.language, "homepage"),
            curLangUrl: routeManager.getCurrLang(this.props.routing.locationBeforeTransitions.pathname),
        });
    }

    public componentWillUnmount() {
        window.removeEventListener("RegisterImageElement", this.imageEventHandler);
        window.removeEventListener("LoadedImageElement", this.imageEventHandler);
    }

    private imageEventHandler = (e: { type: any; }) => {
        const {type} = e;
        if (type === "RegisterImageElement") {
            this.imageElementCount++;
        } else {
            this.loadedImageElementCount++;
        }

        if (this.imageElementCount === this.loadedImageElementCount) {
            this.sendNativeLinkRequest({
                actionData: "loaded",
                actionType: "home",
            });
        }
    };

    private sendNativeLinkRequest = (data: any) => {
        const isApp = isMobileApp(this.props.appMode);
        const isIOS = /iphone|ipod|ipad/i.test(navigator.userAgent);
        const isAndroid = /(android)/i.test(navigator.userAgent);
        try {
            if (isAndroid && isApp) {
                (BBYWebViewJavaScriptInterface as any).loadScreen(JSON.stringify(data));
            } else if (isIOS && isApp) {
                (webkit as any).messageHandlers.messageReciever.postMessage(data);
            }
        } catch (error) {
            return false;
        }
    };

    private isHomePageContentLoaded(): boolean {
        return !!(this.props.homePage && this.props.homePage.content);
    }

    private isHomepageError(): boolean {
        return !!(this.props.homePage.error && this.props.homePage.error.error);
    }
}

const mapStateToProps = (state: StoreState) => {
    return {
        config: state.config,
        homePage: state.homePage,
        isStandalone: state.routing.pageKey === "homepageStandalone",
        language: state.intl.language,
        locale: state.intl.locale,
        regionName: state.user.shippingLocation.regionName,
        routing: state.routing,
        screenSize: getScreenSize(state),
        appMode: state.app.environment.appMode,
        appEnv: state.app.environment.appEnv,
        adBlockerIsActive: state.app.adBlockerIsActive,
        dynamicContentFeatureToggles: state.config.features.dynamicContentFeatureToggles,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        actions: bindActionCreators(homeActionCreators, dispatch),
        adActions: bindActionCreators(adActionCreators, dispatch),
        routingActions: bindActionCreators(routingActionCreators, dispatch),
    };
};

export default connect<StateProps, DispatchProps, {}>(mapStateToProps, mapDispatchToProps)(injectIntl(HomePage));
