import { SWReactIcons } from "@similarweb/icons";
import * as React from "react";
import { colorsPalettes, mixins, rgba } from "@similarweb/styles";
import MetricsCompareBars from "components/React/MetricsCompareBars/MetricsCompareBars";
import ComponentHeader from "components/React/componentHeader/componentHeader";
import SimpleFrame from "components/React/widgetFrames/simpleFrame";
import frameStates from "components/React/widgetFrames/frameStates";
import { PercentsNumberSwitcher } from "../../../../../components/React/switcher/commonSwitchers";
import styled from "styled-components";
import { OnLoaded } from "./keywordsTableOverview";
import I18n from "../../../../../../.pro-features/components/WithTranslation/src/I18n";
import { i18nFilter, minVisitsAbbrFilter } from "filters/ngFilters";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders/src/PlaceholderLoaders";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";

const CompareBarTitleWrapper = styled.div`
    display: flex;
    align-items: center;
    width: 50%;
    .comparebar-title--SWReactIconsWrapper {
        margin-bottom: 3px;
    }
`;

const CompareBarTitle = styled.div`
    ${mixins.setFont({ $size: 14, $color: rgba(colorsPalettes.carbon[500], 0.8) })};
    margin-bottom: 3px;
    margin-right: 4px;
`;

const PercentsNumberSwitcherStyled: any = styled(PercentsNumberSwitcher)`
    margin-left: auto;
    align-self: flex-start;
`;

const CompareBarWrapper = styled.div`
    padding: 16px 0 0 16px;
    border-bottom: 1px solid ${colorsPalettes.carbon[50]};
`;

const metricBarNameMap = {
    search_visits: "analysis.source.search.keywords.header.metrics.searchVisits",
};

function getSiteDisplayValues({ percentage, value }, minVisitsAbbrFilter) {
    percentage = percentage * 100;
    let percentageText = `${percentage.toFixed(2)}%`;
    //value = Math.floor(value);
    let valueText = minVisitsAbbrFilter(value);
    if (percentage > 0 && percentage < 0.01) {
        percentage = 0.01;
        percentageText = `< ${percentage}%`;
    } else if (percentage > 99.99 && percentage < 100) {
        percentage = 99.99;
        percentageText = `> ${percentage}%`;
    }
    return {
        percentage,
        percentageText,
        value,
        valueText,
    };
}

function getItemsFromBreakdown(breakdown, sitesList, displayType, minVisitsAbbrFilter) {
    const data = [];
    for (let [metric, metricDadata] of Object.entries(breakdown)) {
        const metricDisplayName = metric in metricBarNameMap ? metricBarNameMap[metric] : metric;
        const metricOverviewObject = { metric: metricDisplayName, bars: [] };
        for (let [siteKey, siteData] of Object.entries(metricDadata)) {
            const { bars } = metricOverviewObject;
            const siteInfo = sitesList.find(({ name }) => name === siteKey);
            const { percentage, percentageText, value, valueText } = getSiteDisplayValues(
                siteData,
                minVisitsAbbrFilter(),
            );

            switch (displayType) {
                case "percent":
                    bars.push({
                        ...siteInfo,
                        valueText: percentageText,
                        width: percentage,
                    });
                    break;
                case "number":
                    bars.push({
                        ...siteInfo,
                        valueText,
                        width: percentage,
                    });
                    break;
            }
        }
        data.push(metricOverviewObject);
    }
    return data;
}

const MetricsBarsOverviewContainer = ({
    isFetching,
    noData,
    breakdown = {},
    sitesList,
    displayType,
    setDisplayType,
    organic = undefined,
    paid = undefined,
    total,
    percentage = undefined,
    webSource = "Desktop",
    filters = undefined,
    showMetricTotals = true,
    compareBarTitleTooltipText = undefined,
}) => {
    const items = getItemsFromBreakdown(breakdown, sitesList, displayType, minVisitsAbbrFilter);
    const state = isFetching ? frameStates.Loading : frameStates.Loaded;
    if (noData) {
        return null;
    }
    return (
        <div>
            {showMetricTotals &&
                OnLoaded({
                    ...{
                        organic,
                        paid,
                        total,
                        percentage,
                        isFetching,
                        noData,
                        webSource,
                        isLoading: isFetching,
                        filters,
                    },
                })}
            <SimpleFrame
                state={state}
                onLoaded={() => null}
                header={
                    <CompareBarWrapper>
                        <CompareBarTitleWrapper>
                            <CompareBarTitle>
                                <I18n>
                                    analysis.source.search.keywords.header.metrics.searchvisits
                                </I18n>
                            </CompareBarTitle>
                            {!!compareBarTitleTooltipText && (
                                <PlainTooltip
                                    tooltipContent={i18nFilter()(compareBarTitleTooltipText)}
                                >
                                    <div className={"comparebar-title--SWReactIconsWrapper"}>
                                        <SWReactIcons iconName={"info"} size={"xs"} />
                                    </div>
                                </PlainTooltip>
                            )}
                        </CompareBarTitleWrapper>
                        <ComponentHeader>
                            {isFetching ? (
                                <PixelPlaceholderLoader width={"calc(100% - 120px)"} height={20} />
                            ) : (
                                <MetricsCompareBars
                                    isFetching={false}
                                    items={items}
                                    title={i18nFilter()(
                                        "analysis.source.search.keywords.header.split.tooltip.title",
                                    )}
                                />
                            )}
                            <PercentsNumberSwitcherStyled
                                style={{ marginLeft: "auto", alignSelf: "flex-start" }}
                                itemList={[
                                    { title: "%", value: "percent" },
                                    {
                                        title: "#",
                                        value: "number",
                                        disabled: !total || total < 5000,
                                        tooltipText:
                                            total < 5000
                                                ? i18nFilter()(
                                                      "search.keywords.numbertoggle.disabled.tooltip",
                                                  )
                                                : null,
                                    },
                                ]}
                                selectedIndex={total < 5000 ? "percent" : displayType}
                                customClass="CircleSwitcher"
                                onItemClick={(displayType) => setDisplayType(displayType)}
                            />
                        </ComponentHeader>
                    </CompareBarWrapper>
                }
            />
        </div>
    );
};
export default MetricsBarsOverviewContainer;
