import { i18nFilter } from "../../../../../../app/filters/ngFilters";
import { AssetsService } from "../../../../../../app/services/AssetsService";
import { IModalConfig } from "../unlockModalConfig";

export interface IWKAUnlockModalTypes {
    WebKeywordsOrganic: "Organic";
    WebKeywordsPaid: "Paid";
    WebKeywordsMobile: "Mobile";
    SearchKeywordAnalysis: "Organic" | "Paid" | "Mobile";
    KeywordsGenerator: "KeywordsGenerator";
    KeywordsAds: "KeywordsAds";
    KeywordsPLAs: "KeywordsPLAs";
    KeywordsGeo: "KeywordsGeo";
}
export const WebKeywordsAnalysisUnlockModalConfig = (): {
    [D in keyof IWKAUnlockModalTypes]: IModalConfig<D>;
} => ({
    SearchKeywordAnalysis: {
        slides: {
            Organic: {
                img: AssetsService.assetUrl("/images/unlock-modal/kwa-organic.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/kwa-organic-2x.jpg"),
                trackId: `${i18nFilter()("hook_unlock.keywords_analysis.title")}/${i18nFilter()(
                    "hook_unlock.web_keywords.organic.title",
                )}`,
                title: i18nFilter()("hook_unlock.keywords_analysis.title"),
                subtitle: i18nFilter()("hook_unlock.web_keywords.organic.title"),
                text: i18nFilter()("hook_unlock.web_keywords.organic.text"),
            },
            Paid: {
                img: AssetsService.assetUrl("/images/unlock-modal/kwa-paid.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/kwa-paid-2x.jpg"),
                trackId: `${i18nFilter()("hook_unlock.keywords_analysis.title")}/${i18nFilter()(
                    "hook_unlock.web_keywords.paid.title",
                )}`,
                title: i18nFilter()("hook_unlock.keywords_analysis.title"),
                subtitle: i18nFilter()("hook_unlock.web_keywords.paid.title"),
                text: i18nFilter()("hook_unlock.web_keywords.paid.text"),
            },
            Mobile: {
                img: AssetsService.assetUrl("/images/unlock-modal/kwa-mobile.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/kwa-mobile-2x.jpg"),
                trackId: `${i18nFilter()("hook_unlock.keywords_analysis.title")}/${i18nFilter()(
                    "hook_unlock.web_keywords.mobile.title",
                )}`,
                title: i18nFilter()("hook_unlock.keywords_analysis.title"),
                subtitle: i18nFilter()("hook_unlock.web_keywords.mobile.title"),
                text: i18nFilter()("hook_unlock.web_keywords.mobile.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.keywords_analysis.cta_text"),
        label: "Search Keywords Analysis",
    },
    WebKeywordsOrganic: {
        slides: {
            Organic: {
                img: AssetsService.assetUrl("/images/unlock-modal/kwa-organic.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/kwa-organic-2x.jpg"),
                title: i18nFilter()("hook_unlock.web_keywords.organic.title"),
                subtitle: i18nFilter()("hook_unlock.web_keywords.organic.subtitle"),
                text: i18nFilter()("hook_unlock.web_keywords.organic.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.web_keywords_competitors.cta_text"),
        label: "Web Keywords Competitors/Organic",
    },
    KeywordsGenerator: {
        slides: {
            KeywordsGenerator: {
                img: AssetsService.assetUrl("/images/unlock-modal/kwa-generator.png"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/kwa-generator-2x.png"),
                title: i18nFilter()("hook_unlock.web_keywords.generator.title"),
                subtitle: i18nFilter()("hook_unlock.web_keywords.generator.subtitle"),
                text: i18nFilter()("hook_unlock.web_keywords.generator.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.web_keywords.generator.cta_text"),
        label: "Web Keywords Competitors/KeywordsGenerator",
    },
    KeywordsAds: {
        slides: {
            KeywordsAds: {
                img: AssetsService.assetUrl("/images/unlock-modal/kwa-topads.png"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/kwa-topads-2x.png"),
                title: i18nFilter()("hook_unlock.web_keywords.topads.title"),
                subtitle: i18nFilter()("hook_unlock.web_keywords.topads.subtitle"),
                text: i18nFilter()("hook_unlock.web_keywords.topads.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.web_keywords.topads.cta_text"),
        label: "Web Keywords Competitors/Top Ads",
    },
    KeywordsPLAs: {
        slides: {
            KeywordsPLAs: {
                img: AssetsService.assetUrl("/images/unlock-modal/kwa-plas.png"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/kwa-plas-2x.png"),
                title: i18nFilter()("hook_unlock.web_keywords.plas.title"),
                subtitle: i18nFilter()("hook_unlock.web_keywords.plas.subtitle"),
                text: i18nFilter()("hook_unlock.web_keywords.plas.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.web_keywords.plas.cta_text"),
        label: "Web Keywords Competitors/Top Product Ads",
    },
    KeywordsGeo: {
        slides: {
            KeywordsGeo: {
                img: AssetsService.assetUrl("/images/unlock-modal/kwa-geo.png"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/kwa-geo-2x.png"),
                title: i18nFilter()("hook_unlock.web_keywords.geo.title"),
                subtitle: i18nFilter()("hook_unlock.web_keywords.geo.subtitle"),
                text: i18nFilter()("hook_unlock.web_keywords.geo.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.web_keywords.plas.cta_text"),
        label: "Web Keywords Competitors/Geography",
    },
    WebKeywordsPaid: {
        slides: {
            Paid: {
                img: AssetsService.assetUrl("/images/unlock-modal/kwa-paid.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/kwa-paid-2x.jpg"),
                title: i18nFilter()("hook_unlock.web_keywords.paid.title"),
                subtitle: i18nFilter()("hook_unlock.web_keywords.paid.subtitle"),
                text: i18nFilter()("hook_unlock.web_keywords.paid.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.web_keywords_competitors.cta_text"),
        label: "Web Keywords Competitors/Paid",
    },
    WebKeywordsMobile: {
        slides: {
            Mobile: {
                img: AssetsService.assetUrl("/images/unlock-modal/kwa-mobile.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/kwa-mobile-2x.jpg"),
                title: i18nFilter()("hook_unlock.web_keywords.mobile.title"),
                subtitle: i18nFilter()("hook_unlock.web_keywords_.mobile.subtitle"),
                text: i18nFilter()("hook_unlock.web_keywords.mobile.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.web_keywords_competitors.cta_text"),
        label: "Web Keywords Competitors/Mobile",
    },
});
