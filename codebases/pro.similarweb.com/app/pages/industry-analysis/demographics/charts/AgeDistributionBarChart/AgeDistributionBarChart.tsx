import { Injector } from "common/ioc/Injector";
import { i18nFilter } from "filters/ngFilters";
import React, { FunctionComponent, useCallback, useMemo, useState } from "react";
import { PngExportService } from "services/PngExportService";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";

import Chart from "../../../../../../.pro-features/components/Chart/src/Chart";
import { DemographicsChartTitleBar } from "../DemographicsChartTitleBar";
import { getAgeBarChartConfig } from "./ageBarChartConfig";

interface IAgeDistributionBarChartProps {
    age18To24: number;
    age25To34: number;
    age35To44: number;
    age45To54: number;
    age55To64: number;
    age65Plus: number;
}

const AgeChartContainer = styled(FlexColumn)`
    width: 100%;
`;

export const AgeDistributionBarChart: FunctionComponent<IAgeDistributionBarChartProps> = (
    props,
) => {
    const [chartRef, setChartRef] = useState(null);

    const chartConfig = useMemo(() => {
        return getAgeBarChartConfig({ type: "column" });
    }, []);

    const chartData = useMemo(() => {
        const augmentedProps = Object.values(props).map((val) => {
            return { y: val, color: "#4f8df9" };
        });

        return [{ data: augmentedProps }];
    }, [props]);

    const handleExportChartPng = useCallback(() => {
        if (chartRef) {
            Injector.get<PngExportService>("pngExportService").export(
                chartRef,
                "Web Category Age Distribution",
            );
        }
    }, [chartRef]);

    return (
        <AgeChartContainer>
            <DemographicsChartTitleBar
                titleText={i18nFilter()("category.demographics.age.chart.title")}
                onExportChartPngClick={handleExportChartPng}
            />
            <Chart
                type={"column"}
                data={chartData}
                config={chartConfig}
                afterRender={(chart) => {
                    setChartRef(chart);
                    return {};
                }}
            />
        </AgeChartContainer>
    );
};
