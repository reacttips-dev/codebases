import {StoryProps} from "components/banners/Story";
import {IBrowser as ScreenSize} from "redux-responsive";
import {storyRowParser, StoryRowSchema} from "./storyRow";
import {BackgroundWidth, Theme} from "models";
import {isObject, guardType} from "utils/typeGuards";

export interface StoryBannerSchema {
    type: "story";
    title: string;
    displayOptions: {
        theme?: Theme;
        backgroundColour?: string;
        backgroundWidth?: BackgroundWidth;
    };
    storyRowList: StoryRowSchema[];
}

interface BuildProps {
    screenSize: ScreenSize;
}

export const storyBannerParser = (data: Partial<StoryBannerSchema>, buildProps: BuildProps): StoryProps | null => {
    if (!isObject(data)) {
        return null;
    }
    const storyRows = data.storyRowList && Array.isArray(data.storyRowList) ? data.storyRowList : [];

    return {
        title: guardType(data.title, "string"),
        displayOptions: isObject(data.displayOptions)
            ? {
                  theme: guardType(data.displayOptions.theme, "string"),
                  backgroundColour: guardType(data.displayOptions.backgroundColour, "string"),
                  backgroundWidth: guardType(data.displayOptions.backgroundWidth, "string"),
              }
            : undefined,
        storyRowList: storyRows.map((row) => storyRowParser(row, buildProps)),
    };
};
