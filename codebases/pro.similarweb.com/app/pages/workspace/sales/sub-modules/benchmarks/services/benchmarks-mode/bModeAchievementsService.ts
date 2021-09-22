import { OpportunityMode } from "../../constants";
import { BenchmarkResultType } from "../../types/benchmarks";

const createBModeAchievementsService = () => {
    return {
        getInitialOpportunityMode(bResult: BenchmarkResultType) {
            const domains = bResult.underperformingCompetitors?.domains ?? [];

            if (domains.length > 0) {
                return OpportunityMode.Achievement;
            }

            return OpportunityMode.Opportunity;
        },
    };
};

export default createBModeAchievementsService;
