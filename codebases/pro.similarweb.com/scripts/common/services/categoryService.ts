import { Injector } from "common/ioc/Injector";
import {
    CategorySearchKey,
    ICategory,
    IFlattenedCategory,
} from "common/services/categoryService.types";
import { swSettings } from "common/services/swSettings";
import { categoryTextToIconFilter, i18nCategoryFilter, i18nFilter } from "filters/ngFilters";
import * as _ from "lodash";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";
import RegexPatterns from "services/RegexPatterns";

import { OLD_TO_NEW_CATEGORIES_MAP } from "./oldToNewCategoriesMap";

export enum ECategoryNameValidation {
    LEGAL,
    ILLEGAL_EXIST,
    ILLEGAL_CHARS,
    ILLEGAL_LENGTH,
}
export const TITLE_MAX_LENGTH = 26;
export const CATEGORY_PREFIX = "$";
export const SUB_CATEGORY_DELIMITER = "/";

export interface ICategoryService {
    categoryQueryParamToCategoryObject: (category: string) => ICategory;
    getCategory: (categoryKey: string, searchBy?: string) => ICategory;
}

export const createCategoryService = () => {
    const CUSTOM_CATEGORY_DEFAULT_ID = "custom_categories";
    const CUSTOM_CATEGORY_DEFAULT_ICON = "custom-category";
    const CUSTOM_CATEGORY_DEFAULT_ICON_CLASS = "sw-icon-custom-categories";

    function isInactive(id) {
        return swSettings.current.isDemo === true && id !== swSettings.current.demo.category;
    }

    function getCategories() {
        const categoryArray: ICategory[] = _.extend(window.similarweb.config.categories);
        const ALL = "All";
        if (categoryArray) {
            categoryArray.forEach(function (category: ICategory) {
                if (category.id == ALL) {
                    return;
                }
                const requestChild = true;
                const parent = category;

                category.children = [];
                category.id = category.name;
                category.categoryId = category.name;
                category.text = i18nCategoryFilter()(category.name);
                category.icon = "sprite-category " + category.name;
                category.cssClass = "parent-category";
                category.inactive = isInactive(category.id);
                category.forApi = CATEGORY_PREFIX + category.id;
                category.forUrl = category.id;
                category.forDisplayApi = category.name;
                _.forEach(category.sons, function (category) {
                    const id = parent.name + "~" + category.name;
                    parent.children.push({
                        id,
                        categoryId: id,
                        text: i18nCategoryFilter()(
                            parent.name + SUB_CATEGORY_DELIMITER + category.name,
                            requestChild,
                        ),
                        inactive: isInactive(id),
                        getText() {
                            return i18nCategoryFilter()(
                                parent.name + SUB_CATEGORY_DELIMITER + category.name,
                            );
                        },
                        getChildrenText() {
                            return i18nCategoryFilter()(category.name);
                        },
                        isCustomCategory: false,
                        isOldCategory: !!OLD_TO_NEW_CATEGORIES_MAP[id],
                        forApi:
                            CATEGORY_PREFIX + parent.name + SUB_CATEGORY_DELIMITER + category.name,
                        forUrl: id,
                        forDisplayApi: category.name,
                    });
                });
            });
            if (!_.find(categoryArray, { id: ALL })) {
                categoryArray.unshift({
                    id: ALL,
                    categoryId: ALL,
                    forApi: CATEGORY_PREFIX + ALL,
                    forUrl: ALL,
                    forDisplayApi: ALL,
                    children: [],
                    cssClass: "parent-category",
                    text: i18nFilter()("forms.category.all"),
                    inactive: isInactive(ALL),
                    icon: "sw-icon-categories",
                    isCustomCategory: false,
                });
            }
        }

        return categoryArray;
    }

    function getCategoriesTitle() {
        return i18nFilter()("swcategories.dropdown.title");
    }
    function getCategory(categoryKey, searchBy: CategorySearchKey = "id") {
        if (categoryKey) {
            if (categoryKey.indexOf("*") !== -1) {
                return _.find(UserCustomCategoryService.getCustomCategories(), { id: categoryKey });
            } else {
                const flatten = [];
                getCategories().forEach((item) => {
                    flatten.push(item);
                    if (item.children) {
                        item.children.forEach((subItem) => flatten.push(subItem));
                    }
                });

                return _.find(flatten, { [searchBy]: categoryKey });
            }
        }
        return undefined;
    }

    function validateGroupName(name) {
        const userCategories = UserCustomCategoryService.getCustomCategories();
        if (RegexPatterns.testCustomCategoryNameUnicode(name)) {
            return ECategoryNameValidation.ILLEGAL_CHARS;
        }
        if (userCategories.some((category) => category.text === name)) {
            return ECategoryNameValidation.ILLEGAL_EXIST;
        }
        if (name.length > TITLE_MAX_LENGTH) {
            return ECategoryNameValidation.ILLEGAL_LENGTH;
        }

        return ECategoryNameValidation.LEGAL;
    }

    function getNextCategoryName(name) {
        let newName = name;
        let suffix = 1;
        while (this.validateGroupName(newName) === ECategoryNameValidation.ILLEGAL_EXIST) {
            newName = `${name}${suffix++}`;
        }
        return newName;
    }

    function hasCustomCategoriesPermission() {
        return swSettings.components.Home.resources.IsCCAllowed || false;
    }

    function categoryTextToIcon(text) {
        return categoryTextToIconFilter()(text);
    }
    function parseCategoryFromApiToDropDown(
        { id, text, count, children },
        isCustomCategory,
        parentId = null,
    ) {
        return {
            text,
            count,
            name: text,
            id,
            isCustomCategory,
            isChild: parentId ? true : false,
            icon: isCustomCategory ? CUSTOM_CATEGORY_DEFAULT_ICON : this.categoryTextToIcon(text),
            forApi: id,
            parentId,
            sons: children?.map((child) =>
                this.parseCategoryFromApiToDropDown(child, isCustomCategory, id),
            ),
        };
    }
    function parseCategoriesFromApiToDropDown(categoriesObject: {
        categories: any;
        customCategories: any;
    }) {
        const { categories, customCategories } = categoriesObject;
        return {
            categories: categories.map((category) =>
                this.parseCategoryFromApiToDropDown(category, false),
            ),
            customCategories: [
                {
                    text: i18nFilter()("common.categories.my.custom.categories"),
                    count: customCategories.reduce((sum, { count }) => sum + count, 0),
                    name: i18nFilter()("common.categories.my.custom.categories"),
                    id: CUSTOM_CATEGORY_DEFAULT_ID,
                    isCustomCategory: true,
                    isChild: false,
                    icon: CUSTOM_CATEGORY_DEFAULT_ICON,
                    parentId: undefined,
                    sons: customCategories.map((category) =>
                        this.parseCategoryFromApiToDropDown(
                            category,
                            true,
                            CUSTOM_CATEGORY_DEFAULT_ID,
                        ),
                    ),
                },
            ],
        };
    }

    function parseCategoryFromApiToCategoriesFilter(
        { id, text, count, children },
        isCustomCategory,
        parentId = null,
        totalCountArray,
    ) {
        totalCountArray.push(count);
        return {
            text,
            count: children ? children.reduce((sum, child) => sum + child.count, Number()) : count,
            name: text,
            id,
            isCustomCategory,
            isChild: parentId ? true : false,
            icon: isCustomCategory ? CUSTOM_CATEGORY_DEFAULT_ICON : "sprite-category " + text,
            forApi: id,
            parentId,
            sons: children?.map((child) =>
                this.parseCategoryFromApiToDropDown(child, isCustomCategory, id),
            ),
        };
    }

    function categoriesSortByCountDesc({ count: categoryACount }, { count: categoryBCount }) {
        if (categoryACount > categoryBCount) {
            return -1;
        }
        if (categoryACount < categoryBCount) {
            return 1;
        }
        return 0;
    }

    function parseCategoriesFromApiToCategoriesFilter(categoriesObject: {
        categories: any;
        customCategories: any;
    }) {
        const { categories, customCategories } = categoriesObject;
        const totalCountArray = [];
        const categoriesForCategoriesFilter = categories.map((category) =>
            this.parseCategoryFromApiToCategoriesFilter(category, false, null, totalCountArray),
        );
        const categoriesForCategoriesFilterWithoutSons = [];
        categoriesForCategoriesFilter.map((category) => {
            categoriesForCategoriesFilterWithoutSons.push(category);
            category.sons
                ?.sort(this.categoriesSortByCountDesc)
                .map((son) => categoriesForCategoriesFilterWithoutSons.push(son));
            delete category.sons;
        });

        return {
            categories: [
                {
                    id: "All",
                    children: [],
                    cssClass: "parent-category",
                    text: "All Industries ",
                    inactive: false,
                    icon: "sw-icon-categories",
                    isCustomCategory: false,
                    isChild: false,
                    props: {},
                    count: totalCountArray.reduce((sum, current) => sum + current, Number()),
                },
                ...categoriesForCategoriesFilterWithoutSons,
            ],
            customCategories: customCategories.map((category) => ({
                ...category,
                icon: CUSTOM_CATEGORY_DEFAULT_ICON_CLASS,
                isCustomCategory: true,
                forApi: category.id,
            })),
        };
    }

    function getFlattenedCategoriesList(): IFlattenedCategory[] {
        return [
            ...UserCustomCategoryService.getCustomCategories().map((item: ICategory) => ({
                ...item,
                isChild: false,
            })),
            ...this.getCategories().reduce((items: IFlattenedCategory[], item: ICategory) => {
                const { children = [] } = item;
                return [
                    ...items,
                    { ...item, isChild: false },
                    ...children.map((child) => ({
                        ...child,
                        isChild: true,
                        parentItem: item,
                    })),
                ];
            }, []),
        ];
    }

    function editCategory(category: ICategory, categoryModalProps?) {
        const $rootScope = Injector.get<any>("$rootScope");
        const $modal = Injector.get<any>("$modal");

        const scope = $rootScope.$new();
        scope.customCategoryName = category.text;
        scope.isCategoryTypeDisabled = categoryModalProps?.isCategoryTypeDisabled;
        scope.categoryType = categoryModalProps?.categoryType;
        $modal.open({
            controller: "customCategoriesWizardCtrl as ctrl",
            templateUrl: "/app/components/customCategoriesWizard/custom-categories-wizard.html",
            windowClass: "swWizard customCategoriesWizardWindow",
            scope,
        });
    }

    function categoryQueryParamToCategoryObject(categoryQueryParam: string): ICategory {
        return UserCustomCategoryService.isCustomCategory(categoryQueryParam)
            ? UserCustomCategoryService.getCustomCategoryById(categoryQueryParam.substr(1))
            : this.getCategory(categoryQueryParam);
    }

    return {
        getCategories,
        getCategoriesTitle,
        getCategory,
        validateGroupName,
        getFlattenedCategoriesList,
        hasCustomCategoriesPermission,
        getNextCategoryName,
        categoriesSortByCountDesc,
        parseCategoryFromApiToCategoriesFilter,
        parseCategoriesFromApiToDropDown,
        parseCategoryFromApiToDropDown,
        categoryTextToIcon,
        parseCategoriesFromApiToCategoriesFilter,
        editCategory,
        categoryQueryParamToCategoryObject,
    };
};

export default createCategoryService();
