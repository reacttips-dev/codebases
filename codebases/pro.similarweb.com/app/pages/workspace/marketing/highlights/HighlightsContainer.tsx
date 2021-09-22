import React, { FC, useEffect, useMemo, useState } from "react";
import swLog from "@similarweb/sw-log";
import { HighlightCard, TrendTypes } from "pages/workspace/marketing/highlights/HighlightCard";
import { Injector } from "common/ioc/Injector";
import {
    CarouselWrapper,
    CTA,
    HeaderWrapper,
    HighlightsInnerWrapper,
    HighlightsWrapper,
} from "./StyledComponents";
import { Carousel } from "components/Carousel/src/Carousel";
import { NoMoreHighlightsCard } from "pages/workspace/marketing/highlights/NoMoreHighlightsCard";
import BoxTitle from "components/BoxTitle/src/BoxTitle";
import StyledBoxSubtitle from "styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import { i18nFilter } from "filters/ngFilters";
import { StyledPrimaryTitle } from "styled components/StyledBoxTitle/src/StyledBoxTitle";
import BoxSubtitle from "components/BoxSubtitle/src/BoxSubtitle";
import CountryService from "services/CountryService";
import { BetaLabel } from "components/BetaLabel/BetaLabel";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { SwNavigator } from "common/services/swNavigator";
import { FeedbackModal } from "pages/workspace/marketing/highlights/FeedbackModal";
import { swSettings } from "common/services/swSettings";
import DurationService from "services/DurationService";
import { marketingWorkspaceApiService } from "services/marketingWorkspaceApiService";
import dayjs from "dayjs";
import I18n from "components/WithTranslation/src/I18n";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";

interface IHighlightsContainerProps {
    arenaId: string;
    arenaCountry: number;
    webSource: string;
    country: number;
    duration: string;
    keys: string[];
    includeSubDomains: boolean;
    isWindow: boolean;
    showToast: (text?: string) => any;
    sitesColors: IDomainsColorMap[];
}

interface IDomainsColorMap {
    domain: string;
    color: string;
}

const ChannelsScore = {
    "Organic Search": 0,
    "Paid Search": 0,
    Referrals: 0,
    "Display Ads": 0,
    Social: 0,
    Direct: 1,
    Email: 1,
};

const HighlightsContainerInner: FC<IHighlightsContainerProps> = ({
    arenaId,
    webSource,
    country,
    duration,
    keys,
    includeSubDomains,
    isWindow,
    showToast,
    sitesColors,
    arenaCountry,
}) => {
    const [highlightsData, setHighlightsData] = useState([]);
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const component = swSettings.current;
    const durationObject = useMemo(() => DurationService.getDurationData(duration, ""), [
        duration,
        component,
    ]);
    const to = durationObject.raw.to.valueOf();
    const componentEndDate = component.endDate.valueOf();
    const periodDuration = useMemo(
        () => durationObject.raw.to.diff(durationObject.raw.from, "months"),
        [durationObject],
    );
    const showHighlights =
        ((periodDuration < 3 && to === componentEndDate) || isWindow) &&
        webSource !== "MobileWeb" &&
        arenaCountry === country;

    const parseTraffic = (traffic) =>
        Object.entries(traffic)
            .map(([key, val]) => [dayjs.utc(key).valueOf(), val])
            .sort((a, b) => (a[0] > b[0] ? 1 : -1));

    const calcTrendChange = (parsedTraffic) =>
        (parsedTraffic[3][1] / parsedTraffic[2][1] +
            parsedTraffic[2][1] / parsedTraffic[1][1] +
            parsedTraffic[1][1] / parsedTraffic[0][1]) /
            3 -
        1;

    const calcAnomalyChange = (parsedTraffic) => parsedTraffic[3][1] / parsedTraffic[2][1] - 1;

    const enrichHighlightsData = (rawData) =>
        rawData.map((highlightsObj) => {
            const parsedTraffic = parseTraffic(highlightsObj.traffic);

            return {
                ...highlightsObj,
                traffic: parsedTraffic,
                color:
                    sitesColors.find((s: IDomainsColorMap) => s.domain === highlightsObj.site)
                        .color ?? "#000000",
                change: TrendTypes.includes(highlightsObj.metric)
                    ? calcTrendChange(parsedTraffic)
                    : calcAnomalyChange(parsedTraffic),
            };
        });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await marketingWorkspaceApiService.getStrategicOverviewHighlights(
                    arenaId,
                    includeSubDomains,
                );
                setHighlightsData(sortHighlights(enrichHighlightsData(response)));
            } catch (e) {
                swLog.warn("Error in fetching alerts data:" + e);
            } finally {
                swLog.info("Successfully fetched alerts data");
            }
        };
        fetchData();
    }, [includeSubDomains]);

    ///////////   Helpers methods  //////////////////

    const subtitleFilters = [
        {
            filter: "icon",
            value: i18nFilter()("datepicker.lastn", {
                count: "7",
                unit: i18nFilter()("datepicker.units.day.nomerous"),
            }),
            iconName: "daily-ranking",
        },
        {
            filter: "country",
            countryCode: country,
            value: CountryService.getCountryById(country).text,
        },
        {
            filter: "webSource",
            value: "Desktop",
        },
    ];

    // 1. Sort by channel (binary hierarchy)
    // show first: organic, paid, display, social, referral
    // show last: direct, email
    // 2. Sort by Math.abs() of magnitude
    const sortHighlights = (highlightsData) => {
        return highlightsData.sort((a, b) =>
            ChannelsScore[a.channel] > ChannelsScore[b.channel]
                ? 1
                : ChannelsScore[a.channel] === ChannelsScore[b.channel]
                ? Math.abs(a.change) < Math.abs(b.change)
                    ? 1
                    : -1
                : -1,
        );
    };

    const onCTAClicked = () => {
        TrackWithGuidService.trackWithGuid("highlights.cta.clicked", "click");

        swNavigator.go("websites-trafficOverview", {
            key: keys.toString(),
            country: country,
            duration: "1m",
            isWWW: swNavigator.getParams().isWWW ? swNavigator.getParams().isWWW : "*",
            webSource: webSource,
            category: "no-category",
        });
    };

    const onCardClicked = (channel: string) => {
        TrackWithGuidService.trackWithGuid("highlights.card.clicked", "click");

        swNavigator.go("websites-trafficOverview", {
            key: keys.toString(),
            country: country,
            duration: "1m",
            isWWW: swNavigator.getParams().isWWW ? swNavigator.getParams().isWWW : "*",
            webSource: webSource,
            category: "no-category",
            channelAnalysisChannel: channel,
            channelAnalysisMtd: true,
        });
    };

    return (
        <div data-automation="marketing-highlights">
            {highlightsData.length > 0 && showHighlights && (
                <HighlightsWrapper>
                    <HighlightsInnerWrapper>
                        <HeaderWrapper>
                            <FlexColumn>
                                <StyledPrimaryTitle>
                                    <BoxTitle
                                        tooltip={i18nFilter()(
                                            "arena.strategic-overview.highlights.header.tooltip",
                                        )}
                                    >
                                        {i18nFilter()(
                                            "arena.strategic-overview.highlights.header.title",
                                        )}
                                        <BetaLabel />
                                    </BoxTitle>
                                </StyledPrimaryTitle>
                                <StyledBoxSubtitle>
                                    <BoxSubtitle filters={subtitleFilters} />
                                </StyledBoxSubtitle>
                            </FlexColumn>
                            <FeedbackModal showToast={showToast} />
                        </HeaderWrapper>
                        <CarouselWrapper>
                            <Carousel margin={16} offset={24} data-automation>
                                {[
                                    ...highlightsData.map((highlightObj) => (
                                        <HighlightCard
                                            site={highlightObj.site}
                                            type={highlightObj.metric}
                                            channel={highlightObj.channel}
                                            change={highlightObj.change}
                                            traffic={highlightObj.traffic}
                                            color={highlightObj.color}
                                            key={highlightObj.id}
                                            onCardClicked={onCardClicked}
                                        />
                                    )),
                                    highlightsData.length === 1 && (
                                        <NoMoreHighlightsCard key={"no-more-highlights"} />
                                    ),
                                ]}
                            </Carousel>
                        </CarouselWrapper>
                        <CTA>
                            <IconButton
                                type="flat"
                                iconName="arrow-right"
                                iconSize="xs"
                                onClick={onCTAClicked}
                                placement="right"
                            >
                                <I18n>{"arena.strategic-overview.highlights.cta"}</I18n>
                            </IconButton>
                        </CTA>
                    </HighlightsInnerWrapper>
                </HighlightsWrapper>
            )}
        </div>
    );
};

const propsAreEqual = (prevProps, nextProps) => {
    return (
        prevProps.arenaId === nextProps.arenaId &&
        prevProps.arenaCountry === nextProps.arenaCountry &&
        prevProps.webSource === nextProps.webSource &&
        prevProps.country === nextProps.country &&
        prevProps.duration === nextProps.duration &&
        prevProps.includeSubDomains === nextProps.includeSubDomains &&
        prevProps.isWindow === nextProps.isWindow
    );
};
export const HighlightsContainer = React.memo(HighlightsContainerInner, propsAreEqual);
