import { BENCHMARK_ITEM_KEY } from "../../constants";
import { BenchmarkResultType } from "../../types/benchmarks";

const createOpportunityModeAchievementService = (bResult: BenchmarkResultType) => {
    return {
        get isDisabled() {
            return (bResult.outperformingCompetitors?.domains ?? []).length === 0;
        },
        get aggregatedDetails() {
            return bResult.underperformingCompetitors;
        },
        get opportunityTitleKey() {
            return `${BENCHMARK_ITEM_KEY}.gap`;
        },
        prefixOpportunityValueSign(formattedValue: string) {
            return formattedValue;
        },
    };
};

export default createOpportunityModeAchievementService;
