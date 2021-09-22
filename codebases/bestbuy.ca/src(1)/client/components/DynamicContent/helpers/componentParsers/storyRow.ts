import {StoryRowProps} from "components/banners/Story/components/StoryRow";
import {
    BackgroundWidth,
    LinkEventType,
    Theme,
    SectionImage,
    ResponsiveImageType,
    TextLayout,
    TextPosition,
    videoProps,
} from "models";
import {IBrowser as ScreenSize} from "redux-responsive";
import {isObject, guardType} from "utils/typeGuards";
import {linkEventParser} from "./linkEvent";
import {sectionImageParser} from "./sectionImage";

export interface StoryRowSchema {
    type?: "story-row";
    id?: string;
    primaryCta?: LinkEventType;
    secondaryCta?: LinkEventType;
    foregroundImage?: SectionImage;
    foregroundVideo?: string;
    backgroundImage?: ResponsiveImageType;
    displayOptions?: {
        backgroundColour?: string;
        backgroundWidth?: BackgroundWidth;
        textLayout?: TextLayout;
        textPosition?: TextPosition;
        theme?: Theme;
        foregroundVideo?: videoProps.ageRestricted;
    };
    body?: string;
}

interface BuildProps {
    screenSize: ScreenSize;
}

export const storyRowParser = (data: Partial<StoryRowSchema>, buildProps: BuildProps): StoryRowProps => {
    if (!isObject(data)) {
        return null as any;
    }
    return {
        id: guardType(data.id, "string"),
        background: {
            backgroundImage: data.backgroundImage,
            backgroundColour: data.displayOptions && guardType(data.displayOptions.backgroundColour, "string"),
            backgroundWidth: data.displayOptions && guardType(data.displayOptions.backgroundWidth, "string"),
        },
        body: {
            text: guardType(data.body, "string"),
            foregroundImage: data.foregroundImage && sectionImageParser(data.foregroundImage, buildProps),
            foregroundVideo: data.foregroundVideo
                ? {
                      url: guardType(data.foregroundVideo, "string"),
                      ageRestricted:
                          data.displayOptions && data.displayOptions.foregroundVideo === videoProps.ageRestricted,
                  }
                : undefined,
        },
        displayOptions: data.displayOptions
            ? {
                  theme: guardType(data.displayOptions.theme, "string"),
                  textLayout: guardType(data.displayOptions.textLayout, "string"),
                  textPosition: guardType(data.displayOptions.textPosition, "string"),
              }
            : undefined,
        links: {
            primaryCta: data.primaryCta && linkEventParser(data.primaryCta),
            secondaryCta: data.secondaryCta && linkEventParser(data.secondaryCta),
        },
    };
};
