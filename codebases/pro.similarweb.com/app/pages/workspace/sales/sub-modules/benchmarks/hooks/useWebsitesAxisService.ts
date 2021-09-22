import React from "react";
import BenchmarkItemContext from "../contexts/BenchmarkItemContext";
import createWebsitesAxisService from "../services/websites-axis/websitesAxisService";

const useWebsitesAxisService = () => {
    const { benchmarkItemService } = React.useContext(BenchmarkItemContext);

    return React.useMemo(() => {
        return createWebsitesAxisService(benchmarkItemService);
    }, [benchmarkItemService]);
};

export default useWebsitesAxisService;
