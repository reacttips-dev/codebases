import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";
import BoxTitle, { InfoIcon } from "components/BoxTitle/src/BoxTitle";
import I18n from "components/React/Filters/I18n";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip";
import { i18nFilter } from "filters/ngFilters";
import { ExcelDownload } from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewGraph/Components/ExcelDownload";
import { PngDownload } from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewGraph/Components/PngDownload";
import { organicPaid } from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewGraph/Helpers/SearchOverviewGraphConfig";
import { searchOverviewContext } from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewGraph/SearchOverviewGraph";
import React, { useContext } from "react";
import StyledBoxSubtitle from "styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import {
    MMXAlertWrapper,
    MonthToDateToggleContainer,
    SearchOverviewGraphHeaderStyle,
    StyledHeaderTitle,
    UtilitiesContainer,
    UtilitiesContainerWrapper,
} from "./StyledComponents";
import {
    getMonthsToDateTooltipText,
    monthToDateTracking,
} from "UtilitiesAndConstants/UtilityFunctions/monthsToDateUtilityFunctions";
import { MTDTitle } from "pages/website-analysis/TrafficAndEngagement/Components/TrafficAndEngagementTabs";
import { OnOffSwitch } from "@similarweb/ui-components/dist/on-off-switch";
import * as _ from "lodash";
import { MMXAlertWithPlainTooltip } from "components/MMXAlertWithPlainTooltip";
import dayjs from "dayjs";
import DurationService from "services/DurationService";
import { swSettings } from "common/services/swSettings";

export const GraphTabHeader = (props) => {
    const { isMobileWeb, isSingle, queryParams, params, isMonthsToDateSupported } = props;
    const { duration, webSource } = params;
    const { chartRef, selectedMetricTab, category, actions, isMonthsToDateActive } = useContext(
        searchOverviewContext,
    );
    const { setIsMonthsToDateActive } = actions;
    const tooltip = isMobileWeb
        ? "analysis.source.search.overview.analysis.mobile.tooltip"
        : "analysis.source.search.overview.analysis.tooltip";
    const monthsToDateToggleClicked = () => {
        const monthToDateNewValue = !isMonthsToDateActive;
        setIsMonthsToDateActive(monthToDateNewValue);
        const MONTHS_TO_DATE_TRACKING_GUID_KEY =
            "website_analysis.search_overview.search_traffic.toggle_mtd";
        monthToDateTracking(MONTHS_TO_DATE_TRACKING_GUID_KEY)(monthToDateNewValue);
    };
    const MONTH_TO_DATE_NOT_SUPPORTED_TOOLTIP_KEY =
        "analysis.source.search.overview.search.traffic.mtd.not.supported.tooltip";
    const i18n = i18nFilter();
    const durationObject = DurationService.getDurationData(duration);
    const newMMXAlgoStartData = swSettings.current.resources.NewAlgoMMX;
    const isShowMMXAlertBell =
        webSource !== devicesTypes.DESKTOP &&
        durationObject.raw.from.isBefore(dayjs(newMMXAlgoStartData)) &&
        durationObject.raw.to.isAfter(dayjs(newMMXAlgoStartData));
    return (
        <SearchOverviewGraphHeaderStyle marginBottom={0}>
            <span>
                <StyledHeaderTitle>
                    <BoxTitle>
                        {!isMobileWeb && <I18n>analysis.source.search.overview.analysis</I18n>}
                        {isMobileWeb && isSingle && (
                            <I18n>analysis.source.search.overview.analysis.mobile.single</I18n>
                        )}
                        {isMobileWeb && !isSingle && (
                            <I18n>analysis.source.search.overview.analysis.mobile.compare</I18n>
                        )}
                        <PlainTooltip placement="top" text={i18nFilter()(tooltip)}>
                            <span>
                                <InfoIcon iconName="info" />
                            </span>
                        </PlainTooltip>
                        {isShowMMXAlertBell && (
                            <MMXAlertWrapper>
                                <MMXAlertWithPlainTooltip />
                            </MMXAlertWrapper>
                        )}
                    </BoxTitle>
                </StyledHeaderTitle>
            </span>
            <UtilitiesContainerWrapper>
                <UtilitiesContainer>
                    <MonthToDateToggleContainer>
                        <PlainTooltip
                            enabled={true}
                            text={
                                isMonthsToDateSupported
                                    ? getMonthsToDateTooltipText(true, isMonthsToDateActive)
                                    : i18n(MONTH_TO_DATE_NOT_SUPPORTED_TOOLTIP_KEY)
                            }
                        >
                            <MTDTitle
                                onClick={isMonthsToDateSupported && monthsToDateToggleClicked}
                                isDisabled={!isMonthsToDateSupported}
                            >
                                <OnOffSwitch
                                    isSelected={isMonthsToDateActive}
                                    onClick={_.noop}
                                    isDisabled={!isMonthsToDateSupported}
                                />
                                <StyledBoxSubtitle>
                                    <span style={{ paddingTop: "1px" }}>
                                        {i18n("wa.traffic.engagement.over.time.mtd.toggle_label")}
                                    </span>
                                </StyledBoxSubtitle>
                            </MTDTitle>
                        </PlainTooltip>
                    </MonthToDateToggleContainer>
                    <PngDownload metricName={selectedMetricTab.name} chartRef={chartRef} />
                    {category.id === organicPaid && (
                        <ExcelDownload
                            metricName={selectedMetricTab.name}
                            queryParams={queryParams}
                        />
                    )}
                </UtilitiesContainer>
            </UtilitiesContainerWrapper>
        </SearchOverviewGraphHeaderStyle>
    );
};
