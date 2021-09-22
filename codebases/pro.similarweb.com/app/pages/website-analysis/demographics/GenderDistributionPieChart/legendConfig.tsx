import React from "react";
import ReactDOMServer from "react-dom/server";
import { LegendContainer, LabelName, LabelValue } from "./StyledComponents";

const PieChartLegend = (props: { pointName: string; pointValue: number }) => {
    const { pointName, pointValue } = props;

    return (
        <LegendContainer>
            <LabelName>{pointName}</LabelName>
            <LabelValue>{pointValue}</LabelValue>
        </LegendContainer>
    );
};

export default ({ yAxisFormatter }) => {
    return {
        plotOptions: {
            // Pie charts turn showInLegend to false by default
            // we want to make sure that it's enabled (otherwise
            // no data will appear on the legend)
            pie: {
                showInLegend: true,
                point: {
                    events: {
                        legendItemClick() {
                            return false;
                        },
                    },
                },
            },
        },
        legend: {
            enabled: true,
            layout: "proximate",
            align: "right",
            verticalAlign: "middle",
            useHTML: true,
            itemMarginBottom: 28,
            y: 10,
            labelFormatter() {
                const formattedY = yAxisFormatter({ value: this.y });
                const name = this.name;

                return ReactDOMServer.renderToString(
                    <PieChartLegend pointName={name} pointValue={formattedY} />,
                );
            },
        },
    };
};
