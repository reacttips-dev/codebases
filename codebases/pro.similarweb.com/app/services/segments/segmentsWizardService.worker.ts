import difference from "lodash/difference";
import differenceWith from "lodash/differenceWith";
import cloneDeep from "lodash/cloneDeep";
import XRegExp from "xregexp";
import {
    IUrlShareSegments,
    ISegmentRuleItem,
    IWordsFilterConfig,
} from "services/segments/segmentsWizardServiceTypes";
import SegmentsWordsFilter from "services/segments/segmentsFilter/segmentsWordsFilter";
import {
    extractFoldersFromUrls,
    extractWordsFromUrls,
    sortPredictionsByShare,
} from "./segmentsProcessor/segmentsKeywordProcessor";
import {
    escapeRegexString,
    keywordsDelimiterRegexPattern,
} from "./segmentsProcessor/segmentsKeywordsVariables";
import WorkerProcessor from "./workerProcessor";

const delimitersRegex = XRegExp(`(?:${keywordsDelimiterRegexPattern})+`, "ui");
const MAX_URL_FOLDERS_DEPTH = 4;

/*** Worker Cache Data ***/
// worker cache data (for loading segments popular pages):
let allSegmentUrls: IUrlShareSegments[] = undefined;

// worker cache data (for last filtered by rules):
let filteredSegmentsRules = undefined;
let filteredSegmentUrls = undefined;
/*** End of worker cache data ***/

function resetSegmentsCache() {
    allSegmentUrls = undefined;
    filteredSegmentsRules = undefined;
    filteredSegmentUrls = undefined;
}

/**
 * Searches for segments (popular pages) according to rules
 * */
function searchSegments(rules: ISegmentRuleItem[]): IUrlShareSegments[] {
    let checkData = allSegmentUrls;
    let checkRules = rules;

    // if having cached filtered segments by some rules
    if (filteredSegmentUrls && filteredSegmentsRules) {
        // if same params, use cached filtered segments urls
        const isEqualRule = (ruleA, ruleB) =>
            ruleA.type === ruleB.type &&
            ruleA.words.length === ruleB.words.length &&
            ruleA.exact.length === ruleB.exact.length &&
            ruleA.folders.length === ruleB.folders.length &&
            ruleA.exactURLS.length === ruleB.exactURLS.length &&
            difference(ruleA.words, ruleB.words).length === 0 &&
            difference(ruleA.exact, ruleB.exact).length === 0 &&
            difference(ruleA.folders, ruleB.folders).length === 0 &&
            difference(ruleA.exactURLS, ruleB.exactURLS).length === 0;
        const extraRules = differenceWith(rules, filteredSegmentsRules, isEqualRule);

        // if filtered segments are cached and search rules include cached filtered rules,
        // then use filtered cache to shorten search operations
        if (
            filteredSegmentsRules.length !== 0 &&
            extraRules.length === rules.length - filteredSegmentsRules.length
        ) {
            checkData = filteredSegmentUrls;
            checkRules = extraRules;
        }
    }

    try {
        filteredSegmentUrls = matchPopularPagesByRules(checkData, checkRules);
        filteredSegmentsRules = cloneDeep(rules);
    } catch (err) {
        console.warn("Error in filtering popular pages", err.message);
    }
    return filteredSegmentUrls || [];
}

/**
 * Derives keywords from given URL. The domain is cut off from the URL and will not be derived as keywords.
 */
function deriveKeywordsFromUrl(url: string, domain: string): Set<string> {
    const urlWithoutDomain = url.replace(domain, "");
    const keywordsSet = new Set(urlWithoutDomain.split(delimitersRegex));
    keywordsSet.delete("");
    return keywordsSet;
}

/**
 * Derives folder parts from given URL (split by "/").
 */
function deriveFolderPartsFromUrl(url: string, maxDepth: number): Set<string> {
    const trimmedUrl = trimUrlWithPathOnly(url);
    const folderPartsSet = new Set(
        trimmedUrl
            .split("/", maxDepth ? maxDepth + 1 : undefined)
            .slice(0, maxDepth ? maxDepth + 1 : undefined),
    );
    folderPartsSet.delete("");
    return folderPartsSet;
}

/**
 * Trims the given URL from query string and hash, so only domain and path will remain.
 */
function trimUrlWithPathOnly(url: string): string {
    let cutIdx = -1;
    cutIdx = cutIdx === -1 ? url.indexOf("?") : cutIdx;
    cutIdx = cutIdx === -1 ? url.indexOf("#") : cutIdx;
    return cutIdx !== -1 ? url.slice(0, cutIdx) : url;
}

/**
 * Transforms unsafe urls.
 */
function transformToUrl(unsafeUrl: string): string {
    try {
        return decodeURIComponent(escape(atob(unsafeUrl)));
    } catch (err) {
        return "";
    }
}

/**
 * Returns the keywords prediction list for the given list of URLs.
 */
function getKeywordPredictionsList(
    rules: ISegmentRuleItem[],
    excludeKeywords?: Iterable<string>,
    wordsFilterConfig?: IWordsFilterConfig,
): string[] {
    const filteredUrls = searchSegments(rules);
    const predictions = extractWordsFromUrls(allSegmentUrls, filteredUrls, excludeKeywords);

    const filteredPredictions = wordsFilterConfig
        ? new SegmentsWordsFilter(predictions, wordsFilterConfig).getFilteredResults()
        : [...predictions];

    sortPredictionsByShare(filteredPredictions, "keyword");

    return filteredPredictions.map((prediction) => prediction.keyword);
}

/**
 * Returns the folders predictions list for the given list of URLs.
 */
function getFolderPredictionsList(rules: ISegmentRuleItem[]): string[] {
    const filteredUrls = searchSegments(rules);
    const predictions = extractFoldersFromUrls(allSegmentUrls, filteredUrls);

    sortPredictionsByShare(predictions, "folder");

    return predictions.map((segment) => segment.folder);
}

/**
 * Prepare the raw segments: derive keywords list for each URL.
 */
function prepareSegments(
    data: Array<[string, number]>,
    domain: string,
    isRaw: boolean,
    doSync: boolean,
): IUrlShareSegments[] {
    const preparedSegmentUrls = data.map<IUrlShareSegments>((d) => {
        const url = isRaw ? d[0] : transformToUrl(d[0]);
        return {
            URL: url,
            Share: d[1],
            Segments: isRaw ? deriveKeywordsFromUrl(url, domain) : new Set(d[0]),
            FolderParts: isRaw ? deriveFolderPartsFromUrl(url, MAX_URL_FOLDERS_DEPTH) : new Set(),
        };
    });

    if (doSync) {
        resetSegmentsCache();
        allSegmentUrls = preparedSegmentUrls;
    }

    return preparedSegmentUrls;
}

function matchPopularPagesByRules(checkData: IUrlShareSegments[], checkRules: ISegmentRuleItem[]) {
    // if no rules to check, return all the data (whether filtered or all)
    if (checkRules.length === 0) {
        return checkData;
    }

    // check whether any word of a rule exists in entry segments
    const checkAnyWordInSegments = (words: string[], segments: Set<string>): boolean =>
        words.some((w) => segments.has(w));

    // Check whether any exact-phrase of a rule is contained within a url
    const checkAnyExactInUrl = (exact: string[], url: string) =>
        exact?.some((e) => {
            // fix for JIRA SIM-28279 - we want our search to be case insensitive
            const exactRegex = new RegExp(`${escapeRegexString(e)}`, "gi");
            return exactRegex.test(url);
        }) ?? false;

    const checkAnyExactUrls = (exact: string[], url: string) =>
        exact?.some((e) => {
            // fix for JIRA SIM-28279 - we want our search to be case insensitive
            const exactRegex = new RegExp(
                `^${escapeRegexString(e)}[\\/,?]?(?![\\/a-zA-Z0-9])`,
                "gi",
            );
            return exactRegex.test(url);
        }) ?? false;

    const checkAnyFolderInUrl = (folders: string[], url: string) =>
        folders?.some(
            (f) =>
                url.toLowerCase().startsWith(f.toLowerCase()) &&
                ["/", "?", "#", undefined].includes(url[f.length]),
        );

    // create check function according to rules to check whether a popular page entry fulfills the rules
    const check = (entry: IUrlShareSegments) =>
        checkRules.every((rule) => {
            // an entry is considered a "match" in case the current rule has a word (or more) within its segments
            // or in case the current rule has an exact phrase (or more) within its url
            const hasMatch =
                checkAnyWordInSegments(rule.words, entry.Segments) ||
                checkAnyExactInUrl(rule.exact, entry.URL) ||
                checkAnyFolderInUrl(rule.folders, entry.URL) ||
                checkAnyExactUrls(rule.exactURLS, entry.URL);

            return rule.type === 0
                ? hasMatch // include any word or exact phrase
                : !hasMatch; // exclude any word or exact phrase
        });

    return checkData.filter(check);
}

WorkerProcessor.processMethods({
    prepareSegments: {
        method: prepareSegments,
    },
    searchSegments: {
        method: searchSegments,
    },
    getKeywordPredictionsList: {
        method: getKeywordPredictionsList,
    },
    getFolderPredictionsList: {
        method: getFolderPredictionsList,
    },
    resetSegmentsCache: {
        method: resetSegmentsCache,
    },
});
