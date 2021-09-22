import {isObject, guardType} from "utils/typeGuards";
import {SectionImage, ImageResType, ResponsiveImageType} from "models";
import {IBrowser as ScreenSize} from "redux-responsive";
import {getImageSize} from "utils/imageUtils";

interface BuildProps {
    screenSize: ScreenSize;
}

const buildImageResType = (data: Partial<ImageResType> = {}): ImageResType => ({
    x1: guardType(data.x1, "string"),
    ...(data.x2 && {x2: guardType(data.x2, "string")}),
    ...(data.x3 && {x3: guardType(data.x3, "string")}),
});

export const responsiveImageParser = (
    data: Partial<ResponsiveImageType | undefined>,
): ResponsiveImageType | undefined => {
    if (!isObject(data)) {
        return;
    }
    const {extraSmall, small, medium, large, infinity} = data;

    return {
        ...(extraSmall && {extraSmall: buildImageResType(extraSmall)}),
        ...(small && {small: buildImageResType(small)}),
        ...(medium && {medium: buildImageResType(medium)}),
        ...(large && {large: buildImageResType(large)}),
        ...(infinity && {infinity: buildImageResType(infinity)}),
    } as ResponsiveImageType;
};

export const sectionImageParser = (data: Partial<SectionImage>, buildProps: BuildProps): SectionImage | undefined => {
    if (!isObject(data)) {
        return;
    }
    const {alternateText, extraSmall, small, medium, large, infinity} = data;

    const fallbackImageData = getImageSize(
        {
            extraSmall,
            small,
            medium,
            large,
            infinity,
        },
        buildProps.screenSize,
    );

    const responsiveImage = responsiveImageParser(data);

    return {
        alternateText: alternateText ? guardType(alternateText, "string") : "",
        ...(fallbackImageData && {fallbackImage: fallbackImageData}),
        ...responsiveImage,
    };
};
