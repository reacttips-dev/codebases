import { Injector } from "common/ioc/Injector";
import {
    MetricTitle,
    NoData,
    SeeMore,
    TableLoader,
} from "pages/keyword-analysis/KeywordsOverviewPage/Components/UtilityComponents";
import {
    TopCountriesContainer,
    TopCountriesSeeMoreWrapper,
} from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import { i18nFilter } from "filters/ngFilters";
import React, { useState } from "react";
import DurationService from "services/DurationService";
import { DefaultFetchService } from "services/fetchService";
import { TopCountriesTable } from "../../../../components/React/TopCountiresTable";

const EndPoint = "widgetApi/KeywordAnalysisOP/KeywordAnalysisByGeo/Table";
const TitleKey = "keyword.analysis.overview.topCountries.title";
const MonthlyTimeGranularity = "Monthly";
const InnerLinkPage = "keywordAnalysis-geo";

const TopCountriesInner = (props) => {
    const { queryParams, noDataState, setNoDataState, routingParams } = props;
    queryParams.includeSubDomains = true;
    delete queryParams.ShouldGetVerifiedData;
    const topCountriesQueryParams = {
        ...queryParams,
        // in the geo component we always wont to show data
        ...DurationService.getDurationData("3m").forAPI,
    };
    const [Countries, setCountries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const swNavigator = Injector.get<any>("swNavigator");
    const innerLink = swNavigator.href(InnerLinkPage, { ...routingParams });
    const setData = () => {
        const fetchService = DefaultFetchService.getInstance();
        const getParams = { ...topCountriesQueryParams, timeGranularity: MonthlyTimeGranularity };
        delete getParams.latest;
        const visitsDataPromise = fetchService.get(EndPoint, getParams);
        visitsDataPromise.then(({ Data }) => setCountries(Data)).finally(() => setIsLoading(false));
    };
    React.useEffect(setData, [queryParams]);
    const i18n = i18nFilter();
    const isNoDataState = !Countries || Object.values(Countries).length === 0;
    React.useEffect(() => {
        if (isNoDataState !== noDataState.topCountries) {
            setNoDataState({
                ...noDataState,
                topCountries: isNoDataState,
            });
        }
    }, [isLoading]);
    return (
        <TopCountriesContainer>
            <MetricTitle
                headline={i18n(TitleKey)}
                tooltip={i18n("keyword.analysis.overview.topCountries.tooltip")}
                fontSize={20}
            />
            {isLoading ? (
                <TableLoader />
            ) : isNoDataState ? (
                <NoData paddingTop={"66px"} />
            ) : (
                <div>
                    <TopCountriesTable data={Countries} />
                    <TopCountriesSeeMoreWrapper>
                        <SeeMore innerLink={innerLink} componentName={"TopCountries.Keywords"}>
                            {i18n("keyword.analysis.overview.topCountries.seeMore.button")}
                        </SeeMore>
                    </TopCountriesSeeMoreWrapper>
                </div>
            )}
        </TopCountriesContainer>
    );
};

const propsAreEqual = (prevProps, nextProps) =>
    prevProps.queryParams?.keyword === nextProps.queryParams?.keyword;
export const TopCountries = React.memo(TopCountriesInner, propsAreEqual);
