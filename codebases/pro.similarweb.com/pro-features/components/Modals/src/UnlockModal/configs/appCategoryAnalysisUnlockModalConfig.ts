import { i18nFilter } from "../../../../../../app/filters/ngFilters";
import { AssetsService } from "../../../../../../app/services/AssetsService";
import { IModalConfig } from "../unlockModalConfig";

export interface IACAUnlockModalTypes {
    AppCategoryAnalysis: "TopApps" | "TrendingApps" | "TopKeywords";
    TopApps: "TopApps";
    TrendingApps: "TrendingApps";
    Store: "TopKeywords";
}

export const AppCategoryAnalysisUnlockModalConfig = (): {
    [D in keyof IACAUnlockModalTypes]: IModalConfig<D>;
} => ({
    AppCategoryAnalysis: {
        slides: {
            TopApps: {
                img: AssetsService.assetUrl("/images/unlock-modal/rankings-top-apps.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/rankings-top-apps-2x.jpg"),
                trackId: `${i18nFilter()("hook_unlock.app_category_analysis.title")}/${i18nFilter()(
                    "hook_unlock.rankings.top_apps.title",
                )}`,
                title: i18nFilter()("hook_unlock.app_category_analysis.title"),
                subtitle: i18nFilter()("hook_unlock.rankings.top_apps.title"),
                text: i18nFilter()("hook_unlock.rankings.top_apps.text"),
            },
            TrendingApps: {
                img: AssetsService.assetUrl("/images/unlock-modal/rankings-trending-apps.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/rankings-trending-apps-2x.jpg"),
                trackId: `${i18nFilter()("hook_unlock.app_category_analysis.title")}/${i18nFilter()(
                    "hook_unlock.rankings.trending_apps.title",
                )}`,
                title: i18nFilter()("hook_unlock.app_category_analysis.title"),
                subtitle: i18nFilter()("hook_unlock.rankings.trending_apps.title"),
                text: i18nFilter()("hook_unlock.rankings.trending_apps.text"),
            },
            TopKeywords: {
                img: AssetsService.assetUrl("/images/unlock-modal/store-top-keywords.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/store-top-keywords-2x.jpg"),
                trackId: `${i18nFilter()("hook_unlock.app_category_analysis.title")}/${i18nFilter()(
                    "hook_unlock.store.top_keywords.title",
                )}`,
                title: i18nFilter()("hook_unlock.app_category_analysis.title"),
                subtitle: i18nFilter()("hook_unlock.store.top_keywords.title"),
                text: i18nFilter()("hook_unlock.store.top_keywords.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.app_category_analysis.cta_text"),
        label: "App Category Analysis",
    },
    TopApps: {
        slides: {
            TopApps: {
                img: AssetsService.assetUrl("/images/unlock-modal/rankings-top-apps.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/rankings-top-apps-2x.jpg"),
                title: i18nFilter()("hook_unlock.rankings.top_apps.title"),
                subtitle: i18nFilter()("hook_unlock.rankings.top_apps.subtitle"),
                text: i18nFilter()("hook_unlock.rankings.top_apps.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.rankings.cta_text"),
        label: "Top Apps",
    },
    TrendingApps: {
        slides: {
            TrendingApps: {
                img: AssetsService.assetUrl("/images/unlock-modal/rankings-trending-apps.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/rankings-trending-apps-2x.jpg"),
                title: i18nFilter()("hook_unlock.rankings.trending_apps.title"),
                subtitle: i18nFilter()("hook_unlock.rankings.trending_apps.subtitle"),
                text: i18nFilter()("hook_unlock.rankings.trending_apps.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.rankings.cta_text"),
        label: "Rankings",
    },
    Store: {
        slides: {
            TopKeywords: {
                img: AssetsService.assetUrl("/images/unlock-modal/store-top-keywords.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/store-top-keywords-2x.jpg"),
                title: i18nFilter()("hook_unlock.store.top_keywords.title"),
                subtitle: i18nFilter()("hook_unlock.store.top_keywords.subtitle"),
                text: i18nFilter()("hook_unlock.store.top_keywords.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.store.cta_text"),
        label: "Store",
    },
});
