import { Legends as LegendsComponent } from "components/React/Legends/Legends";
import React, { useEffect } from "react";
import { LegendWithValue, Legend } from "@similarweb/ui-components/dist/legend";
import { Positions, Sizes } from "@similarweb/ui-components/dist/legend/src/Legend";
import { LegendsContainer } from "./styled";
import { responsiveRender } from "UtilitiesAndConstants/UtilityFunctions/responsiveRender";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import {
    clientWidthThreshold,
    useCompetitiveTrackerHighLevelMetricsContext,
} from "../../context/context";

const LegendWithSubValue = (props) => (
    <Legend {...props} valuePosition={Positions.Bottom} isSubValue={true} size={Sizes.MD} />
);

export const Legends = () => {
    const competitiveTrackerHighLevelMetricsContext = useCompetitiveTrackerHighLevelMetricsContext();
    const {
        legendItems,
        setLegendItems,
        data,
        selectedMetric,
    } = competitiveTrackerHighLevelMetricsContext;

    useEffect(() => {
        const { chartData } = data;
        const { metric, formatter } = selectedMetric;
        const metricData = chartData[metric];
        const newLegendItems = metricData
            ? metricData.map(({ name, color, legendData }) => {
                  return {
                      name,
                      color,
                      data: formatter(legendData),
                      visible: true,
                  };
              })
            : [];
        setLegendItems(newLegendItems);
    }, [data, selectedMetric]);

    const toggleSeries = (clickedItem) => {
        const newLegendItems = legendItems.map((legendItem) => {
            if (legendItem.name === clickedItem.name) {
                legendItem.visible = !clickedItem.visible;
            }
            return legendItem;
        });
        TrackWithGuidService.trackWithGuid("competitive.tracking.chart.legend.toggle", "check", {
            entity: clickedItem.name,
            state: clickedItem.visible ? "on" : "off",
        });
        setLegendItems(newLegendItems);
    };
    return (
        <LegendsContainer clientWidthThreshold={clientWidthThreshold}>
            <div>
                <LegendsComponent
                    legendItems={legendItems}
                    toggleSeries={toggleSeries}
                    legendComponent={responsiveRender(
                        clientWidthThreshold,
                        LegendWithSubValue,
                        LegendWithValue,
                    )}
                />
            </div>
        </LegendsContainer>
    );
};
