import { minVisitsAbbrFilter } from "filters/ngFilters";
import _ from "lodash";
import dayjs from "dayjs";
import { FC } from "react";
import Chart from "../../Chart";
import { ChartContainer, ChartLegendContainer } from "../PeriodOverPeriodChart/StyledComponents";
import { getPeriodConfig, getWebsiteConfig } from "../PopWithComapreChart/chartConfig";
export interface IPoPWithCompareGraphProps {
    type?: string;
    data: any;
    view: string;
    xAxisFormatter?: ({ value }) => string;
    yAxisFormatter?: ({ value }) => string;
    legendDurations?: string[];
    options?: {
        stackedColumn?: boolean;
        categoryXSeries?: boolean;
        height?: number;
    };
}
const defaultXAxisFormatter = ({ value }) => (value ? dayjs.utc(value).utc().format("MMM") : "N/A");
const categoryXAxisFormatter = ({ value }) => value;

export const PoPWithCompareChart: FC<IPoPWithCompareGraphProps> = ({
    type,
    data,
    xAxisFormatter,
    yAxisFormatter,
    legendDurations,
    options,
    view,
}) => {
    const selectedXAxisFormatter =
        xAxisFormatter || options.categoryXSeries ? categoryXAxisFormatter : defaultXAxisFormatter;
    const isStackedColumn = false;
    const configParams = {
        type,
        xAxisFormatter: selectedXAxisFormatter,
        yAxisFormatter,
        isStackedColumn,
        categoryXSeries: options.categoryXSeries,
        legendDurations,
        height: options.height,
        data,
    };
    const config =
        view === "website" ? getWebsiteConfig(configParams) : getPeriodConfig(configParams);

    return (
        <div>
            <ChartLegendContainer>
                <ChartContainer className={"chartContainer"}>
                    <Chart type={type} data={data} config={config} />
                </ChartContainer>
            </ChartLegendContainer>
        </div>
    );
};
PoPWithCompareChart.displayName = "PoPWithCompareGraph";

PoPWithCompareChart.defaultProps = {
    type: "column",
    yAxisFormatter: ({ value }) => (_.isNumber(value) ? minVisitsAbbrFilter()(value) : "N/A"),
    options: { stackedColumn: false, categoryXSeries: false },
};
