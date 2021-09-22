import {IBrowser as ScreenSize} from "redux-responsive";
import {isObject, isDefined} from "utils/typeGuards";
import {featureBannerParser, FeatureBannerSchema} from "./featureBanner";
import {SlideShowFeatureBannerProps} from "components/banners/SlideShowFeatureBanner";
import {DisplayOptions, CustomContentType} from "models";

interface SlideShowItemSchema extends FeatureBannerSchema {
    customContentType?: CustomContentType;
    values?: {
        format: string;
        id: string;
    };
}
export interface SlideShowFeatureBannerSchema {
    featureBannerList: SlideShowItemSchema[];
    displayOptions: DisplayOptions;
}
interface BuildProps {
    screenSize: ScreenSize;
    language: Language;
    isMobileApp: boolean;
    disableFirstSlideLazyLoad?: boolean;
}

// todo: data should be unknown type but after upgrading to ts 3
export const slideShowFeatureBannerParser = (
    data: Partial<SlideShowFeatureBannerSchema>,
    buildProps: BuildProps,
): SlideShowFeatureBannerProps | null => {
    if (!isObject(data)) {
        return null;
    }

    const slideShowContent =
        data.featureBannerList &&
        data.featureBannerList
            .map(
                (bannerData, index) =>
                    (bannerData && featureBannerParser(bannerData, {
                        screenSize: buildProps.screenSize,
                        disableLazyLoad: buildProps.disableFirstSlideLazyLoad && index === 0,
                    })) || undefined,
            )
            .filter(isDefined);

    return slideShowContent && slideShowContent.length
        ? {
              content: slideShowContent,
              screenSize: buildProps.screenSize,
              isMobileApp: buildProps.isMobileApp,
              language: buildProps.language,
              ...(isObject(data.displayOptions) && {displayOptions: data.displayOptions}),
          }
        : null;
};
