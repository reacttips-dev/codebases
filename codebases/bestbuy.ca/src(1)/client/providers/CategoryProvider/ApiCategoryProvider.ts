import { map } from "lodash-es";
import * as url from "url";
import { HttpRequestType } from "../../errors";
import { Category, CategoryFilter, SubCategory } from "../../models";
import fetch from "../../utils/fetch";
import { CategoryProvider } from "./";
import en from "./translations/en";
import fr from "./translations/fr";

export class ApiCategoryProvider implements CategoryProvider {

    public messages = en;

    constructor(private baseUrl: string, private locale: Locale) {
        if (this.locale.startsWith("fr")) {
            this.messages = fr;
        }
    }

    public async getCategory(id: string): Promise<Category> {

        const categoryApiJson = await this.getCategoryApiJson(id);
        let altCategoryBreadcrumb = null;

        if (this.locale === "fr-CA") {
            const altCategoryApiJson = await this.getCategoryApiJson(id, "en-CA");
            altCategoryBreadcrumb = this.buildBreadcrumb(altCategoryApiJson);
        }

        const categoryBreadcrumb = this.buildBreadcrumb(categoryApiJson);
        const name = this.getCategoryName(id, categoryApiJson.name);
        const seoDefinition = this.getSeoDefinition(id, name, categoryBreadcrumb);
        let subCategories = this.buildSubCategories(categoryApiJson);

        if (id === "departments") {
            subCategories = subCategories.sort(this.compareCategories);
        }

        const result: Category = {
            altLangSeoText: categoryApiJson.altLangSeoText,
            categoryBreadcrumb,
            altCategoryBreadcrumb,
            id: categoryApiJson.id,
            name: this.getCategoryName(categoryApiJson.id, categoryApiJson.name),
            seoDescription: "",
            seoText: categoryApiJson.seoText,
            seoTitle: seoDefinition,
            subCategories,
        };

        return result;
    }

    private getSeoDefinition = (id: string, name: string, categoryBreadcrumb: CategoryFilter[]) => {

        const selectedCategoryDisplayName = this.getCategoryName(id, name);
        let fallbackSeoTitle = selectedCategoryDisplayName;

        const selectedCategoryHasParent = categoryBreadcrumb.length > 1;
        if (selectedCategoryHasParent) {
            const parentCategory = categoryBreadcrumb[categoryBreadcrumb.length - 2];

            fallbackSeoTitle += ` : ${parentCategory.name}`;
        }

        return fallbackSeoTitle;
    }

    private async getCategoryApiJson(id: string, locale: Locale = this.locale) {
        const categoryUrl = url.parse(url.resolve(this.baseUrl, id));
        categoryUrl.query = {
            lang: locale,
        };

        const formattedUrl = url.format(categoryUrl);
        const categoryApiResponse = await fetch(formattedUrl, HttpRequestType.CategoryApi);
        const categoryApiJson = await categoryApiResponse.json();
        return categoryApiJson;
    }

    private buildBreadcrumb(json: any): CategoryFilter[] {
        const categoryBreadcrumb: CategoryFilter[] = [];

        if (json.parentCategories) {
            let category = json.parentCategories[0];

            while (category && category.id !== "presentationhierarchy1") {
                const node = this.mapCategory(category);
                categoryBreadcrumb.unshift(node);
                category = category.parentCategory;
            }
        }

        const currentNode = this.mapCategory(json);
        categoryBreadcrumb.push(currentNode);

        return categoryBreadcrumb;
    }

    private buildSubCategories(json: any): SubCategory[] {
        let subCategories: SubCategory[];
        if (json.subCategories) {
            subCategories = map(json.subCategories, (cat) => this.mapCategory(cat));
        }
        return subCategories;
    }

    private mapCategory = (category: any): SubCategory => {
        return {
            categoryId: category.id,
            count: category.productCount,
            hasSubcategories: category.hasSubcategories,
            isSelected: false,
            name: this.getCategoryName(category.id, category.name),
            seoText: category.seoText,
        };
    }

    private getCategoryName = (id: string, name: string) => {
        return id === "Departments" ?
            this.messages.allCategoriesFilterName : name;
    }

    private compareCategories = (a, b) => {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    }
}

export default ApiCategoryProvider;
