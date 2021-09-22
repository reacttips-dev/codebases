import React, { FunctionComponent, useEffect, useState } from "react";
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
import { ShoppingAd } from "components/React/Table/cells/AdUnit";
import styled from "styled-components";
import { Button } from "@similarweb/ui-components/dist/button";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";

interface IData {
    Title: string;
    Price: string;
    Brand: string;
    ImageUrl: string;
    DestUrl: string;
}

const ShoppingAdWrapper = styled.div`
    > div {
        margin: 0 24px 24px 24px;
        width: unset;
        font-size: 12px;
        .image-container {
            height: 130px;
        }
    }
`;

export const TopProductAdsSingle: FunctionComponent<IPaidSearchOverviewProps> = (props) => {
    const { country, duration, webSource, isWWW, key } = props.navigationParams;
    const durationObject = DurationService.getDurationData(duration);
    const { from, to, isWindow } = durationObject.forAPI;
    const getDateRange = (durationObject) => [durationObject.raw.from, durationObject.raw.to];
    const [fromDate, toDate] = getDateRange(durationObject);
    const { href, fetchService, i18n } = props;
    const title = i18n("website-analysis.traffic-sources.paid-search.top-product-ads.title");
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
        "website-analysis.traffic-sources.paid-search.top-product-ads.title.tooltip",
    );
    const [data, setData] = useState<IData[]>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [totalCount, setTotalCount] = useState<number>(0);
    const innerCtaLink = href("competitiveanalysis_website_search_plaResearch", {
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
                    atype: "shopping",
                })
                .finally(() => setIsLoading(false));
            setTotalCount(response?.TotalCount);
            setData(transformData(response?.Data));
        }

        fetchData();
    }, []);

    const onClick = () => {
        TrackWithGuidService.trackWithGuid(
            "websiteanalysis.trafficsources.paidsearch.top_product_ads.see_more",
            "click",
        );
    };

    const onClickShoppingAd = (DestUrl) => {
        window.open(DestUrl, "_blank").focus();

        TrackWithGuidService.trackWithGuid(
            "websiteanalysis.trafficsources.paidsearch.top_product_ads",
            "click",
            {
                SelectedUrl: DestUrl,
            },
        );
    };

    const transformData = (data) => {
        return data?.map((record) => {
            const { Title, Price, Brand, ImageUrl, DestUrl } = record;
            return { Title, Price, Brand, ImageUrl, DestUrl };
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
                        <ShoppingAdWrapper key={index}>
                            <ShoppingAd
                                {...ad}
                                onImageClick={() => onClickShoppingAd(ad.DestUrl)}
                            />
                        </ShoppingAdWrapper>
                    ))}
                </AdsWrapper>
                <SeeMoreContainer onClick={onClick} marginTop={0}>
                    <a href={innerCtaLink} target="_self">
                        <Button type="flat">
                            {i18n(
                                "website-analysis.traffic-sources.paid-search.top-product-ads.cta",
                                { total: pureNumberFilter(totalCount) },
                            )}
                        </Button>
                    </a>
                </SeeMoreContainer>
            </>
        );

    return (
        <StyledBox width="50%" height="606" data-automation="total-paid-search-traffic-single">
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
