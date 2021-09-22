import { IModalConfig } from "components/Modals/src/UnlockModal/unlockModalConfig";

export type SalesUnlockModalConfigType = {
    InsightsGeneratorFeature: "InsightsGeneratorFeature";
};

export const createSalesUnlockModalConfig = (
    translate: (key: string) => string,
    assetsService: { assetUrl(path: string): string },
): {
    [K in keyof SalesUnlockModalConfigType]: IModalConfig<K>;
} => {
    return {
        InsightsGeneratorFeature: {
            slides: {
                InsightsGeneratorFeature: {
                    img: assetsService.assetUrl(
                        "/images/sales-intelligence/insights-generator-illustration.svg",
                    ),
                    imgWidth: 350,
                    title: translate("hook_unlock.si_insights_generator.title"),
                    text: translate("hook_unlock.si_insights_generator.text"),
                    subtitle: translate("hook_unlock.si_insights_generator.subtitle"),
                },
            },
            ctaText: translate("hook_unlock.si_insights_generator.button"),
            label: "Insights Generator",
        },
    };
};
