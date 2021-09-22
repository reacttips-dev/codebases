import { BenchmarkResultType } from "../../types/benchmarks";
import { OpportunityMode } from "../../constants";
import createOpportunityModeOpportunityService from "./opportunityModeOpportunityService";
import createOpportunityModeAchievementService from "./opportunityModeAchievementService";

const createOpportunityModeService = (
    bResult: BenchmarkResultType,
    opportunityMode: OpportunityMode,
) => {
    if (opportunityMode === OpportunityMode.Opportunity) {
        return createOpportunityModeOpportunityService(bResult);
    }

    return createOpportunityModeAchievementService(bResult);
};

export default createOpportunityModeService;
