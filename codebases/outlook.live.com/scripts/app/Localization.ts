/**
 * Localization.ts
 *
 * Module for Localization
 */

/**
 * List of supported Locales
 * REMINDER: update readme to match the list below if change is made
 */
let supportedLocales: string[] = [
	"af",
	"am",
	"ar",
	"as",
	"az",
	"be",
	"bg",
	"bn-BD",
	"bn-IN",
	"bs",
	"ca",
	"ca-Es-VALENCIA",
	"chr-Cher",
	"cs",
	"cy",
	"da",
	"de",
	"el",
	"en-GB",
	"es",
	"es-MX",
	"et",
	"eu",
	"fa",
	"fi",
	"fil",
	"fr",
	"fr-CA",
	"ga",
	"gd",
	"gl",
	"gu",
	"ha-Latn-NG",
	"he",
	"hi",
	"hr",
	"hu",
	"hy",
	"id",
	"is",
	"it",
	"ja",
	"ka",
	"kk",
	"km-KH",
	"kn",
	"ko",
	"kok",
	"ky",
	"lb",
	"lo",
	"lt",
	"lv",
	"mi",
	"mk",
	"ml",
	"mn",
	"mr",
	"ms",
	"mt",
	"nb-NO",
	"ne",
	"nl",
	"nn-NO",
	"or",
	"pa",
	"pl",
	"prs",
	"pt-BR",
	"pt-PT",
	"quz",
	"ro",
	"ru",
	"sd",
	"si",
	"sk",
	"sl",
	"sq",
	"sr-Cyrl-BA",
	"sr-Cyrl-RS",
	"sr-Latn-RS",
	"sv",
	"sw",
	"ta",
	"te",
	"th",
	"tk",
	"tr",
	"tt",
	"ug",
	"uk",
	"ur",
	"uz-Latn-UZ",
	"vi",
	"zh-Hans",
	"zh-Hant",
];

const localeVariantToSupportedlocaleMap: { [key: string]: string } = {
	"ZH-CN": "zh-Hans",
	"ZH-HK": "zh-Hant",
	"ZH-MO": "zh-Hant",
	"ZH-SG": "zh-Hans",
	"ZH-TW": "zh-Hant",
};

export function validate(locale: string): string {
	let localeUpperCase = locale.toLocaleUpperCase();

	// support for Chinese ll-cc, VSO Bug 1583389
	if (localeUpperCase in localeVariantToSupportedlocaleMap) {
		return localeVariantToSupportedlocaleMap[localeUpperCase];
	}

	// return supported locale if exact match found
	for (let supportedLocale of supportedLocales) {
		if (supportedLocale.toUpperCase() === localeUpperCase) {
			return supportedLocale;
		}
	}

	let localePartOne = localeUpperCase.split("-")[0];
	// return supported "ll" if exact match not found, but "ll" matches
	for (let supportedLocale of supportedLocales) {
		if (supportedLocale.toUpperCase() === localePartOne) {
			return supportedLocale;
		}
	}

	// default everything else to en
	return "en";
}
