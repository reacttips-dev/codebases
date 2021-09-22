import { swSettings } from "common/services/swSettings";
import { Injector } from "../../../scripts/common/ioc/Injector";
import { i18nFilter } from "../../filters/ngFilters";
import RegexPatterns from "../../services/RegexPatterns";
import { IKeywordGroup } from "userdata";
import { IKeywordsGroupEditorGroup } from "./KeywordsGroupEditor";
import { isAlphaNumericOrJapaneseText } from "UtilitiesAndConstants/UtilityFunctions/assetsNameValidation";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

export const emptyKeyordGroup: IKeywordGroup = {
    AddedTime: null,
    GroupHash: null,
    Id: null,
    Keywords: [],
    LastUpdated: null,
    Name: null,
    UserId: null,
};

export interface ITitleValidation {
    isValid: boolean;
    errorMessage?: string;
}

export const TITLE_MAX_LENGTH = 26;

export const KeywordGroupEditorHelpers = {
    isAlphaNumericOrJapaneseText,
    validateTitle: (
        newGroupName,
        keywordsGroup: IKeywordsGroupEditorGroup = null,
    ): ITitleValidation => {
        if (!newGroupName || newGroupName.length === 0) {
            return {
                isValid: false,
                errorMessage: i18nFilter()("KeywordAnalysis.keywordgroup.wizard.required"),
            };
        }
        if (newGroupName.length > TITLE_MAX_LENGTH) {
            return {
                isValid: false,
                errorMessage: i18nFilter()("KeywordAnalysis.keywordgroup.wizard.title.max.length"),
            };
        }
        const isFormatValid = RegexPatterns.isUnicodeRegexSupported()
            ? RegexPatterns.unicodeOrWhitespaceOnly(newGroupName)
            : KeywordGroupEditorHelpers.isAlphaNumericOrJapaneseText(newGroupName);
        if (!isFormatValid) {
            return {
                isValid: false,
                errorMessage: "Invalid characters",
            };
        }

        const groupWithThisName = keywordsGroupsService.findGroupByName(newGroupName); // make sure a group with such name doesnt exists
        const { Name, Id } = groupWithThisName;
        const nameExists = {
            isValid: false,
            errorMessage: `'${Name}' is already used`,
        };
        // Better comparison by ID
        if (Id) {
            if (groupWithThisName?.Id !== keywordsGroup?.Id) {
                return nameExists;
            }
        } else {
            // Legacy support
            if (Name && groupWithThisName !== keywordsGroup) {
                return nameExists;
            }
        }

        return {
            isValid: true,
            errorMessage: ``,
        };
    },
    keywordGroupFromList: (target: any = {}, existedGroup = emptyKeyordGroup): IKeywordGroup => {
        const { title = null, items = [] } = target;
        const { GroupHash, Id, AddedTime, LastUpdated, UserId } = existedGroup;
        return {
            Name: title,
            Keywords: items.map(({ text }) => text.toLowerCase()),
            GroupHash,
            Id,
        };
    },
    toEditorGroup: (existedGroup: IKeywordGroup = emptyKeyordGroup): IKeywordsGroupEditorGroup => {
        const { Name, Keywords, Id, GroupHash, LastUpdated } = existedGroup;
        return {
            title: Name,
            items: Keywords.map((text) => ({ text: text.toLowerCase() })),
            Id,
            GroupHash,
            LastUpdated,
        };
    },
    getMaxGroupCount: () => {
        return swSettings.components.KeywordAnalysis.resources.maxGroupCount;
    },
};
