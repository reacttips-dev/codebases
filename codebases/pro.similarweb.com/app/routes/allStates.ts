import keywordAnalysisConfig from "./keywordAnalysisConfig";

declare const similarweb: any;
import angular from "angular";
import { StateDeclaration } from "@uirouter/angularjs";
import * as _ from "lodash";
import { digitalMarketingConfig } from "pages/digital-marketing/config/configuration/digitalMarketingConfig";
import { segmentsConfig } from "pages/segments/config/segmentsConfig";
import { industryAnalysisConfig } from "routes/industryAnalysisConfig";
import { PageId } from "userdata";
import { conversionConfig } from "../pages/conversion/config/conversionConfig";
import { marketResearchConfig } from "../pages/market-research/config/configuration/marketResearchConfig";
import homeConfig from "./homeConfig";
import { googleKeywordsConfig } from "./keywordsConfig";
import getWebsiteStateConfig from "./websiteStateConfig";
import { SecondaryBarType } from "reducers/_reducers/SecondaryBarReducer";
import { Solutions2Package } from "common/services/solutions2Helper";
import { salesIntelligenceConfig } from "pages/sales-intelligence/legacy-router-config/configuration/salesIntelligenceConfig";
import { productBoardConfig } from "pages/product-board/productBoardConfig";
import { appCategoryConfig } from "./appCategoryConfig";

export interface IRouterState extends StateDeclaration {
    trackingId?: any;
    configId?: string;
    absoluteUrl?: string;
    pageId: PageId;
    parent: string;
    pageTitle: string;
    menuId: string;
    hidePageTitle: boolean;
    defaultQueryParams?: {
        webSource: string;
    };
    defaultParams?: any; // any params could be here
    stateId?: string;
    pageSubtitle: string;
    pinkBadgeTitle: string;
    orangeBadgeTitle: string;
    homeState: string;
    navBarContainerClassName?: string;

    /**
     * Indicates what is the current navigation menu that should be displayed.
     * used by the ProSecondaryBar component to resolve the navigation menu contents
     * according to the user location in the platform.
     */
    secondaryBarType?: SecondaryBarType;
    isSecondaryBarOpen?: boolean;

    /**
     * Package name indicates what is the current solutions 2.0 package.
     * this is used to resolve routing when a reroute should be done from legacy package
     * to solutions 2.0 package and vice versa.
     * see app.ts "navChangeStart" callback logic for more information.
     */
    packageName?: Solutions2Package;

    fallbackStates?: Record<Solutions2Package, string>;

    /**
     * Used to resolve what is the updated route when navigating to a page in a legacy
     * package from a page that is located in a solutions 2.0 package.
     * an example: if the user clicks on a link in a page on marketing intelligence package, which leads
     * to website research (legacy package), we want to reroute him to an aquivalent route in marketing intelligence
     * package. see app.ts "navChangeStart" callback logic for more information.
     */
    legacy?: Record<Solutions2Package, string>;
}

angular.module("sw.common").factory("allStates", function (appAnalysisConfig) {
    const websiteStateConfig = getWebsiteStateConfig();
    const allStates = _.chain({})
        .assign(
            appAnalysisConfig,
            websiteStateConfig,
            homeConfig,
            industryAnalysisConfig,
            keywordAnalysisConfig,
            appCategoryConfig,
            googleKeywordsConfig,
            conversionConfig,
            segmentsConfig,
            marketResearchConfig,
            digitalMarketingConfig,
            salesIntelligenceConfig,
            productBoardConfig,
        )
        .map(function (state, name, all) {
            if (state.pageId) {
                return {
                    name,
                    pageId: state.pageId,
                    section: state.pageId.section,
                    subSection: state.pageId.subSection,
                    subSubSection: state.pageId.subSubSection,
                    pageTitle: state.pageTitle,
                    url: state.url,
                    icon: state.icon,
                    parent: state.parent,
                    parentObj: all[state.parent],
                    configId: state.configId,
                    defaultQueryParams: state.defaultQueryParams,
                };
            }
        })
        .compact()
        .value();

    return allStates;
});
