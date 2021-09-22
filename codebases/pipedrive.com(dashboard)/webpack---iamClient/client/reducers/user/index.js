import Immutable from 'seamless-immutable';
import * as actions from 'actions/user';
import { DEFAULT_LANGUAGE } from 'constants/preferences';

const initialState = Immutable.from({
	userId: null,
	companyId: null,
	userLang: DEFAULT_LANGUAGE,
	userLocale: null,
	userLangCountry: null,
	userCreationDate: null,
	companyCreationDate: null,
	companyFeatures: {},
	isAdmin: null,
	importEnabled: null,
});

function mapLanguageCodes(externalLangCode) {
	if (externalLangCode && externalLangCode.indexOf('-') >= 0) {
		return externalLangCode.substring(0, externalLangCode.indexOf('-'));
	}

	return externalLangCode;
}

function mapLanguageCountries(externalLangCode) {
	if (externalLangCode && externalLangCode.indexOf('-') >= 0) {
		return externalLangCode.substring(externalLangCode.indexOf('-') + 1, externalLangCode.length);
	}

	return null;
}

// eslint-disable-next-line complexity
export default function(state = initialState, action) {
	switch (action.type) {
		case actions.USER_SET_ID:
			return Immutable.merge(state, {
				userId: action.id,
			});
		case actions.USER_SET_COMPANY_ID:
			return Immutable.merge(state, {
				companyId: action.id,
			});
		case actions.USER_SET_LANGUAGE:
			return Immutable.merge(state, {
				userLang: mapLanguageCodes(action.language),
				userLangCountry: mapLanguageCountries(action.language),
			});
		case actions.USER_SET_LOCALE:
			return Immutable.merge(state, {
				userLocale: action.locale,
			});
		case actions.USER_SET_CREATION_DATE:
			return Immutable.merge(state, {
				userCreationDate: action.userCreationDate,
			});
		case actions.USER_SET_COMPANY_CREATION_DATE:
			return Immutable.merge(state, {
				companyCreationDate: action.companyCreationDate,
			});
		case actions.USER_SET_COMPANY_FEATURES:
			return Immutable.merge(state, {
				companyFeatures: action.companyFeatures,
			});
		case actions.USER_SET_IS_ADMIN:
			return Immutable.merge(state, {
				isAdmin: action.isAdmin,
			});
		case actions.USER_SET_IMPORT_ENABLED:
			return Immutable.merge(state, {
				importEnabled: action.importEnabled,
			});
		default:
			return state;
	}
}
