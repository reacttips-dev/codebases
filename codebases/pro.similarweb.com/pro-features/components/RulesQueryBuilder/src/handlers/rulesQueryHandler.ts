import { RuleTypes, IRule } from "./../RulesQueryBuilderTypes";
import { keywordsDelimiterRegexPattern } from "services/segments/segmentsProcessor/segmentsKeywordsVariables";
import XRegExp from "xregexp";

const delimiterRegex = XRegExp(keywordsDelimiterRegexPattern);

function isExactMatchPhrase(val: string): boolean {
    const isNotEmptyString = val !== null && val !== undefined && val.length > 0;
    return isNotEmptyString && delimiterRegex.test(val);
}

function updateRule(rules: IRule[], ruleIndex: number, rule: IRule): IRule[] {
    return rules.map((curRule, idx) =>
        idx === ruleIndex
            ? {
                  ...curRule,
                  words: [...rule.words],
                  exact: [...rule.exact],
                  folders: [...rule.folders],
              }
            : curRule,
    );
}

/**
 * Generates a function to add new strings to a rule in given key.
 * @param ruleStringsKey - the strings key to add the strings to
 * @return function (rules, ruleIndex, stringsToAdd) => rules
 */
function generateAddNewStringsToRule(ruleStringsKey: string) {
    return function (rules: IRule[], ruleIndex: number, stringsToAdd: string[]): IRule[] {
        const newStringsToAdd = stringsToAdd.filter(
            (str) => !rules[ruleIndex][ruleStringsKey].includes(str),
        );
        if (newStringsToAdd) {
            return rules.map((rule, idx) =>
                idx === ruleIndex
                    ? {
                          ...rule,
                          [ruleStringsKey]: [...rule[ruleStringsKey], ...newStringsToAdd],
                      }
                    : rule,
            );
        }
    };
}

function generateRemoveStringForRule(ruleStringsKey: string) {
    return function (rules: IRule[], ruleIndex: number, stringsToRemove: string[]): IRule[] {
        const ruleStringsFiltered = rules[ruleIndex][ruleStringsKey].filter(
            (str) => !stringsToRemove.includes(str),
        );
        if (ruleStringsFiltered.length !== rules[ruleIndex][ruleStringsKey].length) {
            return rules.map((rule, idx) =>
                idx === ruleIndex
                    ? {
                          ...rule,
                          [ruleStringsKey]: ruleStringsFiltered,
                      }
                    : rule,
            );
        }
        return rules;
    };
}

/**
 * Adds a new word to the target rule
 * @param rules - the set of current user rules
 * @param ruleIndex - the location of the currently edited rule within the rules list
 * @param wordsToAdd - The words to add to the rule
 */
const setWordsForRule = generateAddNewStringsToRule("words");

/**
 * Adds a new exact-match word to the target rule
 * @param rules - the set of current user rules
 * @param ruleIndex - the location of the currently edited rule within the rules list
 * @param exactToAdd - The exact-match word to add to the rule
 */
const setExactForRule = generateAddNewStringsToRule("exact");

/**
 * Adds a new exact-match word to the target rule
 * @param rules - the set of current user rules
 * @param ruleIndex - the location of the currently edited rule within the rules list
 * @param folders - The folders to add to the rule
 */
const setFoldersForRule = generateAddNewStringsToRule("folders");

/**
 * Adds a new exact-match word to the target rule
 * @param rules - the set of current user rules
 * @param ruleIndex - the location of the currently edited rule within the rules list
 * @param exactURLS - The exactURLS to add to the rule
 */
const setExactURLSForRule = generateAddNewStringsToRule("exactURLS");

/**
 * Removes a word from the target rule
 * @param rules - the set of current user rules
 * @param ruleIndex - the location of the currently edited rule within the rules list
 * @param wordsToAdd - the words to remove from the rule
 */
const removeWordsForRule = generateRemoveStringForRule("words");

/**
 * Removes a word from the target rule
 * @param rules - the set of current user rules
 * @param ruleIndex - the location of the currently edited rule within the rules list
 * @param exactToRemove - the exact words to remove from the rule
 */
const removeExactForRule = generateRemoveStringForRule("exact");

/**
 * Removes a word from the target rule
 * @param rules - the set of current user rules
 * @param ruleIndex - the location of the currently edited rule within the rules list
 * @param foldersToRemove - the folders to remove from the rule
 */
const removeFoldersForRule = generateRemoveStringForRule("folders");

/**
 * Removes a exactURLS from the target rule
 * @param rules - the set of current user rules
 * @param ruleIndex - the location of the currently edited rule within the rules list
 * @param exactURLSToRemove - the exact words to remove from the rule
 */
const removeExactURLSForRule = generateRemoveStringForRule("exactURLS");

function setRuleType(
    rules: IRule[],
    ruleIndex: number,
    selectionProps: { children: any; id: string },
) {
    return rules.map((rule, idx) =>
        idx === ruleIndex
            ? {
                  ...rule,
                  type: resolveRuleType(+selectionProps.id),
              }
            : rule,
    );
}

/**
 * Resolves the rule type according to its type id
 */
function resolveRuleType(idx: number): RuleTypes {
    return idx === 0 ? RuleTypes.include : RuleTypes.exclude;
}

function createNewRule(
    ruleType: RuleTypes = RuleTypes.include,
    ruleWords: string[] = [],
    ruleExact: string[] = [],
    ruleFolders: string[] = [],
    ruleExactURLS: string[] = [],
): IRule {
    return {
        type: ruleType,
        words: ruleWords,
        exact: ruleExact,
        folders: ruleFolders,
        exactURLS: ruleExactURLS,
    };
}

/**
 * Filters out any empty rules (rules with no words selected)
 */
function filterEmptyRules(rules: IRule[]) {
    const nonEmptyRules =
        rules?.filter(
            (rule) =>
                rule.words.length > 0 ||
                rule.exact.length > 0 ||
                rule.folders.length ||
                rule.exactURLS.length,
        ) ?? [];

    return nonEmptyRules;
}

export default {
    setWordsForRule,
    setExactForRule,
    setFoldersForRule,
    setExactURLSForRule,
    removeWordsForRule,
    removeExactForRule,
    removeFoldersForRule,
    removeExactURLSForRule,
    updateRule,
    setRuleType,
    filterEmptyRules,
    createNewRule,
    isExactMatchPhrase,
};
