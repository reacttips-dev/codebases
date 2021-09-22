export enum CategorySelectionState {
    EMPTY = 0,
    PARTIAL = 1,
    FULL = 2,
}

interface ICategory {
    id: string;
    sons?: ICategory[];
    selected?: CategorySelectionState;
    isCustomCategory?: boolean;
}

const resolveParentSelectionState = (parentCategory: ICategory): CategorySelectionState => {
    if (parentCategory.sons.length === 0) {
        return parentCategory.selected ?? CategorySelectionState.EMPTY;
    }

    const selectedChildren = parentCategory.sons.filter(
        ({ selected }) => selected === CategorySelectionState.FULL,
    );

    if (selectedChildren.length === 0) {
        return CategorySelectionState.EMPTY;
    }

    return selectedChildren.length < parentCategory.sons.length
        ? CategorySelectionState.PARTIAL
        : CategorySelectionState.FULL;
};

export class CategoriesListManager {
    private categories: ICategory[];
    private initialSelected: string[];
    private originalCategories: ICategory[];

    constructor(categories: ICategory[], initialSelected: string[]) {
        this.initialSelected = initialSelected;
        this.originalCategories = categories;
        this.init(categories);
    }

    private init = (parentCategories: ICategory[]) => {
        this.categories = parentCategories.map(this.initParentCategoriesSelection);
    };

    private initParentCategoriesSelection = (parentCategory: ICategory) => {
        const isParentSelected = this.initialSelected.includes(parentCategory.id);

        const categoryChildren =
            parentCategory.sons?.map((childCategory) => {
                // Resolve the child selection state. a child is considered selected in case
                // it appears on the initial selection list, or if its parent category is selected
                // (when a parent category is selected - all of its children should appear as selected)
                const isSelected =
                    isParentSelected || this.initialSelected.includes(childCategory.id);

                return {
                    ...childCategory,
                    selected: isSelected
                        ? CategorySelectionState.FULL
                        : CategorySelectionState.EMPTY,
                };
            }) ?? [];

        return {
            ...parentCategory,
            sons: categoryChildren,
            // In case the parent was selected, we know that all of its children were selected
            // otherwise - we need to check how many children were selected to determine the selection state
            // (Partial / Empty / Full)
            selected: isParentSelected
                ? CategorySelectionState.FULL
                : resolveParentSelectionState(parentCategory),
        };
    };

    public reset = () => {
        this.init(this.originalCategories);
    };

    public clear = () => {
        this.categories.forEach((parentCat) => {
            parentCat.selected = CategorySelectionState.EMPTY;
            parentCat.sons.forEach((son) => {
                son.selected = CategorySelectionState.EMPTY;
            });
        });
    };

    public findParent = (childId) => {
        return this.categories.find(
            (parent) => typeof parent.sons.find((son) => son.id === childId) !== "undefined",
        );
    };

    public getCategories = () => {
        return this.categories;
    };

    public toggleParentCategory = (parentCategoryId) => {
        const parentCategory = this.categories.find(({ id }) => id === parentCategoryId);
        if (parentCategory) {
            switch (parentCategory.selected) {
                case CategorySelectionState.FULL:
                    parentCategory.selected = CategorySelectionState.EMPTY;
                    parentCategory.sons.forEach((son) => {
                        son.selected = CategorySelectionState.EMPTY;
                    });
                    break;
                case CategorySelectionState.EMPTY:
                case CategorySelectionState.PARTIAL:
                default:
                    parentCategory.sons?.forEach((son) => {
                        son.selected = CategorySelectionState.FULL;
                    });
                    parentCategory.selected = CategorySelectionState.FULL;
                    break;
            }
        }
        return this.categories;
    };

    public toggleSubCategory = (subCategoryId) => {
        const parentCategory = this.findParent(subCategoryId);
        if (parentCategory) {
            const subCategory = parentCategory.sons.find(({ id }) => id === subCategoryId);
            subCategory.selected = subCategory.selected
                ? CategorySelectionState.EMPTY
                : CategorySelectionState.FULL;
            parentCategory.selected = resolveParentSelectionState(parentCategory);
        }
        return this.categories;
    };

    public getSelectedCategories = (onlyFull: boolean = false, igonreParents: boolean = false) => {
        const targetState = onlyFull ? CategorySelectionState.FULL : CategorySelectionState.PARTIAL;
        return this.categories.reduce((result, current) => {
            if ((!igonreParents || current.sons.length === 0) && current.selected >= targetState) {
                result.push(current);
            }
            current.sons.forEach((son) => {
                if (son.selected >= targetState) {
                    result.push(son);
                }
            });
            return result;
        }, []);
    };
}
