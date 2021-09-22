import { InclusionEnum } from "../../../../common-components/dropdown/InclusionDropdown/InclusionDropdown";
import { AdvancedSearchFilter, AdvancedSearchFilterDeps } from "../../types/filters";

export const enum TechnologiesConditionTypeEnum {
    Category = "category",
    SubCategory = "subCategory",
    Technology = "technology",
}

export type TechnologiesFilterDto = {
    inclusion: InclusionEnum;
    parentCategories: readonly string[];
    categories: readonly string[];
    technologies: readonly string[];
};

export type TechnologiesConditionEntry = {
    readonly name: string;
    readonly type: TechnologiesConditionTypeEnum;
};

export type TechnologiesCondition = Pick<TechnologiesFilterDto, "inclusion"> & {
    readonly id: string;
    entries: TechnologiesConditionEntry[];
};

export type TechnologiesFilterValue = TechnologiesCondition[];

export type WithSecondaryName = {
    readonly secondaryName: string;
};

export type WithTechnologiesCount = {
    readonly technologiesCount: number;
};

export type WithNamesMatchType = {
    readonly nameMatch?: string;
    readonly secondaryNameMatch?: string;
};

export type TechnologiesBaseListItem = TechnologiesConditionEntry;

export type CategoryListItemType = TechnologiesBaseListItem & WithTechnologiesCount;

export type SubCategoryListItemType = CategoryListItemType & WithSecondaryName;

export type TechnologyListItemType = TechnologiesBaseListItem & WithSecondaryName & { id: number };

export type TechnologiesDDItemType = TechnologiesBaseListItem &
    Partial<WithSecondaryName> &
    Partial<WithTechnologiesCount> &
    WithNamesMatchType & { isSelected?: boolean };

export type TechnologiesFilterContextType = {
    categories: readonly CategoryListItemType[];
    subCategories: readonly SubCategoryListItemType[];
    technologies: readonly TechnologyListItemType[];
};

export type TechnologiesFilterDeps = AdvancedSearchFilterDeps<TechnologiesFilterValue> &
    TechnologiesFilterContextType;

export interface CommonTechnologyFilter extends AdvancedSearchFilter<TechnologiesFilterValue> {
    readonly technologies: readonly TechnologyListItemType[];
    readonly categories: readonly CategoryListItemType[];
    readonly subCategories: readonly SubCategoryListItemType[];
}
