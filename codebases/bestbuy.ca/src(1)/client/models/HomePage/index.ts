import {Error} from "../../errors";
import {MerchItem, SectionData} from "models";
import {DynamicContentModel} from "models/DynamicContent";

/* Types */

export type ContentTypes = "homepage" | "homepageFallback" | "homepageError";

/* Enums */

export enum SectionTypes {
    primary = "primary",
    secondary = "secondary",
}

/* Interfaces */

export interface HomePageState {
    content: HomePageContent;
    contentType: ContentTypes;
    loading: boolean;
    error: ErrorState;
}

export interface ErrorState {
    error: Error;
    statusCode: number;
}

export interface HomePageContent extends DynamicContentModel {
    primary: MerchItem[];
    sections: SectionData[];
}
