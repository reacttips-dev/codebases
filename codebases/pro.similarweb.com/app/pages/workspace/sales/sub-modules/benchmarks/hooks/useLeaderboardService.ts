import React from "react";
import { AssetsService } from "services/AssetsService";
import BenchmarkItemContext from "../contexts/BenchmarkItemContext";
import createLeaderboardService from "../services/leaderboard/leaderboardService";

const useLeaderboardService = () => {
    const { benchmarkItemService } = React.useContext(BenchmarkItemContext);

    return React.useMemo(() => {
        return createLeaderboardService(benchmarkItemService, AssetsService);
    }, [benchmarkItemService]);
};

export default useLeaderboardService;
