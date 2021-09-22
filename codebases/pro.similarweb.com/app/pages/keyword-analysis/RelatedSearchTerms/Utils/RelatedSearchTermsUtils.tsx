import { IRelatedSearchTerm } from "services/relatedSearchTerms/RelatedSearchTermsServiceTypes";
import { RelatedSearchTermListItem } from "pages/keyword-analysis/RelatedSearchTerms/RelatedSearchTermsModal/RelatedSearchTermsList/RelatedSearchTermsListItem";
import { KeywordGroupEditorHelpers } from "pages/keyword-analysis/KeywordGroupEditorHelpers";
import { IKeywordGroup } from "userdata";
import { SwLog } from "@similarweb/sw-log";

const filterSelectedKeywordFromList = (
    selectedKeyword: string,
    relatedSearchTerms: IRelatedSearchTerm[],
) => {
    return relatedSearchTerms.filter((term) => term.keyword !== selectedKeyword);
};

const getOrCreateSelectedSearchTerm = (
    selectedKeyword: string,
    relatedSearchTerms: IRelatedSearchTerm[],
) => {
    const selectedKeywordOnList = relatedSearchTerms.find(
        (term) => term.keyword === selectedKeyword,
    );

    const hasSelectedKeywordOnList = !!selectedKeywordOnList;
    return hasSelectedKeywordOnList ? selectedKeywordOnList : { keyword: selectedKeyword };
};

export const adaptRelatedSearchTerms = (
    selectedKeyword: string,
    relatedSearchTerms: IRelatedSearchTerm[],
) => {
    const selectedSearchTerm = getOrCreateSelectedSearchTerm(selectedKeyword, relatedSearchTerms);
    const filteredSearchTerms = filterSelectedKeywordFromList(selectedKeyword, relatedSearchTerms);
    return [selectedSearchTerm, ...filteredSearchTerms];
};

export const renderRelatedSearchTermsListItems = (
    selectedKeyword: string,
    relatedSearchTerms: IRelatedSearchTerm[],
    isSavingGroupInProgress: boolean,
    onRemoveClick: (term: IRelatedSearchTerm) => void,
) => {
    return (
        // TODO: explain the math random :(
        relatedSearchTerms?.map((term) => {
            const isSelectedKeyword = selectedKeyword === term.keyword;
            return (
                <RelatedSearchTermListItem
                    key={term.keyword + Math.random()}
                    item={term}
                    isSelectedKeyword={isSelectedKeyword}
                    isSavingGroup={isSavingGroupInProgress}
                    onRemove={() => onRemoveClick(term)}
                />
            );
        }) ?? []
    );
};

export const saveRelatedKeywordsGroup = async (
    groupName: string,
    keywords: string[],
    keywordsGroupsService: any,
): Promise<{ isSuccess: boolean; newGroup?: IKeywordGroup }> => {
    try {
        const groupToCreate = KeywordGroupEditorHelpers.keywordGroupFromList({
            title: groupName,
            items: keywords.map((keyword) => {
                return { text: keyword };
            }),
        });

        const result: IKeywordGroup[] = await keywordsGroupsService.update(groupToCreate);
        const newGroup = result.find((record) => record.Name === groupName);

        return {
            isSuccess: true,
            newGroup: newGroup,
        };
    } catch (e) {
        SwLog.error(e);
        return {
            isSuccess: false,
        };
    }
};
