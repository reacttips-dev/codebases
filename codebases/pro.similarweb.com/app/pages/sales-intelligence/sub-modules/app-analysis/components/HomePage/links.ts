const DEFAULT_LEADERBOARD_PARAMS = {
    store: "Google",
    country: 840,
    category: "All",
    device: "AndroidPhone",
    mode: "Top Free",
};

const DEFAULT_TRENDS_PARAMS = {
    store: "Google",
    country: 840,
    category: "All",
    device: "AndroidPhone",
    mode: "Top Free",
    tab: "usageRank",
};

export const getHomeLinks = <NAV extends { go(key: string, params: any): void }>(
    navigator: NAV,
    trackingService: any, // TODO add tracking actions after when events will be done.
) => {
    return [
        {
            onClick() {
                navigator.go(
                    "salesIntelligence-appcategory-leaderboard",
                    DEFAULT_LEADERBOARD_PARAMS,
                );
            },
            name: "topApps",
            iconName: "leader",
            primaryText: "si.apps.home.section.leader.title",
            secondaryText: "si.apps.home.section.leader.subtitle",
        },
        {
            onClick() {
                navigator.go("salesIntelligence-appcategory-trends", DEFAULT_TRENDS_PARAMS);
            },
            name: "trendingApps",
            iconName: "arrows-opposite",
            primaryText: "si.apps.home.section.trending.title",
            secondaryText: "si.apps.home.section.trending.subtitle",
        },
    ];
};
