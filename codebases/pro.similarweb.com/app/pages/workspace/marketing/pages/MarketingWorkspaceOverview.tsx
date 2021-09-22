/* eslint-disable @typescript-eslint/camelcase */
import { colorsPalettes } from "@similarweb/styles";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { Tab, TabList, TabPanel, Tabs } from "@similarweb/ui-components/dist/tabs";
import { hideTopNav } from "actions/commonActions";
import { setKeywordGeneratorSuggestionParams } from "actions/keywordGeneratorToolActions";
import { swSettings } from "common/services/swSettings";
import AffiliateMarketingOptimization from "components/dashboard/dashboard-templates/templates/AffiliateMarketingOptimization";
import CompetitiveOverview from "components/dashboard/dashboard-templates/templates/CompetitiveOverview";
import DailyCompetitiveOverview from "components/dashboard/dashboard-templates/templates/DailyCompetitiveOverview";
import OrganicKeywordOptimization from "components/dashboard/dashboard-templates/templates/OrganicKeywordOptimization";
import SeoPerformance from "components/dashboard/dashboard-templates/templates/SeoPerformance";
import WebsiteAudienceAnalysis from "components/dashboard/dashboard-templates/templates/WebsiteAudienceAnalysis";
import DownloadPdfOverlay from "components/React/DownloadPdfOverlay/DownloadPdfOverlay";
import { HELP_ARTICLE_IDS } from "help-widget/constants";
import { WithHelpWidgetArticle } from "help-widget/react/WithHelpWidgetArticle";
import _ from "lodash";
import dayjs, { Dayjs } from "dayjs";
import AffiliatesOverviewTab from "pages/workspace/marketing/pages/AffiliatesOverviewTab";
import OrganicSearchOverviewTab from "pages/workspace/marketing/pages/OrganicSearchOverviewTab";
import {
    ESubdomainsType,
    MarketingWorkspaceFilters,
} from "pages/workspace/marketing/shared/MarketingWorkspaceFilters";
import * as React from "react";
import { getTabNameForTracking } from "routes/workspaceConfig";
import DurationService from "services/DurationService";
import { PdfExportService } from "services/PdfExportService";
import { allTrackers } from "services/track/track";
import UIComponentStateService from "services/UIComponentStateService";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";
import { IWebsiteLegend } from "../../../../../.pro-features/components/Workspace/WorkspaceCompetitors/src/WorkspaceCompetitors";
import { DashboardsCarouselComponent } from "../../../../../.pro-features/pages/workspace/marketing/src/DashboardsCarouselComponent";
import { Injector } from "../../../../../scripts/common/ioc/Injector";
import { KWSuggestions } from "../pages/KWSuggestions";

import { Transition } from "react-transition-group";
import {
    batchActions,
    marketingWorkspaceArenaSetCategory,
    marketingWorkspaceArenaSetSelectedTab,
    marketingWorkspaceSetCountry,
    marketingWorkspaceSetDuration,
    marketingWorkspaceSetFilters,
    marketingWorkspaceSetIsWWW,
    marketingWorkspaceSetWebsource,
} from "../../../../actions/marketingWorkspaceActions";
import ArenaChannelsOverview from "../../../../Arena/components/ArenaChannelsOverview/ArenaChannelsOverview";
import { ArenaVisitsContainer } from "../../../../Arena/components/ArenaVisits/ArenaVisitsContainer";
import { default as EngagementMetrics } from "../../../../Arena/components/EngagementMetrics/EngagementMetrics";
import {
    selectDashboardTemplate,
    templateAddKeys,
    templateChangeCountry,
    templateSetOrigin,
    templateSetParent,
} from "../../../../components/dashboard/dashboard-templates/actions/dashboardTemplateActions";
import {
    DashboardTemplateService,
    EDashboardOriginType,
    EDashboardParentType,
} from "../../../../components/dashboard/dashboard-templates/DashboardTemplateService";
import { EUpdateType } from "../../../../components/dashboard/services/DashboardService";
import { preparePresets } from "../../../../components/dashboard/widget-wizard/components/DashboardWizardDuration";
import * as utils from "../../../../components/filters-bar/utils";
import { NavigatorConnectHOC } from "../../../../components/navigatorHOC/navigatorConnectHOC";
import { CHART_COLORS } from "../../../../constants/ChartColors";
import SWReactRootComponent from "../../../../decorators/SWReactRootComponent";
import { i18nFilter } from "../../../../filters/ngFilters";
import ArenaApiService from "../../../../services/arena/arenaApiService";
import CountryService, { ICountryObject } from "../../../../services/CountryService";
import { getWebSource } from "../../../../services/Workspaces.service";
import {
    BenchmarkToArenaLegendStyled,
    MarketingWorkspaceOverviewPageContainer,
    MarketingWorkspaceOverviewPageContentContainer,
    MarketingWorkspaceOverviewPageHeaderPart,
    MarketingWorkspacePageHeaderContainer,
    MarketingWorkspacePageTitle,
    MarketingWorkspacePageTitleContainer,
} from "../shared/styledComponents";
import {
    ProductTours,
    ProductToursLocalStorageKeys,
    showIntercomTour,
} from "services/IntercomProductTourService";
import useLocalStorage from "custom-hooks/useLocalStorage";
import { HighlightsContainer } from "pages/workspace/marketing/highlights/HighlightsContainer";
import { showSuccessToast } from "actions/toast_actions";
import { PreferencesService } from "services/preferences/preferencesService";
import { UserArenaOrTrackerPreferenceKey } from "pages/competitive-tracking/arena/types";
import { TeaserWrapper as TrackerTeaserWrapper } from "pages/competitive-tracking/arena/TeaserWrapper";
import { TeaserBanner } from "pages/competitive-tracking/arena/TeaserBanner";
import { CompetitiveTrackerServiceUtils } from "services/competitiveTracker/utils";

interface IMarketingWorkspaceOverviewStateFromProps {
    country: number;
    keys: IWebsiteLegend[];
    workspaceSetCountry: (country) => void;
    workspaceId: string;
    cigLink: string;
    title: string;
    dashboards: any[];
    arenaId: string;
    showGAApprovedData: boolean;
}

interface IMarketingWorkspaceOverviewDispatchFromProps {
    goToDashboardTemplate: (templateId, keys, country, workspaceId) => () => void;
    setKeywordGeneratorSuggestionParams: (keys, country, arenaTitle) => void;
    hideTopNav: VoidFunction;
}

interface IDashboardTemplatesLink {
    id: number | string;
    title: string;
    description: string;
    onClick: (title: string) => () => void;
}

interface IMarketingWorkspaceOverviewState {
    dashboardTemplatesLinks: IDashboardTemplatesLink[];
    webSource: string;
    ischannelsOverviewLoading: boolean;
    isEngagementTableDataLoading: boolean;
    isPreferencesLoading: boolean;
    scroll: boolean;
    isFiltersSideBarOpen: boolean;
    isPdf: boolean;
    selectedTab: number;
    visibleSuggestionsBar: string[];
    isTrackerModalOpen: boolean;
}

const i18n = i18nFilter();

const TeaserBannerContainer = styled.div`
    padding: 0px 24px;
`;

const WorkspaceSettingsButton = styled.div`
    margin-left: 8px;
`;

const TabListStyled = styled(TabList)`
    border-bottom: 0;
    padding-left: 24px;
`;

const TabsContainer = styled.div<{ isScroll?: boolean }>`
    background-color: ${colorsPalettes.carbon[0]};
    box-shadow: ${({ isScroll }) =>
        isScroll ? `0px 4px 6px 0px rgba(202, 202, 202, 0.5)` : `none`};
    position: relative;
    z-index: 1;
    border-bottom: 1px solid ${colorsPalettes.carbon[50]};
`;

type Props = IMarketingWorkspaceOverviewStateFromProps &
    IMarketingWorkspaceOverviewDispatchFromProps &
    any;

type Many<T> = T | ReadonlyArray<T>;

export interface IMarketingOverviewArenaPrefrences {
    duration: string;
    country: number;
    webSource: Many<string | "Desktop" | "MobileWeb" | "Total">;
    isWWW: Many<string | "*" | "-">;
}

const IntercomProductTourTrigger = (): JSX.Element => {
    const [hasViewedProductTour] = useLocalStorage(
        ProductToursLocalStorageKeys.WebAnalysisFullTour,
    );
    const [hasViewedWorkspacesTour, setViewedWorkspacesTour] = useLocalStorage(
        ProductToursLocalStorageKeys.WorkspaceTour,
    );

    const hasNewPackages = swSettings.user.hasSolution2;

    React.useEffect(() => {
        if (!hasNewPackages && !hasViewedProductTour && !hasViewedWorkspacesTour) {
            setViewedWorkspacesTour("true");
            showIntercomTour(ProductTours.Workspaces);
        }
    }, []);

    return null;
};

class MarketingWorkspaceOverview extends React.PureComponent<
    Props,
    IMarketingWorkspaceOverviewState
> {
    public static defaultProps = {
        duration: "3m",
        webSource: "Desktop",
        isWWW: "*",
        selectedTab: 0,
    };

    public static getDerivedStateFromProps(props, state): object {
        if (typeof props.selectedTab !== "undefined" && props.selectedTab !== state.selectedTab) {
            return {
                selectedTab: props.selectedTab,
            };
        }

        return null;
    }

    private dashboardService = Injector.get<any>("dashboardService");
    private swNavigator = Injector.get<any>("swNavigator");
    private pdfExportService = PdfExportService;
    private swSettings = swSettings;
    private readonly snapshotDate: Dayjs;
    private readonly snapshotDateFormated: string;
    private arenaApiService: any;
    private channelsOverviewData: any;
    private channelsOverviewCategoryData: any;
    private engagementDataTable: any;
    private tabsRefArray = [];
    private tabsPdfTitles = [
        "workspaces.marketing.overview.pdf.title",
        "workspaces.marketing.organic.search.pdf.title",
        "workspaces.marketing.affiliates.pdf.title",
    ];
    private arenaUserPreferences: any;
    private isSuggestionsBarOpen: boolean;
    private scrollContainerRef = React.createRef<HTMLDivElement>();

    private readonly SuggestionsKeys: string[] = [`suggestions_marketing_workspace`];
    private readonly visibleSuggestionsBar = this.SuggestionsKeys.filter((key) =>
        JSON.parse(UIComponentStateService.getItem(key, "localStorage", true)),
    );

    constructor(props, context) {
        super(props, context);
        this.snapshotDate = this.swSettings.components.MarketingWorkspace.endDate as any;
        this.snapshotDateFormated = this.snapshotDate.format("YYYY/MM");
        this.arenaApiService = new ArenaApiService();
        this.channelsOverviewData = {};
        this.state = this.getState();
        const { arenaId } = this.swNavigator.getParams();
        this.arenaUserPreferences = PreferencesService.get(`${arenaId}`);
        this.isSuggestionsBarOpen =
            this.state.visibleSuggestionsBar.indexOf(`suggestions_marketing_workspace`) > -1 &&
            !swSettings.user.hasDM &&
            !swSettings.user.hasMR;
    }

    public async fetchEngagementData({
        webSource,
        isWindow,
        from,
        to,
        country,
        keys,
        includeSubDomains,
        showGAApprovedData,
    }): Promise<void> {
        if (this.state.isEngagementTableDataLoading) {
            return;
        }
        try {
            this.setState({
                isEngagementTableDataLoading: true,
            });
            this.engagementDataTable = await this.arenaApiService.getEngagementOverview(
                {
                    webSource,
                    isWindow,
                    from,
                    to,
                    country,
                    keys,
                    includeSubDomains,
                    includeLeaders: true,
                    shouldGetVerifiedData: showGAApprovedData,
                },
                keys,
            );
            this.setState({
                isEngagementTableDataLoading: false,
            });
        } catch (error) {
            this.engagementDataTable = {};
            this.setState({
                isEngagementTableDataLoading: false,
            });
        }
    }

    public async fetchChannelsOverviewData({
        isWindow,
        includeSubDomains,
        from,
        to,
        country,
        keys,
        category,
        webSource,
    }): Promise<void> {
        if (this.state.ischannelsOverviewLoading) {
            return;
        }
        try {
            await this.setStateAsync({
                ischannelsOverviewLoading: true,
            });

            const params = {
                isWindow,
                from,
                to,
                country,
                includeSubDomains,
                keys,
                timeGranularity: "Monthly",
                webSource,
            };
            // fetch category data if category selected
            if (category) {
                // set keys to be the category
                const clonedParams = {
                    ...params,
                    keys: category,
                };
                const response = await this.arenaApiService.getChannelsOverviewWithBenchmark(
                    clonedParams,
                );
                this.channelsOverviewCategoryData = response.Data || {};
            } else {
                this.channelsOverviewCategoryData = {};
            }
            const response = await this.arenaApiService.getChannelsOverview(params);
            const isMobileWeb = webSource === "MobileWeb";
            this.channelsOverviewData = isMobileWeb ? { Mobile: response.Data } : response.Data;
            this.setState({
                ischannelsOverviewLoading: false,
            });
        } catch (error) {
            this.channelsOverviewData = {};
            this.setState({
                ischannelsOverviewLoading: false,
            });
        }
    }

    public async fetchData(): Promise<void> {
        const includeSubDomains = this.props.isWWW === "*";
        const { webSource, country, keys, showGAApprovedData, category } = this.props;
        const durationData = DurationService.getDurationData(
            this.props.duration,
            "",
            "WebAnalysis",
        );
        const { from, to, isWindow } = durationData.forAPI;
        const filters = {
            includeSubDomains,
            webSource,
            isWindow,
            from,
            to,
            country,
            keys: _.map(keys, (key: any) => key.domain),
            showGAApprovedData,
            category: null,
        };
        if (category) {
            filters.category = `$${category}`;
        }
        this.fetchChannelsOverviewData(filters);
        this.fetchEngagementData(filters);
    }

    public async updateUserPreferences(): Promise<void> {
        const { arenaId } = this.swNavigator.getParams();
        await PreferencesService.add({
            [`${arenaId}`]: {
                duration: this.props.duration,
                webSource: this.props.webSource,
                isWWW: this.props.isWWW,
                country: this.props.country,
            },
        });
    }

    public async fetchArenaUserPreferences(): Promise<IMarketingOverviewArenaPrefrences> {
        const { arenaId } = this.swNavigator.getParams();
        const arenaUserPreferences: IMarketingOverviewArenaPrefrences =
            this.arenaUserPreferences && this.arenaUserPreferences.duration
                ? this.arenaUserPreferences
                : PreferencesService.get(`${arenaId}`);
        return arenaUserPreferences;
    }

    public async componentDidUpdate(prevProps, prevState): Promise<void> {
        if (
            this.props.duration !== prevProps.duration ||
            this.props.isWWW !== prevProps.isWWW ||
            this.props.webSource !== prevProps.webSource ||
            this.props.country !== prevProps.country ||
            this.props.showGAApprovedData !== prevProps.showGAApprovedData ||
            this.props.category !== prevProps.category
        ) {
            this.fetchData();
            this.updateUserPreferences();
            this.props.setKeywordGeneratorSuggestionParams(
                _.map(this.props.keys, (key: any) => key.domain).join(","),
                this.props.country,
                this.props.title,
            );
        }
    }

    public async componentDidMount(): Promise<void> {
        if (this.scrollContainerRef) {
            this.scrollContainerRef.current.addEventListener("scroll", this.onScroll, {
                capture: true,
            });
        }
        if (this.isSuggestionsBarOpen) {
            this.props.notificationListHeight({
                type: "NOTIFICATION_BAR_UPDATE_HEIGHT",
                height: 112,
            });
        }
        const { duration, isWWW, webSource, country } = this.props;
        const userPrefrences = await this.fetchArenaUserPreferences();
        this.setState({ isPreferencesLoading: false });
        if (
            userPrefrences &&
            userPrefrences.duration &&
            !_.isEqual(userPrefrences, { duration, isWWW, webSource, country }) &&
            this.isUserPreferencesAllowed(userPrefrences)
        ) {
            this.props.setFilters({
                duration: userPrefrences.duration,
                isWWW: userPrefrences.isWWW,
                websource: userPrefrences.webSource,
                country: userPrefrences.country,
            });
            return;
        }
        this.fetchData();
        this.props.setKeywordGeneratorSuggestionParams(
            _.map(this.props.keys, (key: any) => key.domain).join(","),
            this.props.country,
            this.props.title,
        );
    }

    public componentWillUnmount(): void {
        if (this.scrollContainerRef) {
            this.scrollContainerRef.current.removeEventListener("scroll", this.onScroll, {
                capture: true,
            });
        }
    }
    private isUserPreferencesAllowed(userPreferences): boolean {
        const { duration, webSource, country } = userPreferences;
        const currentState = this.swNavigator.current();
        const { name: stateName } = currentState;
        const allowedCountry = swSettings.allowedCountry(country, stateName);
        const allowWebSource = Boolean(this.getWebsources().find(({ id }) => id === webSource));
        const allowDuration = swSettings.allowedDuration(duration);
        return allowedCountry && allowWebSource && allowDuration;
    }

    private getState = (props = this.props): IMarketingWorkspaceOverviewState => {
        const { country, selectedTab } = props;
        const webSource = getWebSource(country);
        const ischannelsOverviewLoading = false;
        const isEngagementTableDataLoading = false;
        const isPreferencesLoading = true;
        const promotedDashboardTemplates = [
            CompetitiveOverview,
            DailyCompetitiveOverview,
            WebsiteAudienceAnalysis,
            SeoPerformance,
            AffiliateMarketingOptimization,
            OrganicKeywordOptimization,
        ];
        const isPdf = false;
        const visibleSuggestionsBar = this.visibleSuggestionsBar;
        return {
            selectedTab,
            visibleSuggestionsBar,
            isPdf,
            webSource,
            ischannelsOverviewLoading,
            isEngagementTableDataLoading,
            isPreferencesLoading,
            dashboardTemplatesLinks: promotedDashboardTemplates.map((dashboardTemplate) => {
                return {
                    id: dashboardTemplate.id,
                    title: i18n(dashboardTemplate.title),
                    description: i18n(dashboardTemplate.description),
                    onClick: this.onDashboardTemplateClick(dashboardTemplate.id),
                };
            }),
            scroll: false,
            isFiltersSideBarOpen: false,
            isTrackerModalOpen:
                PreferencesService.get(UserArenaOrTrackerPreferenceKey) === undefined &&
                !CompetitiveTrackerServiceUtils.hasTrackers() &&
                swSettings.user.hasMR,
        };
    };

    private onDurationChange = (duration): void => {
        this.props.setDuration(duration);
    };

    private getWebsources = () => {
        const { duration, country } = this.props;
        const { selectedTab } = this.state;
        const webSources = utils.getAvailableWebSource(
            { name: "websites-audienceOverview" },
            { duration, country },
        );
        if ([1, 2].includes(selectedTab)) {
            return webSources.filter((webSource) => webSource.id === "Desktop");
        } else {
            return webSources;
        }
    };

    private onWebSourceChange = (websource): void => {
        this.props.setWebsource(websource.id);
    };

    private onSubDomainsFilterChange = ({ id }): void => {
        this.props.setIsWWW(id === ESubdomainsType.INCLUDE ? "*" : "-");
    };

    private onTabSelect = (index: number, lastIndex?: any, event?: any): void => {
        this.props.setSelectedTab(index);
        if ([1, 2].includes(index)) {
            this.props.setWebsource("Desktop");
        }
        allTrackers.trackEvent(
            "Tab",
            "Switch",
            getTabNameForTracking({ selectedArenaTab: index.toString() }),
        );
    };

    private downloadPdf = async (): Promise<void> => {
        allTrackers.trackEvent("Download", "submit-ok", "PDF");
        await this.setStateAsync({ isPdf: !this.state.isPdf });
        setTimeout(async () => {
            const { selectedTab } = this.state;
            const el = this.tabsRefArray[selectedTab];
            this.pdfExportService.setHTML(el.outerHTML);
            const domains = this.props.keys.map((key) => key.domain).join();
            await this.pdfExportService.downloadHtmlPdfFedService(
                i18n(this.tabsPdfTitles[selectedTab]),
                domains,
            );
            await this.setStateAsync({ isPdf: false });
        }, 1000); // this number (waiting for chart to finish render) is not good at all, currently it is the only way. Still thinking of better solution.
    };

    private getListWithoutKey = (key: string): string[] => {
        return _.without(this.state.visibleSuggestionsBar, key);
    };

    private removeSuggestionBar = (): void => {
        const key = `suggestions_marketing_workspace`;
        UIComponentStateService.setItem(key, "localStorage", "false", true);
        this.setState({
            visibleSuggestionsBar: this.getListWithoutKey(key),
        });
        this.props.notificationListHeight({
            type: "NOTIFICATION_BAR_UPDATE_HEIGHT",
            height: 0,
        });
    };

    // Allowing to components to be Injector-free.
    private getLink = (params) => this.swNavigator.href(...params);
    private getCountryById = (id) => CountryService.getCountryById(id);

    private showStrategicOverviewTab = (): boolean => {
        const claims = swSettings.components.Home.resources;
        return claims.StrategicOverview !== false;
    };

    private existedTabs: string[] = [
        "workspaces.marketing.overview.tab.title",
        "workspaces.marketing.organic.search.organic.tab.title",
        "workspaces.marketing.organic.search.affiliates.tab.title",
    ];

    private getAllowedTabs = (): string[] => {
        const {
            NT_SearchBM,
            NT_AffiliateBM,
            NT_MediaBuyingBM,
        } = this.swSettings.components.AvailableBusinessModules.resources;

        const isShowOrganicTab = (): boolean => NT_SearchBM === "Open";
        const isShowReferralsTab = (): boolean => NT_AffiliateBM === "Open";

        const allowedTabs: [boolean, string][] = [
            [this.showStrategicOverviewTab(), this.existedTabs[0]],
            [isShowOrganicTab(), this.existedTabs[1]],
            [isShowReferralsTab(), this.existedTabs[2]],
        ];
        const isNoTouch = swSettings.components.Home.resources.IsNoTouchUser;

        if (!isNoTouch) {
            const tabs = allowedTabs.map(([_, tab]) => tab);

            if (!this.showStrategicOverviewTab()) {
                tabs.shift();
            }
            return tabs;
        }

        return allowedTabs.filter(([condition]) => condition).map(([_, tab]) => tab);
    };

    private tabs = this.getAllowedTabs();

    public render() {
        const includeSubDomains = this.props.isWWW === "*";
        const isWWW = this.props.isWWW;
        const countryObject: ICountryObject = CountryService.getCountryById(this.props.country);
        const minDate = this.swSettings.current.startDate as any;
        const maxDate = this.swSettings.current.endDate as any;
        const durationSelectorPresets = this.swSettings.current.datePickerPresets;
        const {
            webSource,
            country,
            keys,
            duration,
            showGAApprovedData,
            selectedTab,
            category,
            arenaId,
            customIndustries,
            keywordGroups,
        } = this.props;
        const durationData = DurationService.getDurationData(
            this.props.duration,
            "",
            "WebAnalysis",
        );
        const { from, to, isWindow } = durationData.forAPI;
        const filters = {
            webSource,
            isWWW,
            isWindow,
            from,
            to,
            country,
            duration,
            includeSubDomains,
            keys: _.map(keys, (key: any) => key.domain),
            domains: keys,
            ShouldGetVerifiedData: Boolean(showGAApprovedData),
        };
        const availableWebsources = this.getWebsources();
        const selectedWebSource =
            availableWebsources.find((w) => w.id === this.props.webSource) ??
            availableWebsources[0];
        const isWebsourceFilterDisabled = availableWebsources.length === 1;
        // if the user already has a keyword/partner list we don't show the suggestions bar
        const isSuggestionsBarOpen =
            this.isSuggestionsBarOpen &&
            customIndustries.length === 0 &&
            keywordGroups.length === 0;

        const defaultStyle = {
            transition: `max-height 750ms ease-in-out`,
            maxHeight: 0,
        };

        const transitionStyles = {
            entering: { maxHeight: 300 },
            entered: { maxHeight: 300 },
            exiting: { maxHeight: 0 },
            exited: { maxHeight: 0 },
        };

        return (
            <MarketingWorkspaceOverviewPageContainer>
                {
                    <TrackerTeaserWrapper
                        isOpen={this.state.isTrackerModalOpen}
                        setIsOpen={(isTrackerModalOpen) => this.setState({ isTrackerModalOpen })}
                    />
                }
                <IntercomProductTourTrigger />
                {this.state.isPdf && <DownloadPdfOverlay isDownloading={this.state.isPdf} />}
                {isSuggestionsBarOpen && (
                    <Transition in={!this.state.scroll} timeout={4000} classNames="collapsed">
                        {(state) => (
                            <div
                                style={{
                                    ...defaultStyle,
                                    ...transitionStyles[state],
                                }}
                            >
                                <KWSuggestions
                                    arenas={this.props.selectedWorkspace.arenas}
                                    removeSuggestionBar={this.removeSuggestionBar}
                                    hideTopNav={this.props.hideTopNav}
                                />
                            </div>
                        )}
                    </Transition>
                )}
                <MarketingWorkspacePageHeaderContainer>
                    <MarketingWorkspaceOverviewPageHeaderPart>
                        <MarketingWorkspacePageTitleContainer>
                            <MarketingWorkspacePageTitle>
                                {this.state.scroll && (
                                    <BenchmarkToArenaLegendStyled
                                        sites={this.getSitesForLegend()}
                                        hideLabel={true}
                                        margin={false}
                                        inline={false}
                                    />
                                )}
                                {!this.state.scroll && (
                                    <FlexRow alignItems="center">
                                        {this.props.title}
                                        <WorkspaceSettingsButton>
                                            <IconButton
                                                onClick={this.editArena}
                                                type="flatNegative"
                                                height="40px"
                                                iconName="settings"
                                            />
                                        </WorkspaceSettingsButton>
                                    </FlexRow>
                                )}
                            </MarketingWorkspacePageTitle>
                        </MarketingWorkspacePageTitleContainer>
                    </MarketingWorkspaceOverviewPageHeaderPart>
                    <MarketingWorkspaceOverviewPageHeaderPart
                        className="react-filters-container"
                        data-sw-intercom-tour-workspaces-marketing-marketingworkspaceoverviewpageheaderpart-step-2
                    >
                        <MarketingWorkspaceFilters
                            availableCountries={this.getAvailableCountries()}
                            onCountryChange={this.onChangeCountry}
                            selectedCountryId={countryObject.id}
                            selectedCountryText={countryObject.text}
                            durationSelectorPresets={preparePresets(durationSelectorPresets)}
                            componentId={this.swSettings.current.componentId}
                            duration={this.props.duration}
                            minDate={minDate}
                            maxDate={maxDate}
                            onDurationChange={this.onDurationChange}
                            availableWebSources={availableWebsources}
                            webSourceFilterDisabled={isWebsourceFilterDisabled}
                            onWebSourceChange={this.onWebSourceChange}
                            selectedWebSource={selectedWebSource}
                            showIncludeSubdomainsFilter={true}
                            isIncludeSubdomains={this.props.isWWW === "*"}
                            onSubDomainsFilterChange={this.onSubDomainsFilterChange}
                            showKeywordsTypeFilter={false}
                            showGaToggle={selectedTab === 0}
                        />
                    </MarketingWorkspaceOverviewPageHeaderPart>
                </MarketingWorkspacePageHeaderContainer>

                <TabsContainer isScroll={this.state.scroll}>
                    {!this.state.scroll && (
                        <BenchmarkToArenaLegendStyled
                            sites={this.getSitesForLegend()}
                            hideLabel={true}
                            margin={true}
                            inline={true}
                        />
                    )}
                    {swSettings.user.hasMR && !CompetitiveTrackerServiceUtils.hasTrackers() && (
                        <TeaserBannerContainer>
                            <TeaserBanner />
                        </TeaserBannerContainer>
                    )}

                    <FlexRow justifyContent="space-between" alignItems="center">
                        <TabListStyled data-sw-intercom-tour-workspaces-marketing-overview-step-3>
                            {this.tabs.map((tab, index) => (
                                <Tab key={`tab-${index}`} {...this.getTabProps(tab, index)}>
                                    {i18n(tab)}
                                </Tab>
                            ))}
                        </TabListStyled>
                        <IconButton
                            iconName="download"
                            type="flat"
                            className="DownloadPdfButton"
                            onClick={this.downloadPdf}
                        >
                            {i18n("workspaces.marketing.overview.downloadpdf")}
                        </IconButton>
                    </FlexRow>
                </TabsContainer>
                <MarketingWorkspaceOverviewPageContentContainer
                    ref={this.scrollContainerRef as any}
                    isPdf={this.state.isPdf}
                >
                    <Tabs
                        onSelect={this.onTabSelect}
                        selectedIndex={this.state.selectedTab}
                        forceRenderTabPanel={false}
                    >
                        {this.showStrategicOverviewTab() && (
                            <TabPanel className="firstTab">
                                <WithHelpWidgetArticle
                                    articleId={HELP_ARTICLE_IDS.ARENA_STRATEGIC_OVERVIEW}
                                />
                                <div ref={(el) => (this.tabsRefArray[0] = el)}>
                                    <HighlightsContainer
                                        arenaCountry={this.props.arenaCountry}
                                        arenaId={arenaId}
                                        webSource={filters.webSource}
                                        country={filters.country}
                                        duration={filters.duration}
                                        keys={filters.keys}
                                        includeSubDomains={filters.includeSubDomains}
                                        isWindow={filters.isWindow}
                                        showToast={this.props.showToast}
                                        sitesColors={this.getSitesForLegend()}
                                    />
                                    <ArenaVisitsContainer
                                        isPdf={this.state.isPdf}
                                        title={"arena.visits.over.time.title"}
                                        titleTooltip={"arena.visits.over.time.tooltip"}
                                        filters={filters}
                                        isPreferencesLoading={this.state.isPreferencesLoading}
                                        getCountryById={this.getCountryById}
                                        country={country}
                                        sitesForLegend={this.getSitesForLegend()}
                                    />
                                    <EngagementMetrics
                                        tableData={this.engagementDataTable}
                                        filters={filters}
                                        isLoading={this.state.isEngagementTableDataLoading}
                                        getCountryById={this.getCountryById}
                                        country={country}
                                    />
                                    <ArenaChannelsOverview
                                        data={this.channelsOverviewData}
                                        categoryData={this.channelsOverviewCategoryData}
                                        filters={filters}
                                        isPdf={this.state.isPdf}
                                        sitesForLegend={this.getSitesForLegend()}
                                        getCountryById={this.getCountryById}
                                        country={country}
                                        loading={this.state.ischannelsOverviewLoading}
                                        onCategoryChange={this.onChannelsOverviewCategoryChange}
                                        selectedCategoryId={category}
                                    />
                                    {!this.state.isPdf && (
                                        <DashboardsCarouselComponent
                                            dashboardsData={this.getDashboardData()}
                                            onAddDashboardClick={this.onAddDashboardClick}
                                        />
                                    )}
                                </div>
                            </TabPanel>
                        )}
                        <TabPanel className="secondTab">
                            <WithHelpWidgetArticle
                                articleId={HELP_ARTICLE_IDS.ARENA_ORGANIC_SEARCH_OVERVIEW}
                            />
                            <div ref={(el) => (this.tabsRefArray[1] = el)}>
                                <OrganicSearchOverviewTab
                                    isPdf={this.state.isPdf}
                                    from={from}
                                    to={to}
                                    webSource={webSource}
                                    keys={keys}
                                    country={country}
                                    includeSubDomains={includeSubDomains}
                                    isWindow={isWindow}
                                    getLink={this.getLink}
                                    getCountryById={this.getCountryById}
                                    sitesForLegend={this.getSitesForLegend()}
                                    durationString={duration}
                                    filters={filters}
                                    selectedCategoryId={category}
                                />
                            </div>
                        </TabPanel>
                        <TabPanel className="thirdTab">
                            <WithHelpWidgetArticle
                                articleId={HELP_ARTICLE_IDS.ARENA_REFERRALS_OVERVIEW}
                            />
                            <div ref={(el) => (this.tabsRefArray[2] = el)}>
                                <AffiliatesOverviewTab
                                    isPdf={this.state.isPdf}
                                    from={from}
                                    to={to}
                                    webSource={webSource}
                                    keys={keys}
                                    country={country}
                                    includeSubDomains={includeSubDomains}
                                    isWindow={isWindow}
                                    getLink={this.getLink}
                                    getCountryById={this.getCountryById}
                                    sitesForLegend={this.getSitesForLegend()}
                                    durationString={duration}
                                    filters={filters}
                                    selectedCategoryId={category}
                                />
                            </div>
                        </TabPanel>
                    </Tabs>
                </MarketingWorkspaceOverviewPageContentContainer>
            </MarketingWorkspaceOverviewPageContainer>
        );
    }

    private onScroll = (e) => {
        const isSuggestionsBarOpen =
            this.state.visibleSuggestionsBar.indexOf(`suggestions_marketing_workspace`) > -1 &&
            !swSettings.user.hasDM &&
            !swSettings.user.hasMR;
        const scrollTop = (e.target as HTMLDivElement).scrollTop;
        this.setState(
            {
                scroll: scrollTop >= 40,
            },
            () => {
                this.props.notificationListHeight({
                    type: "NOTIFICATION_BAR_UPDATE_HEIGHT",
                    height: this.state.scroll ? 0 : isSuggestionsBarOpen ? 112 : 0,
                });
            },
        );
    };

    private getAvailableCountries = () => {
        return utils.getCountries();
    };

    private onChangeCountry = (country) => {
        this.props.setCountry(country.id, this.props.webSource, this.props.duration);
    };

    private editArena = () => {
        this.swNavigator.go("marketingWorkspace-arena-edit", { ...this.swNavigator.getParams() });
    };

    private getSitesForLegend = () => {
        return this.props.keys.map(({ domain, favicon }, index) => ({
            domain,
            color: CHART_COLORS.main[index],
        }));
    };

    private checkDashboardUpdateType = (dashboard) => {
        const updateType = this.dashboardService.getUpdateType(dashboard);
        if (updateType === EUpdateType.window) {
            return this.swSettings.components.WebAnalysis.resources.SupportedWindowDate;
        } else if (updateType === EUpdateType.snapshot) {
            return this.swSettings.components.WebAnalysis.resources.SupportedDate;
        } else {
            return false;
        }
    };

    private getDashboardData = () => {
        const arenaDashboards = this.props.dashboards;
        const dashboards = this.dashboardService.dashboards;
        const dashboardLinks = arenaDashboards.map((arenaDashboard) => {
            const dashboard = _.find<any>(dashboards, (d) => d.id === arenaDashboard.id);
            return {
                id: dashboard.id,
                title: dashboard.title,
                parentType: dashboard.parentType,
                parentId: dashboard.parentId,
                link: this.swNavigator.href("dashboard-exist", { dashboardId: dashboard.id }),
                created: i18n("workspaces.marketing.dashboard.created", {
                    date: dayjs.utc(dashboard.addedTime).format("MMM DD, YYYY"),
                }),
                lastUpdated: this.checkDashboardUpdateType(dashboard)
                    ? i18n("workspaces.marketing.dashboard.update", {
                          date: dayjs
                              .utc(this.checkDashboardUpdateType(dashboard))
                              .format("MMM DD, YYYY"),
                      })
                    : null,
            };
        });
        const dashboardsPlaceholders = this.state.dashboardTemplatesLinks.filter((template) => {
            const dashboardTemplateCreated = dashboardLinks.find((d) => {
                return d.parentType === "Template" && d.parentId === template.id.toString();
            });
            return !dashboardTemplateCreated;
        });
        return {
            dashboards: dashboardLinks,
            dashboardsPlaceholders,
        };
    };

    private onDashboardTemplateClick = (templateId) => (title: string) => () => {
        const { keys, country, arenaId } = this.props;
        this.track("Dashboard Templates Quick Links", "click", `${title}/create`);
        this.props.goToDashboardTemplate(templateId, keys, country, arenaId);
    };

    private onAddDashboardClick = () => {
        const { keys, country, arenaId } = this.props;
        this.props.goToDashboardTemplate(null, keys, country, arenaId);
        this.track("Dashboard Templates Quick Links", "click", `New dashboard/create`);
    };

    private track = (category: string, action: string, name: string, label?: string) => {
        allTrackers.trackEvent(category, action, name);
    };

    private setStateAsync(newState) {
        return new Promise<void>((resolve, reject) => {
            this.setState(newState, resolve);
        });
    }

    private getTabProps = (tab, index) => {
        return {
            onClick: () => this.onTabSelect(index),
            selected: this.state.selectedTab === index,
        };
    };

    private onChannelsOverviewCategoryChange = (categoryId) => {
        this.props.setCategory(categoryId || "-");
    };
}

const mapUrlToAction = {
    duration: (value) => {
        if (value !== null) {
            return marketingWorkspaceSetDuration(value);
        }
    },
    websource: (value) => {
        if (value !== null) {
            return marketingWorkspaceSetWebsource(value);
        }
    },
    isWWW: (value) => {
        if (value !== null) {
            return marketingWorkspaceSetIsWWW(value);
        }
    },
    country: (value) => {
        if (value !== null) {
            return marketingWorkspaceSetCountry(parseInt(value));
        }
    },
    selectedArenaTab: (value) => {
        if (value !== null) {
            return marketingWorkspaceArenaSetSelectedTab(value);
        }
    },
    category: (value) => {
        if (value !== null) {
            return marketingWorkspaceArenaSetCategory(value);
        }
    },
};

const mapStateToProps = ({
    common: { showGAApprovedData },
    marketingWorkspace: { selectedWorkspace, selectedArenaTab },
    cig,
    routing,
}) => {
    const arenaId = routing.params.arenaId;
    const arena =
        selectedWorkspace.arenas.find((b) => b.id === arenaId) || selectedWorkspace.arenas[0];
    const keys = [...arena.allies, ...arena.competitors];
    const { friendlyName: title, dashboards } = arena;
    const filters = selectedWorkspace.filters;

    return {
        arenaId,
        workspaceId: selectedWorkspace.id,
        customIndustries: selectedWorkspace.customIndustries,
        keywordGroups: selectedWorkspace.keywordGroups,
        cigLink: cig.cigLink,
        keys,
        country: filters.country || arena.country,
        title,
        dashboards,
        duration: filters.duration,
        isWWW: filters.isWWW,
        webSource: filters.websource,
        selectedTab: selectedArenaTab,
        showGAApprovedData,
        category: filters.category && filters.category !== "-" ? filters.category : null,
        selectedWorkspace,
        arenaCountry: arena.country,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        goToDashboardTemplate: async (templateId, keys, country, arenaId) => {
            dispatch(selectDashboardTemplate(templateId));
            dispatch(
                templateAddKeys(
                    keys.map(({ domain, favicon }) => ({ name: domain, icon: favicon })),
                ),
            );
            dispatch(templateChangeCountry(country));
            dispatch(templateSetOrigin(EDashboardOriginType.MARKETING_WORKSPACE_ARENA, arenaId));
            dispatch(templateSetParent(EDashboardParentType.TEMPLATE, templateId));
            await DashboardTemplateService.generateDashboardTemplates();
            Injector.get<any>("swNavigator").go("dashboard-gallery", {});
        },
        setCountry: (country, webSource, duration) => {
            const availableWebsources = utils.getAvailableWebSource(
                { name: "websites-audienceOverview" },
                { duration, country },
            );
            const WebsourceSupported = availableWebsources.find(({ id }) => id === webSource);
            if (!WebsourceSupported) {
                const firstAvailableWebsource = availableWebsources.find(
                    ({ available, disabled }) => available && !disabled,
                );
                dispatch(
                    batchActions(
                        marketingWorkspaceSetCountry(country),
                        marketingWorkspaceSetWebsource(firstAvailableWebsource.id),
                    ),
                );
            } else {
                dispatch(marketingWorkspaceSetCountry(country));
            }
        },
        setDuration: (value) => {
            dispatch(marketingWorkspaceSetDuration(value));
        },
        setWebsource: (value) => {
            dispatch(marketingWorkspaceSetWebsource(value));
        },
        setIsWWW: (value) => {
            dispatch(marketingWorkspaceSetIsWWW(value));
        },
        setFilters: (filters) => {
            dispatch(marketingWorkspaceSetFilters(filters));
        },
        setSelectedTab: (selectedTab) => {
            dispatch(marketingWorkspaceArenaSetSelectedTab(selectedTab));
        },
        setCategory: (category) => {
            dispatch(marketingWorkspaceArenaSetCategory(category));
        },
        setKeywordGeneratorSuggestionParams: (keys, country, arenaTitle) => {
            dispatch(setKeywordGeneratorSuggestionParams(keys, country, arenaTitle));
        },
        notificationListHeight: (action) => {
            dispatch(action);
        },
        hideTopNav: () => {
            dispatch(hideTopNav());
        },
        showToast: (text?: string) => dispatch(showSuccessToast(text)),
    };
};

const connected = NavigatorConnectHOC(
    mapStateToProps,
    mapDispatchToProps,
    null,
    {
        areStatesEqual: (next, prev) => {
            const workspaceId = next.marketingWorkspace.selectedWorkspace.id;
            // disable rerender when the workspace doesnt have this arenaId
            const workspaceHasArena = next.marketingWorkspace.selectedWorkspace.arenas.find(
                (arena) => arena.id === next.routing.params.arenaId,
            );
            if (!next.routing.params.arenaId || !workspaceId || !workspaceHasArena) {
                return true;
            } else {
                return next === prev;
            }
        },
    },
    mapUrlToAction,
    true,
)(MarketingWorkspaceOverview);

export default SWReactRootComponent(connected, "MarketingWorkspaceOverview");
