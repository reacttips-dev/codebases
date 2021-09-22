import {SectionImage} from "models/DynamicContent";
import {LinkEventProps} from "@bbyca/apex-components";
import {SectionData} from "models";

export type GlobalCMSContextMap = {
    [key in GlobalCMSContexts]?: GlobalCMSContext | SectionData;
};

export interface GlobalCMSContext {
    items?: GlobalCMSContextItem[];
}

export type GlobalCMSContextItem = FlexMessage | PencilBanner | GlobalCustomContent | GlobalCustomContentList | HtmlBlock;

export interface GlobalContentState {
    content: GlobalCMSContextMap;
    isFinished: boolean;
}

export enum GlobalCMSContexts {
    rpuDisabled = "rpu-disabled",
    browseMode = "browse-mode",
    sitewide = "sitewide",
    plp = "plp",
    pdp = "pdp",
    homepage = "homepage",
    everythingElse = "everything-else",
    category = "category",
    search = "search",
    pdpFooter = "pdp-footer",
    brandFooter = "brand-footer",
    searchBottom = "search-bottom",
    categoryBottom = "category-bottom",
    categoryFooter = "category-footer",
    collectionBottom = "collections-bottom",
    collectionFooter = "collections-footer",
    gspFallback = "gsp-fallback",
    gsrpFallback = "gsrp-fallback"
}

export enum ContextItemTypes {
    flexMessage = "flex-message",
    pencilBanner = "pencil-banner",
    customContent = "custom-content",
    customContentList = "custom-content-list",
    htmlBlock = "html-block"
}

export enum FlexMessageDisplayOption {
    alert = "alert",
    info = "info",
    none = "none",
}

export interface FlexMessage {
    type: ContextItemTypes.flexMessage;
    messageTitle?: string;
    messageBody?: string;
    displayOptions: {
        displayAs: FlexMessageDisplayOption;
    };
}

export enum Theme {
    light = "light",
    dark = "dark",
}

export interface PencilBanner {
    type: ContextItemTypes.pencilBanner;
    headline: string;
    subHeadline?: string;
    image?: SectionImage;
    event?: LinkEventProps;
    displayOptions: {
        theme: Theme;
        backgroundColour: string;
    };
}

export interface HtmlBlock {
    type: string;
    htmlBody: string;
}

export enum GlobalCustomContentType {
    criteoSponsoredProducts = "criteo-sponsored-products",
    adSlotGoogle = "ad-slot-google",
}

export enum GlobalCustomContentListType {
    mediumRectangleList = "medium-rectangle-list",
}

export interface GlobalCustomContent {
    type: ContextItemTypes.customContent;
    customContentType: GlobalCustomContentType;
    values?: {[key: string]: string};
}

export interface GlobalCustomContentList {
    type: ContextItemTypes.customContentList;
    customContentListType: GlobalCustomContentListType;
    customContentList: GlobalCustomContent[];
}

export interface GlobalContent {
    contexts: GlobalCMSContextItem;
}
