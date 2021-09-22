import {ProdListingBannerDisplayOptions, ProdListingBannerProps} from "components/ProdListingBanner";
import {isObject} from "lodash-es";
import {LinkEventType, SectionImage, SectionItemTypes} from "models";
import {IBrowser as ScreenSize} from "redux-responsive";
import {guardType} from "utils/typeGuards";
import {linkEventParser} from "./linkEvent";
import {sectionImageParser} from "./sectionImage";

export interface ProdListingBannerSchema {
    type: SectionItemTypes.prodListingBanner;
    title: string;
    body?: string;
    headline?: string;
    backgroundImage?: SectionImage;
    foregroundImage?: SectionImage;
    logo?: {
        url: string;
        alternateText: string;
    };
    event?: LinkEventType;
    displayOptions: ProdListingBannerDisplayOptions;
}

interface BuildProps {
    screenSize: ScreenSize;
}

export const prodListingBannerParser = (
    data: Partial<ProdListingBannerSchema>,
    buildProps: BuildProps,
): ProdListingBannerProps | null => {
    if (!isObject(data)) {
        return null;
    }

    return {
        body: {
            headline: guardType(data.headline, "string"),
            logo: isObject(data.logo)
                ? {
                      url: guardType(data.logo.url, "string"),
                      alternateText: guardType(data.logo.alternateText, "string"),
                  }
                : undefined,
            text: guardType(data.body, "string"),
        },
        foregroundImage: data?.foregroundImage && sectionImageParser(data.foregroundImage, buildProps),
        backgroundImage: data?.backgroundImage && sectionImageParser(data.backgroundImage, buildProps),
        cta: data.event && linkEventParser(data.event),
        displayOptions: isObject(data.displayOptions)
            ? {
                  theme: guardType(data.displayOptions.theme, "string"),
                  backgroundColour: guardType(data.displayOptions.backgroundColour, "string"),
              }
            : undefined,
    };
};
