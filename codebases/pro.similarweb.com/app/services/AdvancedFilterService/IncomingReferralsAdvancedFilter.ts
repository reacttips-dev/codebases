import { AdvancedFilterService, IAdvancedFilter } from "./AdvancedFilterService";
const referralsAdvancedFilters: IAdvancedFilter[] = [
    {
        id: "ReferralOpportunities",
        api: "0-0.10",
        name: "analysis.compare.trafficsource.referrals.advanced.predefined.opportunities",
        tooltip:
            "analysis.compare.trafficsource.referrals.advanced.predefined.opportunities.tooltip",
    },
    {
        id: "ReferralExclusive",
        api: "0.8-0.99",
        name: "analysis.compare.trafficsource.referrals.advanced.predefined.exclusive",
        tooltip: "analysis.compare.trafficsource.referrals.advanced.predefined.exclusive.tooltip",
    },
    {
        id: "HighCompetitiveReferral",
        api: "0.2-0.6;0.2-0.6",
        name: "analysis.compare.trafficsource.referrals.advanced.predefined.competitive",
        tooltip: "analysis.compare.trafficsource.referrals.advanced.predefined.competitive.tooltip",
    },
    {
        id: "LosingToCompetitionReferral",
        api: "0.01-0.2",
        name: "analysis.compare.trafficsource.referrals.advanced.predefined.losing",
        tooltip: "analysis.compare.trafficsource.referrals.advanced.predefined.losing.tooltip",
    },
];

export const IncomingReferralsAdvancedFilterService = new AdvancedFilterService(
    referralsAdvancedFilters,
);
