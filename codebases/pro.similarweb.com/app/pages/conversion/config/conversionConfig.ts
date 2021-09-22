import swLog from "@similarweb/sw-log/index";
import { receiveSegments, requestSegments } from "actions/conversionModuleActions";
import { Injector } from "common/ioc/Injector";
import NgRedux from "ng-redux";
import { SecondaryBarType } from "reducers/_reducers/SecondaryBarReducer";
import { ConversionSegmentsService } from "services/conversion/ConversionSegmentsService";
import { ConversionQueryBar } from "../ConversionQueryBar";
import ConversionSegmentsQueryBar from "../ConversionSegmentsQueryBar";

function getSegments() {
    return async () => {
        try {
            const { conversionModule } = Injector.get<NgRedux.INgRedux>("$ngRedux").getState();
            if (conversionModule.segments) {
                return true;
            }
            Injector.get<NgRedux.INgRedux>("$ngRedux").dispatch(requestSegments());
            await ConversionSegmentsService.getInstance()
                .getAllSegmentsData()
                .then((segments) => {
                    Injector.get<NgRedux.INgRedux>("$ngRedux").dispatch(receiveSegments(segments));
                })
                .catch((error) => {
                    swLog.error("request failed", error);
                });
            return true;
        } catch (e) {
            swLog.error("request failed", e);
            return true;
        }
    };
}

export const conversionConfig = {
    conversion: {
        parent: "sw",
        abstract: true,
        url: "/conversion",
        templateUrl: "/app/pages/conversion/conversionRoot.html",
        configId: "Conversion",
        resolve: {
            segments: getSegments(),
        },
        secondaryBarType: "ConversionAnalysis" as SecondaryBarType,
        fallbackStates: {
            marketresearch: "marketresearch-home",
            digitalmarketing: "digitalmarketing-home",
            legacy: "websites_root-home",
        },
    },
    "conversion-homepage": {
        parent: "sw",
        url: "/conversion/home",
        templateUrl: "/app/pages/conversion/conversionHomepage.html",
        configId: "Conversion",
        resolve: {
            segments: getSegments(),
        },
        pageId: {
            section: "conversion",
            subSection: "homepage",
        },
        trackingId: {
            section: "Funnel Analysis",
            subSection: "homepage",
            subSubSection: "",
        },
        pageTitle: "conversion.homepage.title",
    },
    "conversion-wizard": {
        parent: "sw",
        url: "/conversion/wizard/:gid/:country?",
        template: `<div class="sw-layout-scrollable-element use-sticky-css-rendering" auto-scroll-top>
            <sw-react component="CustomGroupWizardContainer"></sw-react>
        </div>`,
        configId: "ConversionOverview",
        resolve: {
            segments: getSegments(),
        },
        pageId: {
            section: "conversion",
            subSection: "wizard",
        },
        trackingId: {
            section: "Funnel Analysis",
            subSection: "wizard",
            subSubSection: "",
        },
        pageTitle: "conversion.wizard.title",
        params: {
            gid: "",
            country: "",
        },
    },
    "conversion-categoryoverview": {
        parent: "conversion",
        url: "/categoryoverview/:industry/:category/:country/:duration",
        templateUrl: "/app/pages/conversion/categoryoverview.html",
        configId: "ConversionOverview",
        pageId: {
            section: "conversion",
            subSection: "categoryoverview",
        },
        pageTitle: "conversion.categoryoverview.Title",
        defaultQueryParams: {},
        trackingId: {
            section: "Funnel Analysis",
            subSection: "Category Analysis",
            subSubSection: "",
        },
        params: {
            category: { type: "string", raw: true },
        },
        leftSubNav: ConversionQueryBar,
    },
    "conversion-customgroup": {
        parent: "conversion",
        url: "/:gid/:country/:duration",
        templateUrl: "/app/pages/conversion/categoryoverview.html",
        configId: "ConversionOverview",
        pageId: {
            section: "conversion",
            subSection: "groupOverview",
        },
        pageTitle: "conversion.categoryoverview.Title",
        defaultQueryParams: {},
        trackingId: {
            section: "Funnel Analysis",
            subSection: "Group Analysis",
            subSubSection: "",
        },
        leftSubNav: ConversionSegmentsQueryBar,
    },
    "conversion-customsegement": {
        parent: "conversion",
        url: "/:gid/:sid/:country/:duration/:comparedDuration?tab",
        templateUrl: "/app/pages/conversion/segmentoverview.html",
        configId: "ConversionOverview",
        periodOverPeriodEnabled: true,
        pageId: {
            section: "conversion",
            subSection: "segementOverview",
        },
        trackingId: {
            section: "Funnel Analysis",
            subSection: "Segment Analysis",
            subSubSection: "",
        },
        reloadOnSearch: false,
        pageTitle: "conversion.websiteoverview.Title",
        leftSubNav: ConversionSegmentsQueryBar,
    },
    "conversion-customsegement-nogroup": {
        parent: "conversion",
        url: "/nogroup/:sid/:country/:duration/:comparedDuration",
        templateUrl: "/app/pages/conversion/segmentoverview.html",
        configId: "ConversionOverview",
        periodOverPeriodEnabled: true,
        pageId: {
            section: "conversion",
            subSection: "segementOverview",
        },
        trackingId: {
            section: "Funnel Analysis",
            subSection: "conversion",
            subSubSection: "segement overview",
        },
        pageTitle: "conversion.websiteoverview.Title",
        leftSubNav: ConversionSegmentsQueryBar,
    },
};

// in order to make trailing space optional
conversionConfig["conversion-customsegement-duplicate"] = {
    ...conversionConfig["conversion-customsegement"],
    url: "/:gid/:sid/:country/:duration",
    redirectTo: "conversion-customsegement",
};
conversionConfig["conversion-customsegement-nogroup-duplicate"] = {
    ...conversionConfig["conversion-customsegement-nogroup"],
    url: "nogroup/:sid/:country/:duration",
    redirectTo: "conversion-customsegement-nogroup",
};
