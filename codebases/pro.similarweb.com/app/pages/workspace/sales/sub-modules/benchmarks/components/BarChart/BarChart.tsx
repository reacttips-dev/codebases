import React from "react";
import { StyledChartWrapper, StyledWatermark } from "./styles";
import Chart from "components/Chart/src/Chart";
import Watermark from "pages/sales-intelligence/common-components/Watermark/Watermark";

type BarChartProps = {
    id: string;
    height: number;
    series: object[];
    config: object;
};

const BarChart = (props: BarChartProps) => {
    const { id, height, config, series } = props;

    return (
        <StyledChartWrapper id={id}>
            <Chart
                type="bar"
                data={series}
                config={config}
                domProps={{
                    style: {
                        height,
                        width: "100%",
                    },
                }}
            />
            <StyledWatermark>
                <Watermark />
            </StyledWatermark>
        </StyledChartWrapper>
    );
};

export default BarChart;
