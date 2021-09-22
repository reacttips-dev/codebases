import { colorsPalettes } from "@similarweb/styles";
import { ECategoryType } from "common/services/categoryService.types";
import { swSettings } from "common/services/swSettings";
import BoxTitle from "components/BoxTitle/src/BoxTitle";
import Chart from "components/Chart/src/Chart";
import { TrafficShare } from "components/React/Table/cells";
import { TrafficShareWithTooltip } from "components/TrafficShare/src/TrafficShareWithTooltip";
import { StyledCoreWebsiteCell } from "pages/segments/analysis/StyledComponents";
import { getOverTimeChartAbsNumsConfigCompare } from "pages/website-analysis/incoming-traffic/commonOverTime";
import TrafficOverTimeChartNoData from "pages/website-analysis/TrafficOverTimeChartNoData";
import * as queryString from "query-string";
import * as React from "react";
import { connect } from "react-redux";
import ABService from "services/ABService";
import DurationService from "services/DurationService";
import { ETableSelectionNewGroupDropdownMode } from "../../../../../.pro-features/components/TableSelection/src/TableSelectionNewGroupDropdown";
import ComponentsProvider from "../../../../../.pro-features/components/WithComponent/src/ComponentsProvider";
import { Injector } from "../../../../../scripts/common/ioc/Injector";
import { SwNavigator } from "../../../../../scripts/common/services/swNavigator";
import { tableActionsCreator } from "../../../../actions/tableActions";
import { showSuccessToast } from "../../../../actions/toast_actions";
import { SWReactTableWrapperWithSelection } from "../../../../components/React/Table/SWReactTableWrapperSelectionContext";
import { getToastItemComponent } from "../../../../components/React/Toast/ToastItem";
import { WebsiteTooltip } from "../../../../components/React/Tooltip/WebsiteTooltip/WebsiteTooltip";
import { CHART_COLORS } from "../../../../constants/ChartColors";
import SWReactRootComponent from "../../../../decorators/SWReactRootComponent";
import {
    changeFilter,
    i18nCategoryFilter,
    i18nFilter,
    smallNumbersPercentageFilter,
} from "../../../../filters/ngFilters";
import { IncomingReferralsAdvancedFilterService } from "../../../../services/AdvancedFilterService/IncomingReferralsAdvancedFilter";
import { DefaultFetchService } from "../../../../services/fetchService";
import { allTrackers } from "../../../../services/track/track";
import { IncomingTrafficLineChartDataTransformer } from "../../../website-analysis/incoming-traffic/IncomingTrafficLineChart";
import { IncomingTrafficPieChartDataTransformer } from "../../../website-analysis/incoming-traffic/IncomingTrafficPieChart";
import {
    CloseIconButton,
    ReferralsPage,
    ToggleIconButton,
    TrafficOverTime,
    TrafficOverTimeChangeWrapShare,
    TrafficOverTimeChart,
    TrafficOverTimeChartTitle,
    TrafficOverTimeIndex,
    TrafficOverTimeLeft,
    TrafficOverTimeShareWrap,
    TrafficOverTimeTitle,
    TrafficOverTimeWebSiteWrap,
} from "../../../website-analysis/incoming-traffic/StyledComponents";
import { IncomingTrafficCompareTableSettings } from "../../../website-analysis/incoming-traffic/compare/IncomingTrafficCompareTableSettings";
import { IncomingTrafficCompareTableTop } from "../../../website-analysis/incoming-traffic/compare/IncomingTrafficCompareTableTop";
import { DomainSelection } from "components/React/TableSelectionComponents/DomainSelection";
import { ISwSettings } from "app/@types/ISwSettings";
import { MAX_DOMAINS_IN_CATEGORY } from "components/customCategoriesWizard/custom-categories-wizard-react";
import { apiHelper } from "common/services/apiHelper";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";
import categoryService from "common/services/categoryService";

interface IBackendData {
    AllCategories: Array<{
        Count: number;
        Name: string;
        Value: number;
    }>;
    TopCategories: Array<{
        Count: number;
        Name: string;
        Value: number;
    }>;
    TotalShare: number;
    TotalUnGroupedCount: number;
    TotalVisits: number;
    TotalVisitsGlobalList: Record<string, number>;
    Categories: Record<string, Array<{ Name: string; Value: number }>>;
    Topics: Array<{ Name: string; Value: number }>;
}

export interface IIncomingTrafficPageData {
    dictionary: {
        [key: string]: {
            Dates: string[];
            SearchTotal: number;
            VolumeTotal: number;
            Volumes: Array<[number, number]>;
        };
    };
}

interface IIncomingTrafficCompareProps {
    selectedRows: Array<{ Domain: string }>;
    clearAllSelectedRows: () => void;
    showToast: (href, text, label) => void;
    params: any;
}

const i18n = i18nFilter();

class FindAffiliateByCompetitionCompare extends React.PureComponent<
    IIncomingTrafficCompareProps,
    any
> {
    private dropdownRef;
    private swNavigator = Injector.get<SwNavigator>("swNavigator");
    private swSettings: ISwSettings = swSettings;
    private chosenSites = Injector.get<any>("chosenSites");
    private pageSize = 100;
    private $cookies: any = Injector.get("$cookies");

    constructor(props) {
        super(props);
        this.dropdownRef = React.createRef();
        this.state = {
            allCategories: [],
            totalSectionData: null,
            newGroupType: ECategoryType.PARTNERS_LIST,
            tableSelectionMode: ETableSelectionNewGroupDropdownMode.GROUP_LIST,
            lineChartTitle: i18n("analysis.common.trafficsource.referrals.title"),
            lineChartTitleTooltip: i18n("analysis.common.trafficsource.referrals.title.tooltip"),
            educationalVideoModalIsOpen: false,
            pageNumber: 0,
            shouldAutoExpand: ABService.getFlag("vwoAutoExpandTableRow"),
            sort: this.props.params?.orderBy,
        };
        this.changePageCallback = this.changePageCallback.bind(this);
    }

    public async componentDidMount(): Promise<void> {
        const { orderBy } = this.props.params;
        if (orderBy && orderBy.includes("EngagementScore")) {
            this.swNavigator.updateParams({ orderBy: null });
        }

        const data = await this.getPageData();
        const { lineChartData } = IncomingTrafficLineChartDataTransformer(data, this.chosenSites);
        const { pieChartData } = IncomingTrafficPieChartDataTransformer(data, this.chosenSites);
        this.setState({
            lineChartData,
            pieChartData,
        });
    }
    public onCheckboxChange = ({ field, value }) => {
        this.swNavigator.applyUpdateParams({ [field]: value });
    };
    public render(): JSX.Element {
        const downloadExcelPermitted = this.swSettings.current.resources.IsExcelAllowed;
        const {
            referralsCategory: category,
            limits,
            engagementTypeFilter,
            duration,
            key,
        } = this.props.params;
        const durationObject = DurationService.getDurationData(duration, null, null, null);
        const { from, to, isCustom } = durationObject.raw;
        const categoryName = category ? decodeURIComponent(category).split(",") : null;
        const { shouldAutoExpand } = this.state;
        const hasCustomCategoriesPermission = categoryService.hasCustomCategoriesPermission();
        const selectedRows = this.props.selectedRows;
        const pageSize = this.pageSize;
        const pageNumber = this.state.pageNumber;
        const durationDiff = DurationService.getDiffSymbol(from, to);
        const showTrafficOverTimeChartNoData = ["28d", "1m"].includes(durationDiff);
        return (
            <ReferralsPage className="sharedTooltip">
                <SWReactTableWrapperWithSelection
                    changePageCallback={this.changePageCallback}
                    tableSelectionKey="IncomingTrafficCompare"
                    tableSelectionProperty="Domain"
                    maxSelectedRows={MAX_DOMAINS_IN_CATEGORY}
                    cleanOnUnMount={true}
                    serverApi={this.getApiEndpoint()}
                    initialFilters={this.getInitialFilters()}
                    tableColumns={this.getColumns(hasCustomCategoriesPermission, to)}
                    transformData={this.transformData}
                    getDataCallback={this.onGetData}
                    dataParamsAdapter={this.dataParamsAdapter}
                    tableOptions={{
                        metric: "MarketingWorkspaceWebsiteGroupTable",
                        aboveHeaderComponents: [
                            <DomainSelection
                                key="DomainSelection"
                                showToast={this.props.showToast}
                                clearAllSelectedRows={this.props.clearAllSelectedRows}
                                selectedRows={this.props.selectedRows}
                            />,
                        ],
                        showCompanySidebar: true,
                        tableSelectionTrackingParam: "Domain",
                        trackName: "Traffic Sources",
                        get enrichedRowComponentClass() {
                            return `DropdownContent-container ${
                                selectedRows && selectedRows.length > 0 ? "selected" : ""
                            }`;
                        },
                        get EnrichedRowComponent() {
                            return (props) => {
                                const {
                                    index,
                                    Favicon,
                                    Domain,
                                    TotalShare,
                                    trafficDistribution,
                                    SiteOriginsPerMonth,
                                    TotalVisitsAndSharePerMonth,
                                } = props.row;
                                const keys = key.split(",");
                                const clickOutsideXButton = (): void => {
                                    allTrackers.trackEvent(
                                        "Open",
                                        "Click",
                                        "Traffic Over Time/Collapsed",
                                    );
                                    document.body.click();
                                };
                                const colors = CHART_COLORS.compareMainColors.slice();
                                const categories = SiteOriginsPerMonth.map((x) =>
                                    new Date(x.Key).getTime(),
                                );
                                const data = keys.reduce((result, site) => {
                                    const siteData = [];
                                    for (const value of Object.values(
                                        TotalVisitsAndSharePerMonth,
                                    )) {
                                        const siteObj = (value as Array<{
                                            AbsValue: number;
                                            Value: number;
                                            Site: string;
                                        }>).find((item) => item.Site === site);
                                        if (siteObj) {
                                            siteData.push({
                                                y: siteObj.AbsValue,
                                                share: siteObj.Value,
                                            });
                                        }
                                    }
                                    result.push({ name: site, data: siteData });
                                    return result;
                                }, []);
                                return (
                                    <div>
                                        <TrafficOverTime>
                                            <TrafficOverTimeLeft>
                                                <div onClick={clickOutsideXButton}>
                                                    <ToggleIconButton
                                                        iconName="chev-up"
                                                        type="flat"
                                                    />
                                                </div>
                                                <TrafficOverTimeIndex>
                                                    {pageNumber * pageSize + index + 1}
                                                </TrafficOverTimeIndex>
                                                <TrafficOverTimeWebSiteWrap>
                                                    <ComponentsProvider
                                                        components={{ WebsiteTooltip }}
                                                    >
                                                        <StyledCoreWebsiteCell
                                                            icon={Favicon}
                                                            domain={Domain}
                                                            externalLink={`http://${Domain}`}
                                                            trackExternalLink={() =>
                                                                allTrackers.trackEvent(
                                                                    "external link",
                                                                    "click",
                                                                    `Conversion Category Overview`,
                                                                )
                                                            }
                                                        />
                                                    </ComponentsProvider>
                                                </TrafficOverTimeWebSiteWrap>
                                                <TrafficOverTimeShareWrap>
                                                    <TrafficOverTimeTitle>
                                                        {i18n(
                                                            "analysis.source.search.all.table.columns.totalShareCompare.title",
                                                        )}
                                                    </TrafficOverTimeTitle>
                                                    <TrafficShare
                                                        {...props.row}
                                                        value={TotalShare}
                                                        row={props.row}
                                                    />
                                                </TrafficOverTimeShareWrap>
                                                <TrafficOverTimeChangeWrapShare>
                                                    <TrafficOverTimeTitle>
                                                        {i18n(
                                                            "analysis.source.search.all.table.columns.shareCompare.title",
                                                        )}
                                                    </TrafficOverTimeTitle>
                                                    <TrafficShareWithTooltip
                                                        data={trafficDistribution}
                                                        title={i18n(
                                                            "incomingtraffic.competitivetrafficshare.tooltip",
                                                        )}
                                                    />
                                                </TrafficOverTimeChangeWrapShare>
                                            </TrafficOverTimeLeft>
                                            <CloseIconButton
                                                type="flat"
                                                onClick={clickOutsideXButton}
                                                iconName="clear"
                                                placement="left"
                                            />
                                        </TrafficOverTime>
                                        {!showTrafficOverTimeChartNoData ? (
                                            <TrafficOverTimeChart>
                                                <TrafficOverTimeChartTitle>
                                                    <BoxTitle
                                                        tooltip={i18n(
                                                            "incomingtraffic.overtime.compare.chart.title.tooltip",
                                                        )}
                                                    >
                                                        {i18n(
                                                            "incomingtraffic.overtime.compare.chart.title",
                                                        )}
                                                    </BoxTitle>
                                                </TrafficOverTimeChartTitle>
                                                <Chart
                                                    type="column"
                                                    config={getOverTimeChartAbsNumsConfigCompare({
                                                        type: "column",
                                                        colors,
                                                        categories,
                                                    })}
                                                    data={data}
                                                    domProps={{ style: { height: "250px" } }}
                                                />
                                            </TrafficOverTimeChart>
                                        ) : (
                                            <TrafficOverTimeChartNoData />
                                        )}
                                    </div>
                                );
                            };
                        },
                        get enrichedRowComponentHeight() {
                            return 580;
                        },
                        shouldApplyEnrichedRowHeightToCell: false,
                        shouldEnrichRow: (props, index, e) => {
                            const openEnrich = e?.currentTarget?.childNodes[0]?.className.includes(
                                "enrich",
                            );
                            if (openEnrich) {
                                allTrackers.trackEvent("Open", "Click", "Traffic Over Time/Expand");
                            }
                            return openEnrich;
                        },
                        get enrichOnLoadRowNumber() {
                            if (!shouldAutoExpand) {
                                return null;
                            }

                            let isMinThreeMonths;
                            // 'isCustom' ie. not a preset duration.
                            if (!isCustom) {
                                isMinThreeMonths = duration !== "28d" && duration !== "1m";
                            } else {
                                isMinThreeMonths =
                                    DurationService.diffByUnit(
                                        durationObject.forAPI.from,
                                        durationObject.forAPI.to,
                                        "months",
                                    ) +
                                        1 >=
                                    3;
                            }

                            if (isMinThreeMonths) {
                                return 1;
                            }
                            return null;
                        },
                        onEnrichedRowClick: (isOpen, rowIndex, row) => {
                            // console.log('onEnrichedRowClick');
                        },
                        customTableClass: "incoming-traffic-table",
                    }}
                    recordsField="records"
                    totalRecordsField="TotalCount"
                    onSort={this.onSort}
                    pageIndent={1}
                >
                    {(topComponentProps) => (
                        <IncomingTrafficCompareTableTop
                            {...topComponentProps}
                            onCheckboxChange={this.onCheckboxChange}
                            selectedLimits={limits}
                            selectedEngagementTypeFilter={engagementTypeFilter || null}
                            selectedCategoryId={category}
                            selectedCategory={categoryName}
                            allCategories={this.state.allCategories}
                            totalSectionData={this.state.totalSectionData}
                            referralsTrafficShare={this.state.referralsTrafficShare}
                            excelLink={this.getExcel()}
                            downloadExcelPermitted={downloadExcelPermitted}
                            topics={this.state.topics}
                            categoriesData={this.state.categoriesData}
                            domainMetaData={this.state.domainMetaData}
                            href={this.swNavigator.href.bind(this.swNavigator)}
                            current={this.swNavigator.current.bind(this.swNavigator)}
                            updateParams={this.swNavigator.updateParams.bind(this.swNavigator)}
                            params={this.props.params}
                            convertLimitsToApiParam={this.convertLimitsToApiParam}
                        />
                    )}
                </SWReactTableWrapperWithSelection>
            </ReferralsPage>
        );
    }

    private changePageCallback(page): void {
        this.setState({ pageNumber: page });
    }

    private dataParamsAdapter = (params) => {
        const transformedParams = { ...params };
        if (transformedParams.filter) {
            delete transformedParams.filter;
        }
        if (transformedParams.sort) {
            delete transformedParams.sort;
        }
        if (transformedParams.referralsCategory) {
            transformedParams.Category = transformedParams.referralsCategory;
            delete transformedParams.referralsCategory;
        }
        // convert limits param to actual api param
        if (transformedParams.limits) {
            transformedParams.limits = this.convertLimitsToApiParam(transformedParams.limits);
        }
        return transformedParams;
    };

    public getColumns = (useSelection, to) => {
        const { webSource, duration } = this.props.params;
        let sortedColumn;
        if (this.state.sort) {
            const [field, sortDirection] = this.state.sort.split(" ");
            sortedColumn = {
                field,
                sortDirection,
            };
        }
        const columns = IncomingTrafficCompareTableSettings.getColumns(
            sortedColumn,
            useSelection,
            webSource,
            duration === "28d",
            !to.isBefore("2018-10-01"),
        );
        return columns;
    };

    public convertLimitsToApiParam = (limits) => {
        const filters = IncomingReferralsAdvancedFilterService.getAllFilters();
        return filters.find((filter) => filter.id === limits).api;
    };

    public getInitialFilters = () => {
        const params = { ...this.props.params };
        // orderBy
        if (!params.orderBy) {
            params.orderBy = "TotalShare desc";
        }
        const apiParams = apiHelper.transformParamsForAPI(params);
        return apiParams;
    };

    public getApiEndpoint = (): string => {
        const { webSource } = this.props.params;
        switch (webSource) {
            case "MobileWeb":
                return "/api/websiteanalysis/GetTrafficSourcesMobileWebReferralsTable";
            case "Total":
                return "/api/websiteanalysis/GetTrafficSourcesTotalReferralsTable";
            case "Desktop":
                return "/api/websiteanalysis/GetTrafficSourcesReferralsTable";
        }
    };

    public transformData = (data) => {
        const params = this.props.params;
        const keys = params.key.split(",");
        return {
            ...data,
            records: data.Records.map((record) => {
                return {
                    ...record,
                    TotalSharePerMonth: record.TotalSharePerMonth ? record.TotalSharePerMonth : [],
                    SiteOriginsPerMonth: record.SiteOriginsPerMonth
                        ? record.SiteOriginsPerMonth
                        : [],
                    url: this.swNavigator.href("websites-worldwideOverview", {
                        ...params,
                        key: record.Domain,
                    }),
                    EngagementScores: record.EngagementScores
                        ? Object.entries(record.EngagementScores).map(([key, val]) => ({
                              name: key,
                              score: val,
                          }))
                        : [],
                    TotalShare: record.FilteredShare && record.FilteredShare,
                    trafficDistribution: record.SiteOrigins
                        ? Object.entries(record.SiteOrigins).map(([site, value]) => {
                              const colorIndex = keys.indexOf(site);
                              return {
                                  color: colorsPalettes.carbon[0],
                                  backgroundColor: CHART_COLORS.main[colorIndex],
                                  width: value,
                                  text: smallNumbersPercentageFilter()(value, 1),
                                  name: site,
                              };
                          })
                        : [],
                    Children: Array.isArray(record.Children)
                        ? record.Children.map((child) => {
                              return {
                                  ...child,
                                  url: this.swNavigator.href("websites-worldwideOverview", {
                                      ...params,
                                      key: child.Domain,
                                  }),
                                  // country: this.props.country,
                                  trafficDistribution: child.SiteOrigins
                                      ? Object.entries(child.SiteOrigins).map(([site, value]) => {
                                            const colorIndex = keys.indexOf(site);
                                            return {
                                                color: colorsPalettes.carbon[0],
                                                backgroundColor: CHART_COLORS.main[colorIndex],
                                                width: value,
                                                text: smallNumbersPercentageFilter()(value, 1),
                                                name: site,
                                            };
                                        })
                                      : [],
                              };
                          })
                        : null,
                };
            }),
            TotalVisitsGlobalList: Object.entries<number>(data.TotalVisitsGlobalList).map(
                ([domain, percentage]) => {
                    return {
                        color: this.chosenSites.getSiteColor(domain),
                        name: domain,
                        percentage,
                        valueText: changeFilter()(percentage),
                        width: percentage * 100,
                    };
                },
            ),
        };
    };

    public onGetData = (data: IBackendData): void => {
        // This code uses legacy chosenItems service to populate the categories table
        const temp = {
            categories: {
                CategoriesList: [],
            },
        };
        this.chosenSites.registerLists(
            temp,
            [
                {
                    name: "Categories",
                    topList: data.TopCategories,
                    func(obj, category) {
                        if (
                            category.Name.toLowerCase() !== "others" &&
                            category.Name.toLowerCase() !== "other"
                        ) {
                            obj.Id = category.Name.replace("/", "~");
                        }
                        return obj;
                    },
                },
            ],
            "categories",
            data,
        );
        //

        this.setState({
            allCategories: data.AllCategories,
            topCategories: data.TopCategories,
            totalSectionData: {
                totalShare: data.TotalShare > 0.99 ? 1 : data.TotalShare,
                totalUnGroupedCount: data.TotalUnGroupedCount,
                totalVisits: data.TotalVisits,
            },
            referralsTrafficShare: data.TotalVisitsGlobalList,
            topics: data.Topics,
            categoriesData: temp.categories.CategoriesList.map((cat) => {
                return {
                    category: i18nCategoryFilter()(cat.name),
                    categoryApi: cat.Id,
                    ...Object.entries(data.Categories).reduce((acc, [domain, domainCategories]) => {
                        const { value } = cat.sites.find((site) => site.name === domain);
                        return {
                            ...acc,
                            [domain]: [value],
                        };
                    }, {}),
                };
            }),
            domainMetaData: this.chosenSites.map((site) => {
                return {
                    icon: this.chosenSites.listInfo[site].icon,
                    name: site,
                    color: this.chosenSites.getSiteColor(site),
                };
            }),
        });
    };

    public getExcel = (): string => {
        const params = this.dataParamsAdapter(this.getInitialFilters());
        const queryStringParams = queryString.stringify(params);
        return `export/analysis/GetTrafficSourcesReferralsTsv?${queryStringParams}`;
    };

    public showSuccessToast = (name, isNewGroup, workspaceId?: string): void => {
        this.props.clearAllSelectedRows();
        this.setState({
            tableSelectionMode: ETableSelectionNewGroupDropdownMode.GROUP_LIST,
            newGroupErrorMessage: null,
            newGroupError: false,
        });
        this.dropdownRef.current.close();
        const text = isNewGroup
            ? i18n("table.selection.websites.groupcreated")
            : i18n("table.selection.websites.groupupdated");
        this.showGroupLinkToast(name, text, i18n("table.selection.websites.seegroup"), workspaceId);
    };

    public showGroupLinkToast = (name, text, label, workspaceId?: string): void => {
        const params = this.props.params;
        let linkToGroup;
        if (workspaceId) {
            const groupId = UserCustomCategoryService.getCustomCategories().find(
                (c) => c.text === name,
            ).categoryId;
            linkToGroup = this.swNavigator.href("marketingWorkspace-websiteGroup", {
                websiteGroupId: groupId,
                workspaceId,
                ...params,
            });
        } else {
            linkToGroup = this.swNavigator.href("industryAnalysis-overview", {
                ...params,
                category: `*${name}`,
            });
        }
        this.dropdownRef.current.close();
        this.props.showToast(linkToGroup, text, label);
    };

    public onSort = ({ field, sortDirection }): void => {
        this.swNavigator.applyUpdateParams({
            orderBy: `${field} ${sortDirection}`,
        });
        this.setState({
            sort: `${field} ${sortDirection}`,
        });
    };

    public setStateAsync(newState): Promise<void> {
        return new Promise<void>((resolve) => {
            this.setState(newState, resolve);
        });
    }

    public onListTypeSelect = (typeId): void => {
        this.setState({ newGroupType: typeId });
    };

    private getPageData = (): Promise<IIncomingTrafficPageData> => {
        const params = { ...this.props.params };
        Object.keys(params).forEach((key) => params[key] === undefined && delete params[key]);
        if (params.limits) {
            delete params.limits;
        }
        const apiParams = apiHelper.transformParamsForAPI(params);
        let endpoint = "";
        switch (params.webSource) {
            case "MobileWeb":
                endpoint = "/api/websiteanalysis/GetTrafficSourcesMobileWebReferrals";
                break;
            case "Total":
                endpoint = "/api/websiteanalysis/GetTrafficSourcesTotalReferrals";
                break;
            case "Desktop":
                endpoint = "/api/websiteanalysis/GetTrafficSourcesReferrals";
                break;
        }

        return DefaultFetchService.getInstance().get(endpoint, apiParams);
    };
}

const mapStateToProps = ({ routing: { params }, tableSelection: { IncomingTrafficCompare } }) => {
    return {
        params,
        selectedRows: IncomingTrafficCompare,
    };
};

export const mapDispatchToProps = (dispatch) => {
    return {
        clearAllSelectedRows: () => {
            dispatch(
                tableActionsCreator("IncomingTrafficCompare", "Domain").clearAllSelectedRows(),
            ); // todo
        },
        showToast: (href, text, label) => {
            dispatch(
                showSuccessToast(
                    getToastItemComponent({
                        text,
                        linkText: label,
                        href,
                        onClick: () =>
                            allTrackers.trackEvent(
                                "add to Custom Category",
                                "click",
                                "internal link/websites.overview",
                            ),
                    }),
                ),
            );
        },
    };
};

export default SWReactRootComponent(
    connect(mapStateToProps, mapDispatchToProps, null, {
        areStatesEqual: (next, prev) => {
            if (
                next.routing.currentPage !== "websites-trafficReferrals" &&
                next.routing.currentPage !== "findaffiliates_bycompetition"
            ) {
                return true;
            } else {
                return next === prev;
            }
        },
    })(FindAffiliateByCompetitionCompare),
    "FindAffiliateByCompetitionCompare",
);
