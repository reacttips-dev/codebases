import React, { FunctionComponent, useEffect, useState } from "react";
import { adsTargetURL } from "filters/ngFilters";
import { pureNumberFilter } from "filters/numberFilter";
import DurationService from "services/DurationService";
import {
    AdsWrapper,
    SeeMoreContainer,
    StyledBox,
    TitleContainer,
} from "../common/StyledComponents";
import { Loader } from "../common/Loader";
import { PaidSearchComponentTitle } from "pages/website-analysis/traffic-sources/paid-search/components/common/PaidSearchComponentTitle";
import { NoDataLandscape } from "components/NoData/src/NoData";
import { IPaidSearchOverviewProps } from "pages/website-analysis/traffic-sources/paid-search/PaidSearchOverview";
import { H3Container, TextAd } from "components/React/Table/cells/AdUnit";
import styled from "styled-components";
import { Button } from "@similarweb/ui-components/dist/button";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";

interface IData {
    Description: string;
    Page: string;
    FullPage: string;
    Title: string;
    DestUrl: string;
    targetUrl: string;
}

const TextAdWrapper = styled.div`
    > div {
        margin: 0 24px 24px 24px;
        width: unset;
        font-size: 12px;
        padding-bottom: 8px;
        padding-top: 8px;
        height: 114px;

        .description {
            line-height: 1.6 !important;
            position: relative;
            height: 80px;
            overflow: hidden;
            padding-right: 2px;
        }

        ${H3Container} {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            line-height: 16px !important;
        }
    }
`;

export const TopSearchAdsSingle: FunctionComponent<IPaidSearchOverviewProps> = (props) => {
    const { country, duration, webSource, isWWW, key } = props.navigationParams;
    const durationObject = DurationService.getDurationData(duration);
    const { from, to, isWindow } = durationObject.forAPI;
    const getDateRange = (durationObject) => [durationObject.raw.from, durationObject.raw.to];
    const [fromDate, toDate] = getDateRange(durationObject);
    const { href, fetchService, i18n } = props;
    const title = i18n("website-analysis.traffic-sources.paid-search.recent-search-ads.title");
    const subTitleFilters = [
        {
            filter: "date",
            value: {
                from: fromDate.valueOf(),
                to: toDate.valueOf(),
                useRangeDisplay: fromDate.format("YYYY-MM") !== toDate.format("YYYY-MM"),
            },
        },
        {
            filter: "webSource",
            value: webSource,
        },
    ];
    const tooltip = i18n(
        "website-analysis.traffic-sources.paid-search.recent-search-ads.title.tooltip",
    );
    const [data, setData] = useState<IData[]>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [totalCount, setTotalCount] = useState<number>(0);
    const innerCtaLink = href("competitiveanalysis_website_search_ads", {
        ...props.navigationParams,
        orderBy: "Position asc",
    });

    useEffect(() => {
        async function fetchData() {
            setData(null);
            setTotalCount(0);
            const response = await fetchService
                .get<{ Data: object[]; TotalCount: number }>("widgetApi/Search/ScrapedAds/Table", {
                    country,
                    from,
                    includeSubDomains: isWWW === "*",
                    isWindow,
                    keys: key,
                    timeGranularity: "Monthly",
                    to,
                    webSource,
                    orderBy: "Position",
                    pageSize: 3,
                    atype: "text",
                })
                .finally(() => setIsLoading(false));
            setTotalCount(response?.TotalCount);
            setData(transformData(response?.Data));
        }

        fetchData();
    }, []);

    const onClickSeeMore = () => {
        TrackWithGuidService.trackWithGuid(
            "websiteanalysis.trafficsources.paidsearch.recent_search_ads.see_more",
            "click",
        );
    };

    const onClickTextAd = (DestUrl) => {
        TrackWithGuidService.trackWithGuid(
            "websiteanalysis.trafficsources.paidsearch.recent_search_ads",
            "click",
            { SelectedUrl: DestUrl },
        );
    };

    const transformData = (data) => {
        return data?.map((record) => {
            return {
                ...record,
                targetUrl: adsTargetURL()(record),
            };
        });
    };

    const getComponent = () =>
        !data || data.length === 0 ? (
            <NoDataLandscape
                title="website-analysis.traffic-sources.paid-search.no-data"
                subtitle=""
            />
        ) : (
            <>
                <AdsWrapper>
                    {data.map((ad: IData, index) => (
                        <TextAdWrapper key={index}>
                            <TextAd {...ad} onClick={() => onClickTextAd(ad.DestUrl)} />
                        </TextAdWrapper>
                    ))}
                </AdsWrapper>
                <SeeMoreContainer onClick={onClickSeeMore} marginTop={0}>
                    <a href={innerCtaLink} target="_self">
                        <Button type="flat">
                            {i18n(
                                "website-analysis.traffic-sources.paid-search.recent-search-ads.cta",
                                { total: pureNumberFilter(totalCount) },
                            )}
                        </Button>
                    </a>
                </SeeMoreContainer>
            </>
        );

    return (
        <StyledBox
            width="50%"
            height="606"
            data-automation="total-paid-search-traffic-single"
            marginRight={24}
        >
            <TitleContainer>
                <PaidSearchComponentTitle
                    title={title}
                    tooltip={tooltip}
                    filters={subTitleFilters}
                />
            </TitleContainer>
            {isLoading ? <Loader /> : getComponent()}
        </StyledBox>
    );
};
