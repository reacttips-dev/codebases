import { Category } from "../../models";
import { CategoryProvider } from "./";
import { ApiCategoryProvider } from "./ApiCategoryProvider";
import { CachedCategoryProvider } from "./CachedCategoryProvider";

export interface CategoryProvider {
    getCategory(id: string): Promise<Category>;
}

export function createCategoryProvider(baseUrl: string, locale: Locale): CategoryProvider {

    const categoryProvider = new ApiCategoryProvider(baseUrl, locale);

    return (typeof (window) === "undefined") ? new CachedCategoryProvider(categoryProvider, locale) : categoryProvider;

}
