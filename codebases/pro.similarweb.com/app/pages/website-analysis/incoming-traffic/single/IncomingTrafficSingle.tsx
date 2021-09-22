import { colorsPalettes } from "@similarweb/styles";
import { ButtonType } from "@similarweb/ui-components/dist/button";
import { ECategoryType } from "common/services/categoryService.types";
import { swSettings } from "common/services/swSettings";
import BoxTitle from "components/BoxTitle/src/BoxTitle";
import Chart from "components/Chart/src/Chart";
import { TrafficShareWithVisits } from "components/React/Table/cells";
import { HELP_ARTICLE_IDS } from "help-widget/constants";
import { withHelpWidgetArticle } from "help-widget/react/hocs/withHelpWidgetArticle";
import * as _ from "lodash";
import { StyledCoreWebsiteCell } from "pages/segments/analysis/StyledComponents";
import { dateToUTC } from "pages/website-analysis/incoming-traffic/chartConfig";
import { getOverTimeChartAbsNumsConfigSingle } from "pages/website-analysis/incoming-traffic/commonOverTime";
import TrafficOverTimeChartNoData from "pages/website-analysis/TrafficOverTimeChartNoData";
import * as queryString from "query-string";
import * as React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { AssetsService } from "services/AssetsService";
import DurationService from "services/DurationService";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
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
import { DefaultFetchService } from "../../../../services/fetchService";
import { PngExportService } from "../../../../services/PngExportService";
import { allTrackers } from "../../../../services/track/track";
import { IIncomingTrafficPageData } from "../compare/IncomingTrafficCompare";
import {
    IncomingTrafficLineChart,
    IncomingTrafficLineChartDataTransformer,
} from "../IncomingTrafficLineChart";
import {
    IncomingTrafficTotalTrafficBox,
    IncomingTrafficTotalTrafficBoxTransformer,
} from "../IncomingTrafficTotalTrafficBox";
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
} from "../StyledComponents";
import { IncomingTrafficSingleTableSettings } from "./IncomingTrafficSingleTableSettings";
import { IncomingTrafficSingleTableTop } from "./IncomingTrafficSingleTableTop";
import { DomainSelection } from "components/React/TableSelectionComponents/DomainSelection";
import { CookieManager } from "components/cookie-manager/CookieManager";
import { MAX_DOMAINS_IN_CATEGORY } from "components/customCategoriesWizard/custom-categories-wizard-react";
import { apiHelper } from "common/services/apiHelper";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";
import categoryService from "common/services/categoryService";

const cookieManager: CookieManager = new CookieManager();

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

interface IIncomingTrafficSingleProps {
    selectedRows: Array<{ Domain: string }>;
    clearAllSelectedRows: () => void;
    showToast: (href, text, label) => void;
    params: any;
}

const i18n = i18nFilter();

class IncomingTrafficSingle extends React.PureComponent<IIncomingTrafficSingleProps, any> {
    private dropdownRef;
    private swNavigator = Injector.get<SwNavigator>("swNavigator");
    private swSettings = swSettings;
    private chosenSites = Injector.get<any>("chosenSites");
    private pageSize = 100;
    private lineChartInstance;
    private educationBannerProps;

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
            pageNumber: 0,
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

    public render() {
        const downloadExcelPermitted = this.swSettings.current.resources.IsExcelAllowed;
        const { referralsCategory: category, webSource, duration } = this.props.params;
        const categoryName = category ? decodeURIComponent(category).split(",") : null;
        const durationObject = DurationService.getDurationData(duration, null, null, null);
        const { from, to, isWindow, isCustom } = durationObject.raw;
        const {
            lineChartTitle,
            lineChartTitleTooltip,
            totalTrafficData,
            lineChartData,
        } = this.state;
        const hasCustomCategoriesPermission = categoryService.hasCustomCategoriesPermission();
        const selectedRows = this.props.selectedRows;
        const pageSize = this.pageSize;
        const pageNumber = this.state.pageNumber;
        const durationDiff = DurationService.getDiffSymbol(from, to);
        const showTrafficOverTimeChartNoData = ["28d", "1m"].includes(durationDiff);
        const is28d = durationObject.forAPI.latest === "28d";
        return (
            <ReferralsPage className="sharedTooltip">
                <>
                    <div className="row-fluid">
                        <IncomingTrafficTotalTrafficBox
                            isLoading={!this.state.lineChartData}
                            totalTrafficData={totalTrafficData}
                            webSource={webSource}
                            to={to}
                            from={from}
                            is28d={is28d}
                        />
                        <IncomingTrafficLineChart
                            isLoading={!this.state.lineChartData}
                            isSingle={true}
                            isDaily={isWindow}
                            data={this.state.lineChartData}
                            webSource={webSource}
                            to={to}
                            from={from}
                            title={lineChartTitle}
                            titleTooltip={lineChartTitleTooltip}
                            is28d={is28d}
                            onExport={this.onLineChartExport}
                            afterRender={this.afterLineChartRender}
                        />
                    </div>
                    {lineChartData && (
                        <SWReactTableWrapperWithSelection
                            changePageCallback={this.changePageCallback}
                            tableSelectionKey="IncomingTrafficSingle"
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
                                    const cookieName = "IncomingTrafficSingleEnrichOnLoad";
                                    const cookie = cookieManager.getCookie(cookieName);

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

                                    if (isMinThreeMonths && !cookie) {
                                        cookieManager.setCookie(cookieName, true, 1);
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
                                    onCheckboxChange={this.onCheckboxChange}
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

    private afterLineChartRender = (chart) => {
        this.lineChartInstance = chart;
        return {};
    };

    private onLineChartExport = () => {
        allTrackers.trackEvent(`Download`, `submit-ok`, `Referral Visits/PNG`);
        if (this.lineChartInstance) {
            const { lineChartTitle } = this.state;
            let trimmedDateTitle =
                lineChartTitle.indexOf("from") != -1
                    ? lineChartTitle.substr(0, lineChartTitle.indexOf("from") - 1)
                    : lineChartTitle;
            trimmedDateTitle =
                lineChartTitle.indexOf("Last") != -1
                    ? lineChartTitle.substr(0, lineChartTitle.indexOf("Last") - 1)
                    : trimmedDateTitle;
            Injector.get<PngExportService>("pngExportService").export(
                this.lineChartInstance,
                trimmedDateTitle,
            );
        }
    };

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
                    // country: this.props.country,
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

    public onCheckboxChange = ({ field, value }) => {
        this.swNavigator.applyUpdateParams({ [field]: value });
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

const mapStateToProps = ({ routing: { params }, tableSelection: { IncomingTrafficSingle } }) => {
    return {
        params,
        selectedRows: IncomingTrafficSingle,
    };
};

export const mapDispatchToProps = (dispatch) => {
    return {
        clearAllSelectedRows: () => {
            dispatch(tableActionsCreator("IncomingTrafficSingle", "Domain").clearAllSelectedRows()); // todo
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
                next.routing.currentPage !== "competitiveanalysis_website_referrals_incomingtraffic"
            ) {
                return true;
            } else {
                return next === prev;
            }
        },
    }),
    withHelpWidgetArticle(HELP_ARTICLE_IDS.INCOMING_TRAFFIC),
);

SWReactRootComponent(enhance(IncomingTrafficSingle), "IncomingTrafficSingle");
