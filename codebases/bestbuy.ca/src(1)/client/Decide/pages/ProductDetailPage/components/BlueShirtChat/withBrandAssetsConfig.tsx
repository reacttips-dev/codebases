import * as React from "react";
import {
    brandAssets as brandAssetsConfigMap,
    BrandId,
    getSalesforceEnvForWebappEnv,
    SalesforceEnv,
    ChatType,
} from "./brands";

export interface BrandChatConfig {
    chatType: ChatType;
    brandId: BrandId;
    sfButtonId: string;
    preChatBackgroundImage: string;
    avatarImage: string;
    brandName: string;
    logo: string;
    backgroundImage: string;
}

interface WithBrandAssetsConfigMap {
    brandId: BrandId;
    appEnv: string;
    language: Language;
}

export interface ForwardedBrandChatConfigProps {
    chatConfig?: BrandChatConfig;
}
export const withBrandAssetsConfig = (
    Component: React.ComponentType<ForwardedBrandChatConfigProps>,
): React.FunctionComponent<WithBrandAssetsConfigMap> => ({brandId, appEnv = "development", language, ...rest}) => {
    const [brandChatConfig, setBrandChatConfig] = React.useState<BrandChatConfig>();

    React.useEffect(() => {
        const sfEnv: SalesforceEnv = getSalesforceEnvForWebappEnv(appEnv);
        const brandAssetConfigMap = brandAssetsConfigMap[sfEnv];
        const assets =
            brandAssetConfigMap && (brandAssetConfigMap[brandId?.toLowerCase()] || brandAssetConfigMap.blueShirt);

        const config: BrandChatConfig = {
            chatType: assets.config[language].chatType,
            brandId: brandId || assets.name,
            sfButtonId: assets.config[language].salesforceButtonId,
            preChatBackgroundImage: assets.config[language].preChatBackgroundImage,
            avatarImage: assets.avatarImage,
            brandName: assets.name,
            logo: assets.logo,
            backgroundImage: assets.backgroundImage,
        };

        setBrandChatConfig(config);
    }, [brandId, appEnv, language]);

    const props = {...rest, chatConfig: brandChatConfig};
    return <Component {...props} />;
};
