/* eslint-disable react/display-name */
import { Injector } from "common/ioc/Injector";
import { allTrackers } from "services/track/track";
import { processMenuItem } from "common/services/moduleService";
import { swSettings } from "common/services/swSettings";
import PrimaryNavOverrideDropdown from "components/React/PrimaryNavOverrideDropdown/PrimaryNavOverrideDropdown";
import ProductUpdatesDropdown from "components/React/ProductUpdatesDropdown/ProductUpdatesDropdown";
import UserSettingDropdown from "components/React/UserSettingDropdown/UserSettingDropdown";
import {
    filterItemsAccordingToPackages,
    filterByCurrentModule,
    getPackageFilters,
    hasDigitalMarketingPermission,
    hasConversionPermission,
    hasMarketResearchPermission,
    hasAppsPermission,
    PackageType,
} from "components/SideBar/utils";
import { PrimaryNavOverrideMode } from "reducers/_reducers/primaryNavOverrideReducer";
import { SecondaryBarType } from "reducers/_reducers/SecondaryBarReducer";
import { openUnlockModalV2 } from "services/ModalService";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { getPermittedWorkSpacesTypes, hasWorkSpacesPermission } from "services/Workspaces.service";
import "./ProSideBar.scss";
import {
    FIND_LEADS_PAGE_ROUTE,
    FIND_LEADS_PAGE_ROUTE_URL,
    HOME_PAGE_ROUTE,
    HOME_PAGE_ROUTE_URL,
    MY_LISTS_PAGE_ROUTE,
    MY_LISTS_PAGE_ROUTE_URL,
} from "pages/sales-intelligence/constants/routes";
import { SolutionSwitcherMenuComponent } from "components/React/SolutionSwitcherMenuComponent/SolutionSwitcherMenuComponent";
import { BeamerButton } from "components/beamer/BeamerButton";
import { ReactNode } from "react";
import * as React from "react";
import { isMarketingWorkspace, WorkSpaceMenuItems } from "components/SideBar/WorkSpaceMenuItems";

export interface IProSidebarItem {
    package: PackageType[];
    title?: string;
    icon?: string;
    link?: string;
    subLinks?: string[];
    trackName?: string;
    modules?: string[];
    inModules?: { show?: string[]; hide?: string[] };
    /**
     * Used to decide which item should be highlighted.
     * The secondary bar (a.k.a - navigation bar) type is set according to the current
     * location in the platform. the sideBar (a.k.a icon bar) item highlighting should always
     * correspond to that very same location in the platform.
     */
    sections?: SecondaryBarType[];
    isDisabled?: boolean;
    isHidden?: boolean;
    withSeparator?: boolean;
    onClick?: VoidFunction;
    onClickDisabled?: VoidFunction;
    sidebarItemComponent?: (
        isActive?: boolean,
        onClick?: VoidFunction,
        onChildClick?: VoidFunction,
        onToggle?: (isOpen: any, isOutsideClick: any, e: any) => void,
    ) => ReactNode;
}

const getWorkspaceItem = () => {
    const permittedWorkSpaces: any[] = Object.values(getPermittedWorkSpacesTypes());
    const hasMultipleWorkspaces = permittedWorkSpaces.length > 1;
    return hasMultipleWorkspaces || isMarketingWorkspace(permittedWorkSpaces[0])
        ? {
              sidebarItemComponent: (isActive: boolean, onClick, onChildClick, onToggle) => (
                  <WorkSpaceMenuItems
                      onClick={onClick}
                      onChildClick={onChildClick}
                      onToggle={onToggle}
                      permittedWorkSpaces={permittedWorkSpaces}
                      isActive={isActive}
                  />
              ),
          }
        : {
              onClick: () => {
                  TrackWithGuidService.trackWithGuid(
                      "solutions2.sidebar.menu.workspace.dropdown",
                      "click",
                      { trackName: `${permittedWorkSpaces[0]["trackName"]}/websites` },
                  );
                  window.location.href = permittedWorkSpaces[0]["link"];
              },
          };
};

const getUserSettingSidebarItemComponent = () => (
    isActive: boolean,
    onClick,
    onChildClick,
    onToggle,
) => <UserSettingDropdown onClick={onClick} onChildClick={onChildClick} onToggle={onToggle} />;

const getPrimaryNavOverrideSidebarItemComponent = (
    changePrimaryNavOverrideMode: (mode: PrimaryNavOverrideMode) => void,
    navOverrideMode: PrimaryNavOverrideMode,
) => (isActive: boolean, onClick, onChildClick, onToggle) => {
    const onOverrideItemClick = (selectedMode: PrimaryNavOverrideMode) => {
        changePrimaryNavOverrideMode(selectedMode);
    };
    return (
        <PrimaryNavOverrideDropdown
            onClick={onClick}
            itemClicked={onOverrideItemClick}
            onToggle={onToggle}
            currentlySelectedMode={navOverrideMode}
        />
    );
};

const getProductUpdatesItemComponent = () => (
    isActive: boolean,
    onClick,
    onChildClick,
    onToggle,
) => <ProductUpdatesDropdown onClick={onClick} onChildClick={onChildClick} onToggle={onToggle} />;

const getSolutionSwitcherSidebarItemComponent = () => (
    isAcitve: boolean,
    onClick,
    onChildClick,
    onToggle,
) => (
    <SolutionSwitcherMenuComponent
        onClick={onClick}
        onToggle={onToggle}
        onChildClick={onChildClick}
    />
);

export const getItemsList = (currentModule, props?): IProSidebarItem[] => {
    const navigator = Injector.get<any>("swNavigator");
    // TODO: check if we can use the moduleService to determine if new packages are locked.
    //  If yes, then these bindings are unnecessary.

    // used to filter the list of sidebar items according to a user's claims
    const packageFilters: PackageType[] = getPackageFilters(
        hasWorkSpacesPermission(),
        props.navOverrideMode,
    );

    const items: IProSidebarItem[] = [
        {
            package: ["home"],
            title: "homepage.iconbar.title",
            icon: "home",
            trackName: "Research",
            modules: ["proModules"],
            inModules: {
                hide: ["salesIntelligence", "accountreview"],
            },
            onClick: () => navigator.go("proModules"),
            isDisabled: false,
        },
        {
            package: ["digitalmarketing", "current"],
            title: "aquisitionintelligence.iconbar.title",
            icon: "publish",
            trackName: "DigitalMarketing/ModuleHome",
            link: "/#/marketing/home",
            modules: [
                "digitalmarketing",
                "competitiveanalysis",
                "keywordresearch",
                "affiliateresearch",
                "mediabuyingresearch",
                "adcreativeresearch",
                "keywordanalysis",
                "findkeywords",
                "affiliateanalysis",
                "findaffiliates",
            ],
            inModules: {
                hide: ["salesIntelligence", "accountreview"],
            },
            sections: ["DigitalMarketing"],
            isDisabled: !hasDigitalMarketingPermission(),
            onClick: () => navigator.go("digitalmarketing-home"),
            onClickDisabled: () => openUnlockModalV2("CompetitveAnalysisOverviewHomepage"),
        },
        {
            package: ["marketresearch", "current"],
            title: "marketintelligence.iconbar.title",
            icon: "visitor",
            trackName: "MarketResearch/ModuleHome",
            link: "/#/research/home",
            modules: ["marketresearch-home", "marketresearch", "companyresearch"],
            sections: ["MarketResearch"],
            inModules: {
                hide: ["salesIntelligence", "accountreview"],
            },
            isDisabled: !hasMarketResearchPermission(),
            isHidden:
                !hasMarketResearchPermission() &&
                swSettings.components.Home.resources.IsNoTouchUser,
            withSeparator: true,
            onClick: () => navigator.go("marketresearch-home"),
            onClickDisabled: () => openUnlockModalV2("WebMarketAnalysisOverviewHomepage"),
        },
        {
            package: ["workspace"],
            title: "workspace.iconbar.title",
            icon: "category",
            modules: ["salesWorkspace", "investorsWorkspace", "marketingWorkspace"],
            sections: ["MarketingWorkspace", "InvestorsWorkspace", "SalesWorkspace"],
            inModules: {
                hide: ["salesIntelligence", "accountreview"],
            },
            ...getWorkspaceItem(),
            isDisabled: false,
        },
        {
            package: ["dashboard"],
            title: "topbar.tabs.Dashboards",
            icon: "dashboard",
            trackName: "Dashboards",
            modules: ["dashboard"],
            sections: ["Dashboards"],
            inModules: {
                hide: ["salesIntelligence", "accountreview"],
            },
            withSeparator: true,
            onClick: () => navigator.go("dashboard"),
            isDisabled: false,
        },
        {
            package: ["legacy"],
            title: "webresearch.iconbar.title",
            icon: "globe",
            trackName: "Research/websites,industry,keyword,websiteSegments",
            link: "/#/website/home",
            subLinks: [
                "/#/industry/overview/All/999/3m?webSource=Total",
                "/#/keyword/home",
                "/#/segments/home",
            ],
            modules: [
                "websites_root-home",
                "websites",
                "websites-root",
                "segments",
                "industryAnalysis",
                "keywordAnalysis",
            ],
            sections: ["WebsiteResearch"],
            inModules: {
                hide: ["salesIntelligence", "accountreview"],
            },
            isDisabled: false,
            onClick: () => navigator.go("websites_root-home"),
        },
        {
            package: ["legacy"],
            title: "appresearch.iconbar.title",
            icon: "app",
            trackName: "Research/apps,appscategory,playkeyword",
            link: "/#/apps/home",
            subLinks: [
                "/#/appcategory/leaderboard/Google/840/All/AndroidPhone/Top%20Free",
                "/#/keywords/home",
            ],
            modules: ["apps-home", "apps", "appcategory", "keywords"],
            sections: ["AppResearch"],
            inModules: {
                hide: ["salesIntelligence", "accountreview"],
            },
            onClick: () => navigator.go("apps-home"),
            isDisabled: false,
        },
        {
            package: ["legacy", "current"],
            title: "topbar.tabs.buyerjourney.title",
            icon: "funnel-empty",
            trackName: "Research/buyerJourney",
            link: "/#/conversion/home",
            modules: ["conversion-homepage", "conversion"],
            sections: ["ConversionAnalysis"],
            inModules: {
                hide: ["salesIntelligence", "accountreview"],
            },
            onClick: () => navigator.go("conversion-homepage"),
            onClickDisabled: () => openUnlockModalV2("FunnelAnalysisSector"),
            isDisabled: !hasConversionPermission(),
        },
        {
            package: ["internal"],
            sidebarItemComponent: getPrimaryNavOverrideSidebarItemComponent(
                props.changePrimaryNavOverrideMode,
                props.navOverrideMode,
            ),
        },
        {
            package: ["productupdates"],
            sidebarItemComponent: getProductUpdatesItemComponent(),
        },
        {
            package: ["deepinsights"],
            title: "custominsights.iconbar.title",
            icon: "reports",
            trackName: "Custom reports",
            link: "/#/insights/home",
            modules: ["insights-home", "insights"],
            sections: ["CustomInsights"],
            inModules: {
                hide: ["salesIntelligence", "accountreview"],
            },
            onClick: () => navigator.go("insights-home"),
            isDisabled: false,
        },
        {
            package: ["all-s2"],
            sidebarItemComponent: () => <BeamerButton />,
            isHidden: !swSettings.components.Home.resources.HasWhatsNewFeature,
        },
        {
            package: ["all"],
            title: "helpcenter.iconbar.title",
            icon: "helpcenter",
            onClick: () => props.toggleEducationBar(),
            isDisabled: false,
        },
        {
            package: ["all-s2"],
            sidebarItemComponent: getSolutionSwitcherSidebarItemComponent(),
        },
        {
            package: ["all"],
            sidebarItemComponent: getUserSettingSidebarItemComponent(),
        },
        {
            package: ["si"],
            sections: ["SalesIntelligenceHome"],
            inModules: {
                show: ["salesIntelligence", "accountreview"],
            },
            title: "si.menu.item.home",
            icon: "home",
            link: `/#${HOME_PAGE_ROUTE_URL}`,
            onClick() {
                allTrackers.trackEvent("side menu", "click", "home");
                navigator.go(HOME_PAGE_ROUTE);
            },
        },
        {
            package: ["si"],
            sections: ["SalesIntelligenceLists"],
            inModules: {
                show: ["salesIntelligence", "accountreview"],
            },
            title: "si.menu.item.lists",
            icon: "list-icon",
            link: `/#${HOME_PAGE_ROUTE_URL}${MY_LISTS_PAGE_ROUTE_URL}`,
            onClick() {
                allTrackers.trackEvent("side menu", "click", "my lists");
                navigator.go(MY_LISTS_PAGE_ROUTE);
            },
        },
        {
            package: ["si"],
            sections: ["SalesIntelligenceFind"],
            inModules: {
                show: ["salesIntelligence", "accountreview"],
            },
            title: "si.menu.item.find",
            icon: "phrases",
            link: `/#${HOME_PAGE_ROUTE_URL}${FIND_LEADS_PAGE_ROUTE_URL}`,
            onClick() {
                allTrackers.trackEvent("side menu", "click", "find websites");
                navigator.go(FIND_LEADS_PAGE_ROUTE);
            },
        },
        {
            package: ["si"],
            sections: ["SalesIntelligenceAppReview"],
            inModules: {
                show: ["salesIntelligence", "accountreview"],
            },
            title: "si.menu.item.apps",
            icon: "app",
            link: `/#/sales/apps/home`,
            onClick() {
                allTrackers.trackEvent("side menu", "click", "find apps");
                navigator.go("salesIntelligence-apps-home");
            },
            isHidden: !hasAppsPermission(),
        },
    ];

    const itemsFilteredAccordingToPackage = filterByCurrentModule(
        currentModule,
        filterItemsAccordingToPackages(packageFilters, items),
    );
    // checks if any items should be disabled and disables them
    const processedItems = itemsFilteredAccordingToPackage.map(processMenuItem);
    return processedItems;
};
