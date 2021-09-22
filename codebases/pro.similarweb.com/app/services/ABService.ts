import { Injector } from "common/ioc/Injector";

declare global {
    interface Window {
        vwoParamTrackLink: boolean;
        vwoSkipFirstArena: boolean;
        vwoNewGeneralHookPopup: boolean;
        vwoSuggestionsWidget: boolean;
        vwoShowTrendsFirst: boolean;
        vwoDMIHomepageVariation: string;
        _vwo_code: any;
        _vwo_exp: any;
        _vis_opt_experiment_id: any;
        _vis_opt_readCookie: any;
        _vis_opt_comb_name: any;
        // Trackers
        _paq: any;
        similarweb: any;
        ga: any;
        Intercom: any;
        mixpanel: any;
        MunchkinAsync: any;
    }
}

export enum EVwoDMIHomepageVariation {
    Control,
    Variation1,
    Variation2,
}

interface Flags {
    trackLink: boolean;
    isNewSearchKeywordsFilters: boolean;
    vwoSkipFirstArena: boolean;
    vwoNewGeneralHookPopup: boolean;
    vwoSuggestionsWidget: boolean;
    vwoShowTrendsFirst: boolean;
    vwoAutoExpandTableRow: boolean;
    vwoDMIHomepageVariation: EVwoDMIHomepageVariation;
}

let flags: Flags;

export default class ABService {
    public static getFlag<FlagKey extends keyof Flags>(flag: FlagKey): Flags[FlagKey] {
        return flags[flag];
    }

    private params = {};

    constructor() {
        // VWO Tracking
        if (window._vwo_code) {
            if (!window._vwo_code.finished()) {
                const origFinish = window._vwo_code.finish;
                window._vwo_code.finish = () => {
                    origFinish();
                    this.trackVwoNew();
                };
            } else {
                this.trackVwoNew();
            }
        }
        this.setFlags();
    }

    public setParam = (key, value) => {
        this.params[key] = value;
    };

    public getParam = (key) => this.params[key];

    public applyChanges = () => {
        const $rootScope: any = Injector.get("$rootScope");
        $rootScope.global = this.params;
        $rootScope.$digest();
    };

    private setFlags() {
        const isRunning = ABService.isVwoRunning();
        const expObject = isRunning ? window._vwo_exp[window._vis_opt_experiment_id] : {};
        flags = {
            trackLink: window.vwoParamTrackLink,
            isNewSearchKeywordsFilters: expObject.combination_chosen === "2",
            vwoSkipFirstArena: window.vwoSkipFirstArena,
            vwoNewGeneralHookPopup: window.vwoNewGeneralHookPopup,
            vwoSuggestionsWidget: window.vwoSuggestionsWidget,
            vwoShowTrendsFirst: window.vwoShowTrendsFirst,
            vwoAutoExpandTableRow: undefined,
            vwoDMIHomepageVariation: window.vwoDMIHomepageVariation
                ? Number(window.vwoDMIHomepageVariation)
                : EVwoDMIHomepageVariation.Control,
        };
    }

    static isVwoRunning() {
        return window._vwo_exp && window._vis_opt_experiment_id in window._vwo_exp;
    }

    static getABTestData(): {
        experimentId: string;
        experimentName: string;
        variationName: string;
        variationId: string | number;
    } {
        const experimentId = window._vis_opt_experiment_id;
        const experiment = window._vwo_exp[experimentId];
        const combId =
            experiment.combination_chosen ||
            window._vis_opt_readCookie("_vis_opt_exp_" + experimentId + "_combi");
        const combName = window._vis_opt_comb_name[combId];
        return {
            experimentId,
            experimentName: experiment.name,
            variationName: combName,
            variationId: combId,
        };
    }

    private trackVwoNew() {
        if (ABService.isVwoRunning()) {
            const {
                experimentId,
                experimentName,
                variationName,
                variationId,
            } = ABService.getABTestData();
            // eslint:disable-next-line:no-unused-expression
            window._paq &&
                window._paq.push([
                    "setCustomVariable",
                    5,
                    "VWO-" + experimentId,
                    variationName,
                    "page",
                ]);
            // set mixpanel super properties for vwo campaigns
            if (window.hasOwnProperty("mixpanel")) {
                if (experimentId) {
                    window.mixpanel.register({
                        [`ab_test_name`]: `VWO-${experimentId}`,
                        [`ab_test_value`]: variationName,
                        [`ab_test_variation_id`]: variationId,
                    });
                }
            }
        }
    }
}

const FroMarketingOnboardVariations = {
    OnlyProductTour: "ONLY_PRODUCT_TOUR",
    VideoAndProductTour: "VIDEO_AND_PRODUCT_TOUR",
};

// TODO: remove when AB testing is finished
// eslint:disable-next-line:max-classes-per-file
export class FroMarketingWelcomeScreen {
    public IsAvailable() {
        return !!this.GetFroMarketingWelcomeScreen();
    }

    public IsOnlyProductTour() {
        return (
            this.GetFroMarketingWelcomeScreen() === FroMarketingOnboardVariations.OnlyProductTour
        );
    }

    public IsVideoAndProductTour() {
        return (
            this.GetFroMarketingWelcomeScreen() ===
            FroMarketingOnboardVariations.VideoAndProductTour
        );
    }

    private GetFroMarketingWelcomeScreen() {
        return window["vwoFroMarketingWelcomeScreen"];
    }
}
