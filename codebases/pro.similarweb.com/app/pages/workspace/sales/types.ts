export const USERDATA_ENDPOINT = "/api/userdata";
export const SALES_WIDGET_ENDPOINT = "/widgetApi/SalesWorkspace";
export const SITE_TRENDS_ENDPOINT = "/api/SiteTrends/Data";
export const SALES_ENDPOINT = `${USERDATA_ENDPOINT}/workspaces/sales`;
export const ANALYSIS_ENDPOINT = `/widgetApi/SalesSiteAnalysis`;
export const API_ANALYSIS_ENDPOINT = `/api/SalesSiteAnalysis`;

export type PrimitiveType = string | number | symbol;

export type WithLabel = {
    label: string;
};
