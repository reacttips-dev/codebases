import React from "react";
import BenchmarkItemContext from "../contexts/BenchmarkItemContext";

const useSummaryTextService = () => {
    const { benchmarkItemService } = React.useContext(BenchmarkItemContext);

    return React.useMemo(() => {
        return benchmarkItemService.getSummaryTextService();
    }, [benchmarkItemService]);
};

export default useSummaryTextService;
