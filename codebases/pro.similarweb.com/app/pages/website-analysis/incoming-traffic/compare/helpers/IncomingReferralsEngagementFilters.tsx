interface IEngagementTypeFilter {
    id: string;
    selected: string;
    name: string;
    tooltip: string;
    api: string;
}

export const IncomingReferralsEngagementFilters: IEngagementTypeFilter[] = [
    {
        id: "EngagementOpportunities",
        api: "loss",
        selected: "analysis.compare.trafficsource.referrals.engagement.loss.selected",
        name: "analysis.compare.trafficsource.referrals.engagement.loss.name",
        tooltip: "analysis.compare.trafficsource.referrals.engagement.loss.tooltip",
    },
    {
        id: "EngagementWins",
        api: "win",
        selected: "analysis.compare.trafficsource.referrals.engagement.wins.selected",
        name: "analysis.compare.trafficsource.referrals.engagement.wins.name",
        tooltip: "analysis.compare.trafficsource.referrals.engagement.wins.tooltip",
    },
];
