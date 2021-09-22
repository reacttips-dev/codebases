import {
    KeywordMetricsSubTitle,
    MetricTitle,
    NoData,
    TableLoader,
} from "pages/keyword-analysis/KeywordsOverviewPage/Components/UtilityComponents";
import {
    MetricContainerWithoutShadow,
    TopCategoriesContainer,
    TopCategoriesContainerLeft,
    TopCategoriesContainerRight,
} from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import { i18nFilter } from "filters/ngFilters";
import React, { useState } from "react";
import { DefaultFetchService } from "services/fetchService";
import { KeywordAnalysisPageTopCategories } from "../../../../components/React/KeywordAnalysisPageTopCategories";
import { KeywordAnalysisPageTopCategoriesTrending } from "../../../../components/React/KeywordAnalysisPageTopCategoriesTrending";

const EndPoint = "widgetApi/KeywordAnalysisOP/KeywordAnalysisTopCategoriesAndTrends/SingleMetric";
const SubTitleKey = "keyword.analysis.overview.topCategories.subTitle";
const TitleKey = "keyword.analysis.overview.topCategories.title";
const MonthlyTimeGranularity = "Monthly";

const TopCategoriesInner = (props) => {
    const { queryParams, keyWordHeaderParams, noDataState, setNoDataState } = props;
    queryParams.includeSubDomains = true;
    delete queryParams.ShouldGetVerifiedData;
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const setData = () => {
        const fetchService = DefaultFetchService.getInstance();
        const getParams = { ...queryParams, timeGranularity: MonthlyTimeGranularity };
        delete getParams.latest;
        const visitsDataPromise = fetchService.get(EndPoint, getParams);
        visitsDataPromise
            .then(({ Data }) => setCategories(Data[queryParams.keys]))
            .finally(() => setIsLoading(false));
    };
    React.useEffect(setData, [queryParams]);
    const i18n = i18nFilter();
    const onClick = (index) => {
        setSelectedCategory(index);
    };
    const isNoDataState = !categories || Object.values(categories).length === 0;
    React.useEffect(() => {
        if (isNoDataState !== noDataState.topCategories) {
            setNoDataState({
                ...noDataState,
                topCategories: isNoDataState,
            });
        }
    }, [isLoading]);
    return (
        <TopCategoriesContainer>
            <TopCategoriesContainerLeft>
                <MetricTitle headline={i18n(TitleKey)} />
                {isLoading ? (
                    <TableLoader />
                ) : isNoDataState ? (
                    <NoData paddingTop={"66px"} />
                ) : (
                    <div>
                        <KeywordMetricsSubTitle
                            webSource="none"
                            subtitle={i18n(SubTitleKey, { domain: keyWordHeaderParams.keyword })}
                        />
                        <KeywordAnalysisPageTopCategories onClick={onClick} data={categories} />
                    </div>
                )}
            </TopCategoriesContainerLeft>
            <TopCategoriesContainerRight>
                <MetricContainerWithoutShadow height={"90%"} width={"100%"}>
                    <KeywordAnalysisPageTopCategoriesTrending
                        data={categories[selectedCategory]}
                        {...props}
                        isLoading={isLoading}
                    />
                </MetricContainerWithoutShadow>
            </TopCategoriesContainerRight>
        </TopCategoriesContainer>
    );
};

const propsAreEqual = (prevProps, nextProps) =>
    prevProps.queryParams?.keyword === nextProps.queryParams?.keyword;
export const TopCategories = React.memo(TopCategoriesInner, propsAreEqual);
