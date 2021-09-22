import React, { FunctionComponent, useEffect, useState } from "react";
import { Loader } from "pages/website-analysis/traffic-sources/display-ads/common/Loader";
import { StyledBox } from "pages/website-analysis/traffic-sources/display-ads/overview/common/StyledComponents";
import { DisplayOverviewTitleComponent } from "pages/website-analysis/traffic-sources/display-ads/overview/common/DisplayOverviewTitleComponent";
import {
    absFilter,
    changeFilter,
    i18nFilter,
    minAbbrNumberFilter,
    percentageSignFilter,
} from "filters/ngFilters";
import CountryService from "services/CountryService";
import { DefaultFetchService } from "services/fetchService";
import DurationService from "services/DurationService";
import { ChangeValue } from "@similarweb/ui-components/dist/change-value";
import { EmptyState } from "pages/website-analysis/traffic-sources/display-ads/overview/common/EmptyState";
import {
    BodyWrapper,
    ChangeDateWrapper,
    ChangeNumberWrapper,
    ChangeWrapper,
    TotalWrapper,
    VolumeWrapper,
} from "pages/website-analysis/traffic-sources/display-ads/overview/single/StyledComponents";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import {
    displayAdsOverviewConfig,
    isNumberDecrease,
} from "pages/website-analysis/traffic-sources/display-ads/overview/single/helpers";
import { DisplayAdsGraphHeaderStyle } from "pages/website-analysis/traffic-sources/display-ads/overview/overview-graph/components/StyledComponents";
import { Injector } from "common/ioc/Injector";
import { LoaderWrapper } from "pages/website-analysis/traffic-sources/display-ads/common/StyledComponents";

export const AdsTotalVisitsSingle: FunctionComponent<any> = () => {
    const swNavigator = Injector.get("swNavigator") as any;
    const params = swNavigator.getParams();
    const { country, webSource, key, duration, isWWW } = params;
    const fetchService = DefaultFetchService.getInstance();
    const { from, to, isWindow } = DurationService.getDurationData(duration).forAPI;
    const rawDate = DurationService.getDurationData(duration).raw.to.clone();
    const currentMonth = rawDate.format("MMM YYYY");
    const lastMonth = rawDate.subtract(1, "months").format("MMM YYYY");
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const is28d = duration === "28d";

    const transformData = (response) => {
        const data = response.Data[key];
        return {
            total: data.AdsTotal || null,
            volume: data.VolumeTotal,
            change: data.ChangeAdsTotal,
        };
    };

    useEffect(() => {
        async function fetchData() {
            setData(null);
            const response = await fetchService
                .get<any>("/widgetApi/WebsiteDisplayAds/WebsiteAdsVisitsOverview/SingleMetric", {
                    appMode: "single",
                    country,
                    from,
                    includeSubDomains: isWWW === "*",
                    isWindow,
                    keys: key,
                    timeGranularity: is28d ? "Daily" : "Monthly",
                    to,
                    webSource,
                    channel: -1,
                })
                .finally(() => {
                    setIsLoading(false);
                });

            setData(transformData(response));
        }
        fetchData();
    }, []);

    const getComponentTitle = (name) => {
        const title = i18nFilter()(displayAdsOverviewConfig[name].title);
        const tooltip = i18nFilter()(displayAdsOverviewConfig[name].tooltip);
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
        return (
            <DisplayAdsGraphHeaderStyle isSingle={false}>
                <DisplayOverviewTitleComponent
                    title={title}
                    tooltip={tooltip}
                    filters={subTitleFilters}
                />
            </DisplayAdsGraphHeaderStyle>
        );
    };

    const getChangeMetric = (change) => {
        const isDecrease = isNumberDecrease(change, duration);
        return is28d ? (
            <ChangeWrapper isDecrease={null}>
                <ChangeNumberWrapper isDecrease={null}>{"N/A"}</ChangeNumberWrapper>
                <ChangeDateWrapper>
                    {i18nFilter()("display.ads.overview.change.last28days")}
                </ChangeDateWrapper>
            </ChangeWrapper>
        ) : (
            <ChangeWrapper isDecrease={isDecrease}>
                <ChangeValue
                    value={
                        change === "Infinity"
                            ? i18nFilter()("display.ads.overview.new")
                            : changeFilter()(absFilter()(change))
                    }
                    isDecrease={isDecrease}
                    descriptionText={i18nFilter()("display.ads.overview.change.date", {
                        currentMonth: currentMonth,
                        lastMonth: lastMonth,
                    })}
                />
            </ChangeWrapper>
        );
    };

    const getComponentBody = () => {
        const total = data?.total;
        const change = data?.change;
        const volume = data?.volume;

        return (total && total !== "NaN") || (change && change !== "NaN") ? (
            <BodyWrapper>
                <FlexRow justifyContent={"space-between"}>
                    <TotalWrapper>{minAbbrNumberFilter()(total)}</TotalWrapper>
                    {getChangeMetric(change)}
                </FlexRow>
                <VolumeWrapper>
                    {i18nFilter()("display.ads.overview.total.ads.volume", {
                        value: percentageSignFilter()(volume, 2),
                    })}
                </VolumeWrapper>
            </BodyWrapper>
        ) : (
            <EmptyState
                titleKey="display.ads.overview.empty.state.title"
                subTitleKey="display.ads.overview.empty.state.sub.title"
                isSmallWidget={true}
            />
        );
    };

    return (
        <StyledBox width="32.5%" height="168px" key={"total_ads"}>
            {getComponentTitle("TOTAL_ADS")}
            {isLoading ? (
                <LoaderWrapper>
                    <Loader />
                </LoaderWrapper>
            ) : (
                getComponentBody()
            )}
        </StyledBox>
    );
};
