import {LinkEventType, MerchItem, SectionItemTypes} from "models";
import {isObject, guardType} from "utils/typeGuards";
import {linkEventParser} from "components/DynamicContent/helpers/componentParsers/";

export interface MerchItemSchema {
    bannerType?: string;
    imageOnly?: boolean;
    customContentType?: string;
    values?: {[key: string]: string};
    adLoaded?: boolean;
    event?: LinkEventType;
    type: SectionItemTypes;
}

interface BuildProps {
    language: Language;
}

export const parseMerchItem = (data: Partial<MerchItemSchema>, buildProps: BuildProps): MerchItem | null => {
    if (!isObject(data)) {
        return null;
    }

    const linkEvent = isObject(data.event) && linkEventParser(data.event);

    return {
        ...(guardType(data.bannerType, "string") && {bannerType: data.bannerType}),
        ...(linkEvent && {event: {...linkEvent}}),
        ...(guardType(data.imageOnly, "boolean") !== undefined && {imageOnly: data.imageOnly}),
        ...(guardType(data.customContentType, "string") && {customContentType: data.customContentType}),
        type: guardType(data.type, "string") || "",
        ...(isObject(data.values) && ({values: data.values} as any)),
        ...(guardType(data.adLoaded, "boolean") !== undefined && {adLoaded: data.adLoaded}),
        displayOptions: (isObject(data.displayOptions) && data.displayOptions) || {},
    };
};
