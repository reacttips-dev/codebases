import {IBrowser as ScreenSize} from "redux-responsive";
import {MerchSkuListDisplayTypes} from "models";
import {isObject, guardType} from "utils/typeGuards";
import {MerchSkuListProps} from "components/banners/MerchSkuList";
import {linkEventParser} from "components/DynamicContent/helpers/componentParsers/linkEvent";

export interface SkuListSchema {
    displayOptions: {
        displayAs: MerchSkuListDisplayTypes;
    };
}

interface BuildProps {
    screenSize: ScreenSize;
    regionName: string;
    isMobileApp?: boolean;
    language: Language;
    noCrawl?: boolean;
    noConversion?: boolean;
    shouldRenderAnchorLinkOnProductItems?: boolean;
    onProductItemScrollIntoView?: (sku: string) => void;
    disableSeoAttributes?: boolean;
}

export const skuListParser = (data: Partial<SkuListSchema>, buildProps: BuildProps): MerchSkuListProps | null => {
    if (!isObject(data) || !Array.isArray(data.skuList)) {
        return null;
    }

    const displayOptions = data.displayOptions;

    return {
        ...buildProps,
        skuList: data.skuList,
        type: data.type,
        ...(displayOptions && displayOptions.displayAs && {displayAs: displayOptions.displayAs}),
        ...(guardType(data.ctaText, "string") && {ctaText: data.ctaText}),
        ...(guardType(data.title, "string") && {title: data.title}),
        ...(data.bannerType && {bannerType: data.bannerType}),
        ...(guardType(data.imageOnly, "string") && {imageOnly: data.imageOnly}),
        ...(isObject(data.values) && {values: data.values}),
        ...(guardType(data.adLoaded, "boolean") && {adLoaded: data.adLoaded}),
        ...(isObject(data.event) && {event: linkEventParser(data.event)}),
        ...(guardType(data.customContentType, "string") && {customContentType: data.customContentType}),
        ...(isObject(displayOptions) && {displayOptions}),
    };
};
