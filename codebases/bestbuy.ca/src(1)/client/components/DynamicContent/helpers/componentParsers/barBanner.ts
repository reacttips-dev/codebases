import {BarBannerProps} from "components/banners/BarBanner";
import {SectionImage, LinkEventType, Theme} from "models";
import {IBrowser as ScreenSize} from "redux-responsive";
import {isObject, guardType} from "utils/typeGuards";
import {sectionImageParser} from "components/DynamicContent/helpers/componentParsers/sectionImage";
import {linkEventParser} from "components/DynamicContent/helpers/componentParsers/linkEvent";

export interface BarBannerSchema {
    type: "bar-banner";
    headline?: string;
    subHeadline?: string;
    disclaimer?: string;
    logo?: SectionImage;
    foregroundImage?: SectionImage;
    primaryCta?: LinkEventType;
    secondaryCta?: LinkEventType;
    displayOptions: {
        textPosition?: "left" | "right";
        theme?: Theme;
        foregroundImageAlignment?: "left" | "right";
    };
    backgroundImage: SectionImage;
}

interface BuildProps {
    screenSize: ScreenSize;
}

export const barBannerParser = (data: Partial<BarBannerSchema>, buildProps: BuildProps): BarBannerProps | null => {
    if (!isObject(data)) {
        return null;
    }

    return {
        body: {
            headline: guardType(data.headline, "string"),
            subHeadline: guardType(data.subHeadline, "string"),
            disclaimer: guardType(data.disclaimer, "string"),
            logo: data.logo && sectionImageParser(data.logo, buildProps),
        },
        foregroundImage: data.foregroundImage && sectionImageParser(data.foregroundImage, buildProps),
        links: {
            primaryCta: data.primaryCta && linkEventParser(data.primaryCta),
            secondaryCta: data.secondaryCta && linkEventParser(data.secondaryCta),
        },
        displayOptions: isObject(data.displayOptions)
            ? {
                  textPosition: guardType(data.displayOptions.textPosition, "string"),
                  theme: guardType(data.displayOptions.theme, "string"),
                  foregroundImageAlignment: guardType(data.displayOptions.foregroundImageAlignment, "string"),
              }
            : undefined,
    };
};
