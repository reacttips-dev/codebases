import { IKeywordGroup } from "./KeywordsQueryBarTypes";
import { IKeywordsQueryBarProps } from "components/compare/KeywordsQueryBar/KeywordsQueryBarTypes";
const USER_CATEGORIES = 0;
const SHARED_CATEGORIES = 1;

export const findSelectedKeywordGroup = (
    keywordGroups: IKeywordGroup[],
    selectedGroupId: string,
): IKeywordGroup => {
    if (!selectedGroupId) {
        return null;
    }

    return keywordGroups?.find((group) => group.id === selectedGroupId);
};

export const adaptKeywordsQueryBarProps = (categoriesProps: {
    customCategories: any[];
    selectedCat: string;
    isKeywordMode?: boolean;
    searchTerm?: string;
    isLoading?: boolean;
    keywordGroupId?: string;
}): IKeywordsQueryBarProps => {
    const {
        customCategories,
        selectedCat,
        searchTerm,
        isKeywordMode,
        isLoading = false,
        keywordGroupId,
    } = categoriesProps;

    const userCatrgories: IKeywordGroup[] =
        customCategories?.[USER_CATEGORIES]?.map((cat) => {
            return {
                id: cat.id || cat.Id,
                text: cat.text || cat.Name,
                isShared: false,
                keywords: cat.domains || cat.Keywords,
            };
        }) ?? [];

    const sharedCategories: IKeywordGroup[] =
        customCategories?.[SHARED_CATEGORIES]?.map((cat) => {
            return {
                id: cat.id || cat.Id,
                text: cat.text || cat.Name,
                isShared: true,
                keywords: cat.domains || cat.Keywords,
            };
        }) ?? [];

    return {
        keywordGroups: [...userCatrgories, ...sharedCategories],
        selectedKeywordGroupId: selectedCat || keywordGroupId,
        selectedKeyword: searchTerm || `*${keywordGroupId}`,
        isKeywordMode: isKeywordMode,
        isLoading: isLoading,
    };
};
