import {
    MetricTitle,
    NoData,
    TableLoader,
} from "pages/keyword-analysis/KeywordsOverviewPage/Components/UtilityComponents";
import { useEffect, useRef, useState } from "react";
import {
    TableContainer,
    TitleContainer,
    AddToDashboardWrapper,
    CardWrapper,
    MetricContainer,
} from "./StyledComponents";
import { i18nFilter } from "filters/ngFilters";
import { Injector } from "common/ioc/Injector";
import { DefaultFetchService } from "services/fetchService";
import { AddToDashboardButton } from "components/React/AddToDashboard/AddToDashboardButton";
import {
    EGraphGranularities,
    graphGranularityToString,
} from "pages/keyword-analysis/OrganicPage/Graph/GraphData";
import DurationService from "services/DurationService";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";
import categoryService from "common/services/categoryService";

const TableRowsAmount = 5;

const IndustryAnalysisMiniTable = ({
    HeadLineKey,
    KeywordTooltipKey = undefined,
    renderTable,
    noDataMessage = "search.overview.no.data.sub.title",
    addToDashboardParams,
    metricData,
    endPoint,
    queryParams,
}) => {
    const addToDashboardModal = useRef({ dismiss: () => null });
    const $modal = Injector.get<any>("$modal");
    const $rootScope = Injector.get("$rootScope");
    const i18n = i18nFilter();
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
        getData();
    }, [queryParams]);

    useEffect(() => {
        return () => {
            addToDashboardModal.current.dismiss();
        };
    }, [addToDashboardModal]);

    const getData = async () => {
        const apiParams = { ...queryParams };
        const fetchService = DefaultFetchService.getInstance();
        const requestPromise = fetchService.get(endPoint, apiParams);
        let response;
        try {
            response = await requestPromise;
        } catch {
            setIsLoading(false);
        }
        const dataList = response ? response["Data"]?.slice(0, TableRowsAmount) : [];
        if (dataList.length === 0) {
            setIsLoading(false);
            return;
        }
        setData(
            dataList.map((keyword) => {
                return { ...keyword };
            }),
        );
        setIsLoading(false);
    };

    const a2d = () => {
        const { categoryId, country } = queryParams;
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
        const { isWindow } = DurationService.getDurationData(addToDashboardParams.duration).forAPI;
        const timeGranularity = isWindow ? EGraphGranularities.DAILY : EGraphGranularities.MONTHLY;

        addToDashboardModal.current = $modal.open({
            animation: true,
            controller: "widgetAddToDashboardController as ctrl",
            templateUrl: "/app/components/widget/widget-add-to-dashboard-modal.html",
            windowClass: "add-to-dashboard-modal",
            resolve: {
                widget: () => null,
                customModel: () => ({
                    ...metricData,
                    country,
                    duration: addToDashboardParams.duration,
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
            <CardWrapper>
                <TitleContainer>
                    <MetricTitle
                        headline={i18n(HeadLineKey)}
                        tooltip={KeywordTooltipKey && i18n(KeywordTooltipKey)}
                        fontSize={16}
                    />
                    {metricData && (
                        <AddToDashboardWrapper>
                            <AddToDashboardButton onClick={a2d} />
                        </AddToDashboardWrapper>
                    )}
                </TitleContainer>
                {isLoading ? (
                    <TableLoader />
                ) : !data.length ? (
                    <NoData
                        paddingTop={"50px"}
                        noDataTitleKey={"search.overview.no.data.title"}
                        noDataSubTitleKey={noDataMessage}
                    />
                ) : (
                    <>
                        <TableContainer>{renderTable({ data })}</TableContainer>
                    </>
                )}
            </CardWrapper>
        </MetricContainer>
    );
};

export default IndustryAnalysisMiniTable;
