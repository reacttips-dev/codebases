import { BenchmarksMode } from "../../constants";
import { BenchmarksModeServiceType } from "./types";
import createBModeAchievementsService from "./bModeAchievementsService";
import createBModeOpportunitiesService from "./bModeOpportunitiesService";

const createBenchmarksModeService = (benchmarksMode: BenchmarksMode): BenchmarksModeServiceType => {
    if (
        [
            BenchmarksMode.TopCountry,
            BenchmarksMode.SelectedCountry,
            BenchmarksMode.TopOpportunities,
        ].includes(benchmarksMode)
    ) {
        return createBModeOpportunitiesService();
    }

    return createBModeAchievementsService();
};

export default createBenchmarksModeService;
