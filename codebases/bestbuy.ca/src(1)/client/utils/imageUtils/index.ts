import {objectFlattener} from "../../utils/flatteners";
import {ResponsiveImageType, ImageResType} from "models";
import {IBrowser as ScreenSize} from "redux-responsive";
import {ProductVideo} from "models";
/**
 * getIncorrectlyMappedImageProps.
 *
 * Note: this function will return the incorrect image size and should
 * be replaced with the global getImageProps utility. This needs to be done
 * gradually as it will impact all CMS entries that use this component.
 *
 */
export const getIncorrectlyMappedImageProps = (
    image: Partial<ResponsiveImageType>,
    screenSize: ScreenSize,
): ImageResType | null => {
    if (screenSize.lessThan.small) {
        return image.small || null;
    } else if (screenSize.lessThan.medium) {
        return image.medium || image.small || null;
    }
    return image.large || image.medium || image.small || null;
};
/** ----------------------------------------------------------------- */

export const getImageSize = (images: Partial<ResponsiveImageType>, screenSize: ScreenSize) => {
    if (screenSize && screenSize.lessThan) {
        if (screenSize.lessThan.small) {
            return images.extraSmall;
        } else if (screenSize.lessThan.medium) {
            return images.small;
        } else {
            return images.medium;
        }
    }
    // Return default image size
    return images.small;
};

export const getImageProps = (
    imageData: {
        image: ResponsiveImageType;
        description: string;
        preferHigherResolution?: boolean;
    },
    screenSize: ScreenSize,
    imgSizeGetter: (images: ResponsiveImageType, screenSize: ScreenSize) => ImageResType = getImageSize,
) => {
    const {image, description, preferHigherResolution} = imageData;
    if (!image) {
        return;
    }
    const imageByScreen = imgSizeGetter(image, screenSize);
    return {
        alt: description,
        src:
            imageByScreen &&
            (preferHigherResolution ? imageByScreen.x3 || imageByScreen.x2 || imageByScreen.x1 : imageByScreen.x1),
        srcSet: objectFlattener(imageByScreen)
            .map((res, index) => `${res} ${index + 1}x`)
            .join(", "),
    };
};

type GetProductVideosArgs = Array<Pick<ProductVideo, "id" | "source">>;

export const getProductVideos = (videos: GetProductVideosArgs): ProductVideo[] => {
    if (!Array.isArray(videos)) {
        return [];
    }

    return videos
        .filter((video) => video.id && video.source)
        .map((video) => ({
            id: video.id,
            source: video.source,
            thumbnail: `https://i1.ytimg.com/vi/${video.id}/default.jpg`,
        }));
};
