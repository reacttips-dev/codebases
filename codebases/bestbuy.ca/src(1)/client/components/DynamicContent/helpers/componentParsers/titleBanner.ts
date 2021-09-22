import {TitleBannerProps} from "components/banners/TitleBanner";
import {SectionImage, Theme, LinkEventType} from "models";
import {IBrowser as ScreenSize} from "redux-responsive";
import {isObject, guardType} from "utils/typeGuards";
import {sectionImageParser} from "components/DynamicContent/helpers/componentParsers/sectionImage";
import {linkEventParser} from "components/DynamicContent/helpers/componentParsers/linkEvent";

export interface TitleBannerSchema {
    type: "title-banner";
    backgroundImage?: SectionImage;
    headline?: string;
    subHeadline?: string;
    disclaimer?: string;
    secondaryCta?: LinkEventType;
    displayOptions?: {
        textPosition?: "left" | "right";
        theme?: Theme;
        foregroundImageAlignment?: "left" | "right";
    };
    logo?: SectionImage;
}

interface BuildProps {
    screenSize: ScreenSize;
}

export const titleBannerParser = (
    data: Partial<TitleBannerSchema>,
    buildProps: BuildProps,
): TitleBannerProps | null => {
    if (!isObject(data)) {
        return null;
    }
    return {
        body: {
            headline: guardType(data.headline, "string"),
            subHeadline: guardType(data.subHeadline, "string"),
            disclaimer: guardType(data.disclaimer, "string"),
        },
        logo: data.logo && sectionImageParser(data.logo, buildProps),
        cta: data.secondaryCta && linkEventParser(data.secondaryCta),
        displayOptions: isObject(data.displayOptions)
            ? {
                  textPosition: guardType(data.displayOptions.textPosition, "string"),
                  theme: guardType(data.displayOptions.theme, "string"),
                  foregroundImageAlignment: guardType(data.displayOptions.foregroundImageAlignment, "string"),
              }
            : undefined,
    };
};
