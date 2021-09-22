import { colorsPalettes } from "@similarweb/styles";
import { SwLog } from "@similarweb/sw-log";
import { ECategoryType } from "common/services/categoryService.types";
import { swSettings } from "common/services/swSettings";
import * as utils from "components/filters-bar/utils";
import { RecommendedWebsiteGroupBanner } from "components/WebsiteRecommendationEngine/src/RecommendedWebsiteGroupBanner";
import _ from "lodash";
import dayjs from "dayjs";
import {
    ESubdomainsType,
    MarketingWorkspaceFilters,
} from "pages/workspace/marketing/shared/MarketingWorkspaceFilters";
import * as PropTypes from "prop-types";
import * as queryString from "query-string";
import * as React from "react";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";
import CountryService, { ICountryObject } from "services/CountryService";
import DurationService from "services/DurationService";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { BenchmarkToArena } from "../../../../../.pro-features/components/Workspace/BenchmarkToArena/src/BenchmarkToArena";
import { BenchmarkToArenaItem } from "../../../../../.pro-features/components/Workspace/BenchmarkToArena/src/BenchmarkToArenaItem";
import { FlexColumn } from "../../../../../.pro-features/styled components/StyledFlex/src/StyledFlex";
import { Injector } from "../../../../../scripts/common/ioc/Injector";
import {
    marketingWorkspaceSetAllParams,
    marketingWorkspaceSetCountry,
    marketingWorkspaceSetDuration,
    marketingWorkspaceSetIsWWW,
    marketingWorkspaceSetSites,
    marketingWorkspaceSetWebsource,
    setWebsiteGroupRecommendationSuccess,
} from "../../../../actions/marketingWorkspaceActions";
import { preparePresets } from "../../../../components/dashboard/widget-wizard/components/DashboardWizardDuration";
import { NavigatorConnectHOC } from "../../../../components/navigatorHOC/navigatorConnectHOC";
import SWReactTableWrapper from "../../../../components/React/Table/SWReactTableWrapper";
import { CHART_COLORS } from "../../../../constants/ChartColors";
import SWReactRootComponent from "../../../../decorators/SWReactRootComponent";
import {
    i18nFilter,
    minVisitsAbbrFilter,
    smallNumbersPercentageFilter,
} from "../../../../filters/ngFilters";
import { DefaultFetchService, NoCacheHeaders } from "../../../../services/fetchService";
import { IArena } from "../../../../services/marketingWorkspaceApiService";
import { MarketingWorkspaceDrillDownEllipsis } from "../shared/MarketingWorkspaceDrillDownEllipsis";
import { MarketingWorkspaceMoreDropdownButton } from "../shared/MarketingWorkspaceMoreDropdownButton";
import MarketingWorkspaceTableTopBar from "../shared/MarketingWorkspaceTableTopBar";
import {
    BenchmarkToArenaLegendStyled,
    MarketingWorkspaceGroupPageContainer,
    MarketingWorkspaceOverviewPageHeaderPart,
    MarketingWorkspacePageHeaderContainer,
    MarketingWorkspacePageTitle,
    MarketingWorkspacePageTitleContainer,
    ScrollContainer,
} from "../shared/styledComponents";
import { MarketingWorkspaceAffiliateTableSettings } from "../tableConfig/MarketingWorkspaceAffiliateTableSettings";
import { CustomCategoriesWizard } from "components/customCategoriesWizard/CustomCategoriesWizard";
import { PreferencesService } from "services/preferences/preferencesService";

const i18n = i18nFilter();

class MarketingWorkspaceWebsiteGroupPage extends React.PureComponent<any, any> {
    public static contextTypes = {
        translate: PropTypes.func,
        track: PropTypes.func,
    };
    public static defaultProps = {
        duration: "3m",
        arenas: [],
        websource: "Desktop",
    };
    private readonly swSettings = swSettings;
    private readonly swNavigator = Injector.get<any>("swNavigator");
    private readonly fetchService = DefaultFetchService.getInstance();
    private scrollContainerRef = React.createRef<HTMLDivElement>();

    constructor(props, context) {
        super(props, context);
        this.state = {
            validArenas: [],
            sortedColumn: {
                sort: MarketingWorkspaceAffiliateTableSettings.defaultSortField,
                asc: MarketingWorkspaceAffiliateTableSettings.defaultSortDirection === "asc",
            },
            scroll: false,
            showRecommendedGroupBanner: PreferencesService.get(
                `website-recommendation-${this.props.websiteGroup.categoryId}`,
            ),
        };
    }

    public componentDidUpdate(prevProps: Readonly<any>) {
        if (!this.props.sites) {
            const propsHasChanged =
                this.propHasChanged("duration", prevProps.duration) ||
                this.propHasChanged("websource", prevProps.websource) ||
                this.propHasChanged("sites", prevProps.sites);
            if (propsHasChanged) {
                this.setAvailableArenas();
            }
        } else {
            if (this.propHasChanged("sites", prevProps.sites)) {
                let websource = "Desktop";
                // change to desktop if country doesnt support mobileweb
                if (!this.swSettings.allowedCountry(prevProps.country, "MobileWebSearch")) {
                    websource = "Desktop";
                }
                this.props.setWebsource(websource);
            }
        }
    }

    public componentDidMount() {
        if (this.scrollContainerRef) {
            this.scrollContainerRef.current.addEventListener("scroll", this.onScroll, {
                capture: true,
            });
        }
        if (this.props.websiteGroupRecommendationSuccess) {
            this.props.clearWebsiteGroupRecommendationSuccess();
        }
    }

    public componentWillUnmount() {
        if (this.scrollContainerRef) {
            this.scrollContainerRef.current.removeEventListener("scroll", this.onScroll, {
                capture: true,
            });
        }
    }

    public render() {
        const { country, sites, websiteGroup, websource, duration, isWWW } = this.props;
        const benchmarkToArena = sites && sites.length > 0;
        const { from, to, isWindow } = this.getDurationForApi();
        const filters: any = {
            country,
            from,
            to,
            isWindow,
            // when not benchmarking againt arena, the websource filter is fixed on "Dekstop"
            websource: benchmarkToArena ? websource : "Desktop",
            sort: MarketingWorkspaceAffiliateTableSettings.defaultSortField,
            asc: MarketingWorkspaceAffiliateTableSettings.defaultSortDirection === "asc",
            rowsPerPage: 100,
            groupHash: websiteGroup.categoryHash,
            includeSubDomains: isWWW === "*",
        };
        if (benchmarkToArena) {
            filters.sites = sites.join(",");
        }
        const minDate = this.swSettings.current.startDate;
        const maxDate = this.swSettings.current.endDate;
        const durationSelectorPresets = this.swSettings.current.datePickerPresets;
        const endpoint = `api/workspaces/marketing/affiliates/${websiteGroup.categoryId}${
            benchmarkToArena ? "/benchmark" : ""
        }/table`;
        const countryObject: ICountryObject = CountryService.getCountryById(country);
        const availableWebSources = this.getWebsources();
        const selectedWebSource = availableWebSources.find((w) => w.id === filters.websource);

        return (
            <MarketingWorkspaceGroupPageContainer>
                <FlexColumn style={{ height: "100%" }}>
                    <MarketingWorkspacePageHeaderContainer isScroll={this.state.isScroll}>
                        <MarketingWorkspaceOverviewPageHeaderPart>
                            <MarketingWorkspacePageTitleContainer>
                                <MarketingWorkspacePageTitle>
                                    {this.state.scroll && sites && (
                                        <BenchmarkToArenaLegendStyled
                                            margin={false}
                                            inline={false}
                                            sites={this.getSitesForLegend()}
                                            onClose={this.clearSelectedArena}
                                        />
                                    )}
                                    {(!sites || !this.state.scroll) && this.props.title}
                                </MarketingWorkspacePageTitle>
                                {!sites && (
                                    <BenchmarkToArena
                                        loading={this.state.validArenasLoading}
                                        arenas={this.getArenas()}
                                    />
                                )}
                            </MarketingWorkspacePageTitleContainer>
                        </MarketingWorkspaceOverviewPageHeaderPart>
                        <MarketingWorkspaceOverviewPageHeaderPart className="react-filters-container">
                            <MarketingWorkspaceFilters
                                selectedCountryId={countryObject.id}
                                selectedCountryText={countryObject.text}
                                availableCountries={this.getAvailableCountries()}
                                onCountryChange={this.onChangeCountry}
                                onDurationChange={this.onDurationChange}
                                maxDate={maxDate}
                                minDate={minDate}
                                durationSelectorPresets={preparePresets(durationSelectorPresets)}
                                duration={duration}
                                componentId={this.swSettings.current.componentId}
                                availableWebSources={availableWebSources}
                                selectedWebSource={selectedWebSource}
                                onWebSourceChange={this.onWebSourceChange}
                                webSourceFilterDisabled={true}
                                showIncludeSubdomainsFilter={true}
                                includeSubdomainsDisabled={false}
                                showKeywordsTypeFilter={false}
                                isIncludeSubdomains={isWWW === "*"}
                                onSubDomainsFilterChange={this.onSubDomainsFilterChange}
                            />
                        </MarketingWorkspaceOverviewPageHeaderPart>
                    </MarketingWorkspacePageHeaderContainer>
                    {this.state.showRecommendedGroupBanner && (
                        <RecommendedWebsiteGroupBanner
                            onCloseClick={this.removeRecommendationBanner}
                            learnMoreLink="https://support.similarweb.com/hc/en-us/articles/360003518977"
                            title={i18nFilter()(
                                "workspaces.marketing.websitegroup.recommendation.banner.learn.title",
                            )}
                            text={i18nFilter()(
                                "workspaces.marketing.websitegroup.recommendation.banner.learn.text",
                            )}
                            infoText={i18nFilter()(
                                "workspaces.marketing.websitegroup.recommendation.banner.learn.tooltip",
                            )}
                        />
                    )}
                    <ScrollContainer ref={this.scrollContainerRef as any}>
                        {sites && (
                            <BenchmarkToArenaLegendStyled
                                sites={this.getSitesForLegend()}
                                onClose={this.clearSelectedArena}
                                margin={true}
                                inline={true}
                            />
                        )}
                        <SWReactTableWrapper
                            serverApi={endpoint}
                            tableOptions={{
                                metric: "MarketingWorkspaceWebsiteGroupTable",
                            }}
                            tableColumns={MarketingWorkspaceAffiliateTableSettings.getColumns(
                                {
                                    field: filters.sort,
                                    sortDirection:
                                        MarketingWorkspaceAffiliateTableSettings.defaultSortDirection,
                                },
                                benchmarkToArena,
                                DurationService.getDiffSymbol(filters.from, filters.to),
                                filters.isWindow,
                            )}
                            initialFilters={filters}
                            transformData={this.transformData}
                            key={websiteGroup.categoryHash}
                            onSort={this.onSort}
                        >
                            {(topComponentProps) => (
                                <MarketingWorkspaceTableTopBar
                                    searchField={
                                        MarketingWorkspaceAffiliateTableSettings.searchFieldName
                                    }
                                    options={this.getOptions()}
                                    permissionsComponent={"WebAnalysis"}
                                    searchPlaceholder="workspaces.marketing.search.website.placeholder"
                                    totalTrafficTitle="workspaces.marketing.websitegroup.totaltraffic.title"
                                    tooltipTitle="workspaces.marketing.websitegroup.totalvisits.tooltip"
                                    {...topComponentProps}
                                />
                            )}
                        </SWReactTableWrapper>
                    </ScrollContainer>
                    <div className="marketing-workspace-table-fixed-container">
                        {this.getResearchMore()}
                    </div>
                </FlexColumn>
                <CustomCategoriesWizard
                    isOpen={this.state.showCustomCategoriesWizard}
                    onClose={() => {
                        this.setState({ showCustomCategoriesWizard: false });
                    }}
                    wizardProps={{
                        stayOnPage: true,
                        placeholder:
                            "workspaces.marketing.customcategories.wizard.editor.placeholder.bold",
                        customCategoryId: this.state.customCategoryId,
                        isCategoryTypeDisabled: true,
                        initialCategoryType: ECategoryType.PARTNERS_LIST,
                        onSave: async () => {
                            await this.saveCustomCategory();
                            this.setState({ showCustomCategoriesWizard: false });
                        },
                    }}
                />
            </MarketingWorkspaceGroupPageContainer>
        );
    }

    private onSubDomainsFilterChange = ({ id }) => {
        this.props.setIsWWW(id === ESubdomainsType.INCLUDE ? "*" : "-");
    };

    private getWebsources = () => {
        const { duration, country } = this.props;
        return utils.getAvailableWebSource({ name: "websites-outgoing" }, { duration, country });
    };

    private onWebSourceChange = (websource) => {
        this.props.setWebsource(websource.id);
    };

    private onScroll = (e) => {
        const scrollTop = (e.target as HTMLDivElement).scrollTop;
        this.setState({
            scroll: scrollTop >= 40,
        });
    };

    private onSort = ({ field, sortDirection }) => {
        this.setState({
            sortedColumn: {
                sort: field,
                asc: sortDirection === "asc",
            },
        });
    };

    private propHasChanged = (propName, propValue) => {
        return JSON.stringify(this.props[propName]) !== JSON.stringify(propValue);
    };

    private getSitesForLegend = () => {
        return this.props.sites.map((site, index) => ({
            domain: site,
            color: CHART_COLORS.main[index],
        }));
    };

    private getArenas = () => {
        const arenas = this.state.validArenas.map(({ id: arenaId }, index) => {
            const arena = _.find<IArena>(this.props.arenas, (arena) => arena.id === arenaId);
            const countryObj = CountryService.getCountryById(arena.country);
            return (
                <BenchmarkToArenaItem
                    key={`arena-${index}`}
                    country={countryObj}
                    title={arena.friendlyName}
                    competitorsIcons={arena.competitors.map((competitor) => competitor.favicon)}
                    mainDomain={arena.allies[0]}
                    onClick={this.onArenaClick(arena)}
                />
            );
        });
        if (arenas.length === 0) {
            return null;
        }
        return arenas;
    };

    /**
     * Set available arenas of the current group
     * by calling to the overview endpoint for each arena
     * and check if there is data for that arena.
     * Show only arenas that have data
     */
    private setAvailableArenas = async () => {
        await this.setStateAsync({
            validArenas: [],
            validArenasLoading: true,
        });
        const websiteGroupId = this.props.websiteGroup.categoryId;
        const { from, to, isWindow } = this.getDurationForApi();
        const params = {
            from,
            to,
            isWindow,
            websource: "Desktop",
        };
        const endpoint = `api/workspaces/marketing/affiliates/${websiteGroupId}/benchmark/overview`;

        // remove null or undefined values from the params object
        Object.entries(params).forEach(([paramKey, ParamValue]) => {
            if (!ParamValue) {
                delete params[paramKey];
            }
        });

        let counter = 0;
        // loop over arenas, calling the endpoint and add the arena as *valid* arena to the component's state
        this.props.arenas.forEach(async (arena: IArena) => {
            const competitors = arena.competitors.map((competitor) => competitor.domain);
            const main = arena.allies.map((allie) => allie.domain);
            const finalParams = {
                ...params,
                country: arena.country,
                sites: [...main, ...competitors].join(","),
            };
            try {
                const { visits } = await this.fetchService.get<{ visits: number }>(
                    endpoint,
                    finalParams,
                    { headers: NoCacheHeaders },
                );
                counter++;
                if (visits || counter >= this.props.arenas.length - 1) {
                    this.setState({ validArenasLoading: false });
                }
                // treat 0 visits as no data
                if (!visits) {
                    throw new Error("no data");
                }
                const validArenas = this.state.validArenas;
                const arenaObj = { id: arena.id, visits };
                this.setState({
                    validArenas: [...validArenas, arenaObj].sort((a, b) =>
                        a.visits > b.visits ? -1 : 1,
                    ),
                });
            } catch (e) {
                SwLog.log(`arena ${arena.id} doesn't have data: `, e);
            }
        });
    };

    private clearSelectedArena = () => {
        const { track } = this.context;
        track("Clear Filter", "Click", "BENCHMARK AGAINST YOUR ARENA");
        this.props.setSites(null);
    };

    private onArenaClick = (arena) => () => {
        const { track } = this.context;
        track("Pop Up", "Click", `BENCHMARK AGAINST YOUR ARENA/${arena.friendlyName}`);
        const sites = [
            arena.allies[0].domain,
            ...arena.competitors.map((competitor) => competitor.domain),
        ];
        this.props.setSites(sites);
        this.props.setCountry(arena.country);
    };

    private getDurationForApi = () => {
        const { from, to, isWindow } = DurationService.getDurationData(
            this.props.duration,
            "",
            "WebAnalysis",
        ).forAPI;
        return { from, to, isWindow };
    };

    private getAvailableCountries = () => {
        return utils.getCountries();
    };

    private onDurationChange = (duration) => {
        this.props.setDuration(duration);
    };

    private onChangeCountry = (country) => {
        this.props.setCountry(country.id);
    };

    private getResearchMore = () => {
        return (
            <MarketingWorkspaceMoreDropdownButton
                key={`MarketingWorkspaceAffiliateMoreDropdownButton`}
                onDropdownToggle={this.onMoreDropdownButtonToggle}
                buttonLabel={i18n("workspaces.affiliate.more.button")}
                options={[
                    {
                        label: i18n("workspaces.affiliate.more.topkeyword"),
                        action: this.onMoreDropdownTopKeywordClick,
                    },
                    {
                        label: i18n("workspaces.affiliate.more.trafficleaders"),
                        action: this.onMoreDropdownTrafficLeadersClick,
                    },
                ]}
            />
        );
    };

    private getOptions = () => {
        return (
            <MarketingWorkspaceDrillDownEllipsis
                onGroupRowDelete={this.onGroupRowDelete}
                onGroupRowEdit={this.onGroupRowEdit}
                onDownloadExcel={this.onDownloadExcelClick}
                groupRowSource={this.props.websiteGroup}
                getConfirmationContentText={this.getConfirmationContentText}
                getConfirmationHeaderText={this.getConfirmationHeaderText}
            />
        );
    };

    private onMoreDropdownTopKeywordClick = () => {
        //todo tracking?
        this.swNavigator.go("findkeywords_byindustry_TopKeywords", {
            country: this.props.country,
            category: this.props.websiteGroup.forUrl,
            duration: "3m",
        });
    };
    private onMoreDropdownTrafficLeadersClick = () => {
        //todo tracking?
        this.swNavigator.go("industryAnalysis-topSites", {
            country: this.props.country,
            category: this.props.websiteGroup.forUrl,
            duration: "1m",
        });
    };

    private onMoreDropdownButtonToggle = (isOpen) => {
        //todo tracking?
    };

    private onGroupRowDelete = async (selectedGroupRow) => {
        await UserCustomCategoryService.deleteCustomCategory({ id: selectedGroupRow.categoryId });
        await this.afterGroupDelete(selectedGroupRow.categoryId);
    };

    private onGroupRowEdit = async (selectedGroupRow) => {
        this.showCustomCategoryModal(selectedGroupRow.categoryId);
    };

    private showCustomCategoryModal(customCategoryId) {
        this.setState({ showCustomCategoriesWizard: true, customCategoryId: customCategoryId });
    }

    private saveCustomCategory = async () => {
        const id = this.props.websiteGroup.categoryId;
        await this.updateGroupRows(id);
    };

    private updateGroupRows = (groupId?) => {
        const current = this.swNavigator.current();
        const params = this.swNavigator.getParams();
        // reload the same group
        this.swNavigator.go(current, { ...params, websiteGroupId: groupId }, { reload: true });
    };

    private afterGroupDelete = (groupId) => {
        const current = this.swNavigator.current();
        const params = this.swNavigator.getParams();
        // find the next group to redirect
        const nextGroup = this.props.customIndustries.find(
            (group) => group.id !== groupId && group.linked,
        );
        // redirect to the first group
        if (nextGroup) {
            this.swNavigator.go(current, { ...params, websiteGroupId: nextGroup.id });
            return;
        }
        // redirect to the first arena (when deleting last group
        else {
            this.swNavigator.go("marketingWorkspace-arena", {
                ...params,
                arenaId: this.props.arenas[0].id,
            });
        }
    };

    private onDownloadExcelClick = () => {
        window.location.href = this.getExcelLink();
    };

    private getExcelLink() {
        const { country, sites, websiteGroup, websource } = this.props;
        const { from, to, isWindow } = this.getDurationForApi();
        const { sort, asc } = this.state.sortedColumn;
        const params: any = {
            country,
            from,
            to,
            isWindow,
            websource,
            sort,
            asc,
        };
        if (sites) {
            params.sites = sites.join(",");
        }
        if (sites) {
            return `api/workspaces/marketing/affiliates/${
                websiteGroup.categoryId
            }/benchmark/excel?${queryString.stringify(params)}`;
        } else {
            return `api/workspaces/marketing/affiliates/${
                websiteGroup.categoryId
            }/excel?${queryString.stringify(params)}`;
        }
    }

    private getConfirmationHeaderText = (groupRowSource) => {
        return groupRowSource
            ? i18n("workspaces.marketing.affiliate.grouprow.confirmation.header.text", {
                  name: groupRowSource.text,
              })
            : "";
    };

    private getConfirmationContentText = (groupRowSource) => {
        return groupRowSource
            ? i18n("workspaces.marketing.affiliate.grouprow.confirmation.content.text", {
                  name: groupRowSource.text,
              })
            : "";
    };

    private transformData = (data) => {
        return {
            ...data,
            records: data.records.map((customCategoryDetail) => {
                return {
                    ...customCategoryDetail,
                    country: this.props.country,
                    affiliateTrafficTrend: customCategoryDetail.affiliateTrafficTrend
                        ? customCategoryDetail.affiliateTrafficTrend.map(({ value, key }) => ({
                              value,
                              tooltip: `${minVisitsAbbrFilter()(
                                  value,
                              )} referring visits ${dayjs.utc(key).format("MMM, YYYY")}`,
                          }))
                        : [],
                    trafficDistribution: customCategoryDetail.trafficDistribution
                        ? customCategoryDetail.trafficDistribution.map(
                              ({ site, percentage, value }) => {
                                  const colorIndex = this.props.sites.indexOf(site);
                                  return {
                                      color: colorsPalettes.carbon[0],
                                      backgroundColor: CHART_COLORS.main[colorIndex],
                                      width: percentage,
                                      text: smallNumbersPercentageFilter()(percentage, 1),
                                      name: site,
                                  };
                              },
                          )
                        : [],
                };
            }),
        };
    };

    private removeRecommendationBanner = async () => {
        TrackWithGuidService.trackWithGuid(
            "workspace.marketing.websiterecommendations.remove.banner",
            "click",
        );
        await PreferencesService.remove([
            `website-recommendation-${this.props.websiteGroup.categoryId}`,
        ]);
        this.setState({
            showRecommendedGroupBanner: false,
        });
    };

    private setStateAsync(newState) {
        return new Promise<void>((resolve) => {
            this.setState(newState, resolve);
        });
    }
}

const mapStateToProps = ({
    marketingWorkspace: { selectedWorkspace, websiteGroupRecommendationSuccess },
    routing,
}) => {
    const { filters, arenas, customIndustries } = selectedWorkspace;
    const { websiteGroupId } = routing.params;
    const websiteGroup = UserCustomCategoryService.getCustomCategoryById(websiteGroupId);
    return {
        arenas,
        customIndustries,
        country: filters.country,
        websiteGroup,
        websource: filters.websource,
        duration: filters.duration,
        sites: filters.sites,
        title: websiteGroup.text,
        isWWW: filters.isWWW,
        websiteGroupRecommendationSuccess,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setCountry: (value) => {
            dispatch(marketingWorkspaceSetCountry(value));
        },
        setDuration: (value) => {
            dispatch(marketingWorkspaceSetDuration(value));
        },
        setWebsource: (value) => {
            dispatch(marketingWorkspaceSetWebsource(value));
        },
        setSites: (value) => {
            dispatch(marketingWorkspaceSetSites(value));
        },
        setAllParamas: (params) => {
            dispatch(marketingWorkspaceSetAllParams(params));
        },
        clearWebsiteGroupRecommendationSuccess: () => {
            dispatch(setWebsiteGroupRecommendationSuccess(null));
        },
        setIsWWW: (value) => {
            dispatch(marketingWorkspaceSetIsWWW(value));
        },
    };
};

const mapUrlToAction = {
    country: (value) => {
        if (value !== null) {
            return marketingWorkspaceSetCountry(parseInt(value));
        }
    },
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
    sites: (value) => {
        if (value !== null) {
            return marketingWorkspaceSetSites(value.split(",").filter((s) => s));
        } else {
            return marketingWorkspaceSetSites(null);
        }
    },
};

const connected = NavigatorConnectHOC(
    mapStateToProps,
    mapDispatchToProps,
    null,
    {
        areStatesEqual: (next, prev) => {
            const id = next.routing.params.websiteGroupId;
            const workspaceId = next.marketingWorkspace.selectedWorkspace.id;
            const websiteGroup = UserCustomCategoryService.getCustomCategoryById(id);
            if (!id || !websiteGroup || !workspaceId) {
                return true;
            } else {
                return next === prev;
            }
        },
    },
    mapUrlToAction,
    true,
)(MarketingWorkspaceWebsiteGroupPage);
export default SWReactRootComponent(connected, "MarketingWorkspaceWebsiteGroupPage");
