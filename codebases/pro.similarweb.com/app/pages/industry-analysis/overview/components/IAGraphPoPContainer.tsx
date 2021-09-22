import SWReactRootComponent from "decorators/SWReactRootComponent";
import * as _ from "lodash";
import { StatelessComponent } from "react";
import * as React from "react";
import { PeriodOverPeriodChart } from "../../../../../.pro-features/components/Chart/src/components/PeriodOverPeriodChart/PeriodOverPeriodChart";
import { WidgetState } from "../../../../components/widget/widget-types/Widget";
import { webSourceTextSlimFilter } from "../../../../filters/ngFilters";
import { IAPerformanceGraphLegendContainer } from "./StyledComponents";
import { dynamicFilterFilter } from "filters/dynamicFilter";

const IAGraphPoPContainer: StatelessComponent<any> = ({
    apiParams,
    durationObj,
    data,
    widgetState,
    format,
}) => {
    // show graph only when widget finished fetching data successfully
    if (!data || widgetState !== WidgetState.LOADED) {
        return null;
    }

    const categoryData = _.mapKeys(data[Object.keys(data)[0]], (value, key) =>
        webSourceTextSlimFilter()(key),
    );
    const durations = [durationObj.forWidget[1], durationObj.forWidget[0]];
    const yAxisFormatter = ({ value }) => dynamicFilterFilter()(value, format);
    return (
        <IAPerformanceGraphLegendContainer>
            <PeriodOverPeriodChart
                type="line"
                data={categoryData}
                legendDurations={durations}
                yAxisFormatter={yAxisFormatter}
            />
        </IAPerformanceGraphLegendContainer>
    );
};
IAGraphPoPContainer.displayName = "IAGraphPoPContainer";
export default SWReactRootComponent(IAGraphPoPContainer, "IAGraphPoPContainer");
