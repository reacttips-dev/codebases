import React from "react";
import BenchmarkItemContext from "../contexts/BenchmarkItemContext";
import createBarChartService from "../services/bar-chart/barChartService";

const useBarChartService = () => {
    const { benchmarkItemService } = React.useContext(BenchmarkItemContext);

    return React.useMemo(() => {
        return createBarChartService(benchmarkItemService);
    }, [benchmarkItemService]);
};

export default useBarChartService;
