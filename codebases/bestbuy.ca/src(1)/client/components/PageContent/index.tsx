import * as React from "react";
import {connect} from "react-redux";
import {navigationActionCreatorsFactory} from "@bbyca/apex-components";
import * as styles from "./style.css";
import {IBrowser} from "redux-responsive";
import {bindActionCreators} from "redux";
import {RoutingState} from "reducers";
import {NPSConfigs, NPSModalConfigs, NPSCookieConfigs, NPSSurvey} from "@bbyca/bbyca-components";
import {ApiLocationProvider} from "providers";
import {State} from "store";
import {AppActionCreators, appActionCreators, optInNPS} from "actions";
import {utils as adobeLaunch} from "@bbyca/adobe-launch";
import {getScreenSize} from "store/selectors";

export interface StateProps {
    country?: string;
    flyoutOverlay: boolean;
    locale: Locale;
    locationApiUrl: string;
    language: Language;
    npsExcludedPaths: string[];
    npsFeatureToggle: boolean;
    npsIdleBeforeNewVisitInSeconds: number;
    npsIntervalBetweenSurveysInSeconds: number;
    npsPageViewCountLimit: number;
    npsSamplingPercentage: number;
    npsSurveyUrl: string;
    npsCookieDomain: string;
    npsCookieMaxAge: number;
    routing: RoutingState;
    screenSize: IBrowser;
    npsSurveyOptIn: boolean;
}

export interface DispatchProps {
    appActions: AppActionCreators;
    toggleFlyoutOverlay: (open?: boolean) => (dispatch: any, getState: any) => void;
    optIn: () => any;
}

interface Props {
    disableNps?: boolean;
    extraProps?: object;
}

interface State {
    npsSurveyOptIn: boolean;
}

export class PageContent extends React.Component<Props & StateProps & DispatchProps, State> {
    private resizeTimeout: NodeJS.Timer;
    private THROTTLE_TIMEOUT = 2000;

    constructor(props: Props & StateProps & DispatchProps) {
        super(props);
    }

    public render() {
        return (
            <div className={`x-page-content ${styles.container}`} {...(this.props.extraProps || {})}>
                {this.props.children}
                {!this.props.disableNps && this.renderNpsSurveyModal()}
            </div>
        );
    }

    public componentDidMount() {
        this.setCountry();
        if (typeof window !== "undefined") {
            window.addEventListener("resize", this.throttleHideOverlay);
        }
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", this.throttleHideOverlay);
    }

    private renderNpsSurveyModal() {
        const {
            country,
            language,
            npsExcludedPaths,
            npsFeatureToggle,
            npsIdleBeforeNewVisitInSeconds,
            npsIntervalBetweenSurveysInSeconds,
            npsPageViewCountLimit,
            npsSamplingPercentage,
            npsSurveyUrl,
            npsCookieDomain,
            npsCookieMaxAge,
            npsSurveyOptIn,
        } = this.props;

        const npsConfigs: NPSConfigs = {
            baseSurveyUrl: npsSurveyUrl,
            excludedPaths: npsExcludedPaths,
            idleBeforeNewVisitInSeconds: npsIdleBeforeNewVisitInSeconds,
            intervalBetweenSurveysInSeconds: npsIntervalBetweenSurveysInSeconds,
            pageViewCountLimit: npsPageViewCountLimit,
            samplingPercentage: npsSamplingPercentage,
        };

        const npsModalConfigs: NPSModalConfigs = {
            language,
            modalClassName: styles.modalClassName,
        };

        const npsCookieConfigs: NPSCookieConfigs = {
            domain: npsCookieDomain,
            maxAge: npsCookieMaxAge,
        };

        const CANADA_COUNTRY_STRING = "Canada";

        if (npsFeatureToggle && country === CANADA_COUNTRY_STRING) {
            return (
                <div className="npsSurveyWrapper" data-automation="nps-survey-wrapper">
                    <NPSSurvey
                        npsConfigs={npsConfigs}
                        npsModalConfigs={npsModalConfigs}
                        npsCookieConfigs={npsCookieConfigs}
                        optIn={npsSurveyOptIn}
                        optInToggle={this.toggleOptIn}
                    />
                </div>
            );
        }
    }

    private toggleOptIn = () => {
        adobeLaunch.pushEventToDataLayer({
            event: "NPS_Survey_Sounds_Good",
        });
        this.props.optIn();
    };

    private throttleHideOverlay = () => {
        if (!this.resizeTimeout) {
            this.hideOverlay();
            this.resizeTimeout = setTimeout(() => {
                this.resizeTimeout = null;
            }, this.THROTTLE_TIMEOUT);
        }
    };

    private hideOverlay = () => {
        if (this.props.screenSize.lessThan.medium) {
            this.props.toggleFlyoutOverlay();
        }
    };

    private setCountry = async () => {
        const {country, locale, locationApiUrl, appActions} = this.props;

        if (country || !locationApiUrl || typeof window === "undefined") {
            // since server-side call, dodge dis window
            return;
        }

        const locationProvider = new ApiLocationProvider(locationApiUrl, locale);

        try {
            const location = await locationProvider.locate(false);
            appActions.setCountry(location.country);
        } catch (error) {
            return;
        }
    };
}

const toggleFlyoutOverlay = (open) => (dispatch) => {
    const navigationActionCreators = navigationActionCreatorsFactory({} as any);
    dispatch(navigationActionCreators.toggleFlyoutOverlay(open));
};

const mapStateToProps: MapStateToProps<StateProps, {}, State> = (state) => ({
    flyoutOverlay: state.navigation.flyoutOverlay,
    country: state.app.location.country,
    locale: state.intl.locale,
    locationApiUrl: state.config.dataSources.locationApiUrl,
    language: state.intl.language,
    npsExcludedPaths: state.config.npsSurvey.excludedPaths,
    npsFeatureToggle: state.config.npsSurvey.enabled,
    npsIdleBeforeNewVisitInSeconds: state.config.npsSurvey.idleBeforeNewVisitInSeconds,
    npsIntervalBetweenSurveysInSeconds: state.config.npsSurvey.intervalBetweenSurveysInSeconds,
    npsPageViewCountLimit: state.config.npsSurvey.pageViewCount,
    npsSamplingPercentage: state.config.npsSurvey.samplingPercentage,
    npsCookieDomain: state.config.npsSurvey.cookieConfigs.domain,
    npsCookieMaxAge: state.config.npsSurvey.cookieConfigs.maxAge,
    npsSurveyUrl: state.config.npsSurvey.npsSurveyUrl[state.intl.language],
    npsSurveyOptIn: state.config.npsSurvey.isOptIn,
    routing: state.routing,
    screenSize: getScreenSize(state)
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = (dispatch) => ({
    appActions: bindActionCreators(appActionCreators, dispatch),
    toggleFlyoutOverlay: bindActionCreators(toggleFlyoutOverlay, dispatch),
    optIn: () => dispatch(optInNPS()),
});

export default connect<StateProps, DispatchProps, {}, State>(mapStateToProps, mapDispatchToProps)(PageContent);
