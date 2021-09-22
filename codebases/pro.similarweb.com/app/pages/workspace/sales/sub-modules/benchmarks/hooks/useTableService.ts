import React from "react";
import BenchmarkItemContext from "../contexts/BenchmarkItemContext";

const useTableService = () => {
    const { benchmarkItemService } = React.useContext(BenchmarkItemContext);

    return React.useMemo(() => {
        return benchmarkItemService.getTable();
    }, [benchmarkItemService]);
};

export default useTableService;
