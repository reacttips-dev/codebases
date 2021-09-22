export type ChatType = "BLUE_SHIRT_CHAT" | "BRAND_EXPERT_CHAT";
export type BrandId = "blueShirt" | "google" | "microsoft";
export interface BrandAsset {
    name: string;
    logo: string;
    backgroundImage: string;
    avatarImage: string;
}

export type BrandConfiguration = {
    [lang in Language]: {
        chatType: ChatType;
        salesforceButtonId: string;
        preChatBackgroundImage: string;
    };
};
export interface BrandAssetConfigMap extends BrandAsset {
    config: BrandConfiguration;
}

export type SalesforceEnv = "development" | "qa" | "training" | "production";

export type BrandAssetMap = {
    [key in BrandId]: BrandAssetConfigMap;
};

export type BrandAssets = {
    [env in SalesforceEnv]: BrandAssetMap;
};

export const commonConfig: BrandAssetMap = {
    blueShirt: {
        name: "",
        logo: "",
        backgroundImage: "/client/blue-shirt-chat-background.jpg",
        avatarImage: "",
        config: {
            en: {
                chatType: "BLUE_SHIRT_CHAT",
                salesforceButtonId: "",
                preChatBackgroundImage: "/client/blueshirt-header-en.jpg",
            },
            fr: {
                chatType: "BLUE_SHIRT_CHAT",
                salesforceButtonId: "",
                preChatBackgroundImage: "/client/blueshirt-header-fr.jpg",
            },
        },
    },
    google: {
        name: "Google",
        logo: "/client/bec-logo-google.png",
        backgroundImage: "/client/bec-background-google.jpg",
        avatarImage: "/client/avatar-google.png",
        config: {
            en: {
                chatType: "BRAND_EXPERT_CHAT",
                salesforceButtonId: "",
                preChatBackgroundImage: "/client/bec-banner-text-google-en.jpg",
            },
            fr: {
                chatType: "BRAND_EXPERT_CHAT",
                salesforceButtonId: "",
                preChatBackgroundImage: "/client/bec-banner-text-google-fr.jpg",
            },
        },
    },
};

type GetConfigForBrandAndLang = (
    brandId: BrandId,
    salesforceButtonIdEn: string,
    salesforceButtonIdFr: string,
) => Partial<BrandAssetMap>;

const getConfigForBrandAndLang: GetConfigForBrandAndLang = (brandId, salesforceButtonIdEn, salesforceButtonIdFr) => ({
    [brandId]: {
        ...commonConfig[brandId],
        config: {
            ...commonConfig[brandId].config,
            en: {
                ...commonConfig[brandId].config.en,
                salesforceButtonId: salesforceButtonIdEn,
            },
            fr: {
                ...commonConfig[brandId].config.fr,
                salesforceButtonId: salesforceButtonIdFr,
            },
        },
    },
});

export const brandAssets: BrandAssets = {
    development: {
        ...commonConfig,
        ...getConfigForBrandAndLang("blueShirt", "5730t0000004FNq", "5730t0000004FNv"),
        ...getConfigForBrandAndLang("google", "5730t0000004JHV", "5730t0000004JHa"),
    },
    qa: {
        ...commonConfig,
        ...getConfigForBrandAndLang("blueShirt", "5730x0000008OXA", "5730x0000008OXF"),
        ...getConfigForBrandAndLang("google", "5730x0000008Oph", "5730x0000008Opm"),
    },
    training: {
        ...commonConfig,
        ...getConfigForBrandAndLang("blueShirt", "5730H000000B2k3", "5730H000000B2k8"),
        ...getConfigForBrandAndLang("google", "5734C000000GniO", "5734C000000GniT"),
    },
    production: {
        ...commonConfig,
        ...getConfigForBrandAndLang("blueShirt", "5730H000000B2k3", "5730H000000B2k8"),
        ...getConfigForBrandAndLang("google", "5733o000001Q7AI", "5733o000001Q7AN"),
    },
};

export const getSalesforceEnvForWebappEnv = (webappEnv: string): SalesforceEnv => {
    switch (webappEnv) {
        case "integration":
            return "qa";
        case "staging":
            return "training";
        case "production":
            return "production";
        default:
            return "development";
    }
};
