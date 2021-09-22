import pickBy from "lodash/pickBy";
import * as React from "react";

import SWReactRootComponent from "decorators/SWReactRootComponent";
import { StatelessComponent } from "react";
import Chart from "../../../../.pro-features/components/Chart/src/Chart";

export interface INgHighchartsOptions {
    options?: Highcharts.Options;
    series?: Highcharts.IndividualSeriesOptions[];
}

export interface INgToReactChartProps {
    highchartsNgConfig: INgHighchartsOptions;
    afterRender?: (a?) => {};
    chartIdForAnnotations?: string;
}

export function highchartsNgToVanilla(
    highchartsNgConfig: INgHighchartsOptions,
): { data: Highcharts.IndividualSeriesOptions[]; config: Highcharts.Options } {
    return {
        data: highchartsNgConfig.series,
        config: {
            ...pickBy<any>(highchartsNgConfig.options, (v, k) => k !== "series"),
            ...pickBy<any>(highchartsNgConfig, (v, k) => k !== "series"),
        },
    };
}

export const NgToReactChart: StatelessComponent<INgToReactChartProps> = ({
    highchartsNgConfig,
    afterRender,
    chartIdForAnnotations,
}) => {
    if (!highchartsNgConfig || !highchartsNgConfig.options || !highchartsNgConfig.series) {
        return null;
    }

    const { config, data } = highchartsNgToVanilla(highchartsNgConfig);

    return (
        <Chart
            type={config.chart.type}
            data={data}
            config={config}
            afterRender={afterRender}
            chartIdForAnnotations={chartIdForAnnotations}
        />
    );
};
export default SWReactRootComponent(NgToReactChart, "NgToReactChart");
