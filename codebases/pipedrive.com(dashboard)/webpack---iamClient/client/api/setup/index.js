import * as userActions from 'actions/user';
import { setComponentLoader } from '../../utils/componentLoader';
import pdMetrics from 'utils/pdMetrics';

export default function(stores) {
	return (config = {}) => {
		const { user, company, metrics, componentLoader } = config;

		setComponentLoader(componentLoader);

		for (const store of stores) {
			const settingDispatch = makeSettingsDispatch(store);

			settingDispatch(userActions.setUserId, user.id);

			settingDispatch(userActions.setCompanyId, company.id);

			settingDispatch(userActions.setUserLanguage, user.language);

			settingDispatch(userActions.setUserLocale, user.locale);

			settingDispatch(userActions.setUserCreationDate, user.created);

			settingDispatch(userActions.setCompanyCreationDate, company.created);

			settingDispatch(userActions.setCompanyFeatures, company.features);

			settingDispatch(userActions.setUserIsAdmin, user.isAdmin);

			settingDispatch(userActions.setUserImportEnabled, user.importEnabled);

			pdMetrics.initialize(metrics);
		}
	};
}

function makeSettingsDispatch(store) {
	return (action, value) => {
		if (typeof value !== 'undefined') {
			store.dispatch(action(value));
		}
	};
}
