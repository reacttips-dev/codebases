import React, { FunctionComponent, useEffect, useState } from "react";
import { i18nFilter, minAbbrNumberFilter, percentageSignFilter } from "filters/ngFilters";
import DurationService from "services/DurationService";
import styled from "styled-components";
import { Loader } from "pages/website-analysis/traffic-sources/display-ads/common/Loader";
import { NoDataLandscape } from "components/NoData/src/NoData";
import { CenteredFlexColumn, FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import { DefaultFetchService } from "services/fetchService";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { DisplayAdsGraphHeaderStyle } from "pages/website-analysis/traffic-sources/display-ads/overview/overview-graph/components/StyledComponents";
import { DisplayOverviewTitleComponent } from "pages/website-analysis/traffic-sources/display-ads/overview/common/DisplayOverviewTitleComponent";
import CountryService from "services/CountryService";
import { LoaderWrapper } from "pages/website-analysis/traffic-sources/display-ads/common/StyledComponents";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { FlexRow } from "pages/website-analysis/website-content/leading-folders/components/Tab";

const ContentWrapper = styled(CenteredFlexColumn)`
    margin: 0 24px 24px 24px;
    height: 100%;
`;

const AdsTrafficWrapper = styled.div`
    color: ${colorsPalettes.carbon[500]};
    font-size: 44px;
    font-weight: 400;
    line-height: 56px;
    text-align: left;
`;

const AdsPercentageWrapper = styled(FlexRow)`
    font-size: 16px;
    color: ${rgba(colorsPalettes.carbon[500], 0.8)};
`;

const AdsPercentage = styled.div`
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0;
    text-align: left;
    margin-right: 5px;
`;

interface IData {
    totalAdsVisitsTraffic: number;
    totalVisitsTraffic: number;
}

export const AdsTotalVisitsCompare: FunctionComponent<any> = () => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const fetchService = DefaultFetchService.getInstance();
    const params = swNavigator.getParams();
    const { country, duration, webSource, isWWW, key } = params;
    const i18n = i18nFilter();
    const durationObject = DurationService.getDurationData(duration);
    const { from, to, isWindow } = durationObject.forAPI;
    const [data, setData] = useState<IData>(null);
    const title = i18n("display.ads.overview.total.ads.title");
    const tooltip = i18n("display.ads.overview.total.ads.tooltip");
    const subTitleFilters = [
        {
            filter: "country",
            countryCode: country,
            value: CountryService.getCountryById(country)?.text,
        },
        {
            filter: "webSource",
            value: webSource,
        },
    ];
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const is28d = duration === "28d";

    useEffect(() => {
        async function fetchData() {
            setData(null);
            const response = await fetchService
                .get<{ Data: object[] }>("widgetApi/MarketingMix/TrafficSourcesOverview/PieChart", {
                    country,
                    from,
                    includeSubDomains: isWWW === "*",
                    isWindow,
                    keys: key,
                    timeGranularity: is28d ? "Daily" : "Monthly",
                    to,
                    webSource,
                })
                .finally(() => {
                    setIsLoading(false);
                });
            setData(transformData(response?.Data));
        }
        fetchData();
    }, [from, to, isWindow, country, webSource, key]);

    const transformData = (data) => {
        const dataArr = Object.keys(data).reduce((arr, key) => arr.concat(data[key]), []);
        const totalVisitsTraffic = dataArr.reduce((totalTraffic, item) => {
            Object.values(item).map((value) => {
                totalTraffic += value;
            });
            return totalTraffic;
        }, 0);
        const totalAdsVisitsTraffic = dataArr.reduce((totalAds, item) => {
            totalAds += item["Paid Referrals"] ? item["Paid Referrals"] : 0;
            return totalAds;
        }, 0);
        return {
            totalAdsVisitsTraffic: totalAdsVisitsTraffic,
            totalVisitsTraffic: totalVisitsTraffic,
        };
    };

    const checkIfNoData = () => !data?.totalAdsVisitsTraffic;

    const getComponent = () =>
        !data || checkIfNoData() ? (
            <NoDataLandscape
                title="display.ads.overview.empty.state.title"
                subtitle="display.ads.overview.empty.state.sub.title"
            />
        ) : (
            <ContentWrapper>
                <AdsTrafficWrapper>
                    {data?.totalAdsVisitsTraffic === 0
                        ? "N/A"
                        : minAbbrNumberFilter()(data?.totalAdsVisitsTraffic)}
                </AdsTrafficWrapper>
                <AdsPercentageWrapper>
                    <AdsPercentage>
                        {percentageSignFilter()(
                            data?.totalAdsVisitsTraffic / data?.totalVisitsTraffic,
                        )}
                    </AdsPercentage>
                    {i18n("display.ads.overview.total.percentage.text")}
                </AdsPercentageWrapper>
            </ContentWrapper>
        );

    return (
        <>
            <DisplayAdsGraphHeaderStyle isSingle={false}>
                <DisplayOverviewTitleComponent
                    title={title}
                    tooltip={tooltip}
                    filters={subTitleFilters}
                />
            </DisplayAdsGraphHeaderStyle>
            {isLoading ? (
                <LoaderWrapper>
                    <Loader />
                </LoaderWrapper>
            ) : (
                getComponent()
            )}
        </>
    );
};
