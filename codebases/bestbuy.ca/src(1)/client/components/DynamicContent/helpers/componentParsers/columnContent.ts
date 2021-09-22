import {SectionImage, OfferItem, MerchItem, DisplayOptions, SectionItemTypes} from "models";
import {IBrowser as ScreenSize} from "redux-responsive";
import {isObject, isDefined, guardType} from "utils/typeGuards";
import {ColumnContentProps} from "components/banners/ColumnContent";
import {
    parseOfferItem,
    parseMerchItem,
    OfferItemSchema,
    MerchItemSchema,
} from "components/DynamicContent/helpers/componentParsers/";
import {sectionImageParser} from "components/DynamicContent/helpers/componentParsers/";
import getBackgroundSizing from "components/DynamicContent/helpers/getBackgroundSizing";
import {ContainerComponentProps} from "components/DynamicContent/ContentContainer";

export interface ColumnContentSchema {
    mobileDisplay: 1 | 2;
    offerList: Array<OfferItemSchema | MerchItemSchema>;
    backgroundImage: SectionImage;
    displayOptions: DisplayOptions;
}

interface BuildProps {
    screenSize: ScreenSize;
    language: Language;
    isMobileApp: boolean;
}

const buildOfferList = (
    data: Partial<Array<OfferItemSchema | MerchItemSchema>>,
    buildProps: BuildProps,
): Array<OfferItem | MerchItem> | null => {
    if (!Array.isArray(data)) {
        return null;
    }
    return data
        .map((item) => {
            if (item.type === SectionItemTypes.customContent) {
                return parseMerchItem(item, buildProps);
            } else {
                return parseOfferItem(item, buildProps);
            }
        })
        .filter(isDefined);
};

export const columnContentParser = (
    data: Partial<ColumnContentSchema>,
    buildProps: BuildProps,
): (ColumnContentProps & ContainerComponentProps) | null => {
    if (!isObject(data)) {
        return null;
    }

    const {displayOptions = {}, offerList} = data;
    const offerListData = Array.isArray(offerList) && buildOfferList(offerList, buildProps);
    const backgroundImage = data.backgroundImage && sectionImageParser(data.backgroundImage, buildProps);

    return offerListData
        ? {
              content: {
                  mobileDisplay: data.mobileDisplay || 2,
                  offerList: offerListData,
              },
              displayOptions: {
                  ...displayOptions,
                  ...(displayOptions.backgroundWidth && {
                      backgroundWidth: getBackgroundSizing(displayOptions.backgroundWidth),
                  }),
              },
              screenSize: buildProps.screenSize,
              language: buildProps.language,
              isMobileApp: buildProps.isMobileApp,
              ...(backgroundImage && {backgroundImage}),
              ...(guardType(displayOptions.backgroundColour, "string") && {
                  backgroundColour: displayOptions.backgroundColour,
              }),
          }
        : null;
};
