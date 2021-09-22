export const escapeRegexString = (str: string): string =>
    str.replace(/[.*+?^${}()|\[\]\\]/g, "\\$&");

export const keywordsDelimiterRegexPattern = "%[0-9a-f]{2}|[^\\p{L}\\p{N}]";
export const keywordsDelimiterRegexPatternStart = `^|${keywordsDelimiterRegexPattern}`;
export const keywordsDelimiterRegexPatternEnd = `${keywordsDelimiterRegexPattern}|$`;
