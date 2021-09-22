import { PopularSearchTemplate, WebsiteTypeVariant } from "../types/common";

export const ECOMMERCE_SEARCHES: PopularSearchTemplate[] = [
    {
        icon: {
            name: "cart-icon",
            height: 41,
            width: 45,
        },
        filters: {
            websiteType: {
                type: WebsiteTypeVariant.ecommerce,
            },
        },
    },
    {
        icon: {
            name: "spaceship",
            height: 59,
            width: 58,
        },
        filters: {
            websiteType: {
                type: WebsiteTypeVariant.ecommerce,
            },
            monthlyVisits: {
                from: 5000,
                to: 100000,
            },
            bounceRate: {
                to: 0.8,
            },
            trafficChanges: [
                {
                    value: 0.2,
                    period: "mom",
                    trend: "increase",
                    metric: "monthly_visits_change",
                },
            ],
        },
    },
    {
        icon: {
            name: "parcel-icon",
            height: 44,
            width: 49,
        },
        filters: {
            websiteType: {
                type: WebsiteTypeVariant.ecommerce,
            },
            technologies: [
                {
                    inclusion: "includeOnly",
                    parentCategories: [],
                    categories: ["Shipping"],
                    technologies: [],
                },
                {
                    inclusion: "excludeOnly",
                    parentCategories: [],
                    categories: ["Cross Border"],
                    technologies: [],
                },
            ],
        },
    },
    {
        icon: {
            name: "payment-card-icon",
            height: 36,
            width: 49,
        },
        filters: {
            websiteType: {
                type: WebsiteTypeVariant.ecommerce,
            },
            technologies: [
                {
                    inclusion: "includeOnly",
                    parentCategories: [],
                    categories: ["Payment"],
                    technologies: [],
                },
            ],
            employeeCount: {
                to: 100,
            },
        },
    },
];

export const PUBLISHERS_SEARCHES: PopularSearchTemplate[] = [
    {
        icon: {
            name: "newspaper-square-icon",
            height: 41,
            width: 51,
        },
        filters: {
            websiteType: {
                type: WebsiteTypeVariant.publisher,
            },
        },
    },
    {
        icon: {
            name: "spaceship",
            height: 59,
            width: 58,
        },
        filters: {
            websiteType: {
                type: WebsiteTypeVariant.publisher,
            },
            totalPageViews: {
                from: 5000,
                to: 100000,
            },
            bounceRate: {
                to: 0.8,
            },
            trafficChanges: [
                {
                    value: 0.2,
                    period: "mom",
                    trend: "increase",
                    metric: "total_page_views_change",
                },
            ],
        },
    },
    {
        icon: {
            name: "newspaper-heart-icon",
            height: 41,
            width: 51,
        },
        filters: {
            websiteType: {
                type: WebsiteTypeVariant.publisher,
            },
            bounceRate: {
                to: 0.3,
            },
            avgPagesPerVisit: {
                from: 7,
                to: 29,
            },
            avgVisitDuration: {
                from: 8 * 60,
                to: 28 * 60,
            },
        },
    },
    {
        icon: {
            name: "decline-trend-arrow-icon",
            height: 50,
            width: 42,
        },
        filters: {
            websiteType: {
                type: WebsiteTypeVariant.publisher,
            },
            technologies: [
                {
                    inclusion: "includeOnly",
                    parentCategories: [],
                    categories: ["Retargeting"],
                    technologies: [],
                },
            ],
            trafficChanges: [
                {
                    value: 0.05,
                    period: "mom",
                    trend: "decrease",
                    metric: "total_page_views_change",
                },
            ],
        },
    },
];

export const ADVERTISERS_SEARCHES: PopularSearchTemplate[] = [
    {
        icon: {
            name: "megaphone-icon",
            height: 42,
            width: 50,
        },
        filters: {
            websiteType: {
                type: WebsiteTypeVariant.advertiser,
            },
        },
    },
    {
        icon: {
            name: "spaceship",
            height: 59,
            width: 58,
        },
        filters: {
            websiteType: {
                type: WebsiteTypeVariant.advertiser,
            },
            monthlyVisits: {
                from: 5000,
                to: 100000,
            },
            bounceRate: {
                to: 0.8,
            },
            trafficChanges: [
                {
                    value: 0.2,
                    period: "mom",
                    trend: "increase",
                    metric: "monthly_visits_change",
                },
            ],
        },
    },
    {
        icon: {
            name: "fashion-icon",
            height: 48,
            width: 44,
        },
        filters: {
            websiteType: {
                type: WebsiteTypeVariant.advertiser,
            },
            categories: ["Lifestyle~Fashion_and_Apparel"],
            paidSearchShare: {
                from: 0.1,
            },
            displayAdsShare: {
                to: 0.01,
            },
        },
    },
    {
        icon: {
            name: "point-icon",
            height: 46,
            width: 40,
        },
        filters: {
            websiteType: {
                type: WebsiteTypeVariant.advertiser,
            },
            companyHeadquarter: {
                zip: [],
                codes: [840],
                inclusion: "includeOnly",
            },
            employeeCount: {
                to: 100,
            },
        },
    },
];

export const ALL_SITES_SEARCHES: PopularSearchTemplate[] = [
    {
        icon: null,
        filters: {},
    },
    {
        icon: {
            name: "spaceship",
            height: 59,
            width: 58,
        },
        filters: {
            monthlyVisits: {
                from: 5000,
                to: 100000,
            },
            trafficChanges: [
                {
                    value: 0.2,
                    period: "mom",
                    trend: "increase",
                    metric: "monthly_visits_change",
                },
            ],
        },
    },
    {
        icon: {
            name: "bounced-arrow-icon",
            height: 37,
            width: 44,
        },
        filters: {
            bounceRate: {
                from: 0.3,
            },
            avgPagesPerVisit: {
                to: 3,
            },
            avgVisitDuration: {
                to: 60,
            },
        },
    },
    {
        icon: {
            name: "decline-trend-arrow-icon",
            height: 50,
            width: 42,
        },
        filters: {
            technologies: [
                {
                    inclusion: "includeOnly",
                    parentCategories: [],
                    categories: ["Conversion Optimization"],
                    technologies: [],
                },
            ],
            trafficChanges: [
                {
                    value: 0.2,
                    period: "mom",
                    trend: "decrease",
                    metric: "unique_monthly_visitors_change",
                },
            ],
        },
    },
];
