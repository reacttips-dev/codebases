import {BackgroundWidth, Theme, ContentPositions, TextTypes, DisplayOptions} from "models";
import {isObject, guardType} from "utils/typeGuards";
import {TextBlockProps} from "components/TextBlock";
import {ContainerComponentProps} from "components/DynamicContent/ContentContainer";
import getBackgroundSizing from "components/DynamicContent/helpers/getBackgroundSizing";

export interface TextBlockSchema {
    body: string;
    displayOptions: DisplayOptions & {
        textType: TextTypes;
        textTheme: Theme;
        textPosition?: ContentPositions;
        backgroundColour?: string;
        backgroundWidth?: BackgroundWidth;
    };
}

export interface TextBlockSectionSchema {
    title: string;
}

export const textBlockParser = (
    data: Partial<TextBlockSchema>,
    sectionData: Partial<TextBlockSectionSchema>,
): (TextBlockProps & ContainerComponentProps) | null => {
    if (!isObject(data)) {
        return null;
    }

    const displayOptions = data.displayOptions;

    return {
        ...(guardType(sectionData.title, "string") && {title: sectionData.title}),
        ...(displayOptions && {
            ...(displayOptions.textType === TextTypes.Legal && {isLegal: true}),
            ...(guardType(displayOptions.textTheme, "string") && {textTheme: displayOptions.textTheme}),
            ...(guardType(displayOptions.backgroundColour, "string") && {
                backgroundColour: displayOptions.backgroundColour,
            }),
            ...(guardType(displayOptions.textPosition, "string") && {textAlignment: displayOptions.textPosition}),
        }),
        displayOptions: {
            ...displayOptions,
            backgroundWidth: getBackgroundSizing(displayOptions && displayOptions.backgroundWidth),
        },
    };
};
