import { swSettings } from "common/services/swSettings";
import * as queryString from "query-string";
import * as React from "react";
import { Injector } from "../../../../../../scripts/common/ioc/Injector";
import { SwNavigator } from "../../../../../../scripts/common/services/swNavigator";
import SWReactTableWrapper, {
    SWReactTableWrapperBox,
} from "../../../../../components/React/Table/SWReactTableWrapper";
import { CHART_COLORS } from "../../../../../constants/ChartColors";
import {
    i18nCategoryFilter,
    i18nFilter,
    smallNumbersPercentageFilter,
} from "../../../../../filters/ngFilters";
import { IBackendData } from "../../../incoming-traffic/single/IncomingTrafficSingle";
import {
    IncomingTrafficCompareTableSettings,
    IncomingTrafficSingleTableSettings,
} from "./IncomingTrafficSingleTableSettings";
import { IncomingTrafficSingleTableTop } from "./IncomingTrafficSingleTableTop";
import SWReactRootComponent from "../../../../../decorators/SWReactRootComponent";
import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";
import BoxSubtitle from "components/BoxSubtitle/src/BoxSubtitle";
import { PrimaryBoxTitle } from "styled components/StyledBoxTitle/src/StyledBoxTitle";
import { SubTitleReferrals } from "pages/website-analysis/incoming-traffic/StyledComponents";
import { colorsPalettes } from "@similarweb/styles";
import { TableNoData } from "components/React/Table/FlexTable/Big/FlexTableStatelessComponents";
import {
    Separator,
    Title,
} from "pages/website-analysis/traffic-sources/mmx/single/StyledComponents";
import { apiHelper } from "common/services/apiHelper";
import { buildFiltersForTable } from "./IncomingTrafficTableUtils";
import categoryService from "common/services/categoryService";

declare const similarweb;

@SWReactRootComponent
export class IncomingTrafficRefferalTable extends React.PureComponent<any, any> {
    private swNavigator = Injector.get<SwNavigator>("swNavigator");
    private swSettings: any = swSettings;
    private chosenSites = Injector.get<any>("chosenSites");

    constructor(props) {
        super(props);
        this.state = {
            allCategories: [],
        };
    }

    getTitleSection = () => {
        const title = i18nFilter()("analysis.common.trafficsource.referrals.websites");
        const { webSource } = this.swNavigator.getParams();
        const subTitleFilters = [
            {
                filter: "webSource",
                value: webSource,
            },
        ];
        return (
            <SWReactTableWrapperBox>
                <Title>
                    <PrimaryBoxTitle>{title}</PrimaryBoxTitle>
                    <SubTitleReferrals>
                        <BoxSubtitle filters={subTitleFilters} />
                    </SubTitleReferrals>
                </Title>
                <Separator />
                <TableNoData
                    messageTitle={i18nFilter()(
                        "analysis.source.referrals.table.no_data_mobile_subdomains",
                    )}
                    messageSubtitle={null}
                />
            </SWReactTableWrapperBox>
        );
    };

    public render() {
        const downloadExcelPermitted = this.swSettings.current.resources.IsExcelAllowed;
        const { search, webSource, isWWW, category } = this.swNavigator.getParams();
        const selectedCategory = category ? categoryService.getCategory(category, "id") : null;

        return webSource === devicesTypes.MOBILE && isWWW !== "*" ? (
            this.getTitleSection()
        ) : (
            <SWReactTableWrapper
                serverApi={this.getApiEndpoint()}
                initialFilters={this.getInitialFilters()}
                tableColumns={this.getColumns()}
                transformData={this.transformData}
                getDataCallback={this.onGetData}
                tableOptions={{
                    metric: "MarketingWorkspaceWebsiteGroupTable",
                    showCompanySidebar: true,
                    trackName: "Traffic Sources",
                }}
                recordsField="records"
                totalRecordsField="TotalCount"
                onSort={this.onSort}
                pageIndent={1}
            >
                {(topComponentProps) => (
                    <IncomingTrafficSingleTableTop
                        {...topComponentProps}
                        searchTerm={search}
                        selectedCategoryId={category}
                        selectedCategory={selectedCategory}
                        allCategories={this.state.allCategories}
                        excelLink={this.getExcel()}
                        downloadExcelPermitted={downloadExcelPermitted}
                        topics={this.state.topics}
                        categoriesData={this.state.categoriesData}
                        domainMetaData={this.state.domainMetaData}
                    />
                )}
            </SWReactTableWrapper>
        );
    }

    public getColumns = () => {
        const { orderBy, duration, key } = this.swNavigator.getParams();
        const mode = key.split(",").length > 1 ? "compare" : "single";
        let sortedColumn;
        if (orderBy) {
            const [field, sortDirection] = orderBy.split(" ");
            sortedColumn = {
                field,
                sortDirection,
            };
        }
        return mode === "single"
            ? IncomingTrafficSingleTableSettings.getColumns(sortedColumn, duration === "28d")
            : IncomingTrafficCompareTableSettings.getColumns(sortedColumn);
    };

    public getInitialFilters = () => {
        let searchFilter = "";
        let categoryFilter = "";

        const params = this.swNavigator.getParams();
        params.filter = {};
        if (params.category === "no-category") {
            delete params.category;
        }

        // category
        if (params.referralsCategory) {
            params.category = params.referralsCategory;
            delete params.referralsCategory;
        }

        // search
        if (params.search) {
            searchFilter = params.search;
            delete params.search;
        }

        if (params.category) {
            categoryFilter = params.category;
        }

        // orderBy
        if (!params.orderBy) {
            params.orderBy = "TotalShare desc";
        }

        const { filter } = buildFiltersForTable({
            search: searchFilter,
            category: categoryFilter,
        });

        params.filter = filter;

        return apiHelper.transformParamsForAPI(params);
    };

    public getApiEndpoint = () => {
        const params = this.swNavigator.getParams();
        switch (params.webSource) {
            case "MobileWeb":
                return "/api/websiteanalysis/GetTrafficSourcesMobileWebReferralsTable";
            case "Total":
                return "/api/websiteanalysis/GetTrafficSourcesTotalReferralsTable";
            case "Desktop":
                return "/api/websiteanalysis/GetTrafficSourcesReferralsTable";
        }
    };

    public transformData = (data) => {
        const params = this.swNavigator.getParams();
        const keys = params.key.split(",");
        return {
            ...data,
            records: data.Records.map((record) => {
                return {
                    ...record,
                    url: this.swNavigator.href("websites-worldwideOverview", {
                        ...this.swNavigator.getParams(),
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
                totalVisits: data.TotalVisits,
            },
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
        const params = this.getInitialFilters();
        const queryStringParams = queryString.stringify(params);
        return `export/analysis/GetTrafficSourcesReferralsTsv?${queryStringParams}`;
    };

    public onSort = ({ field, sortDirection }) => {
        this.swNavigator.applyUpdateParams({
            orderBy: `${field} ${sortDirection}`,
        });
    };
}
