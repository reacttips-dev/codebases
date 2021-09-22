import { i18nFilter } from "../../../../../../app/filters/ngFilters";
import { AssetsService } from "../../../../../../app/services/AssetsService";
import { IModalConfig } from "../unlockModalConfig";

export interface IAKAUnlockModalTypes {
    GooglePlayKeywords: "GooglePlayKeywords";
    AppKeywordsCompetitors: "Organic";
}

export const AppKeywordsAnalysisUnlockModalConfig = (): {
    [D in keyof IAKAUnlockModalTypes]: IModalConfig<D>;
} => ({
    GooglePlayKeywords: {
        slides: {
            GooglePlayKeywords: {
                img: AssetsService.assetUrl("/images/unlock-modal/app-kwa-googleplay.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/app-kwa-googleplay-2x.jpg"),
                title: i18nFilter()("hook_unlock.google_play_keywords.title"),
                subtitle: i18nFilter()("hook_unlock.app_keywords.google_play_keywords.title"),
                text: i18nFilter()("hook_unlock.app_keywords.google_play_keywords.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.google_play_keywords.cta_text"),
        label: "Google Play Keywords",
    },
    AppKeywordsCompetitors: {
        slides: {
            Organic: {
                img: AssetsService.assetUrl("/images/unlock-modal/app-kwa-organic.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/app-kwa-organic-2x.jpg"),
                title: i18nFilter()("hook_unlock.app_keywords.organic.title"),
                subtitle: i18nFilter()("hook_unlock.app_keywords.organic.subtitle"),
                text: i18nFilter()("hook_unlock.app_keywords.organic.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.app_keywords_competitors.cta_text"),
        label: "App Keywords Competitors",
    },
});
