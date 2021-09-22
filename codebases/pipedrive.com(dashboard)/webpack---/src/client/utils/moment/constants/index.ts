export const LOCALE = 'en';
export const FORMAT_D_DE_MMM = 'D [de] MMM';
export const FORMAT_D_MMM = 'D MMM';
export const FORMAT_D_DOT_MMM = 'D. MMM';
export const FORMAT_PATTERNS = {
	'en': 'MMM D',

	'en-gb': FORMAT_D_MMM,
	'en-au': FORMAT_D_MMM,
	'en-ca': FORMAT_D_MMM,
	'en-nz': FORMAT_D_MMM,
	'nl': FORMAT_D_MMM,
	'fr': FORMAT_D_MMM,
	'fr-ca': FORMAT_D_MMM,
	'fr-ch': FORMAT_D_MMM,
	'sv': FORMAT_D_MMM,
	'ru': FORMAT_D_MMM,
	'it': FORMAT_D_MMM,
	'pl': FORMAT_D_MMM,

	'pt': FORMAT_D_DE_MMM,
	'pt-br': FORMAT_D_DE_MMM,
	'es': FORMAT_D_DE_MMM,

	'de': FORMAT_D_DOT_MMM,
	'fi': FORMAT_D_DOT_MMM,
	'et': FORMAT_D_DOT_MMM,
	'da': FORMAT_D_DOT_MMM,
	'nb': FORMAT_D_DOT_MMM,
	'cs': FORMAT_D_DOT_MMM,
};
export const FORMAT_OVERRIDE = {
	// Override Australian start of the week day as mysql has different ideas about it. This will make BE match FE
	'en-au': { week: { dow: 0 } },
};
