import { OpportunityMode } from "../../constants";
import { BenchmarkResultType } from "../../types/benchmarks";

const createBModeOpportunitiesService = () => {
    return {
        getInitialOpportunityMode(bResult: BenchmarkResultType) {
            const domains = bResult.outperformingCompetitors?.domains ?? [];

            if (domains.length > 0) {
                return OpportunityMode.Opportunity;
            }

            return OpportunityMode.Achievement;
        },
    };
};

export default createBModeOpportunitiesService;
