import { i18nFilter } from "filters/ngFilters";
import React, { useMemo } from "react";
import { DisplayAdsGraphHeaderStyle } from "./StyledComponents";
import { DisplayOverviewTitleComponent } from "pages/website-analysis/traffic-sources/display-ads/overview/common/DisplayOverviewTitleComponent";
import CountryService from "services/CountryService";
import { ExcelDownload } from "pages/website-analysis/traffic-sources/display-ads/overview/overview-graph/components/ExcelDownload";
import { PngDownload } from "pages/website-analysis/traffic-sources/display-ads/overview/overview-graph/components/PngDownload";
import { FlexRow } from "pages/website-analysis/website-content/leading-folders/components/Tab";

export const DisplayAdsGraphHeader = (props) => {
    const {
        queryParams,
        selectedMetricTab,
        chartRef,
        duration,
        country,
        webSource,
        fromDate,
        toDate,
        isSingle,
    } = props;
    const i18n = i18nFilter();
    const title = i18n("analysis.sources.ads.overview.engagements.metrics");
    const tooltip =
        webSource == "Desktop"
            ? i18n("analysis.sources.ads.overview.engagements.metrics.desktop.tooltip")
            : i18n("analysis.sources.ads.overview.engagements.metrics.mobile.tooltip");
    const subtitleFilters = useMemo(
        () => [
            {
                filter: "date",
                value: {
                    from:
                        fromDate.format("YYYY-MM") !== toDate.format("YYYY-MM")
                            ? fromDate.valueOf()
                            : null,
                    to: toDate.valueOf(),
                    useRangeDisplay: fromDate.format("YYYY-MM") !== toDate.format("YYYY-MM"),
                },
            },
            {
                filter: "country",
                countryCode: country,
                value: CountryService.getCountryById(country)?.text,
            },
            {
                filter: "webSource",
                value: webSource,
            },
        ],
        [fromDate, toDate, country, webSource, duration],
    );

    return (
        <DisplayAdsGraphHeaderStyle isSingle={isSingle}>
            <DisplayOverviewTitleComponent
                title={title}
                tooltip={tooltip}
                filters={subtitleFilters}
            />
            <FlexRow>
                <PngDownload selectedMetricName={selectedMetricTab.name} chartRef={chartRef} />
                <ExcelDownload
                    selectedMetricName={selectedMetricTab.name}
                    queryParams={queryParams}
                />
            </FlexRow>
        </DisplayAdsGraphHeaderStyle>
    );
};
