export const navObj = () => {
    return {
        navList: [
            {
                title: "analysis.traffic.title",
                name: "segments",
                subItems: [
                    {
                        title: "segment.analysis.traffic.engagement.title",
                        name: "segmentOverview",
                        state: "segments-analysis-traffic",
                        options: {
                            isUSStatesSupported: false,
                            isVirtualSupported: false,
                        },
                    },
                    {
                        title: "segment.analysis.marketingChannels.title",
                        name: "segmentTrafficChannels",
                        state: "segments-analysis-marketingChannels",
                        options: {
                            isUSStatesSupported: false,
                            isVirtualSupported: false,
                        },
                        isNew: true,
                    },
                    {
                        title: "segments.analysis.geography.title",
                        name: "segmentGeography",
                        state: "segments-analysis-geography",
                        options: {
                            isUSStatesSupported: false,
                            isVirtualSupported: false,
                        },
                        isNew: true,
                    },
                ],
            },
        ],
    };
};
