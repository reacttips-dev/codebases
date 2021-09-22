import { ICategory } from "common/services/categoryService.types";
import { i18nFilter } from "filters/ngFilters";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";
import { ICategoriesQueryBarData, ICustomCategory } from "./IndustryAnalysisQueryBarTypes";

const _findCategory = (
    id: string,
    categories: ICategory[] | ICustomCategory[],
): ICategory | ICustomCategory => {
    for (const category of categories) {
        if (
            category.id === id ||
            category.categoryId === id ||
            category.categoryId === id.substr(1)
        ) {
            return category;
        }

        if (category.children) {
            const selectedSubcategory = _findCategory(id, category.children);
            if (selectedSubcategory) return selectedSubcategory;
        }
    }

    return null;
};

export const findSelectedCategory = (
    selectedId: string,
    categories: ICategory[],
    customCategories: ICustomCategory[],
): ICategory | ICustomCategory => {
    const selectedCustomCategory = _findCategory(selectedId, customCategories);
    if (selectedCustomCategory) return selectedCustomCategory;

    const selectedCategory = _findCategory(selectedId, categories);
    return selectedCategory;
};

export const getCategoriesData = (selectedCategoryId, categoryService): ICategoriesQueryBarData => {
    return {
        categories: categoryService.getCategories(),
        customCategories: UserCustomCategoryService.getCustomCategories().map((customCategory) => {
            return {
                ...customCategory,
                editable: true,
                deletable: true,
            };
        }),
        categoriesTitle: categoryService.getCategoriesTitle(),
        customCategoriesTitle: i18nFilter()("customcategories.dropdown.title"),
        selectedCategoryId: decodeURIComponent(selectedCategoryId),
    };
};

export const getCategoryDisplayDetails = (category?: ICategory) => {
    if (!category) {
        return {
            text: "Invalid Industry",
            secondaryText: "N/A",
            icon: "no-data",
        };
    }

    return {
        text: category.text,
        secondaryText: category.isCustomCategory ? "Custom Industry" : "Industry",
        icon: category.isCustomCategory ? "category" : "market",
    };
};
