import { Legends } from "components/React/Legends/Legends";
import _ from "lodash";
import React, { useEffect } from "react";
import { LegendWithOneLineCheckboxFlex } from "@similarweb/ui-components/dist/legend";
import { StyledLegendWrapper } from "./styledComponents";
import { CHART_COLORS } from "constants/ChartColors";
import { i18nFilter } from "filters/ngFilters";
import { allTrackers } from "services/track/track";

export const AppEngagementChannelsLegends = (props) => {
    const { isPercentage = true, data, selectedMetric, keys, onLegendToggle, filter } = props;

    const services = React.useMemo(
        () => ({
            i18n: i18nFilter(),
        }),
        [],
    );

    const [legendItems, setLegendItems] = React.useState(null);

    useEffect(() => {
        const items = keys.map((key, index) => {
            const value = filter(data[index]?.total);
            const color = CHART_COLORS.main[index];
            const getWinner = () => {
                if (!data) {
                    return null;
                }

                const winner = data.reduce((prev, current) => {
                    if (!current.total) {
                        return prev;
                    }
                    return prev.total > current.total ? prev : current;
                });

                return key === winner?.appItem?.Id;
            };
            const isWinner = getWinner();

            return {
                id: key,
                data: value,
                name: services.i18n(data[index]?.name),
                hidden: legendItems?.find((i) => i?.id === key)?.hidden || false,
                color,
                isWinner,
                index: index,
            };
        });
        setLegendItems(items);
    }, [data, selectedMetric, isPercentage]);

    const onLegendClick = (filter) => {
        const action = filter.hidden ? "add" : "remove";
        const filteredData = [];
        const filterChannels = legendItems?.map((f) => {
            if (f.name === filter.name) {
                f.hidden = !f.hidden;
            }
            if (!f.hidden) {
                filteredData.push(data[f.index]);
            }
            return f;
        });
        setLegendItems(filterChannels);
        onLegendToggle(filteredData);

        allTrackers.trackEvent(
            "Click Filter",
            action,
            "Over Time Graph/App Engagement Overview/" + filter.name,
        );
    };

    return (
        <>
            {legendItems && (
                <Legends
                    legendItems={legendItems}
                    toggleSeries={onLegendClick}
                    gridDirection="column"
                    legendComponent={LegendWithOneLineCheckboxFlex}
                    legendComponentWrapper={StyledLegendWrapper}
                    textMaxWidth={"125px"}
                />
            )}
        </>
    );
};
