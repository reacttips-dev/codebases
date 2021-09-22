export enum ECategoryType {
    GENERAL_LIST = "General",
    PARTNERS_LIST = "PartnersList",
}

export interface ICategory {
    id: CategoryId;
    text: string;
    icon: string;
    cssClass: string;
    inactive: boolean;
    isCustomCategory: boolean;
    isOldCategory?: boolean;
    Sons?: any;
    children?: any;
    name?: string;
    sons?: any;
    domains?: string[];
    categoryHash?: string;
    categoryId: string;
    uniqueId?: string;
    categoryType?: ECategoryType;
    forApi: string;
    forUrl: string;
    forDisplayApi: string;
}

export type CategorySearchKey = keyof ICategory;

/**
 * Same as ICategory, but assuming that all categories have been flatened,
 * therefore each category has no nested children, but will specify these details
 * with "isChild" and "parentItem" properties.
 */
export interface IFlattenedCategory extends ICategory {
    isChild: boolean;
    parentItem?: IFlattenedCategory;
}

export type CategoryId = string;
