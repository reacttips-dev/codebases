import {FeatureBannerProps} from "components/banners/FeatureBanner";
import {SectionImage, Theme, LinkEventType, ContentPositions} from "models";
import {IBrowser as ScreenSize} from "redux-responsive";
import {isObject, guardType} from "utils/typeGuards";
import {linkEventParser} from "components/DynamicContent/helpers/componentParsers/linkEvent";
import {sectionImageParser} from "components/DynamicContent/helpers/componentParsers/sectionImage";

export interface FeatureBannerSchema {
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
    disableLazyLoad?: boolean;
}

interface BuildProps {
    screenSize: ScreenSize;
    disableLazyLoad?: boolean;
}

export const featureBannerParser = <T extends Partial<FeatureBannerSchema>>(
    data: T,
    buildProps: BuildProps,
): FeatureBannerProps | null => {
    if (!isObject(data)) {
        return null;
    }

    const {countdown} = data;
    const countdownData = isObject(countdown) &&
        isObject(countdown.displayOptions) &&
        countdown.displayOptions.displayTimer && {
            countdownTime: guardType(countdown.offsetTime, "number") && (countdown.offsetTime as number) * 1000,
            label: guardType(countdown.onsetText, "string"),
            textColour: isObject(countdown.displayOptions) && guardType(countdown.displayOptions.textColour, "string"),
        };

    return {
        backgroundImage: data.backgroundImage,
        body: {
            headline: guardType(data.headline, "string"),
            logo: isObject(data.logo)
                ? {
                      url: guardType(data.logo.url, "string"),
                      alternateText: guardType(data.logo.alternateText, "string"),
                  }
                : undefined,
            text: guardType(data.body, "string"),
            disclaimer: guardType(data.disclaimer, "string"),
        },
        countdown: (countdownData && {...countdownData}) || undefined,
        foregroundImage: data.foregroundImage && sectionImageParser(data.foregroundImage, buildProps),
        links: {
            primaryCta: data.primaryCta && linkEventParser(data.primaryCta),
            secondaryCta: data.secondaryCta && linkEventParser(data.secondaryCta),
        },
        displayOptions: isObject(data.displayOptions)
            ? {
                  ...data.displayOptions,
                  textPosition: guardType(data.displayOptions.textPosition, "string"),
                  theme: guardType(data.displayOptions.theme, "string"),
                  foregroundImageAlignment: guardType(data.displayOptions.foregroundImageAlignment, "string"),
              }
            : undefined,
        disableLazyLoad: buildProps.disableLazyLoad,
    };
};
