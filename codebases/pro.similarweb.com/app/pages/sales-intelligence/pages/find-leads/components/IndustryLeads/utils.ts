import { i18nCategoryFilter, i18nFilter } from "filters/ngFilters";
import {
    RecentIndustry,
    RecentIndustryConfigure,
    RecentIndustryData,
} from "pages/sales-intelligence/types";
import { IndustryTables } from "pages/sales-intelligence/pages/find-leads/components/IndustryLeads/IndustyResult/configs/allConfigs";
import { ICategory } from "common/services/categoryService.types";
import { CUSTOM_CATEGORY_PREFIX } from "services/category/userCustomCategoryService";

const ALL = "All";

export const configureRecentIndustry = (
    recentIndustry: RecentIndustry[],
    limit: number,
): RecentIndustryConfigure[] => {
    const arr = recentIndustry
        .map(({ data }) => {
            const text =
                data.category === ALL
                    ? i18nFilter()("common.category.all_industries")
                    : i18nCategoryFilter()(data.category);

            return {
                data,
                text,
                icon: getIndustryIcon(data.mainItem),
            };
        })
        .filter(({ data, icon }) => !data.mainItem.startsWith(CUSTOM_CATEGORY_PREFIX));
    return getUniqueIndustry(arr, "mainItem").slice(0, limit);
};

const getIndustryIcon = (item: string): string => {
    if (item === ALL || item.startsWith(CUSTOM_CATEGORY_PREFIX)) {
        return "custom-category";
    }
    return item.split("~")[0].replace(/_/g, "-").toLowerCase();
};

const getUniqueIndustry = (
    data: RecentIndustryConfigure[],
    key: keyof RecentIndustryData,
): RecentIndustryConfigure[] => {
    const obj: Record<string, true> = {};

    return data.filter(({ data }) => {
        if (!obj[data[key]]) {
            obj[data[key]] = true;
            return true;
        }
        return false;
    });
};

export const getParamsByTable = (tableName: string): { duration: string; webSource: string } => {
    switch (tableName) {
        case IndustryTables.TopWebsites:
        case IndustryTables.OutboundTraffic:
            return { duration: "1m", webSource: "Total" };
        case IndustryTables.SearchLeaders:
        case IndustryTables.IncomingTraffic:
        case IndustryTables.DirectLeaders:
        case IndustryTables.DisplayLeaders:
        case IndustryTables.EmailLeaders:
        case IndustryTables.ReferralLeaders:
        case IndustryTables.SocialLeaders:
            return { duration: "1m", webSource: "Desktop" };
        default:
            return { duration: "1m", webSource: "Total" };
    }
};

export const resolveItemIcon = (item: ICategory, isChild: boolean) => {
    if (isChild) {
        return null;
    }

    return item.icon
        ?.replace(/sprite-category /g, "")
        .replace(/_/g, "-")
        .toLowerCase();
};

export const getCategoryDisplayDetails = (category?: ICategory) => {
    if (!category) {
        return {
            text: "Invalid Industry",
            secondaryText: "N/A",
            icon: "no-data",
        };
    }

    return {
        text: category.text,
        secondaryText: category.isCustomCategory
            ? "Custom Industry"
            : i18nFilter()("si.find_leads.category.industry"),
        icon:
            category.id === ALL
                ? "market"
                : category.id.split("~")[0].replace(/_/g, "-").toLowerCase(),
    };
};
