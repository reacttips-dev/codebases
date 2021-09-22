import {SectionImage, LinkEventType, OfferItem, CustomContentType, SectionItemTypes} from "models";
import {IBrowser as ScreenSize} from "redux-responsive";
import {isObject, guardType} from "utils/typeGuards";
import {linkEventParser, sectionImageParser} from "components/DynamicContent/helpers/componentParsers/";

export interface OfferItemSchema {
    offerTitle: string;
    text: string;
    ctaText: string;
    event: LinkEventType;
    image: SectionImage;
    alternateText: string;
    hasCustomImage: boolean;
    type?: SectionItemTypes;
    customContentType?: CustomContentType;
}

interface BuildProps {
    screenSize: ScreenSize;
}

export const parseOfferItem = (data: Partial<OfferItemSchema>, buildProps: BuildProps): OfferItem | null => {
    if (!isObject(data)) {
        return null;
    }
    const imageData =
        data.image &&
        sectionImageParser(
            {
                ...data.image,
                ...(data.image && {alternateText: guardType(data.alternateText, "string")}),
            },
            buildProps,
        );

    const linkEvent = data.event && linkEventParser({...data.event, ctaText: data.ctaText});

    return {
        offerTitle: guardType(data.offerTitle, "string") || "",
        ...(linkEvent && {event: linkEvent}),
        ...(imageData && {image: imageData}),
        hasCustomImage: !!data.hasCustomImage,
        ...(data.type && {type: data.type}),
        ...(data.customContentType && {customContentType: data.customContentType}),
        text: guardType(data.text, "string") || "",
    };
};
