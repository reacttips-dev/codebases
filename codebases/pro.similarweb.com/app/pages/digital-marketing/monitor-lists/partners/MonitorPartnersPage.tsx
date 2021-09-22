import { colorsPalettes } from "@similarweb/styles";
import { RecommendedWebsiteGroupBanner } from "components/WebsiteRecommendationEngine/src/RecommendedWebsiteGroupBanner";
import dayjs from "dayjs";
import MonitorKeywordsTableTopBar from "pages/digital-marketing/monitor-lists/keywords/MonitorKeywordsTableTopBar";
import { MarketingWorkspaceAffiliateTableSettings } from "pages/workspace/marketing/tableConfig/MarketingWorkspaceAffiliateTableSettings";
import * as PropTypes from "prop-types";
import * as queryString from "query-string";
import * as React from "react";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";
import DurationService from "services/DurationService";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { FlexColumn } from "../../../../../.pro-features/styled components/StyledFlex/src/StyledFlex";
import { Injector } from "../../../../../scripts/common/ioc/Injector";
import {
    marketingWorkspaceSetSites,
    setWebsiteGroupRecommendationSuccess,
} from "../../../../actions/marketingWorkspaceActions";
import { NavigatorConnectHOC } from "../../../../components/navigatorHOC/navigatorConnectHOC";
import SWReactTableWrapper from "../../../../components/React/Table/SWReactTableWrapper";
import { CHART_COLORS } from "../../../../constants/ChartColors";
import SWReactRootComponent from "../../../../decorators/SWReactRootComponent";
import {
    i18nFilter,
    minVisitsAbbrFilter,
    smallNumbersPercentageFilter,
} from "../../../../filters/ngFilters";
import { MarketingWorkspaceDrillDownEllipsis } from "../../../workspace/marketing/shared/MarketingWorkspaceDrillDownEllipsis";
import { MarketingWorkspaceMoreDropdownButton } from "../../../workspace/marketing/shared/MarketingWorkspaceMoreDropdownButton";
import {
    BenchmarkToArenaLegendStyled,
    MarketingWorkspaceGroupPageContainer,
    ScrollContainer,
} from "../../../workspace/marketing/shared/styledComponents";
import { CustomCategoriesWizard } from "components/customCategoriesWizard/CustomCategoriesWizard";
import { PreferencesService } from "services/preferences/preferencesService";

const i18n = i18nFilter();

class MonitorPartnersPage extends React.PureComponent<any, any> {
    public static contextTypes = {
        translate: PropTypes.func,
        track: PropTypes.func,
    };
    public static defaultProps = {
        duration: "3m",
        arenas: [],
        websource: "Desktop",
    };
    private readonly swNavigator = Injector.get<any>("swNavigator");
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

    public componentDidMount() {
        if (this.scrollContainerRef) {
            this.scrollContainerRef.current.addEventListener("scroll", this.onScroll);
        }
        if (this.props.websiteGroupRecommendationSuccess) {
            this.props.clearWebsiteGroupRecommendationSuccess();
        }
    }

    public componentWillUnmount() {
        if (this.scrollContainerRef) {
            this.scrollContainerRef.current.removeEventListener("scroll", this.onScroll);
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
            filters.sites = sites;
        }

        const endpoint = `api/MonitorPartnerList/${websiteGroup.categoryId}${
            benchmarkToArena ? "/benchmark" : ""
        }/table`;

        return (
            <MarketingWorkspaceGroupPageContainer>
                <FlexColumn style={{ height: "100%" }}>
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
                                <MonitorKeywordsTableTopBar
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
                    isOpen={this.state.showCustomCategoryWizard}
                    onClose={() => {
                        this.setState({ showCustomCategoryWizard: false });
                    }}
                    wizardProps={{
                        stayOnPage: true,
                        placeholder:
                            "workspaces.marketing.customcategories.wizard.editor.placeholder.bold",
                        isCategoryTypeDisabled: true,
                        initialCategoryType: websiteGroup.categoryType,
                        customCategoryId: websiteGroup.categoryId,
                        onSave: async (modal, data) => {
                            await this.saveCustomCategory();
                            this.setState({ showCustomCategoryWizard: false });
                        },
                    }}
                />
            </MarketingWorkspaceGroupPageContainer>
        );
    }

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
        return this.props.sites
            .split(",")
            .map((site, index) => ({ domain: site, color: CHART_COLORS.main[index] }));
    };

    /**
     * Set available arenas of the current group
     * by calling to the overview endpoint for each arena
     * and check if there is data for that arena.
     * Show only arenas that have data
     */

    private clearSelectedArena = () => {
        const { track } = this.context;
        track("Clear Filter", "Click", "BENCHMARK AGAINST YOUR ARENA");
        this.props.setSites(null);
    };

    private getDurationForApi = () => {
        const { from, to, isWindow } = DurationService.getDurationData(
            this.props.duration,
            "",
            "WebAnalysis",
        ).forAPI;
        return { from, to, isWindow };
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
                    // {
                    //     label: i18n("workspaces.affiliate.more.outbound"),
                    //     action: this.onMoreDropdownOutboundClick
                    // }
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
                onDeleteClick={this.onDeleteClick}
                onCloseClick={this.onCloseClick}
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
    private onDeleteClick = () => {
        TrackWithGuidService.trackWithGuid("monitor.partners.list.page.delete.click", "open");
    };
    private onCloseClick = () => {
        TrackWithGuidService.trackWithGuid("monitor.partners.list.page.delete.click", "close");
    };

    private onGroupRowDelete = async (selectedGroupRow) => {
        TrackWithGuidService.trackWithGuid("monitor.partners.list.page.delete.click", "close");
        await UserCustomCategoryService.deleteCustomCategory({ id: selectedGroupRow.categoryId });
        await this.afterGroupDelete();
    };

    private onGroupRowEdit = async () => {
        this.showCustomCategoryModal();
    };

    private showCustomCategoryModal() {
        this.setState({ showCustomCategoryWizard: true });
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

    private afterGroupDelete = () => {
        this.swNavigator.go("monitorpartners_home");
        return;
    };

    private onDownloadExcelClick = () => {
        TrackWithGuidService.trackWithGuid(
            "monitor.partners.list.page.excel.download.click",
            "submit-ok",
        );
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
            params.sites = sites;
        }
        if (sites) {
            return `api/MonitorPartnerList/${
                websiteGroup.categoryId
            }/benchmark/excel?${queryString.stringify(params)}`;
        } else {
            return `api/MonitorPartnerList/${websiteGroup.categoryId}/excel?${queryString.stringify(
                params,
            )}`;
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
                              ({ site, percentage, value }, index) => {
                                  const colorIndex = this.props.sites.split(",").indexOf(site);
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
}

const mapStateToProps = ({ routing }) => {
    const { country, websource, duration, sites, isWWW, partnerListId } = routing.params;
    const websiteGroup = UserCustomCategoryService.getCustomCategoryById(partnerListId);
    const userPartnersLists = UserCustomCategoryService.getCustomCategories();
    return {
        country: country,
        websiteGroup,
        websource: websource,
        duration: duration,
        sites: sites,
        title: websiteGroup.text,
        isWWW: isWWW,
        userPartnersLists,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSites: (value) => {
            dispatch(marketingWorkspaceSetSites(value));
        },
        clearWebsiteGroupRecommendationSuccess: () => {
            dispatch(setWebsiteGroupRecommendationSuccess(null));
        },
    };
};

const mapUrlToAction = {
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
            const websiteGroup = UserCustomCategoryService.getCustomCategoryById(id);
            if (!id || !websiteGroup) {
                return true;
            } else {
                return next === prev;
            }
        },
    },
    mapUrlToAction,
    true,
)(MonitorPartnersPage);
export default SWReactRootComponent(connected, "MonitorPartnersPage");
