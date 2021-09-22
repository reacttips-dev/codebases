import React, { FC, useEffect, useState } from "react";
import { i18nFilter } from "filters/ngFilters";
import DurationService from "services/DurationService";
import { DefaultFetchService } from "services/fetchService";
import { Loader } from "pages/website-analysis/traffic-sources/display-ads/common/Loader";
import { Button } from "@similarweb/ui-components/dist/button";
import { EmptyState } from "../common/EmptyState";
import { DisplayOverviewTitleComponent } from "pages/website-analysis/traffic-sources/display-ads/overview/common/DisplayOverviewTitleComponent";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import CountryService from "services/CountryService";
import { Carousel } from "components/Carousel/src/Carousel";
import DisplayTile from "pages/website-analysis/traffic-sources/ads/components/Tiles/DisplayTile";
import { CarouselWrapper } from "pages/website-analysis/traffic-sources/display-ads/overview/single/StyledComponents";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { DisplayAdsGraphHeaderStyle } from "pages/website-analysis/traffic-sources/display-ads/overview/overview-graph/components/StyledComponents";
import { Injector } from "common/ioc/Injector";
import { LoaderWrapper } from "pages/website-analysis/traffic-sources/display-ads/common/StyledComponents";
import { RightFlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { isCreativesCountrySupported } from "pages/website-analysis/traffic-sources/display-ads/overview/single/helpers";

export const RecentlySpottedCreatives: FC<any> = () => {
    const swNavigator = Injector.get("swNavigator") as any;
    const params = swNavigator.getParams();
    const fetchService = DefaultFetchService.getInstance();
    const { country, webSource, key, duration, isWWW } = params;
    const { from, to, isWindow } = DurationService.getDurationData(duration).forAPI;
    const title = i18nFilter()("display.ads.overview.recently.spotted.creatives.title");
    const tooltip = i18nFilter()("display.ads.overview.recently.spotted.creatives.title.tooltip");
    const [data, setData] = useState<object[]>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const is28d = duration === "28d";
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

    const transformData = (data) => {
        return data.map((item) => {
            return {
                Size: `${item.Width}x${item.Height}`,
                ...item,
            };
        });
    };

    useEffect(() => {
        async function fetchData() {
            setData(null);
            const response = await fetchService
                .get<{ Data: object[] }>(
                    "widgetApi/WebsiteAdsIntelDisplay/WebsiteAdsDisplayCreatives/Table",
                    {
                        country,
                        from,
                        includeSubDomains: isWWW === "*",
                        isWindow,
                        keys: key,
                        timeGranularity: is28d ? "Daily" : "Monthly",
                        to,
                        pageSize: 5,
                        webSource,
                        orderBy: "last_seen desc",
                        channel: -1,
                    },
                )
                .finally(() => {
                    setIsLoading(false);
                });

            setData(transformData(response.Data));
        }

        if (isCreativesCountrySupported(country)) {
            fetchData();
        } else {
            setIsLoading(false);
        }
    }, [from, to, isWindow, country, webSource, key]);

    const ctaClicked = () => {
        TrackWithGuidService.trackWithGuid(
            "display_ads.overview.recently_spotted_creatives.cta.click",
            "click",
        );
        swNavigator.go("websites-trafficDisplay-creatives", params);
    };

    const getComponent = () =>
        data && data.length > 0 ? (
            <>
                <CarouselWrapper className="tiles-container">
                    <Carousel margin={16} offset={24} data-automation>
                        {[
                            ...data.map((creativeObj, index) => (
                                <DisplayTile key={index} item={creativeObj} />
                            )),
                        ]}
                    </Carousel>
                </CarouselWrapper>
                <RightFlexRow>
                    <Button
                        onClick={ctaClicked}
                        type="flat"
                        label={i18nFilter()("display.ads.overview.recently.spotted.creatives.cta")}
                    />
                </RightFlexRow>
            </>
        ) : (
            <EmptyState
                titleKey="display.ads.overview.empty.state.title"
                subTitleKey="display.ads.overview.empty.state.sub.title"
            />
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

SWReactRootComponent(RecentlySpottedCreatives, "RecentlySpottedCreatives");
