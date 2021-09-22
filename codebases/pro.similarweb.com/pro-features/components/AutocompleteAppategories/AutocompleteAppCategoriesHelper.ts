import { fetchKeywordsCategories } from "pages/research-homepage/pageResources";
import {
    IAutocompleteAppCategory,
    AppCategoryStore,
    AppCategoryDevice,
} from "components/AutocompleteAppategories/AutocompleteAppCategoriesTypes";
import { IAppCategory } from "components/AutocompleteAppategories/AutocompleteAppCategoriesTypes";

const _adaptCategoryData = (
    category: IAppCategory,
    store: AppCategoryStore,
    device: AppCategoryDevice,
): IAutocompleteAppCategory => {
    return {
        ...category,
        store: store,
        device: device,
    };
};

const _adaptCategoriesData = (
    categories: IAppCategory[],
    store: AppCategoryStore,
    device: AppCategoryDevice,
): IAutocompleteAppCategory[] => {
    return categories.reduce((res, cat) => {
        const categoryToAdd = _adaptCategoryData(cat, store, device);
        const childrenToAdd =
            cat.children?.map((child) => _adaptCategoryData(child, store, device)) ?? [];

        return [...res, categoryToAdd, ...childrenToAdd];
    }, []);
};

/**
 * Resolves which apple categories should be provided to the autocomplete. in case no device was provided, or in case
 * the current device is an android device, then we should provide the iPhone categories.
 */
const _resolveAppleCategoriesByDevice = (categories, deviceId?: AppCategoryDevice) => {
    switch (deviceId) {
        case "iPad":
            return [...categories.Apple.iPad.Categories];

        case "iPhone":
        case "AndroidPhone":
        default:
            return [...categories.Apple.iPhone.Categories];
    }
};

export const fetchAppCategoriesData = async (selectedDeviceId?: AppCategoryDevice) => {
    const { payload: categories } = await fetchKeywordsCategories();

    if (categories) {
        const googleCategories = _adaptCategoriesData(
            categories.Google.AndroidPhone.Categories,
            "Google",
            "AndroidPhone",
        );

        const appleCategories = _adaptCategoriesData(
            _resolveAppleCategoriesByDevice(categories, selectedDeviceId),
            "Apple",
            "iPhone",
        );

        return [...googleCategories, ...appleCategories];
    }
};
