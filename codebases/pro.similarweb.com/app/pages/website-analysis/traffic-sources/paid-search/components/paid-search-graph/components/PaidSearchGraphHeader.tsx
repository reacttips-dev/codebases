import { i18nFilter } from "filters/ngFilters";
import React, { useMemo } from "react";
import { MTDToggleContainer, PaidSearchGraphHeaderStyle } from "./StyledComponents";
import { MTDTitle } from "pages/website-analysis/TrafficAndEngagement/Components/TrafficAndEngagementTabs";
import { OnOffSwitch } from "@similarweb/ui-components/dist/on-off-switch";
import {
    getMonthsToDateTooltipText,
    monthToDateTracking,
} from "UtilitiesAndConstants/UtilityFunctions/monthsToDateUtilityFunctions";
import { PaidSearchComponentTitle } from "pages/website-analysis/traffic-sources/paid-search/components/common/PaidSearchComponentTitle";
import CountryService from "services/CountryService";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip";
import StyledBoxSubtitle from "styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import * as _ from "lodash";
import { ExcelDownload } from "pages/website-analysis/traffic-sources/paid-search/components/paid-search-graph/components/ExcelDownload";
import { PngDownload } from "pages/website-analysis/traffic-sources/paid-search/components/paid-search-graph/components/PngDownload";
import { paidSearchMetricsConfig } from "pages/website-analysis/traffic-sources/paid-search/components/paid-search-graph/helpers/PaidSearchGraphConstants";
import { FlexRow } from "pages/website-analysis/website-content/leading-folders/components/Tab";

export const PaidSearchGraphHeader = (props) => {
    const {
        queryParams,
        ppcQueryParams,
        isMTDSupported,
        isMTDActive,
        setMTD,
        selectedMetricTab,
        chartRef,
        duration,
        country,
        webSource,
        fromDate,
        toDate,
        isSingle,
    } = props;
    const PPC_MONTH_TO_DATE_NOT_SUPPORTED_TOOLTIP_KEY =
        "analysis.source.search.overview.search.traffic.ppc.mtd.not.supported.tooltip";
    const DURATION_MONTH_TO_DATE_NOT_SUPPORTED_TOOLTIP_KEY =
        "analysis.source.search.overview.search.traffic.mtd.not.supported.tooltip";
    const i18n = i18nFilter();
    const title = i18n("website-analysis.traffic-sources.paid-search.graph.title");
    const tooltip = i18n("website-analysis.traffic-sources.paid-search.graph.tooltip");
    const subtitleFilters = useMemo(
        () => [
            {
                filter: "date",
                value: {
                    // fix SIM-33187
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
    const isMtdAllowed = useMemo(
        () => selectedMetricTab.name !== paidSearchMetricsConfig[0].name && isMTDSupported,
        [isMTDSupported, selectedMetricTab],
    );

    const onToggleMTD = () => {
        const selectedMTDActive = !isMTDActive;
        setMTD(selectedMTDActive);
        const MONTHS_TO_DATE_TRACKING_GUID_KEY =
            "websiteanalysis.trafficsources.paidsearch.toggle_mtd";
        monthToDateTracking(MONTHS_TO_DATE_TRACKING_GUID_KEY)(selectedMTDActive);
    };

    return (
        <PaidSearchGraphHeaderStyle isSingle={isSingle}>
            <PaidSearchComponentTitle title={title} tooltip={tooltip} filters={subtitleFilters} />
            <FlexRow>
                <MTDToggleContainer>
                    <PlainTooltip
                        enabled={true}
                        text={
                            isMtdAllowed
                                ? getMonthsToDateTooltipText(true, isMTDActive)
                                : selectedMetricTab.name === paidSearchMetricsConfig[0].name
                                ? i18n(PPC_MONTH_TO_DATE_NOT_SUPPORTED_TOOLTIP_KEY)
                                : i18n(DURATION_MONTH_TO_DATE_NOT_SUPPORTED_TOOLTIP_KEY)
                        }
                    >
                        <MTDTitle onClick={isMtdAllowed && onToggleMTD} isDisabled={!isMtdAllowed}>
                            <OnOffSwitch
                                isSelected={isMTDActive}
                                onClick={_.noop}
                                isDisabled={!isMtdAllowed}
                            />
                            <StyledBoxSubtitle>
                                <span style={{ paddingTop: "1px" }}>
                                    {i18n("wa.traffic.engagement.over.time.mtd.toggle_label")}
                                </span>
                            </StyledBoxSubtitle>
                        </MTDTitle>
                    </PlainTooltip>
                </MTDToggleContainer>
                <PngDownload selectedMetricName={selectedMetricTab.name} chartRef={chartRef} />
                <ExcelDownload
                    selectedMetricName={selectedMetricTab.name}
                    queryParams={
                        selectedMetricTab.name === paidSearchMetricsConfig[0].name
                            ? ppcQueryParams
                            : queryParams
                    }
                />
            </FlexRow>
        </PaidSearchGraphHeaderStyle>
    );
};
