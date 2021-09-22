import { IUserGroups, keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

export class KeywordsGroupUtilities {
    private static KEYWORDS_GROUP_DEFAULT_ICON = "keyword-group";

    private static KEYWORDS_DEFAULT_ICON = "search-keywords";

    private static KEYWORDS_GROUP_DEFAULT_PREFIX = "*";

    static getGroupNameById = (groupId) => KeywordsGroupUtilities.getGroupById(groupId).Name;

    static getGroupById = (groupId) =>
        KeywordsGroupUtilities.getUserKeyWordsGroup().find(({ Id }) => Id === groupId);

    static getGroupByName = (groupName) =>
        KeywordsGroupUtilities.getUserKeyWordsGroup().find(
            ({ Name }) => Name.toLowerCase() === groupName.toLowerCase(),
        );

    static getUserKeyWordsGroup = (): IUserGroups => {
        return [...keywordsGroupsService.userGroups, ...keywordsGroupsService.getSharedGroups()];
    };

    static getKeywordsGroupDefaultIcon = () => KeywordsGroupUtilities.KEYWORDS_GROUP_DEFAULT_ICON;

    static getKeywordsDefaultIcon = () => KeywordsGroupUtilities.KEYWORDS_DEFAULT_ICON;

    static isKeywordsGroupByName = (termName: string) =>
        termName?.startsWith(KeywordsGroupUtilities.KEYWORDS_GROUP_DEFAULT_PREFIX);
}
