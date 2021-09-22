import { IKeywordsGroupService } from "services/keywordsGroup/keywordsGroupTypes";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

const isKeywordsGroupNameUsed = (keywordsGroupName) => {
    const { userGroups = [] } = keywordsGroupsService;
    const isKeywordsGroupNameUsed = userGroups.some(({ Name }) => Name === keywordsGroupName);
    return isKeywordsGroupNameUsed;
};

const generateGroupNameFromKeywordInner = (keyword, index) => {
    const keywordsGroupName = `${keyword} (${index})`;
    if (!isKeywordsGroupNameUsed(keywordsGroupName)) {
        return keywordsGroupName;
    }
    return generateGroupNameFromKeywordInner(keyword, index + 1);
};

const generateGroupNameFromKeyword = (keyword) => {
    if (!isKeywordsGroupNameUsed(keyword)) {
        return keyword;
    }
    return generateGroupNameFromKeywordInner(keyword, 1);
};

export const keywordsGroupService: IKeywordsGroupService = { generateGroupNameFromKeyword };
