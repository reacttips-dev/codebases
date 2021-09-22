import {TrackBuffer} from "../utils/TrackBuffer";
import {AggregatedTracker} from "./AggregatedTracker";
import {ConsoleTracker} from "./ConsoleTracker";

export type DOMAIN_TYPE = "WITH_SUBDOMAINS" | "WITHOUT_SUBDOMAINS";

export type WEB_SOURCE = "TOTAL" | "MOBILEWEB" | "DESKTOP";

/**
 * Common Interface for Trackers
 */
export interface ITrack {
    /**
     * track an Event
     * @param category event category
     * @param action event action
     * @param name event name
     * @param value a number value
     */
    trackEvent: (category: string, action: string, name: string, value?: number) => void;

    /**
     * track a navigation
     * @param urlParams
     */
    // TODO: (dannyr) change the interface to a generic type
    trackPageView: (urlParams?: ICustomDimensionData) => void;

    /**
     * health check is called when the system starts
     * use this to check that everything has loaded
     */
    healthCheck: () => void;

    /**
     * run any custom action
     * @param action
     * @param args
     */
    runCustomAction: (action: string, ...args) => void;

    /**
     * get the tracking buffer
     */
    getBuffer: () => TrackBuffer;
}

export interface IDimensions {
    [name: string]: number;
}

/**
 * custom dimensions and their IDs
 * @type {{string: number}}
 */
export const CustomDimensions: IDimensions = {
    path: 1,
    lang: 2,
    is_sw_user: 3,
    query: 4,
    entity: 5,
    filters: 6,
    category: 7,
    identity: 8,
    custom_data: 9,
};

export interface ICustomDimensionQuery {
    country?: number;
    store?: string;
    device_os?: string;
    date_range?: string;
    order_by?: string;
    not_permitted?: boolean;
}

interface ICustomDimensionCategoryInfo {
    main_category: string;
    sub_category: string;
}

interface ICustomDimensionCustomCategoryInfo {
    custom_category_id: string | number;
    custom_category_name: string;
}

export type ICustomDimensionCategory = ICustomDimensionCategoryInfo | ICustomDimensionCustomCategoryInfo;

export interface ICustomDimensionEntity {
    entity_name?: string;
    entity_id?: string;
}

export interface ICustomDimensionPath {
    section: string;
    sub_section: string;
    sub_sub_section: string;
    page_id: string;
}

export interface ICustomDimensionIdentity {
    subscription_id: number;
    base_product: string;
    user_id: number;
    account_id: number;
    email: string;
}

export interface ICustomDimensionFilters {
    domain_type?: DOMAIN_TYPE;
    web_source?: WEB_SOURCE;
    tab?: string;
    app_mode?: string;
    page_number?: number;
}

export type ICustomDimensionCustomData = any;

/**
 * Custom Dimensions Data Object
 */
export interface ICustomDimensionData {
    path: ICustomDimensionPath;
    lang: string;
    is_sw_user: boolean;
    query?: ICustomDimensionQuery;
    entity?: ICustomDimensionEntity;
    filters?: ICustomDimensionFilters;
    category?: ICustomDimensionCategory;
    identity?: ICustomDimensionIdentity;
    custom_data?: ICustomDimensionCustomData;
}

export function trackerWithConsole(tracker: ITrack, name: string) {
    return new AggregatedTracker([tracker, new ConsoleTracker(name)]);
}



// WEBPACK FOOTER //
// ./src/trackers/ITrack.ts