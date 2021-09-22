import { swSettings } from "common/services/swSettings";
import { IDashboardTemplate } from "../DashboardTemplateService";
import { EFamilyTypes } from "../components/DashboardTemplatesConfig";
import { AssetsService } from "../../../../services/AssetsService";

const dashboard: IDashboardTemplate = {
    id: 4,
    title: "dashboard.templates.marketanalysisdashboard.title",
    description: "dashboard.templates.marketanalysisdashboard.description",
    descriptionLong: "dashboard.templates.marketanalysisdashboard.description.long",
    keyMetrics: "dashboard.templates.marketanalysisdashboard.keymetric",
    previewImage: AssetsService.assetUrl(
        "/images/dashboard/templates/MarketAnalysisDashboard-preview.png",
    ),
    thumbnailImage: AssetsService.assetUrl(
        "/images/dashboard/templates/MarketAnalysisDashboard-thumb.png",
    ),
    familyType: EFamilyTypes.Categories,
    minItems: 1,
    maxItems: 1,
    isHidden: swSettings.user.hasSolution2,
    widgets: [
        {
            pos: {
                sizeX: 1,
                sizeY: 1,
                maxSizeY: 1,
                minSizeX: 1,
                maxSizeX: 2,
                row: 0,
                col: 0,
            },
            properties: {
                selectedChannel: "Direct",
                metric: "EngagementVisits",
                webSource: "Total",
                duration: "1m",
                type: "SingleMetric",
                filters: {
                    ShouldGetVerifiedData: "true",
                    timeGranularity: "Monthly",
                },
                width: "1",
                customAsset: false,
                family: "Industry",
                options: {},
                title: "Total Visits",
                tooltip: "Desktop Visits.tooltip",
                titleTemplate: "custom",
            },
        },
        {
            pos: {
                sizeX: 3,
                sizeY: 1,
                maxSizeY: 2,
                minSizeX: 2,
                maxSizeX: 4,
                row: 0,
                col: 1,
            },
            properties: {
                flexibleDuration: true,
                selectedChannel: "Direct",
                metric: "EngagementVisits",
                webSource: "Total",
                duration: "12m",
                type: "Graph",
                filters: {
                    ShouldGetVerifiedData: "true",
                    timeGranularity: "Monthly",
                },
                width: "2",
                customAsset: false,
                family: "Industry",
                options: {},
                tooltip: "",
                title: "Total Visits",
            },
        },
        {
            pos: {
                sizeX: 1,
                sizeY: 1,
                maxSizeY: 1,
                minSizeX: 1,
                maxSizeX: 2,
                row: 1,
                col: 0,
            },
            properties: {
                mobileWebOnly: true,
                selectedChannel: "Direct",
                metric: "EngagementVisits",
                webSource: "Desktop",
                duration: "1m",
                type: "SingleMetric",
                filters: {
                    ShouldGetVerifiedData: "true",
                    timeGranularity: "Monthly",
                },
                width: "1",
                customAsset: "Industry",
                options: {},
                family: "Industry",
                title: "Desktop Visits",
                tooltip: "Total Visits.tooltip",
                titleTemplate: "custom",
            },
        },
        {
            pos: {
                sizeX: 2,
                sizeY: 1,
                maxSizeY: 1,
                minSizeX: 1,
                maxSizeX: 2,
                row: 1,
                col: 1,
            },
            properties: {
                mobileWebOnly: true,
                selectedChannel: "Direct",
                metric: "EngagementVisits",
                webSource: "Total",
                duration: "1m",
                type: "PieChart",
                filters: {
                    ShouldGetVerifiedData: "true",
                    timeGranularity: "Daily",
                },
                width: "1",
                customAsset: false,
                family: "Industry",
                options: {},
                title: "Desktop Visits",
                tooltip: "Desktop Visits.tooltip",
            },
        },
        {
            pos: {
                sizeX: 1,
                sizeY: 1,
                maxSizeY: 1,
                minSizeX: 1,
                maxSizeX: 2,
                row: 1,
                col: 3,
            },
            properties: {
                mobileWebOnly: true,
                selectedChannel: "Direct",
                metric: "EngagementVisits",
                webSource: "MobileWeb",
                duration: "1m",
                type: "SingleMetric",
                filters: {
                    ShouldGetVerifiedData: "true",
                    timeGranularity: "Monthly",
                },
                width: "1",
                customAsset: "Industry",
                options: {},
                family: "Industry",
                title: "Mobile Visits",
                tooltip: "Total Visits.tooltip",
                titleTemplate: "custom",
            },
        },
        {
            pos: {
                sizeX: 4,
                maxSizeY: 2,
                minSizeX: 2,
                maxSizeX: 4,
                row: 2,
                col: 0,
                sizeY: 1,
            },
            properties: {
                selectedChannel: "Direct",
                metric: "TopSitesExtended",
                webSource: "Total",
                duration: "1m",
                type: "TopSitesTable",
                filters: {
                    timeGranularity: "Monthly",
                    orderBy: "Share desc",
                },
                family: "Industry",
                options: {},
                title: "Top Websites",
                tooltip: "Top Websites.tooltip",
            },
        },
        {
            pos: {
                sizeX: 4,
                maxSizeY: 2,
                minSizeX: 2,
                maxSizeX: 4,
                row: 3,
                col: 0,
                sizeY: 2,
            },
            properties: {
                flexibleDuration: true,
                selectedChannel: "Direct",
                metric: "TopCategoryShare",
                webSource: "Total",
                duration: "12m",
                type: "CategoryShareGraphDashboard",
                filters: {
                    timeGranularity: "Monthly",
                },
                width: "2",
                customAsset: false,
                family: "Industry",
                options: {},
                title: "Category Share",
                tooltip: "Category Share.tooltip",
            },
        },
        {
            pos: {
                sizeX: 2,
                sizeY: 1,
                maxSizeY: 1,
                minSizeX: 1,
                maxSizeX: 2,
                row: 5,
                col: 0,
            },
            properties: {
                selectedChannel: "Direct",
                metric: "TrafficSourcesOverview",
                webSource: "Desktop",
                duration: "1m",
                type: "PieChart",
                filters: {},
                width: "1",
                customAsset: "Industry",
                options: {},
                family: "Industry",
                title: "Last Month Channels",
                tooltip: "Yearly Channels Overview.tooltip",
                titleTemplate: "custom",
            },
        },
        {
            pos: {
                sizeX: 2,
                sizeY: 1,
                maxSizeY: 2,
                minSizeX: 2,
                maxSizeX: 4,
                row: 5,
                col: 2,
            },
            properties: {
                flexibleDuration: true,
                metric: "TrafficSourcesOverview",
                webSource: "Desktop",
                duration: "12m",
                type: "MmxChannelsGraphDashboard",
                filters: {
                    timeGranularity: "Monthly",
                },
                width: "4",
                customAsset: false,
                family: "Industry",
                options: {},
                title: "Channels Overview",
                tooltip: "Channels Overview.tooltip",
            },
        },
        {
            pos: {
                sizeX: 2,
                maxSizeY: 2,
                minSizeX: 2,
                maxSizeX: 4,
                row: 6,
                col: 0,
                sizeY: 1,
            },
            properties: {
                selectedChannel: "Direct",
                metric: "CategoryLeadersDirect",
                webSource: "Total",
                duration: "1m",
                type: "LeaderBySourceTable",
                filters: {
                    orderBy: "Share desc",
                    timeGranularity: "Monthly",
                },
                width: "2",
                family: "Industry",
                options: {},
                title: "Direct Traffic Leaders",
                tooltip: "Direct Traffic Leaders.tooltip",
            },
        },
        {
            pos: {
                sizeX: 2,
                maxSizeY: 2,
                minSizeX: 2,
                maxSizeX: 4,
                row: 6,
                col: 2,
                sizeY: 1,
            },
            properties: {
                duration: "1m",
                family: "Industry",
                type: "LeaderBySourceTable",
                metric: "CategoryLeadersReferrals",
                filters: {
                    orderBy: "Share desc",
                    timeGranularity: "Monthly",
                },
                options: {},
                title: "Referrals Traffic Leaders",
                tooltip: "Referrals Traffic Leaders.tooltip",
            },
        },
        {
            pos: {
                sizeX: 2,
                sizeY: 1,
                maxSizeY: 1,
                minSizeX: 1,
                maxSizeX: 2,
                row: 7,
                col: 1,
            },
            properties: {
                selectedChannel: "Direct",
                metric: "SearchKeywordsAbb",
                webSource: "Desktop",
                duration: "1m",
                type: "PieChart",
                filters: {},
                width: "1",
                family: "Industry",
                options: {},
                title: "Organic vs. Paid",
                tooltip: "Organic vs. Paid.tooltip",
            },
        },
        {
            pos: {
                sizeX: 2,
                maxSizeY: 2,
                minSizeX: 2,
                maxSizeX: 4,
                row: 8,
                col: 0,
                sizeY: 1,
            },
            properties: {
                selectedChannel: "Direct",
                metric: "CategoryLeadersSearch",
                webSource: "Total",
                duration: "1m",
                type: "LeaderBySourceTable",
                filters: {
                    orderBy: "Share desc",
                    timeGranularity: "Monthly",
                },
                width: "2",
                customAsset: false,
                family: "Industry",
                options: {},
                title: "Organic Search Leaders",
                tooltip: "Organic Traffic Leaders.tooltip",
                titleTemplate: "custom",
            },
        },
        {
            pos: {
                sizeX: 2,
                maxSizeY: 2,
                minSizeX: 2,
                maxSizeX: 4,
                row: 8,
                col: 2,
            },
            properties: {
                duration: "1m",
                family: "Industry",
                type: "LeaderBySourceTable",
                metric: "CategoryLeadersSearch",
                customAsset: "Industry",
                filters: {
                    orderBy: "Share desc",
                    timeGranularity: "Monthly",
                    filter: "OP;==;1",
                },
                options: {},
                tooltip: "Paid Search Leaders.tooltip",
                title: "Paid Search Leaders",
                titleTemplate: "custom",
            },
        },
        {
            pos: {
                sizeX: 2,
                sizeY: 1,
                maxSizeY: 2,
                minSizeX: 2,
                maxSizeX: 4,
                row: 9,
                col: 0,
            },
            properties: {
                selectedChannel: "Direct",
                metric: "CategoryLeadersAds",
                webSource: "Desktop",
                duration: "1m",
                type: "LeaderBySourceTable",
                filters: {
                    orderBy: "Share desc",
                },
                width: "2",
                family: "Industry",
                options: {},
                title: "Display Ads Traffic Leaders",
                tooltip: "Display Ads Traffic Leaders.tooltip",
            },
        },
        {
            pos: {
                sizeX: 2,
                sizeY: 1,
                maxSizeY: 2,
                minSizeX: 2,
                maxSizeX: 4,
                row: 9,
                col: 2,
            },
            properties: {
                selectedChannel: "Direct",
                metric: "CategoryLeadersSocial",
                webSource: "Desktop",
                duration: "1m",
                type: "LeaderBySourceTable",
                filters: {
                    orderBy: "Share desc",
                },
                width: "2",
                family: "Industry",
                options: {},
                title: "Social Traffic Leaders",
                tooltip: "Social Traffic Leaders.tooltip",
            },
        },
    ],
};
export default dashboard;
