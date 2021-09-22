import { IDashboardTemplate } from "../DashboardTemplateService";
import { EFamilyTypes } from "../components/DashboardTemplatesConfig";
import { AssetsService } from "../../../../services/AssetsService";

const dashboard: IDashboardTemplate = {
    id: 10,
    title: "dashboard.templates.appengagements.title",
    description: "dashboard.templates.appengagements.description",
    descriptionLong: "dashboard.templates.appengagements.description.long",
    keyMetrics: "dashboard.templates.appengagements.keymetric",
    previewImage: AssetsService.assetUrl(
        "/images/dashboard/templates/MobileAppMonitoring-preview.png",
    ),
    thumbnailImage: AssetsService.assetUrl(
        "/images/dashboard/templates/MobileAppMonitoring-thumb.png",
    ),
    familyType: EFamilyTypes.Apps,
    minItems: 2,
    maxItems: 5,
    widgets: [
        {
            pos: {
                sizeX: 4,
                maxSizeY: 2,
                minSizeX: 2,
                maxSizeX: 4,
                row: 0,
                col: 0,
            },
            properties: {
                metric: "AppEngagementOverviewRealNumbers",
                webSource: "Total",
                duration: "12m",
                type: "AppEngagementOverviewTable",
                filters: {
                    timeGranularity: "Monthly",
                },
                width: "2",
                customAsset: false,
                family: "Mobile",
                options: {},
                title: "Engagement Overview",
                tooltip: "Engagement Overview.tooltip",
            },
        },
        {
            pos: {
                sizeX: 2,
                maxSizeY: 2,
                minSizeX: 2,
                maxSizeX: 4,
                row: 1,
                col: 0,
            },
            properties: {
                duration: "12m",
                family: "Mobile",
                type: "Graph",
                metric: "AppEngagementCurrentInstalls",
                filters: {
                    timeGranularity: "Monthly",
                },
                options: {},
                title: "Install Penetration",
            },
        },
        {
            pos: {
                sizeX: 2,
                maxSizeY: 2,
                minSizeX: 2,
                maxSizeX: 4,
                row: 1,
                col: 2,
            },
            properties: {
                duration: "12m",
                family: "Mobile",
                type: "AppEngagementMetricsDashboardGraph",
                metric: "AppEngagementDownloads",
                filters: {
                    timeGranularity: "Monthly",
                },
                options: {},
                title: "Downloads",
            },
        },
        {
            pos: {
                sizeX: 2,
                maxSizeY: 2,
                minSizeX: 2,
                maxSizeX: 4,
                row: 2,
                col: 0,
            },
            properties: {
                duration: "12m",
                family: "Mobile",
                type: "AppEngagementMetricsDashboardGraph",
                metric: "AppEngagementDailyActiveUsers",
                filters: {
                    timeGranularity: "Monthly",
                },
                options: {},
                tooltip: "Daily Activr Users.tooltip",
                title: "Daily Active Users",
                titleTemplate: "custom",
            },
        },
    ],
};
export default dashboard;
