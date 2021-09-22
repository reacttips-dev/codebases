import {
    IAutocompleteAppCategory,
    AppCategoryStore,
} from "components/AutocompleteAppategories/AutocompleteAppCategoriesTypes";

export const findAppCategory = (
    categories: IAutocompleteAppCategory[],
    categoryId: string,
    storeId: AppCategoryStore,
): IAutocompleteAppCategory => {
    if (!categoryId || !storeId) {
        return null;
    }

    return categories?.find((cat) => {
        return cat.id === categoryId && cat.store === storeId;
    });
};

export const getAppCategoryDisplayDetails = (category?: IAutocompleteAppCategory) => {
    if (!category) {
        return {
            text: "Invalid App Category",
            secondaryText: "N/A",
            icon: "no-data",
        };
    }

    return {
        text: category.text,
        secondaryText: category.store === "Apple" ? "App Store Category" : "Google Store Category",
        icon: category.store === "Apple" ? "i-tunes" : "google-play",
    };
};
