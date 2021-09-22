import { Injector } from "common/ioc/Injector";
import { ShoppingAd, TextAd } from "components/React/Table/cells/AdUnit";
import { adsTargetURL, i18nFilter } from "filters/ngFilters";
import {
    KeywordMetricsSubTitle,
    MetricTitle,
    NoData,
    SeeMore,
    TableLoader,
} from "pages/keyword-analysis/KeywordsOverviewPage/Components/UtilityComponents";
import { getSeeMoreCount } from "pages/keyword-analysis/KeywordsOverviewPage/Components/UtilityFunctions";
import {
    AdsContainer,
    AdsRow,
    AdsTable,
} from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import React, { useState } from "react";
import { DefaultFetchService } from "services/fetchService";

const Text = "text";
const Position = "Position";
const SortArguments = { sort: Position, asc: true, orderBy: Position, pageSize: 3 };
const LoaderConstants = {
    columnsAmount: 1,
    rowsAmount: 3,
    cellHeight: 100,
    cellWidth: "35%",
    isBorder: false,
    isCenter: true,
};

export const AdsInner = (props) => {
    const { queryParams, routingParams, constants, noDataCallbackUpdate } = props;
    const {
        EndPoint,
        InnerLinkPage,
        WebSource,
        HeadLineKey,
        SeeAllKey,
        AdType,
        ComponentName,
    } = constants;
    const [adsData, setAdsData] = useState({ totalRecords: undefined, records: undefined });
    const [isLoading, setIsLoading] = useState(true);
    const setData = () => {
        const fetchService = DefaultFetchService.getInstance();
        const apiParams = { ...queryParams, webSource: WebSource, atype: AdType, ...SortArguments };
        const cpcDataPromise = fetchService.get(EndPoint, apiParams);
        cpcDataPromise
            .then(({ TotalCount, Data }) => setAdsData({ totalRecords: TotalCount, records: Data }))
            .finally(() => setIsLoading(false));
    };
    React.useEffect(setData, [queryParams]);
    const i18n = i18nFilter();
    const swNavigator = Injector.get<any>("swNavigator");
    const innerLink = swNavigator.href(InnerLinkPage, { ...routingParams, webSource: WebSource });
    const { totalRecords, records } = adsData;
    const seeMoreCount = getSeeMoreCount(totalRecords);
    const amountSeeMoreTooltipParams = { totalCount: seeMoreCount };
    const adsTargetURLFilter = adsTargetURL();
    const isNoDataState = !adsData || adsData.records?.length === 0;
    React.useEffect(() => {
        noDataCallbackUpdate && noDataCallbackUpdate(isNoDataState);
    }, [isLoading]);
    return (
        <>
            <MetricTitle headline={i18n(HeadLineKey)} />
            {isLoading ? (
                <TableLoader {...LoaderConstants} />
            ) : isNoDataState ? (
                <NoData paddingTop="130px" />
            ) : (
                <AdsContainer>
                    <KeywordMetricsSubTitle webSource={WebSource} />
                    <AdsTable>
                        {records?.map(
                            (
                                {
                                    Title,
                                    Description,
                                    DestUrl,
                                    onClick,
                                    Price,
                                    Brand,
                                    ImageUrl,
                                    Page,
                                },
                                index,
                            ) => {
                                const targetUrl = adsTargetURLFilter({ DestUrl, Page });
                                return (
                                    <AdsRow key={index} atype={AdType}>
                                        {AdType === Text ? (
                                            <TextAd
                                                {...{
                                                    Title,
                                                    Description,
                                                    DestUrl,
                                                    targetUrl,
                                                    onClick,
                                                }}
                                                withBorder={false}
                                            />
                                        ) : (
                                            <ShoppingAd
                                                {...{
                                                    Title,
                                                    Price,
                                                    Brand,
                                                    ImageUrl,
                                                    Description,
                                                    DestUrl,
                                                    targetUrl,
                                                    onClick,
                                                }}
                                            />
                                        )}
                                    </AdsRow>
                                );
                            },
                        )}
                    </AdsTable>
                    <SeeMore componentName={ComponentName} innerLink={innerLink}>
                        {i18n(SeeAllKey, amountSeeMoreTooltipParams)}
                    </SeeMore>
                </AdsContainer>
            )}
        </>
    );
};

const propsAreEqual = (prevProps, nextProps) =>
    prevProps.queryParams?.keyword === nextProps.queryParams?.keyword;
export const Ads = React.memo(AdsInner, propsAreEqual);
