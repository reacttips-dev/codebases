const NON_ALPHANUM = '[^a-z\\d]';

const previousNonAlphaNum = `(?<=${NON_ALPHANUM})`;
const followingNonAlphaNum = `(?=${NON_ALPHANUM})`;

function escapeRegExp(string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function splitByWhitespace(word) {
	return word.split(/\s+/g);
}

function matchFromStartOrEnd(word) {
	return `^${word}|${word}$|${previousNonAlphaNum}${word}|${word}${followingNonAlphaNum}`;
}

export function makeTermRegex(term) {
	if (!term) {
		return null;
	}
	try {
		term = escapeRegExp(term).trim();

		const termWords = splitByWhitespace(term);

		const termWordsRegexps = termWords.map((word) => matchFromStartOrEnd(word));

		const regexPattern = `(${termWordsRegexps.join('|')})`;

		return new RegExp(regexPattern, 'ig');
	} catch (err) {
		return null;
	}
}
