import { IDashboardTemplate } from "../DashboardTemplateService";
import { EFamilyTypes } from "../components/DashboardTemplatesConfig";
import { AssetsService } from "../../../../services/AssetsService";

const dashboard: IDashboardTemplate = {
    id: 3,
    title: "dashboard.templates.websiteaudienceanalysis.title",
    description: "dashboard.templates.websiteaudienceanalysis.description",
    descriptionLong: "dashboard.templates.websiteaudienceanalysis.description.long",
    keyMetrics: "dashboard.templates.websiteaudienceanalysis.keymetric",
    previewImage: AssetsService.assetUrl(
        "/images/dashboard/templates/WebsiteAudienceAnalysis-preview.png",
    ),
    thumbnailImage: AssetsService.assetUrl(
        "/images/dashboard/templates/WebsiteAudienceAnalysis-thumb.png",
    ),
    familyType: EFamilyTypes.Website,
    minItems: 2,
    maxItems: 5,
    widgets: [
        {
            pos: {
                sizeX: 4,
                minSizeX: 23,
                row: 0,
                col: 0,
                maxSizeY: 2,
                maxSizeX: 4,
            },
            properties: {
                selectedChannel: "Direct",
                metric: "EngagementVisits",
                webSource: "Total",
                duration: "3m",
                type: "Graph",
                filters: {
                    ShouldGetVerifiedData: "true",
                    timeGranularity: "Daily",
                    includeSubDomains: "true",
                },
                width: "2",
                customAsset: false,
                family: "Website",
                options: {},
                title: "Total Visits",
                tooltip: "Total Visits.tooltip",
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
                froWebSource: "Total",
                selectedChannel: "Direct",
                metric: "EngagementOverview",
                webSource: "Desktop",
                duration: "1m",
                type: "EngagementTableDashboard",
                filters: {
                    ShouldGetVerifiedData: "true",
                    includeSubDomains: "true",
                    timeGranularity: "Monthly",
                },
                width: "4",
                customAsset: false,
                family: "Website",
                options: {},
                title: "Engagement Metrics - Desktop",
                tooltip: "Engagement Metrics.tooltip",
            },
        },
        {
            pos: {
                sizeX: 2,
                minSizeX: 2,
                row: 1,
                col: 2,
                maxSizeY: 2,
                maxSizeX: 4,
            },
            properties: {
                mobileWebOnly: true,
                selectedChannel: "Direct",
                metric: "EngagementOverview",
                webSource: "MobileWeb",
                duration: "1m",
                type: "EngagementTableDashboard",
                filters: {
                    ShouldGetVerifiedData: "true",
                    includeSubDomains: "true",
                    timeGranularity: "Monthly",
                },
                width: "4",
                customAsset: false,
                family: "Website",
                options: {},
                title: "Engagement Metrics - Mobile",
                tooltip: "Engagement Metrics.tooltip",
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
                mobileWebOnly: true,
                selectedChannel: "Direct",
                metric: "EngagementDesktopVsMobileVisits",
                webSource: "Total",
                duration: "1m",
                type: "Table",
                filters: {
                    ShouldGetVerifiedData: "true",
                    includeSubDomains: "true",
                },
                width: "2",
                customAsset: false,
                family: "Website",
                options: {},
                tooltip: "",
                title: "Traffic Share by Device",
            },
        },
        {
            pos: {
                sizeX: 1,
                minSizeX: 1,
                row: 2,
                col: 2,
                maxSizeY: 1,
                maxSizeX: 2,
            },
            properties: {
                froWebSource: "Total",
                selectedChannel: "Direct",
                metric: "EngagementVisits",
                webSource: "Desktop",
                duration: "1m",
                type: "PieChart",
                filters: {
                    ShouldGetVerifiedData: "true",
                    includeSubDomains: "true",
                    timeGranularity: "Daily",
                },
                width: "1",
                customAsset: false,
                family: "Website",
                options: {},
                title: "Desktop",
                tooltip: "Desktop.tooltip",
            },
        },
        {
            pos: {
                sizeX: 1,
                sizeY: 1,
                maxSizeY: 1,
                minSizeX: 1,
                maxSizeX: 2,
                row: 2,
                col: 3,
            },
            properties: {
                mobileWebOnly: true,
                selectedChannel: "Direct",
                metric: "EngagementVisits",
                webSource: "MobileWeb",
                duration: "1m",
                type: "PieChart",
                filters: {
                    ShouldGetVerifiedData: "true",
                    timeGranularity: "Daily",
                    includeSubDomains: "true",
                },
                width: "1",
                customAsset: false,
                family: "Website",
                options: {},
                title: "Mobile",
                tooltip: "Mobile.tooltip",
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
            },
            properties: {
                fixedCountry: 999,
                selectedChannel: "Direct",
                metric: "Geography",
                webSource: "Desktop",
                duration: "1m",
                type: "Table",
                filters: {
                    orderBy: "TotalShare desc",
                    includeSubDomains: "true",
                },
                width: "2",
                customAsset: false,
                family: "Website",
                options: {},
                tooltip: "",
                title: "Traffic Share by Country",
            },
        },
        {
            pos: {
                sizeX: 2,
                maxSizeY: 2,
                minSizeX: 2,
                maxSizeX: 4,
                row: 4,
                col: 0,
            },
            properties: {
                selectedChannel: "Direct",
                metric: "WebDemographicsGender",
                webSource: "Desktop",
                duration: "1m",
                type: "BarChartDemographicsGender",
                filters: {},
                width: "2",
                customAsset: false,
                family: "Website",
                options: {},
                tooltip: "dashboard.metricGallery.Website.WebDemographicsGender.description",
                title: "Gender Distribution",
                titleTemplate: "custom",
            },
        },
        {
            pos: {
                sizeX: 2,
                maxSizeY: 2,
                minSizeX: 2,
                maxSizeX: 4,
                row: 4,
                col: 2,
            },
            properties: {
                selectedChannel: "Direct",
                metric: "WebDemographicsAge",
                webSource: "Desktop",
                duration: "1m",
                type: "BarChartDemographics",
                filters: {},
                width: "2",
                customAsset: false,
                family: "Website",
                options: {},
                tooltip: "dashboard.metricGallery.Website.WebDemographicsAge.description",
                title: "Age Distribution",
            },
        },
        {
            singleModeOnly: true,
            pos: {
                sizeX: 4,
                sizeY: 1,
                maxSizeY: 2,
                minSizeX: 2,
                maxSizeX: 4,
                row: 5,
                col: 0,
            },
            properties: {
                selectedChannel: "Direct",
                metric: "AudienceInterests",
                webSource: "Desktop",
                duration: "3m",
                type: "Table",
                filters: {
                    orderBy: "RelevancyScore desc",
                    includeSubDomains: "true",
                },
                width: "2",
                customAsset: false,
                family: "Website",
                options: {},
                title: "Audience Interest",
                tooltip: "Audience Interest.tooltip",
            },
        },
    ],
};
export default dashboard;
