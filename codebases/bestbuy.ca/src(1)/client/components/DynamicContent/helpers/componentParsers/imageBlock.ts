import {SectionImage, LinkEventType, DisplayTypes} from "models";
import {isObject, guardType} from "utils/typeGuards";
import {IBrowser as ScreenSize} from "redux-responsive";
import {ImageBlockProps, ImageBlockDisplayType} from "components/ImageBlock";
import {sectionImageParser, linkEventParser} from "./";

export interface ImageBlockSchema {
    image: SectionImage;
    alternateText?: string;
    metaData: {
        display: ImageBlockDisplayType;
    };
    event: LinkEventType;
}

interface BuildProps {
    screenSize: ScreenSize;
}

const getImageDisplayType = (displayType?: string): ImageBlockDisplayType => {
    switch (displayType) {
        case DisplayTypes.browserSize:
            return ImageBlockDisplayType.browserSize;
        case DisplayTypes.siteSize:
            return ImageBlockDisplayType.siteSize;
        default:
            return ImageBlockDisplayType.trueSize;
    }
};

export const imageBlockParser = (data: Partial<ImageBlockSchema>, screenSize: BuildProps): ImageBlockProps | null => {
    if (!isObject(data) || !data?.image) {
        return null;
    }
    return {
        image: data.image && sectionImageParser(data.image, screenSize),
        altText: guardType(data?.alternateText, "string"),
        event: linkEventParser(data?.event),
        displayType: getImageDisplayType(data.metaData?.display),
    };
};
