import { Category } from "../../models";
import { CategoryProvider } from "./";
import categoryCache from "./CategoryCache";

export class CachedCategoryProvider implements CategoryProvider {

    constructor(private categoryProvider: CategoryProvider, private locale: Locale) {
    }

    public async getCategory(id: string): Promise<Category> {

        const key = `${id}-${this.locale}`;
        let category: Category = categoryCache.get(key);

        if ( category ) {
            return Promise.resolve(category);
        }

        category = await this.categoryProvider.getCategory(id);
        categoryCache.set(key, category);
        return Promise.resolve(category);
    }
}
