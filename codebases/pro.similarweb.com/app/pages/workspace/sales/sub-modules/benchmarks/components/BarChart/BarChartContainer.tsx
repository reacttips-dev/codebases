import React from "react";
import BarChart from "./BarChart";
import { StyledChartContainer } from "./styles";
import useBarChartService from "../../hooks/useBarChartService";
import BenchmarkItemContext from "../../contexts/BenchmarkItemContext";
import VisualisationLoader from "../VisualisationLoader/VisualisationLoader";

const BarChartContainer = () => {
    const { isLoading } = React.useContext(BenchmarkItemContext);
    const barChartService = useBarChartService();

    const renderedChartOrLoader = React.useMemo(() => {
        const height = barChartService.height;

        if (isLoading) {
            return (
                <VisualisationLoader
                    height={height}
                    className={`loader-size-${barChartService.competitorsCount}`}
                />
            );
        }

        return (
            <BarChart
                height={height}
                id={barChartService.id}
                series={barChartService.getSeries()}
                config={barChartService.getConfig()}
            />
        );
    }, [isLoading, barChartService]);

    return <StyledChartContainer>{renderedChartOrLoader}</StyledChartContainer>;
};

export default BarChartContainer;
