import { i18nFilter } from "../../../../../../app/filters/ngFilters";
import { AssetsService } from "../../../../../../app/services/AssetsService";
import { IModalConfig } from "../unlockModalConfig";

export interface IConversionUnlockModalTypes {
    ConversionModule: "ConversionModule";
    ConversionCategoryOverview: "ConversionCategoryOverview";
    ConversionWebsiteOverview: "ConversionWebsiteOverview";
}

export const ConversionUnlockModalConfig = (): {
    [D in keyof IConversionUnlockModalTypes]: IModalConfig<D>;
} => ({
    ConversionModule: {
        slides: {
            ConversionModule: {
                img: AssetsService.assetUrl(
                    "/images/unlock-modal/conversion-category-overview.jpg",
                ),
                img2x: AssetsService.assetUrl(
                    "/images/unlock-modal/conversion-category-overview-2x.jpg",
                ),
                title: i18nFilter()("hook_unlock.conversion-module.title"),
                subtitle: i18nFilter()("hook_unlock.conversion-module.subtitle"),
                text: i18nFilter()("hook_unlock.conversion-module.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.traffic.cta_text"),
        label: "Conversion Module",
    },
    ConversionCategoryOverview: {
        slides: {
            ConversionCategoryOverview: {
                img: AssetsService.assetUrl(
                    "/images/unlock-modal/conversion-category-overview.jpg",
                ),
                img2x: AssetsService.assetUrl(
                    "/images/unlock-modal/conversion-category-overview-2x.jpg",
                ),
                title: i18nFilter()("hook_unlock.conversion-category-overview.title"),
                subtitle: i18nFilter()("hook_unlock.conversion-category-overview.subtitle"),
                text: i18nFilter()("hook_unlock.conversion-category-overview.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.traffic.cta_text"),
        label: "Conversion Category Overview",
    },
    ConversionWebsiteOverview: {
        slides: {
            ConversionWebsiteOverview: {
                img: AssetsService.assetUrl(
                    "/images/unlock-modal/conversion-category-overview.jpg",
                ),
                img2x: AssetsService.assetUrl(
                    "/images/unlock-modal/conversion-category-overview-2x.jpg",
                ),
                title: i18nFilter()("hook_unlock.conversion-website-overview.title"),
                subtitle: i18nFilter()("hook_unlock.conversion-website-overview.subtitle"),
                text: i18nFilter()("hook_unlock.conversion-website-overview.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.traffic.cta_text"),
        label: "Conversion Website Overview",
    },
});
