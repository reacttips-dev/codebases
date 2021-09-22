import {HeroBannerProps} from "components/banners/HeroBanner";
import {SectionImage, Theme, LinkEventType, ContentPositions} from "models";
import {IBrowser as ScreenSize} from "redux-responsive";
import {isObject, guardType} from "utils/typeGuards";
import {linkEventParser} from "components/DynamicContent/helpers/componentParsers/linkEvent";
import {sectionImageParser} from "components/DynamicContent/helpers/componentParsers/sectionImage";

export interface HeroBannerSchema {
    type: "hero-banner";
    headline?: string;
    body?: string;
    disclaimer?: string;
    primaryCta?: LinkEventType;
    secondaryCta?: LinkEventType;
    foregroundImage?: SectionImage;
    backgroundImage: SectionImage;
    logo?: {
        url: string;
        alternateText: string;
    };
    displayOptions: {
        textPosition?: ContentPositions;
        theme?: Theme;
        foregroundImageAlignment?: ContentPositions;
    };
}

interface BuildProps {
    screenSize: ScreenSize;
}

export const heroBannerParser = (data: Partial<HeroBannerSchema>, buildProps: BuildProps): HeroBannerProps | null => {
    if (!isObject(data)) {
        return null;
    }
    return {
        body: {
            headline: guardType(data.headline, "string"),
            logo: isObject(data.logo)
                ? {
                      url: guardType(data.logo.url, "string"),
                      alternateText: guardType(data.logo.url, "string"),
                  }
                : undefined,
            text: guardType(data.body, "string"),
            disclaimer: guardType(data.disclaimer, "string"),
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
