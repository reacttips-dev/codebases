import { sortSettingsType } from "./types";

export const FILTER_WIDTH = "323px";

export const KEYS = {
    techSearchFilter: "technographics.page.search.filter",
    techCategoryFilter: "technographics.page.category.filter",
    techSubDomainFilter: "technographics.page.subdomain.filter",
    techExcelDownload: "analysis.overview.technographics.excel.download",
    categoryFilterBtnText: "websiteAnalysis.technographics.filters.category.btntext",
    categoryFilterBtnPlaceholder: "websiteAnalysis.technographics.filters.category.placeholder",
    searchPlaceholder: "websiteAnalysis.technographics.search.placeholder",
    subdomainPlaceholder: "websiteAnalysis.technographics.filters.subdomain.placeholder",
    subdomainBtnApply: "websiteAnalysis.technographics.filters.subdomain.apply",
    all: "common.category.all",
    website: "workspace.sales.about.technologies.website.title",
    trafficShare: "workspace.sales.about.technologies.trafficshare.title",
};

// Table settings
export const TECHNOGRAPHICS_PAGE_TABLE = "technographics_page_table";

export const sortSettings: sortSettingsType = {
    category: "asc",
    subCategory: "asc",
    technologyName: "asc",
    freePaid: "asc",
};

// Tracking Events
export const CATEGORY = "category";
export const EDIT = "edit";
export const CLICK = "click";
export const CLEAR = "clear";

// API
export const TECHNOLOGIES_TABLE_URL = "/api/technographics/table";
