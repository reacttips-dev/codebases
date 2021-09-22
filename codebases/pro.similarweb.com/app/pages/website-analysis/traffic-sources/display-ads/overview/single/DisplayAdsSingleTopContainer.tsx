import React, { FunctionComponent, useEffect, useState } from "react";
import { Loader } from "pages/website-analysis/traffic-sources/display-ads/common/Loader";
import { StyledBox } from "pages/website-analysis/traffic-sources/display-ads/overview/common/StyledComponents";
import { DisplayOverviewTitleComponent } from "pages/website-analysis/traffic-sources/display-ads/overview/common/DisplayOverviewTitleComponent";
import { abbrNumberFilter, absFilter, i18nFilter, swPositionFilter } from "filters/ngFilters";
import CountryService from "services/CountryService";
import { DefaultFetchService } from "services/fetchService";
import DurationService from "services/DurationService";
import { EmptyState } from "pages/website-analysis/traffic-sources/display-ads/overview/common/EmptyState";
import {
    BodyWrapper,
    ChangeDateWrapper,
    ChangeNumberWrapper,
    ChangeWrapper,
    TotalWrapper,
} from "pages/website-analysis/traffic-sources/display-ads/overview/single/StyledComponents";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import {
    displayAdsOverviewConfig,
    isCreativesCountrySupported,
    isNumberDecrease,
} from "pages/website-analysis/traffic-sources/display-ads/overview/single/helpers";
import { AdsTotalVisitsSingle } from "pages/website-analysis/traffic-sources/display-ads/overview/single/AdsTotalVisitsSingle";
import { DisplayAdsGraphHeaderStyle } from "pages/website-analysis/traffic-sources/display-ads/overview/overview-graph/components/StyledComponents";
import { Injector } from "common/ioc/Injector";
import { LoaderWrapper } from "pages/website-analysis/traffic-sources/display-ads/common/StyledComponents";
import SWReactRootComponent from "decorators/SWReactRootComponent";

export const DisplayAdsSingleTopContainer: FunctionComponent<any> = () => {
    const swNavigator = Injector.get("swNavigator") as any;
    const params = swNavigator.getParams();
    const fetchService = DefaultFetchService.getInstance();
    const { country, webSource, key, duration, isWWW } = params;
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
            CAMPAIGN_PAGES: {
                total: data.CampaignsLandingTotal || null,
                change: data.ChangeCampaignsLandingTotal,
            },
            DETECTED_ADS: {
                total: data.DetectedAdsTotal || null,
                change: data.ChangeDetectedAdsTotal,
            },
        };
    };

    useEffect(() => {
        async function fetchData() {
            setData(null);
            const response = await fetchService
                .get<any>("/widgetApi/WebsiteAdsIntelDisplay/WebsiteAdsDisplay/SingleMetric", {
                    appMode: "single",
                    country,
                    from,
                    includeSubDomains: isWWW === "*",
                    isWindow,
                    keys: key,
                    timeGranularity: is28d ? "Daily" : "Monthly",
                    to,
                    webSource,
                    channel: 1,
                })
                .finally(() => {
                    setIsLoading(false);
                });
            setData(transformData(response));
        }

        if (isCreativesCountrySupported(country)) {
            fetchData();
        } else {
            setIsLoading(false);
        }
    }, []);

    const getOverviewComponentTitle = (name) => {
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
                <ChangeNumberWrapper isDecrease={isDecrease}>
                    {isDecrease && `-`}
                    {!isDecrease && isDecrease !== null && `+`}
                    {change === "Infinity"
                        ? i18nFilter()("display.ads.overview.new")
                        : swPositionFilter()(absFilter()(change))}
                </ChangeNumberWrapper>
                <ChangeDateWrapper>
                    {" "}
                    {i18nFilter()("display.ads.overview.change.date", {
                        currentMonth: currentMonth,
                        lastMonth: lastMonth,
                    })}
                </ChangeDateWrapper>
            </ChangeWrapper>
        );
    };

    const getOverviewComponentBody = (name) => {
        const total = data && data[name]?.total;
        const change = data && data[name]?.change;

        return (total && total !== "NaN") || (change && change !== "NaN") ? (
            <BodyWrapper>
                <FlexRow justifyContent={"space-between"}>
                    <TotalWrapper>{abbrNumberFilter()(total)}</TotalWrapper>
                    {getChangeMetric(change)}
                </FlexRow>
            </BodyWrapper>
        ) : (
            <EmptyState
                titleKey="display.ads.overview.empty.state.title"
                subTitleKey="display.ads.overview.empty.state.sub.title"
                isSmallWidget={true}
            />
        );
    };

    const getOverviewComponent = (name) => {
        return (
            <StyledBox width="32.5%" height="168px" key={name.toLower}>
                {getOverviewComponentTitle(name)}
                {isLoading ? (
                    <LoaderWrapper>
                        <Loader />
                    </LoaderWrapper>
                ) : (
                    getOverviewComponentBody(name)
                )}
            </StyledBox>
        );
    };

    return (
        <>
            <AdsTotalVisitsSingle />
            {getOverviewComponent("CAMPAIGN_PAGES")}
            {getOverviewComponent("DETECTED_ADS")}
        </>
    );
};

SWReactRootComponent(DisplayAdsSingleTopContainer, "DisplayAdsSingleTopContainer");
