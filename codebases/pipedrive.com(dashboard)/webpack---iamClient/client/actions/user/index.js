export const USER_SET_ID = 'USER_SET_ID';
export const USER_SET_COMPANY_ID = 'USER_SET_COMPANY_ID';
export const USER_SET_LANGUAGE = 'USER_SET_LANGUAGE';
export const USER_SET_LOCALE = 'USER_SET_LOCALE';
export const USER_SET_CREATION_DATE = 'USER_SET_CREATION_DATE';
export const USER_SET_COMPANY_CREATION_DATE = 'USER_SET_COMPANY_CREATION_DATE';
export const USER_SET_COMPANY_FEATURES = 'USER_SET_COMPANY_FEATURES';
export const USER_SET_IS_ADMIN = 'USER_SET_IS_ADMIN';
export const USER_SET_IMPORT_ENABLED = 'USER_SET_IMPORT_ENABLED';

export const setUserId = (id) => {
	return ({
		type: USER_SET_ID,
		id,
	});
};

export const setCompanyId = (id) => {
	return ({
		type: USER_SET_COMPANY_ID,
		id,
	});
};

export const setUserLanguage = (language) => {
	return ({
		type: USER_SET_LANGUAGE,
		language,
	});
};

export const setUserLocale = (locale) => {
	return ({
		type: USER_SET_LOCALE,
		locale,
	});
};

export const setUserCreationDate = (userCreationDate) => {
	return ({
		type: USER_SET_CREATION_DATE,
		userCreationDate,
	});
};

export const setCompanyCreationDate = (companyCreationDate) => {
	return ({
		type: USER_SET_COMPANY_CREATION_DATE,
		companyCreationDate,
	});
};

export const setCompanyFeatures = (companyFeatures) => {
	return ({
		type: USER_SET_COMPANY_FEATURES,
		companyFeatures,
	});
};

export const setUserIsAdmin = (isAdmin) => {
	return ({
		type: USER_SET_IS_ADMIN,
		isAdmin,
	});
};

export const setUserImportEnabled = (importEnabled) => {
	return ({
		type: USER_SET_IMPORT_ENABLED,
		importEnabled,
	});
};
