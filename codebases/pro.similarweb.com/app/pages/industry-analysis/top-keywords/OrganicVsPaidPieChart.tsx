import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { colorsPalettes } from "@similarweb/styles";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { DefaultFetchService } from "services/fetchService";
import DurationService from "services/DurationService";
import { Injector } from "common/ioc/Injector";
import Chart from "components/Chart/src/Chart";
import combineConfigs from "components/Chart/src/combineConfigs";
import noMarginConfig from "../../../../.pro-features/components/Chart/src/configs/margin/noMarginConfig";
import noLegendConfig from "../../../../.pro-features/components/Chart/src/configs/legend/noLegendConfig";
import {
    EGraphGranularities,
    graphGranularityToString,
} from "pages/keyword-analysis/OrganicPage/Graph/GraphData";
import { LegendWithOneLineBulletFlex } from "@similarweb/ui-components/dist/legend";
import {
    MetricTitle,
    NoData,
} from "pages/keyword-analysis/KeywordsOverviewPage/Components/UtilityComponents";
import { i18nFilter, percentageFilter } from "filters/ngFilters";
import {
    TitleContainer,
    AddToDashboardWrapper,
    PieChartContainer,
    LegendsContainer,
    MetricContainer,
} from "./StyledComponents";
import { AddToDashboardButton } from "components/React/AddToDashboard/AddToDashboardButton";
import { CircularLoader } from "@similarweb/ui-components/dist/circular-loader";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";
import categoryService from "common/services/categoryService";

const endPoint = "widgetApi/IndustryAnalysisTopKeywords/SearchKeywordsAbb/PieChart";
const paidColor = colorsPalettes.sky[300];
const organicColor = colorsPalettes.blue[400];
const noDataMessage = "search.overview.no.data.sub.title";

const Loader = () => (
    <CircularLoader
        options={{
            svg: {
                stroke: "#dedede",
                strokeWidth: "4",
                r: 21,
                cx: "50%",
                cy: "50%",
            },
            style: {
                width: 46,
                height: 46,
                position: "absolute",
                top: "calc(50% - 23px)",
                left: "calc(50% - 23px)",
            },
        }}
    />
);

const OrganicVsPaidPieChart = (props) => {
    const addToDashboardModal = useRef({ dismiss: () => null });
    const { category, country, duration } = props;
    const $modal = Injector.get<any>("$modal");
    const $rootScope = Injector.get("$rootScope");
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);
    const [pieChartValues, setPieChartValues] = useState({ organic: undefined, paid: undefined });
    const i18n = i18nFilter();

    const getData = async () => {
        const { from, to, isWindow } = DurationService.getDurationData(duration).forAPI;
        const categoryObject = categoryService.categoryQueryParamToCategoryObject(category);
        const keys = categoryObject.forApi;
        const timeGranularity = isWindow ? EGraphGranularities.DAILY : EGraphGranularities.MONTHLY;
        const apiParams = {
            category: categoryObject.forDisplayApi,
            country,
            from,
            to,
            keys,
            includeSubDomains: true,
            isWindow,
            timeGranularity: graphGranularityToString[timeGranularity],
            webSource: "Desktop",
        };

        const fetchService = DefaultFetchService.getInstance();
        const requestPromise = fetchService.get(endPoint, apiParams);
        let response;
        try {
            response = await requestPromise;
            const _data = response.Data[keys];

            setPieChartValues({
                organic: percentageFilter()(_data.Organic, 2) + "%",
                paid: percentageFilter()(_data.Paid, 2) + "%",
            });
            setData([
                {
                    type: "pie",
                    data: [
                        {
                            name: "Organic",
                            color: organicColor,
                            y: _data.Organic,
                        },
                        {
                            name: "Paid",
                            color: paidColor,
                            y: _data.Paid,
                        },
                    ],
                },
            ]);
            setIsLoading(false);
        } catch {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getData();
        return () => {
            addToDashboardModal.current.dismiss();
        };
    }, []);

    const a2d = () => {
        const categoryId = categoryService.categoryQueryParamToCategoryObject(category).id;
        const isCustomCategory = UserCustomCategoryService.isCustomCategory(categoryId);
        const categoryData = isCustomCategory
            ? UserCustomCategoryService.getCustomCategoryByName(categoryId.slice(1))
            : categoryService.getCategory(categoryId);

        const key = isCustomCategory
            ? { id: categoryData.id, name: categoryData.name, category: categoryData.id }
            : {
                  id: `$${categoryData.id}`,
                  name: categoryData.text,
                  category: `$${categoryData.id}`,
              };

        const { isWindow } = DurationService.getDurationData(duration).forAPI;
        const timeGranularity = isWindow ? EGraphGranularities.DAILY : EGraphGranularities.MONTHLY;

        addToDashboardModal.current = $modal.open({
            animation: true,
            controller: "widgetAddToDashboardController as ctrl",
            templateUrl: "/app/components/widget/widget-add-to-dashboard-modal.html",
            windowClass: "add-to-dashboard-modal",
            resolve: {
                widget: () => null,
                customModel: () => ({
                    type: "PieChart",
                    metric: "SearchKeywordsAbb",
                    webSource: "Desktop",
                    country,
                    duration,
                    family: "Industry",
                    key: [key],
                    customAsset: "Industry",
                    filters: {
                        timeGranularity: graphGranularityToString[timeGranularity],
                    },
                }),
            },
            scope: $rootScope.$new(true),
        });
    };

    return (
        <MetricContainer width="100%" height="284px">
            <TitleContainer>
                <MetricTitle headline={i18n("ia.topkeywords.organicpaid")} fontSize={16} />
                <AddToDashboardWrapper>
                    <AddToDashboardButton onClick={a2d} />
                </AddToDashboardWrapper>
            </TitleContainer>
            {isLoading ? (
                <Loader />
            ) : !data.length ? (
                <NoData
                    paddingTop={"50px"}
                    noDataTitleKey={"search.overview.no.data.title"}
                    noDataSubTitleKey={noDataMessage}
                />
            ) : (
                <PieChartContainer>
                    <Chart
                        type={"pie"}
                        config={getPieConfig()}
                        data={data}
                        domProps={{ style: { minWidth: 144 } }}
                    />
                    <LegendsContainer>
                        <LegendWithOneLineBulletFlex
                            text="Organic"
                            isChecked
                            size={1}
                            labelColor={organicColor}
                            value={pieChartValues.organic}
                        />
                        <LegendWithOneLineBulletFlex
                            text="Paid"
                            isChecked
                            size={1}
                            labelColor={paidColor}
                            value={pieChartValues.paid}
                        />
                    </LegendsContainer>
                </PieChartContainer>
            )}
        </MetricContainer>
    );
};

const getPieConfig = () => {
    const type = "pie";
    return combineConfigs({ type }, [
        noMarginConfig,
        noLegendConfig,
        {
            chart: {
                type,
                width: 144,
                height: "auto",
                plotBackgroundColor: "transparent",
                events: {},
            },
            plotOptions: {
                pie: {
                    innerSize: "60%",
                    dataLabels: true,
                },
            },
            tooltip: {
                formatter: function (tooltip) {
                    return this.key + "<br /><b>" + this.percentage.toFixed(2) + "%</b>";
                },
            },
        },
    ]);
};

const mapStateToProps = (state) => {
    const {
        routing: { params },
    } = state;

    return {
        duration: params.duration,
        country: params.country,
        category: params.category,
    };
};

const connected = connect(mapStateToProps)(OrganicVsPaidPieChart);

export default SWReactRootComponent(connected, "OrganicVsPaidPieChart");
