import { BENCHMARK_ITEM_KEY } from "../../constants";
import { BenchmarkResultType } from "../../types/benchmarks";

const createOpportunityModeOpportunityService = (bResult: BenchmarkResultType) => {
    return {
        get isDisabled() {
            return (bResult.underperformingCompetitors?.domains ?? []).length === 0;
        },
        get aggregatedDetails() {
            return bResult.outperformingCompetitors;
        },
        get opportunityTitleKey() {
            return `${BENCHMARK_ITEM_KEY}.opportunity`;
        },
        prefixOpportunityValueSign(formattedValue: string) {
            return bResult.benchmark.greaterIsBetter ? `+${formattedValue}` : formattedValue;
        },
    };
};

export default createOpportunityModeOpportunityService;
