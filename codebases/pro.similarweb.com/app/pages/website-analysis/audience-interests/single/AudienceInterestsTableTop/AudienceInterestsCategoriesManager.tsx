import utils from "../../../../../../scripts/Shared/utils";
import { categoryTextToIconFilter, i18nCategoryFilter } from "../../../../../filters/ngFilters";
import {
    AudienceInterestsCategory,
    AudienceInterestsCategoryItem,
} from "./AudienceInterestsTableTopTypes";
import {
    ApiCustomCategoryData,
    ApiDomainCategoryData,
} from "pages/website-analysis/audience-interests/single/AudienceInterests/AudienceInterestsTypes";

const CUSTOM_CATEGORIES_PARENT_ID = "custom_categories";

const adaptCustomCategoryData = (
    category: ApiCustomCategoryData,
    parentId?: string,
): AudienceInterestsCategoryItem => {
    return {
        text: category.Name,
        count: category.Count,
        name: category.Name,
        id: category.Id,
        isCustomCategory: true,
        icon: "custom-category",
        forApi: `${category.Id}`,
        parentId: parentId,
        isChild: parentId !== undefined,
        sons: [],
    };
};

export const adaptUserCustomCategoryItems = (
    customCategories: ApiCustomCategoryData[],
): AudienceInterestsCategoryItem[] => {
    const customCategoryItems =
        customCategories?.map((category) => {
            return adaptCustomCategoryData(category, CUSTOM_CATEGORIES_PARENT_ID);
        }) ?? [];

    // Wrap all custom category items within a single parent, this way all custom categories are
    // batched together under a section called "My Custom Categories"
    return customCategoryItems.length > 0
        ? [
              {
                  text: "My Custom Categories",
                  // The wrapping parent count is the sum of all children domains
                  count: customCategoryItems.reduce(
                      (totalCount, currentCategory) => (totalCount += currentCategory.count),
                      0,
                  ),
                  name: "My Custom Categories",
                  id: CUSTOM_CATEGORIES_PARENT_ID,
                  isCustomCategory: true,
                  isChild: false,
                  icon: "custom-category",
                  forApi: CUSTOM_CATEGORIES_PARENT_ID,
                  parentId: undefined,
                  sons: customCategoryItems,
              },
          ]
        : [];
};

const adaptDomainCategoryData = (
    { Count, Name, id }: { Count: number; Name: string; id: string },
    parentId: string = null,
): AudienceInterestsCategory => {
    const text = parentId
        ? `${i18nCategoryFilter()(`${parentId}/${Name}`, true)}`
        : i18nCategoryFilter()(Name);

    const forApi = `${parentId ? `${parentId}~` : ``}${id}`;
    const categoryTextToIcon = categoryTextToIconFilter();
    return {
        text,
        count: Count,
        name: text,
        id: forApi,
        isCustomCategory: false,
        isChild: parentId !== null,
        icon: categoryTextToIcon(text),
        forApi,
        parentId,
    };
};

export const adaptDomainCategoryItems = (
    domainCategories: ApiDomainCategoryData[],
): AudienceInterestsCategoryItem[] => {
    const categories = utils.manipulateCategories(domainCategories);
    const items = categories.reduce((result, category) => {
        return [
            ...result,
            {
                ...adaptDomainCategoryData(category),
                sons: (category.Sons || []).map((son) => adaptDomainCategoryData(son, category.id)),
            },
        ];
    }, []);

    return items;
};
