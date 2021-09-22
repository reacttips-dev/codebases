import {
    escapeRegexString,
    keywordsDelimiterRegexPatternEnd,
    keywordsDelimiterRegexPatternStart,
} from "services/segments/segmentsProcessor/segmentsKeywordsVariables";
import XRegExp from "xregexp";

export type IHighlightPartType =
    | "text"
    | "site"
    | "keywordMatch"
    | "exactMatch"
    | "urlDelimiter"
    | "ellipsis";

export interface IHighlightPart {
    partTypes: Set<IHighlightPartType>;
    text: string | undefined;
    isShrink?: boolean;
}

export type ISequenceHighlighterCase = [
    string,
    RegExp,
    { getMatchStartIndex: IMatchToMeasureFunc; getMatchLength: IMatchToMeasureFunc },
];

const ellipsisStr = "\u2026";
const highlightPartTypes: Set<IHighlightPartType> = new Set([
    "keywordMatch",
    "exactMatch",
] as IHighlightPartType[]);

// Safely uri-decode a string
const safeDecodeURI = (str: string): string => {
    try {
        return decodeURI(str);
    } catch {
        return str;
    }
};

// Removes parts at start index and replaces them with given parts that are not empty
const spliceSectionParts = (
    sectionParts: IHighlightPart[],
    start: number,
    deleteCount: number,
    ...parts: IHighlightPart[]
): IHighlightPart[] =>
    sectionParts.splice(start, deleteCount, ...parts.filter((part) => !!part?.text)); // check part text is not empty

// Appends parts to section, and returns the new length
const appendSectionParts = (sectionParts: IHighlightPart[], ...parts: IHighlightPart[]): number => {
    // check part text is not empty
    spliceSectionParts(sectionParts, sectionParts.length, 0, ...parts);
    return sectionParts.length;
};

// Checks whether any part type of the first set is in the other part types set
const isPartTypeIntersect = (firstPartTypes: Set<string>, secondPartTypes: Set<string>): boolean =>
    Array.from(firstPartTypes).some((t) => secondPartTypes.has(t));

// Generates highlight function for text sequence (sequence text cannot be broken, like breaking url with ? or & marks)
export type IMatchToMeasureFunc = (match: RegExpMatchArray) => number;
export const makeSequenceHighlighter = (highlightsRegexps: ISequenceHighlighterCase[]) => (
    sequenceText: string,
    flags: { [key: string]: boolean },
): [IHighlightPart[], boolean] => {
    if (!sequenceText) {
        return [[], false];
    }

    // loop over all highlight regexes
    const sequenceParts = [];
    appendSectionParts(sequenceParts, {
        partTypes: new Set(["text"]),
        text: sequenceText,
        ...flags,
    } as IHighlightPart); // initialize with all sequence text
    let isMatch = false; // flag to return if any match found
    highlightsRegexps.forEach(
        ([partType, highlightRegexp, { getMatchStartIndex, getMatchLength }]) => {
            // loop over matches and make the highlight parts
            let curPartIdx = 0;
            let curPartTextIdx = 0; // calculate char index while looping the sequence parts (to know to calculate match index in current part
            while (true) {
                // get keyword match
                const match = highlightRegexp ? highlightRegexp.exec(sequenceText) : null;

                // if no more match or whole match is empty (didn't consume any character), then stop!
                if (!match || match[0].length === 0) {
                    break;
                }

                // skip empty matches
                const matchLength = match && getMatchLength(match); // get actual match length
                if (matchLength === 0) {
                    // if matched empty string, then skip (no split will be taken anyways)
                    continue;
                }

                // OK, got a real actual match
                isMatch = true;
                const matchStartIdx = getMatchStartIndex(match); // get match start index

                let matchStartIdxFound = false; // flag whether the start index was found
                let matchFoundFinish = false; // flag whether the whole match is found - finished
                let matchIdxInCurPart = matchStartIdx - curPartTextIdx; // get the match index in the current part
                // loop over all sequence parts, split the part on match indexes and mark each part with its matched part types
                for (; curPartIdx < sequenceParts.length; ++curPartIdx) {
                    let curPart = sequenceParts[curPartIdx];
                    if (!matchFoundFinish) {
                        let idxFound = false;
                        // if match index is in the current part, then split the part
                        if (matchIdxInCurPart < curPart.text.length) {
                            const newCurPart = {
                                ...curPart,
                                partTypes: new Set(curPart.partTypes),
                                text: curPart.text.substr(0, matchIdxInCurPart),
                            };
                            spliceSectionParts(sequenceParts, curPartIdx, 1, newCurPart, {
                                ...curPart,
                                partTypes: new Set(curPart.partTypes),
                                text: curPart.text.substr(matchIdxInCurPart),
                            }); // splice and filters empty parts (with empty text)
                            curPart = newCurPart; // set current part to the first part of the split
                            idxFound = true;
                        }
                        if (!matchStartIdxFound) {
                            // if match start index hasn't been found yet
                            if (idxFound) {
                                // if index was found in this part, set next iteration variables and continue
                                matchStartIdxFound = true;
                                matchIdxInCurPart = matchLength; // the match end index from the current part is actually the match length
                                // if after part split the current part is empty, then reduce the curPartIdx since it the new current part is filtered
                                if (curPart.text.length === 0) {
                                    --curPartIdx;
                                }
                            }
                        } else {
                            // if match start index has been found, then every part should be marked as match
                            curPart.partTypes.delete("text"); // remove the regular part type
                            curPart.partTypes.add(partType); // add the match part type
                            if (idxFound) {
                                // if end index has been found
                                // set match finish to break loop next iteration (don't use break, to evaluate the current part text index
                                matchFoundFinish = true;
                            }
                        }
                        if (!idxFound) {
                            // set the correct next iteration part match index
                            matchIdxInCurPart -= curPart.text.length;
                        }
                        // calculate the current part total text index
                        curPartTextIdx += curPart.text.length;
                    } else {
                        // if match finished, break the loop here - next match will continue from the current part
                        break;
                    }
                }
            }
        },
    );

    return [sequenceParts, isMatch];
};

// Shorten the regular parts (without highlights) and take some chars from the start and end of the parts,
// or show all string between matches if its length is short
const shortenRegularParts = (
    parts: IHighlightPart[],
    numStartChars: number,
    numEndChars: number,
    numCharsBetween: number = 0,
    withEllipsis: boolean = true,
): IHighlightPart[] => {
    // if parts text length is equal or less than the chars to take around, then return all the parts
    const partsText = partsToText(parts);
    if (partsText.length <= numStartChars + numEndChars || partsText.length <= numCharsBetween) {
        return parts;
    }

    // get parts from the start until reaching the amount of chars to take from start
    let charsToGo;
    const startParts = [];
    charsToGo = numStartChars;
    for (let i = 0; i < parts.length && charsToGo > 0; ++i) {
        const part = parts[i];
        const shortPartText = part.text.slice(0, charsToGo);
        startParts.push({ ...part, text: shortPartText });
        charsToGo = charsToGo - shortPartText.length;
    }

    // get parts from the end until reaching the amount of chars to take from end
    const endParts = [];
    charsToGo = numEndChars;
    for (let i = parts.length - 1; i >= 0 && charsToGo > 0; --i) {
        const part = parts[i];
        const shortPartText = part.text.slice(-charsToGo);
        endParts.unshift({ ...part, text: shortPartText });
        charsToGo = charsToGo - shortPartText.length;
    }

    return [
        ...startParts,
        ...(withEllipsis
            ? [{ partTypes: new Set(["ellipsis"]), text: ellipsisStr, isShrink: true }]
            : []),
        ...endParts,
    ];
};

// Shortens the highlighted (probably) parts with ellipsis
export const shortenHighlightedParts = (
    parts: IHighlightPart[],
    withInitialStart: boolean = false,
    withTrailEllipsis: boolean = true,
    numCharsAround: [number, number] = [1, 1],
    numCharsBetween: number = 0,
    highlightedTypes: Set<string> = highlightPartTypes,
): IHighlightPart[] => {
    let lastHighlightedIdx = -1; // cache the last highlighted part index to know which parts are between every 2 matches for chars around
    const shortParts = parts.reduce((acc, part, idx) => {
        // if part is highlighted match
        if (isPartTypeIntersect(part.partTypes, highlightedTypes)) {
            const startCharsNum =
                lastHighlightedIdx >= 0
                    ? numCharsAround[0] // if had highlight part before, take chars from start
                    : withInitialStart
                    ? numCharsAround[0]
                    : 0; // else, do not take chars from start unless explicitly told
            const endCharsNum = numCharsAround[1]; // take chars from start
            const betweenCharsNum =
                lastHighlightedIdx >= 0 ? numCharsBetween : withInitialStart ? numCharsBetween : 0;
            // get parts between previous (or first) highlight part to current highlight part and shorten it, and append the highlight part itself
            acc.push(
                ...shortenRegularParts(
                    parts.slice(lastHighlightedIdx + 1, idx),
                    startCharsNum,
                    endCharsNum,
                    betweenCharsNum,
                ),
                part,
            );
            lastHighlightedIdx = idx; // set last highlight part index to current
        }
        return acc;
    }, []);

    // if there are some parts after the last highlight part, then shorten the trailing parts
    if (lastHighlightedIdx < parts.length - 1) {
        // if got any match then take chars from start, otherwise take no chars (show only ellipsis)
        const startCharsNum = lastHighlightedIdx >= 0 ? numCharsAround[0] : 0;
        shortParts.push(
            ...shortenRegularParts(
                parts.slice(lastHighlightedIdx + 1),
                startCharsNum,
                numCharsAround[1],
                0,
                withTrailEllipsis,
            ),
        );
    }

    return shortParts;
};

// Convert parts to text
export const partsToText = (parts: IHighlightPart[]) =>
    parts.reduce((acc, { text }) => acc + text, "");

// Shorten the given url with highlighting the giving keywords in the given selected site.
export const highlightUrl = (
    urlStr: string,
    selectedSite: string,
    keywords: string[],
    exactMatches: string[],
): [string, IHighlightPart[]] => {
    // get highlighter function with a regex to search for keywords
    const keywordsRegexp =
        keywords.length > 0
            ? XRegExp(
                  `(${keywordsDelimiterRegexPatternStart})(${keywords
                      .map(escapeRegexString)
                      .join("|")})(?=${keywordsDelimiterRegexPatternEnd})`,
                  "ugi",
              )
            : null;
    const exactRegexp =
        exactMatches.length > 0
            ? new RegExp(`(${exactMatches.map(escapeRegexString).join("|")})`, "ugi")
            : null;
    const highlightSequence = makeSequenceHighlighter([
        [
            "keywordMatch",
            keywordsRegexp,
            {
                getMatchStartIndex: (match: RegExpMatchArray) => match.index + match[1].length,
                getMatchLength: (match: RegExpMatchArray) => match[2].length,
            },
        ],
        [
            "exactMatch",
            exactRegexp,
            {
                getMatchStartIndex: (match: RegExpMatchArray) => match.index,
                getMatchLength: (match: RegExpMatchArray) => match[0].length,
            },
        ],
    ]);

    // make a URL parts object from the given url string
    const urlParts = {
        domainPath: "",
        query: "",
        hash: "",
    };
    try {
        let urlObj;
        try {
            // try parse the url string as is
            urlObj = new URL(urlStr);
        } catch {
            // if failed, then try parse the url string with some schema in the beginning
            urlObj = new URL("https://" + urlStr);
        }
        urlParts.domainPath = urlObj.hostname + urlObj.pathname;
        urlParts.query = urlObj.search;
        urlParts.hash = urlObj.hash;
    } catch {
        // if not a valid url, then take the whole string as the domain and path of the url
        urlParts.domainPath = urlStr;
    }
    const highlightedTexts = [];

    // get the url hostname and path, exclude the selected site and highlight the rest
    const [urlSubDomain, urlPath] = safeDecodeURI(urlParts.domainPath).split(selectedSite, 2);
    appendSectionParts(
        highlightedTexts,
        ...highlightSequence(urlSubDomain, { isShrink: false })[0], // highlight sub-domain of url
        { partTypes: new Set(["site"]), text: selectedSite, isShrink: false } as IHighlightPart, // put the selected site
        ...highlightSequence(urlPath, { isShrink: false })[0], // highlight the path of the url
    );

    // always show the '?' sign
    appendSectionParts(highlightedTexts, {
        partTypes: new Set(["urlDelimiter"]),
        text: `?`,
        isShrink: true,
    } as IHighlightPart);

    // if url has query params
    if (urlParts.query) {
        // split to params, highlight each query param, filter only query params with match and sort the filtered query params
        const matchedQueryParams = safeDecodeURI(urlParts.query)
            .slice(1)
            .split("&")
            .map((text) => {
                const [highlighted, isMatch] = highlightSequence(text, { isShrink: true });
                return { text, highlighted, isMatch };
            })
            .filter(({ isMatch }) => isMatch)
            .sort((a, b) => (a.text > b.text ? 1 : -1));

        // if got matched query params
        if (matchedQueryParams.length) {
            // for each matched query param, split by key value, and shorten the matched strings in value
            matchedQueryParams.forEach(({ highlighted, text }, i) => {
                const paramKeyParts = [];
                const paramValParts = [];
                let initialStart = false;

                // find the part with '=' sign
                let paramEqualSignIdx = -1;
                const paramEqualPartIdx = highlighted.findIndex(
                    ({ text }) => (paramEqualSignIdx = text.indexOf("=")) !== -1,
                );

                // if found '=' sign, then divide parts to key and value parts
                if (paramEqualPartIdx !== -1) {
                    const paramEqualPart = highlighted[paramEqualPartIdx];
                    paramKeyParts.push(...highlighted.slice(0, paramEqualPartIdx));
                    paramValParts.push(...highlighted.slice(paramEqualPartIdx + 1));

                    // if '=' sign is found in a match (exact-match case)
                    if (isPartTypeIntersect(paramEqualPart.partTypes, highlightPartTypes)) {
                        paramKeyParts.push(paramEqualPart); // take the whole part to the key parts
                        initialStart = paramEqualSignIdx < paramEqualPart.text.length - 1; // value parts should start like there's a match before it
                    } else {
                        paramKeyParts.push({
                            ...paramEqualPart,
                            text: paramEqualPart.text.slice(0, paramEqualSignIdx + 1),
                        }); // put key= in key parts
                        paramValParts.unshift({
                            ...paramEqualPart,
                            text: paramEqualPart.text.slice(paramEqualSignIdx + 1),
                        }); // put value in value parts
                    }
                } else {
                    // if '=' sign was not found, then take the whole param parts as key parts
                    paramKeyParts.push(...highlighted);
                }
                appendSectionParts(
                    highlightedTexts,
                    ...(i > 0 // add '&' sign between query params
                        ? [
                              {
                                  partTypes: new Set(["urlDelimiter"]),
                                  text: "&",
                                  isShrink: true,
                              } as IHighlightPart,
                          ]
                        : []),
                    ...paramKeyParts, // show key params fully
                    // shorten the value params to matched strings (do not show ellipsis if last param, since ellipsis is added explicitly ahead)
                    ...shortenHighlightedParts(
                        paramValParts,
                        initialStart,
                        i !== matchedQueryParams.length - 1,
                        [0, 0],
                        2,
                    ),
                );
            });
        }
    }

    // always show ellipsis after the url path or query params
    appendSectionParts(highlightedTexts, {
        partTypes: new Set(["ellipsis"]),
        text: ellipsisStr,
        isShrink: true,
    } as IHighlightPart);

    // if got matched hash, then add shortened hash parts, otherwise don't display it
    if (urlParts.hash) {
        const [highlightedHash, isMatchHash] = highlightSequence(
            safeDecodeURI(urlParts.hash).slice(1),
            { isShrink: true },
        );
        if (isMatchHash) {
            appendSectionParts(
                highlightedTexts,
                {
                    partTypes: new Set(["urlDelimiter"]),
                    text: "#",
                    isShrink: true,
                } as IHighlightPart, // show the '#' sign
                ...shortenHighlightedParts(highlightedHash, false, true, [0, 0], 2), // shorten the hash to matched string with trailing ellipsis
            );
        }
    }

    // get text string of the shortened url
    const shortUrl = partsToText(highlightedTexts);

    return [shortUrl, highlightedTexts];
};
