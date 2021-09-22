import { DEFAULT_LANGUAGE } from 'constants/preferences';

export default (lang, country) => {
	if (lang && country) {
		return `${lang}-${country.toUpperCase()}`;
	} else if (lang) {
		return lang;
	} else {
		return DEFAULT_LANGUAGE;
	}
};