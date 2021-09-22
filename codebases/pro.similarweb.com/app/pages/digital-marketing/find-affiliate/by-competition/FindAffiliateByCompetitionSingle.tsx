import { colorsPalettes } from "@similarweb/styles";
import { tableActionsCreator } from "actions/tableActions";
import { showSuccessToast } from "actions/toast_actions";
import { Injector } from "common/ioc/Injector";
import { ECategoryType } from "common/services/categoryService.types";
import { SwNavigator } from "common/services/swNavigator";
import { swSettings } from "common/services/swSettings";
import { getToastItemComponent } from "components/React/Toast/ToastItem";
import { ETableSelectionNewGroupDropdownMode } from "components/TableSelection/src/TableSelectionNewGroupDropdown";
import { dateToUTC } from "components/widget/widget-types/ChartWidget";
import { CHART_COLORS } from "constants/ChartColors";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import {
    changeFilter,
    i18nCategoryFilter,
    i18nFilter,
    smallNumbersPercentageFilter,
} from "filters/ngFilters";
import { HELP_ARTICLE_IDS } from "help-widget/constants";
import { withHelpWidgetArticle } from "help-widget/react/hocs/withHelpWidgetArticle";
import _ from "lodash";
import { connect } from "react-redux";
import { getOverTimeChartAbsNumsConfigSingle } from "pages/website-analysis/incoming-traffic/commonOverTime";
import { IIncomingTrafficPageData } from "pages/website-analysis/incoming-traffic/compare/IncomingTrafficCompare";
import { IncomingTrafficLineChartDataTransformer } from "pages/website-analysis/incoming-traffic/IncomingTrafficLineChart";
import { IncomingTrafficTotalTrafficBoxTransformer } from "pages/website-analysis/incoming-traffic/IncomingTrafficTotalTrafficBox";
import { IncomingTrafficSingleTableSettings } from "pages/website-analysis/incoming-traffic/single/IncomingTrafficSingleTableSettings";
import {
    CloseIconButton,
    EnrichedRowHeaderTrafficShare,
    ReferralsPage,
    ToggleIconButton,
    TrafficOverTime,
    TrafficOverTimeChart,
    TrafficOverTimeChartTitle,
    TrafficOverTimeIndex,
    TrafficOverTimeLeft,
    TrafficOverTimeShareWithAbsWrap,
    TrafficOverTimeTitle,
    TrafficOverTimeWebSiteWrapForAbsNums,
} from "pages/website-analysis/incoming-traffic/StyledComponents";
import React from "react";
import { compose } from "redux";
import ABService from "services/ABService";
import { DefaultFetchService } from "services/fetchService";
import { allTrackers } from "services/track/track";
import { SWReactTableWrapperWithSelection } from "components/React/Table/SWReactTableWrapperSelectionContext";
import ComponentsProvider from "components/WithComponent/src/ComponentsProvider";
import * as queryString from "query-string";
import DurationService from "services/DurationService";
import { IncomingTrafficSingleTableTop } from "pages/website-analysis/incoming-traffic/single/IncomingTrafficSingleTableTop";
import BoxTitle from "components/BoxTitle/src/BoxTitle";
import Chart from "components/Chart/src/Chart";
import { TrafficShareWithVisits } from "components/React/Table/cells";
import { DomainSelection } from "components/React/TableSelectionComponents/DomainSelection";
import { StyledCoreWebsiteCell } from "pages/segments/analysis/StyledComponents";
import TrafficOverTimeChartNoData from "pages/website-analysis/TrafficOverTimeChartNoData";
import { WebsiteTooltip } from "components/React/Tooltip/WebsiteTooltip/WebsiteTooltip";
import { MAX_DOMAINS_IN_CATEGORY } from "components/customCategoriesWizard/custom-categories-wizard-react";
import { apiHelper } from "common/services/apiHelper";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";
import categoryService from "common/services/categoryService";

declare const similarweb;

export interface IBackendData {
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
    TotalVisitsGlobalList: { [key: string]: number };
    Categories: { [key: string]: Array<{ Name: string; Value: number }> };
    Topics: Array<{ Name: string; Value: number }>;
}

interface IFindAffiliateByCompetitionSingleProps {
    selectedRows: Array<{ Domain: string }>;
    clearAllSelectedRows: () => void;
    showToast: (href, text, label) => void;
    params: any;
}

const i18n = i18nFilter();

class FindAffiliateByCompetitionSingle extends React.PureComponent<
    IFindAffiliateByCompetitionSingleProps,
    any
> {
    private dropdownRef;
    private swNavigator = Injector.get<SwNavigator>("swNavigator");
    private swSettings = swSettings;
    private chosenSites = Injector.get<any>("chosenSites");
    private pageSize = 100;
    private $cookies: any = Injector.get("$cookies");

    constructor(props) {
        super(props);
        this.dropdownRef = React.createRef();
        this.state = {
            newGroupLoading: false,
            newGroupType: ECategoryType.PARTNERS_LIST,
            newGroupError: false,
            newGroupErrorMessage: null,
            allCategories: [],
            totalSectionData: null,
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

    public async componentDidMount() {
        const data = await this.getPageData();
        const { lineChartData } = IncomingTrafficLineChartDataTransformer(
            data,
            this.chosenSites,
            true,
        );
        const { totalTrafficData } = IncomingTrafficTotalTrafficBoxTransformer(
            data,
            this.chosenSites,
        );
        this.setState({
            lineChartData,
            totalTrafficData,
        });
    }
    public onCheckboxChange = ({ field, value }) => {
        this.swNavigator.applyUpdateParams({ [field]: value });
    };
    public render() {
        const downloadExcelPermitted = this.swSettings.current.resources.IsExcelAllowed;
        const { referralsCategory: category, duration } = this.props.params;
        const categoryName = category ? decodeURIComponent(category).split(",") : null;
        const durationObject = DurationService.getDurationData(duration, null, null, null);
        const { from, to, isCustom } = durationObject.raw;
        const { lineChartData, shouldAutoExpand } = this.state;
        const hasCustomCategoriesPermission = categoryService.hasCustomCategoriesPermission();
        const selectedRows = this.props.selectedRows;
        const pageSize = this.pageSize;
        const pageNumber = this.state.pageNumber;
        const durationDiff = DurationService.getDiffSymbol(from, to);
        const showTrafficOverTimeChartNoData = ["28d", "1m"].includes(durationDiff);
        return (
            <ReferralsPage className="sharedTooltip">
                <>
                    {lineChartData && (
                        <SWReactTableWrapperWithSelection
                            changePageCallback={this.changePageCallback}
                            tableSelectionKey="FindAffiliateByCompetitionSingle"
                            tableSelectionProperty="Domain"
                            maxSelectedRows={MAX_DOMAINS_IN_CATEGORY}
                            cleanOnUnMount={true}
                            dataParamsAdapter={this.dataParamsAdapter}
                            serverApi={this.getApiEndpoint()}
                            initialFilters={this.getInitialFilters()}
                            tableColumns={this.getColumns(hasCustomCategoriesPermission, to)}
                            transformData={this.transformData}
                            getDataCallback={this.onGetData}
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
                                            Domain,
                                            Favicon,
                                            index,
                                            TotalVisitsPerMonth,
                                            Share,
                                        } = props.row;
                                        const clickOutsideXButton = (e) => {
                                            allTrackers.trackEvent(
                                                "Open",
                                                "Click",
                                                "Traffic Over Time/Collapsed",
                                            );
                                            document.body.click();
                                        };
                                        const data = TotalVisitsPerMonth.map((item) => [
                                            dateToUTC(item.Key),
                                            item.Value,
                                        ]);
                                        const graphData = [{ data }];
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
                                                        <TrafficOverTimeWebSiteWrapForAbsNums>
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
                                                        </TrafficOverTimeWebSiteWrapForAbsNums>
                                                        <TrafficOverTimeShareWithAbsWrap>
                                                            <TrafficOverTimeTitle>
                                                                {i18n(
                                                                    "analysis.source.referrals.table.columns.share.title",
                                                                )}
                                                            </TrafficOverTimeTitle>
                                                            <EnrichedRowHeaderTrafficShare>
                                                                <TrafficShareWithVisits
                                                                    {...props.row}
                                                                    value={Share}
                                                                    row={props.row}
                                                                    layout="row"
                                                                    applyAbbrNumberFilter={true}
                                                                />
                                                            </EnrichedRowHeaderTrafficShare>
                                                        </TrafficOverTimeShareWithAbsWrap>
                                                        {/* hidden due to SIM-28057
                                          <TrafficOverTimeChangeWrap>
                                              <TrafficOverTimeTitle>{i18n('analysis.source.search.all.table.columns.change.title')}</TrafficOverTimeTitle>
                                              <ChangePercentage value={Change} {...props.row}/>
                                          </TrafficOverTimeChangeWrap>
*/}
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
                                                                    "incomingtraffic.overtime.chart.title.tooltip",
                                                                )}
                                                            >
                                                                {i18n(
                                                                    "incomingtraffic.overtime.chart.title",
                                                                )}
                                                            </BoxTitle>
                                                        </TrafficOverTimeChartTitle>
                                                        <Chart
                                                            type="area"
                                                            config={getOverTimeChartAbsNumsConfigSingle(
                                                                "line",
                                                            )}
                                                            data={graphData}
                                                            domProps={{
                                                                style: { height: "250px" },
                                                            }}
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
                                        allTrackers.trackEvent(
                                            "Open",
                                            "Click",
                                            "Traffic Over Time/Expand",
                                        );
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
                                <IncomingTrafficSingleTableTop
                                    {...topComponentProps}
                                    onCheckboxChange={this.onCheckboxChange}
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
                                    updateParams={this.swNavigator.updateParams.bind(
                                        this.swNavigator,
                                    )}
                                    params={this.props.params}
                                />
                            )}
                        </SWReactTableWrapperWithSelection>
                    )}
                </>
            </ReferralsPage>
        );
    }
    private changePageCallback(page) {
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
        return transformedParams;
    };

    public getColumns = (useSelection, to) => {
        const { duration, webSource } = this.props.params;
        const durationTooltip = _.mapValues(
            DurationService.getDurationData(duration || "", "", "").forTooltip,
            (v) => {
                return decodeURIComponent(v);
            },
        );
        const durationTooltipParams = {
            currentMonth: durationTooltip.to,
            lastMonth: durationTooltip.from,
        };

        let sortedColumn;
        if (this.state.sort) {
            const [field, sortDirection] = this.state.sort.split(" ");
            sortedColumn = {
                field,
                sortDirection,
            };
        }
        const columns = IncomingTrafficSingleTableSettings.getColumns(
            sortedColumn,
            duration === "28d",
            useSelection,
            durationTooltipParams,
            webSource,
            !to.isBefore("2018-10-01"),
        );
        return columns;
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

    public getApiEndpoint = () => {
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

        const parseTotalVisitsAndSharePerMonth = (data) => {
            const res = [];
            for (const [key, value] of Object.entries(data)) {
                res.push({ Key: key, Value: value[0].AbsValue });
            }
            return res.sort((itemA, itemB) => (itemA.Key > itemB.Key ? 1 : -1));
        };

        return {
            ...data,
            records: data.Records.map((record) => {
                return {
                    ...record,
                    TotalVisitsPerMonth: record.TotalVisitsAndSharePerMonth
                        ? parseTotalVisitsAndSharePerMonth(record.TotalVisitsAndSharePerMonth)
                        : [],
                    url: this.swNavigator.href("websites-worldwideOverview", {
                        ...params,
                        key: record.Domain,
                    }),
                    trafficDistribution: record.SiteOrigins
                        ? Object.entries(record.SiteOrigins).map(([site, value], index) => {
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
                    Rank: record.Rank === -1 ? 0 : record.Rank,
                    Share: record.FilteredShare && record.FilteredShare,
                };
            }),
        };
    };

    public onGetData = (data: IBackendData) => {
        this.setState({
            allCategories: data.AllCategories,
            topCategories: data.TopCategories,
            totalSectionData: {
                totalShare: data.TotalShare > 0.99 ? 1 : data.TotalShare,
                totalUnGroupedCount: data.TotalUnGroupedCount,
                totalVisits: this.state.totalTrafficData.visits * data.TotalShare,
            },
            referralsTrafficShare: Object.entries<number>(data.TotalVisitsGlobalList).map(
                ([domain, percentage]) => {
                    return {
                        color: Injector.get<any>("chosenSites").getSiteColor(domain),
                        name: domain,
                        percentage,
                        valueText: changeFilter()(percentage),
                        width: percentage * 100,
                    };
                },
            ),
            topics: data.Topics,
            categoriesData: similarweb.utils
                .formatTopList(data.TopCategories, 6, {
                    transformFunction: similarweb.utils.addCategoryIdFromName,
                })
                .map((cat) => {
                    return {
                        category: i18nCategoryFilter()(cat.Name),
                        categoryApi: cat.Id,
                        ...Object.entries(data.Categories).reduce(
                            (acc, [domain, domainCategories]) => {
                                return {
                                    ...acc,
                                    [domain]: cat.Value,
                                };
                            },
                            {},
                        ),
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

    public getExcel = () => {
        const params = this.dataParamsAdapter(this.getInitialFilters());
        const queryStringParams = queryString.stringify(params);
        return `export/analysis/GetTrafficSourcesReferralsTsv?${queryStringParams}`;
    };

    public showSuccessToast = (name, isNewGroup, workspaceId: string) => {
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

    public showGroupLinkToast = (name, text, label, workspaceId?: string) => {
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

    public onAdd = (s) => (event) => {};

    public onSort = ({ field, sortDirection }) => {
        this.swNavigator.applyUpdateParams({
            orderBy: `${field} ${sortDirection}`,
        });
        this.setState({
            sort: `${field} ${sortDirection}`,
        });
    };

    public setStateAsync(newState) {
        return new Promise<void>((resolve, reject) => {
            this.setState(newState, resolve);
        });
    }

    public onListTypeSelect = (typeId) => {
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

const mapStateToProps = ({
    routing: { params },
    tableSelection: { FindAffiliateByCompetitionSingle },
}) => {
    return {
        params,
        selectedRows: FindAffiliateByCompetitionSingle,
    };
};

export const mapDispatchToProps = (dispatch) => {
    return {
        clearAllSelectedRows: () => {
            dispatch(
                tableActionsCreator(
                    "FindAffiliateByCompetitionSingle",
                    "Domain",
                ).clearAllSelectedRows(),
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

const enhance = compose(
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
    }),
    withHelpWidgetArticle(HELP_ARTICLE_IDS.INCOMING_TRAFFIC),
);

SWReactRootComponent(enhance(FindAffiliateByCompetitionSingle), "FindAffiliateByCompetitionSingle");
