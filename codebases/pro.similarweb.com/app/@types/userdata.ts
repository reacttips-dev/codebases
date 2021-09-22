import angular from "angular";
import { IAutoCompleteRecentItem } from "autocomplete";

export type Timestamp = string;

export enum AppStore {
    Google = 0,
    Apple = 1,
}

export type AppStoreStr = "google" | "apple";

export type StateObjectType =
    | "website"
    | "app"
    | "virtual"
    | "keyword"
    | "industry"
    | "appCategory"
    | "googlePlayKeyword"
    | "conversionIndustry";

export interface PageId {
    section: string;
    subSection: string;
    subSubSection: string;
    pageId?: string;
}

export interface IStateObject {
    type: StateObjectType;
    mainItem: string;
    comparedItems?: string[];
    domains?: string[];
    resources?: IStateResourceObject;
    appStore?: AppStore;
    origin?: string;
    duration?: string;
    comparedDuration?: string;
    country?: number;
    industry?: string;
    category?: string;
    pageId?: PageId;
    keyword?: string;
    webSource?: string;
    store?: string;
    device?: string;
    mode?: string;
    hideFromRecents?: boolean;
}

export interface IStateResourceObject {
    isCompare?: boolean;
    mainItemFavIcon?: string;
    domainIcons?: string[];
    iconClass?: any;
}

export interface IBaseDataObject {
    id: string;
    data: IStateObject;
}

export interface IFavoriteObject extends IBaseDataObject {
    addedTime: Timestamp;
}

export interface IFavorites {
    freeSlots: number;
    items: IFavoriteObject[];
    virtualItems: IFavoriteObject[];
}

export interface IAlertDataObject {
    change: number;
}

export interface IAlertObject {
    creationDate: string;
    data: IAlertDataObject;
    from: string;
    icon: string;
    id: string;
    isNew: boolean;
    isRead: boolean;
    site: string;
    to: string;
    type: string;
}

export interface IAlerts {
    items: IAlertObject[];
    newCount: number;
    unReadCount: number;
}

export interface IRecentObject extends IBaseDataObject {
    updatedTime: Timestamp;
    isFavorite: boolean;
}

export interface ISearchObject {
    id: string;
    searchTime: Timestamp;
    data: IAutoCompleteRecentItem;
}

export type IRecents = IRecentObject[];
export type IKeywordGroup = {
    AddedTime?: string;
    GroupHash: string;
    Id: string;
    Keywords: string[];
    LastUpdated?: string;
    Name: string;
    UserId?: string;
    sharedWithAccounts?: string[];
    sharedWithUsers?: string[];
};

export type ISearches = angular.resource.IResourceArray<ISearchObject>;

export type UserDataConfig = {
    favorites: IFavorites;
    alerts: IAlerts;
    dashboards: any;
    features: { [feature: string]: boolean };
    keywordGroups: IKeywordGroup[];
    keywordGroupsShared: IKeywordGroup[];
    newsfeedSettings: any;
    feed: any;
};
