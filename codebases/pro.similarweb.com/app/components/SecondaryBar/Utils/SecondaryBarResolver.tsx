import React from "react";
import { SecondaryBarType } from "reducers/_reducers/SecondaryBarReducer";
import { ConversionAnalysisNavBarHeader } from "components/SecondaryBar/NavBars/ConversionAnalysisNavBar/ConversionAnalysisNavBarHeader";
import { InsightsNavBarBody } from "components/SecondaryBar/NavBars/Insights/InsightsNavBarBody";
import { InsightsNavBarHeader } from "components/SecondaryBar/NavBars/Insights/InsightsNavBarHeader";
import { AppResearchSecBarBody } from "../NavBars/AppResearchNavBar/AppResearchNavBarBody";
import { AppResearchNavBarHeader } from "../NavBars/AppResearchNavBar/AppResearchNavBarHeader";
import { DigitalMarketingNavBarBody } from "../NavBars/DigitalMarketing/DigitalMarketingNavBarBody";
import { DigitalMarketingNavBarHeader } from "../NavBars/DigitalMarketing/DigitalMarketingNavBarHeader";
import { MarketResearchSecBarBody } from "../NavBars/MarketResearch/MarketResearchNavBarBody";
import { MarketResearchBarHeader } from "../NavBars/MarketResearch/MarketResearchNavBarHeader";
import { WebsiteResearchSecBarBody } from "../NavBars/WebsiteResearchNavBar/WebsiteResearchNavBarBody";
import { WebsiteResearchNavBarHeader } from "../NavBars/WebsiteResearchNavBar/WebsiteResearchNavBarHeader";
// eslint-disable-next-line max-len
import MarketingWorkspaceNavBarHeader from "components/SecondaryBar/NavBars/WorkspacesNavBar/MarketingWorkspaces/MarketingWorkspaceNavBarHeader/MarketingWorkspaceNavBarHeader";
import MarketingWorkspaceNavBarBody from "../NavBars/WorkspacesNavBar/MarketingWorkspaces/MarketingWorkspaceNavBarBody/MarketingWorkspaceNavBarBody";
import MarketingWorkspaceNavBarFooter from "../NavBars/WorkspacesNavBar/MarketingWorkspaces/MarketingWorkspaceNavBarFooter/MarketingWorkspaceNavBarFooter";
import SalesWorkspaceNavBarBody from "components/SecondaryBar/NavBars/WorkspacesNavBar/SalesWorkspace/SalesWorkspaceNavBarBody";
import SalesWorkspaceNavBarHeader from "components/SecondaryBar/NavBars/WorkspacesNavBar/SalesWorkspace/SalesWorkspaceNavBarHeader";
import InvestorsWorkspaceNavBarBody from "components/SecondaryBar/NavBars/WorkspacesNavBar/InvestorsWorkspace/InvestorsWorkspaceNavBarBody";
import InvestorsWorkspaceNavBarHeader from "components/SecondaryBar/NavBars/WorkspacesNavBar/InvestorsWorkspace/InvestorsWorkspaceNavBarHeader";
import DashboardsNavBarBody from "components/SecondaryBar/NavBars/DashboardsNavBar/DashboardsNavBarBody";
import DashboardsNavBarHeader from "../NavBars/DashboardsNavBar/DashboardsNavBarHeader";
import ConversionAnalysisNavBarBody from "../NavBars/ConversionAnalysisNavBar/ConversionAnalysisNavBarBody";
import { AccountReviewNavBarBody } from "../NavBars/SalesIntelligence/AccountReviewNavBarBody";
import { AccountReviewNavBarHeader } from "../NavBars/SalesIntelligence/AccountReviewNavBarHeader";
import AppReviewNavBarHeader from "../NavBars/SalesIntelligence/AppReviewNavBarHeader";
import AppReviewNavBarBody from "components/SecondaryBar/NavBars/SalesIntelligence/AppReviewNavBarBody";

const typeToModulesMapping = {
    WebsiteResearch: ["websites-root", "websites", "segments", "industryAnalysis"],
    MarketIntelligence: [
        "marketresearch",
        "marketresearch_webmarketanalysis_home",
        "appcategory",
        "marketresearch_keywordmarketanalysis_home",
        "companyresearch_websiteanalysis_home",
        "companyresearch_appanalysis_home",
    ],
};

export interface ISecondaryBarContents {
    SecondaryBarHeader: JSX.Element;
    SecondaryBarBody: JSX.Element;
    SecondaryBarFooter?: JSX.Element;
}

export const resolveSecondaryBarType = (currentModule: string): SecondaryBarType => {
    for (const [barType, supportedModules] of Object.entries(typeToModulesMapping)) {
        if (supportedModules.some((module) => module === currentModule)) {
            return barType as SecondaryBarType;
        }
    }

    return "None";
};

export const resolveSecondaryBarContents = (type: SecondaryBarType) => {
    switch (type) {
        case "WebsiteResearch":
            return websiteResearchNavBarContents();

        case "MarketingWorkspace":
            return marketingWorkspacesNavBarContents();

        case "SalesWorkspace":
            return salesWorkspacesNavBarContents();

        case "InvestorsWorkspace":
            return investorsWorkspacesNavBarContents();

        case "Dashboards":
            return dashboardsNavBarContents();

        case "AppResearch":
            return appResearchNavBarContents();

        case "ConversionAnalysis":
            return conversionAnalysisNavBarContents();

        case "MarketResearch":
            return marketResearchNavBarContent();

        case "DigitalMarketing":
            return digitalMarketingNavBarContent();

        case "CustomInsights":
            return customInsightsNavBarContent();

        case "SalesIntelligenceAccountReview":
            return salesIntelligenceAccountReviewContent();

        case "SalesIntelligenceAppReview":
            return salesIntelligenceAppReviewContent();

        case "None":
            return null;

        default:
            return null;
    }
};

const websiteResearchNavBarContents = (): ISecondaryBarContents => {
    return {
        SecondaryBarHeader: <WebsiteResearchNavBarHeader />,
        SecondaryBarBody: <WebsiteResearchSecBarBody />,
    };
};

const marketingWorkspacesNavBarContents = (): ISecondaryBarContents => {
    return {
        SecondaryBarHeader: <MarketingWorkspaceNavBarHeader text="Workspaces" />,
        SecondaryBarBody: <MarketingWorkspaceNavBarBody />,
        SecondaryBarFooter: <MarketingWorkspaceNavBarFooter />,
    };
};

const salesWorkspacesNavBarContents = (): ISecondaryBarContents => {
    return {
        SecondaryBarHeader: <SalesWorkspaceNavBarHeader />,
        SecondaryBarBody: <SalesWorkspaceNavBarBody />,
    };
};

const salesIntelligenceAccountReviewContent = (): ISecondaryBarContents => ({
    SecondaryBarHeader: <AccountReviewNavBarHeader />,
    SecondaryBarBody: <AccountReviewNavBarBody />,
});

const salesIntelligenceAppReviewContent = (): ISecondaryBarContents => ({
    SecondaryBarHeader: <AppReviewNavBarHeader />,
    SecondaryBarBody: <AppReviewNavBarBody />,
});

const investorsWorkspacesNavBarContents = (): ISecondaryBarContents => {
    return {
        SecondaryBarHeader: <InvestorsWorkspaceNavBarHeader />,
        SecondaryBarBody: <InvestorsWorkspaceNavBarBody />,
    };
};

const dashboardsNavBarContents = (): ISecondaryBarContents => {
    return {
        SecondaryBarHeader: <DashboardsNavBarHeader />,
        SecondaryBarBody: <DashboardsNavBarBody />,
    };
};

const conversionAnalysisNavBarContents = (): ISecondaryBarContents => {
    return {
        SecondaryBarHeader: <ConversionAnalysisNavBarHeader />,
        SecondaryBarBody: <ConversionAnalysisNavBarBody />,
    };
};

const appResearchNavBarContents = (): ISecondaryBarContents => {
    return {
        SecondaryBarHeader: <AppResearchNavBarHeader />,
        SecondaryBarBody: <AppResearchSecBarBody />,
    };
};

const marketResearchNavBarContent = (): ISecondaryBarContents => {
    return {
        SecondaryBarHeader: <MarketResearchBarHeader />,
        SecondaryBarBody: <MarketResearchSecBarBody />,
    };
};

const digitalMarketingNavBarContent = (): ISecondaryBarContents => {
    return {
        SecondaryBarHeader: <DigitalMarketingNavBarHeader />,
        SecondaryBarBody: <DigitalMarketingNavBarBody />,
    };
};

const customInsightsNavBarContent = (): ISecondaryBarContents => {
    return {
        SecondaryBarHeader: <InsightsNavBarHeader />,
        SecondaryBarBody: <InsightsNavBarBody />,
    };
};
