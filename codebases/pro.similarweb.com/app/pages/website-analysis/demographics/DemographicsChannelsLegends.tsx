import { Legends } from "components/React/Legends/Legends";
import _ from "lodash";
import React, { useEffect } from "react";
import { LegendWithOneLineCheckboxFlexWithSubtitle } from "@similarweb/ui-components/dist/legend";
import { StyledLegendWrapper } from "./StyledComponents";
import { CHART_COLORS } from "constants/ChartColors";
import { i18nFilter } from "filters/ngFilters";
import { allTrackers } from "services/track/track";

export const DemographicsChannelsLegends = (props) => {
    const { data, keys, onLegendToggle } = props;

    const services = React.useMemo(
        () => ({
            i18n: i18nFilter(),
        }),
        [],
    );

    const [legendItems, setLegendItems] = React.useState(null);

    useEffect(() => {
        const items = keys.map((key, index) => {
            const color = CHART_COLORS.main[index];
            return {
                id: key,
                name: services.i18n(key),
                hidden: legendItems?.find((i) => i?.id === key)?.hidden || false,
                color,
                index: index,
            };
        });
        setLegendItems(items);
    }, [data]);

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
            "Web Analysis Graph/Demographics/" + filter.name,
        );
    };

    return (
        <>
            {legendItems && (
                <Legends
                    legendItems={legendItems}
                    toggleSeries={onLegendClick}
                    gridDirection="column"
                    legendComponent={LegendWithOneLineCheckboxFlexWithSubtitle}
                    legendComponentWrapper={StyledLegendWrapper}
                    textMaxWidth={"125px"}
                />
            )}
        </>
    );
};
