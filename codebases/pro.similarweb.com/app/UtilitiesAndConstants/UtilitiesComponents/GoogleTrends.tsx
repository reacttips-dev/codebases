import { Dayjs } from "dayjs";
import React from "react";
import CountryService from "services/CountryService";

interface IGoogleTrendsProps {
    countryId: number | string;
    keyword: string;
    dateRange: { from: Dayjs; to: Dayjs };
}

export const GOOGLE_TRENDS_DATE_FORMAT = "YYYY-MM-DD";

// more about embed Google trends can be found here https://support.google.com/trends/answer/4365538?hl=en
export const GoogleTrends: React.FunctionComponent<IGoogleTrendsProps> = (props) => {
    const { countryId, keyword, dateRange } = props;
    const { from, to } = dateRange;
    const googleTrendsDateRange = `${from.format(GOOGLE_TRENDS_DATE_FORMAT)} ${to.format(
        GOOGLE_TRENDS_DATE_FORMAT,
    )}`;
    const googleCountryCode = CountryService.getGoogleCountryCodeById(countryId);
    const CONTAINER_ID = "sw-google-trends-container";
    React.useEffect(() => {
        const targetContainer = document.getElementById(CONTAINER_ID);
        const comparisonItem = [{ keyword, geo: googleCountryCode, time: googleTrendsDateRange }];
        const queryBasicParams = { comparisonItem, category: 0, property: "" };
        (window as any).trends.embed.renderExploreWidgetTo(
            targetContainer,
            "TIMESERIES",
            queryBasicParams,
            {
                exploreQuery: `q=${keyword}&geo=${googleCountryCode}&date=${googleTrendsDateRange}`,
                guestPath: "https://trends.google.com:443/trends/embed/",
            },
        );
    }, []);
    return <div id={CONTAINER_ID}></div>;
};
