import { useIndustryAnalysisOverviewHighLevelMetricsContext } from "pages/industry-analysis/overview/highLevelMetrics/context";
import { Legends as LegendsComponent } from "components/React/Legends/Legends";
import React from "react";
import { PopSingleModeLegends } from "pages/website-analysis/TrafficAndEngagement/Legends/PopSingleModeLegends";
import { FlexRow } from "pages/website-analysis/website-content/leading-folders/components/Tab";

export const Legends = () => {
    const {
        params,
        legendItems,
        setLegendItems,
        isPeriodOverPeriod,
    } = useIndustryAnalysisOverviewHighLevelMetricsContext();
    if (isPeriodOverPeriod) {
        const { webSource } = params;
        const legendsProps = { webSource, legendItems };
        return (
            <FlexRow>
                <PopSingleModeLegends {...legendsProps} />
            </FlexRow>
        );
    }
    const toggleSeries = (clickedItem) => {
        const newLegendItems = legendItems.map((legendItem) => {
            if (legendItem.name === clickedItem.name) {
                legendItem.visible = !clickedItem.visible;
            }
            return legendItem;
        });
        setLegendItems(newLegendItems);
    };
    const legendsProps = { legendItems, toggleSeries };
    return <LegendsComponent {...legendsProps} />;
};
