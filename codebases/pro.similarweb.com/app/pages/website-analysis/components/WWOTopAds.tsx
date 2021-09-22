import BoxTitle from "components/BoxTitle/src/BoxTitle";
import { TextAd } from "components/React/Table/cells/AdUnit";
import { WidgetSubtitle } from "components/React/Widgets/WidgetsSubtitle";
import { TitleContainer } from "components/React/Widgets/WidgetsTop";
import { AdsRow } from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import styled from "styled-components";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { WidgetFooter } from "components/widget/WidgetFooter";
import { adsTargetURL, i18nFilter } from "filters/ngFilters";
import {
    NoData,
    TableLoader,
} from "pages/keyword-analysis/KeywordsOverviewPage/Components/UtilityComponents";
import React, { useState } from "react";
import { DefaultFetchService } from "services/fetchService";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";

const TopAdsContainer = styled.div`
    padding: 24px 24px 0 24px;
`;

const LinkWrapper = styled.div`
    display: flex;
    justify-content: center;
    padding-top: 16px;
`;

const WWOAdsRow = styled(AdsRow)`
    margin-top: 8px;
`;

const Text = styled.div`
    ${setFont({ $size: 14, $weight: 400, $color: rgba(colorsPalettes.carbon[500]) })};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 20px;
`;

const EndPoint = "widgetApi/Search/ScrapedAds/Table";
const TitleKey = "wwo.searchTraffic.paid.topAds.title";
const MonthlyTimeGranularity = "Monthly";
const ToolTipKey = "wwo.searchTraffic.paid.topAds.title.tooltip";
const filterParam = `Title;contains;""`;
const trackingLabel = "wwo search traffic/top ads/ paid";

export const WWOTopAds = (props) => {
    const { queryParams, noDataState, setNoDataState, routingParams } = props;
    const [response, setResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const swNavigator = Injector.get<SwNavigator>("swNavigator");

    const setData = () => {
        const fetchService = DefaultFetchService.getInstance();
        const getParams = {
            ...queryParams,
            timeGranularity: MonthlyTimeGranularity,
            filter: filterParam,
            atype: "text",
        };
        const visitsDataPromise = fetchService.get(EndPoint, getParams);
        visitsDataPromise.then((Data) => parseResult(Data)).finally(() => setIsLoading(false));
    };
    React.useEffect(setData, [queryParams]);
    const i18n = i18nFilter();

    const parseResult = (result) => {
        const FullPage = result.Data[0].FullPage;
        delete result.Data[0].FullPage;
        const fixData = { ...result.Data[0], targetUrl: FullPage };
        const data = { data: fixData, totalCount: result.TotalCount };
        setResponse(data);
    };

    const isNoDataState = !response || Object.values(response).length === 0;
    const href = swNavigator.href("websites-trafficSearch-ads", {
        ...routingParams,
        filter: filterParam,
    });
    const CtaButtonText =
        response && response.totalCount && `see all ${response.totalCount} search ads`;
    React.useEffect(() => {
        if (isNoDataState !== noDataState.TopAds) {
            setNoDataState({
                ...noDataState,
                topKeywords: isNoDataState,
            });
        }
    }, [isLoading]);
    const adsTargetURLFilter = adsTargetURL();
    const AdsTable = () => {
        const { Title, Description, DestUrl, onClick, Page } = response?.data;
        const targetUrl = adsTargetURLFilter({ DestUrl, Page });
        return (
            response?.data && (
                <WWOAdsRow atype={"text"}>
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
                </WWOAdsRow>
            )
        );
    };
    const LinkToKeyword = ({ keywords }) => {
        const href = swNavigator.href("keywordAnalysis-overview", {
            ...routingParams,
            keyword: keywords[0],
        });
        return (
            <LinkWrapper style={{ paddingTop: "16px", display: "flex" }}>
                <Text>{i18n("wwo.searchTraffic.paid.topAds.keyword.text.1")}</Text>&nbsp;
                <a href={href}>
                    <Text>{keywords[0]}</Text>
                </a>
                &nbsp;
                {keywords.length > 1 && (
                    <Text>
                        {i18n("wwo.searchTraffic.paid.topAds.keyword.text.2", {
                            count: keywords.length - 1,
                        })}
                    </Text>
                )}
            </LinkWrapper>
        );
    };
    return (
        <div>
            <TopAdsContainer>
                <TitleContainer>
                    <BoxTitle tooltip={i18n(ToolTipKey)}>{i18n(TitleKey)}</BoxTitle>
                </TitleContainer>
                {isLoading ? (
                    <TableLoader />
                ) : isNoDataState ? (
                    <NoData paddingTop={"66px"} />
                ) : (
                    <div>
                        <WidgetSubtitle webSource={"Desktop"} />
                        <AdsTable />
                        <LinkToKeyword keywords={response.data.Keywords} />
                        <WidgetFooter
                            href={href}
                            trackingLabel={trackingLabel}
                            text={CtaButtonText}
                        />
                    </div>
                )}
            </TopAdsContainer>
        </div>
    );
};
