import userSelf from 'models/user';

export const isAccountSettingsEnabled = () => {
	const suites = userSelf.attributes?.suites || [];

	return (
		suites.includes('BILLING') &&
		suites.includes('COMPANY_SETTINGS') &&
		suites.includes('SECURITY') &&
		suites.includes('USER_MANAGEMENT')
	);
};

export const isReseller = () => {
	const accountType = userSelf.get('companies')[userSelf.get('company_id')].account_type;

	return !!accountType && accountType.startsWith('provisioning-api-');
};
