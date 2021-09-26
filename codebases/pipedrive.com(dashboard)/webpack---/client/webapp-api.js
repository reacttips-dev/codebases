import { get } from 'lodash';

export const fetchUserSelf = (webappApi) =>
	new Promise((resolve, reject) => {
		if (!get(webappApi, 'userSelf.getUser')) {
			return reject(new Error(`API isn't loaded properly`));
		}

		return webappApi.userSelf.getUser(resolve, reject);
	});

export const updateUserSetting = (webappApi, key, value, options = {}) =>
	fetchUserSelf(webappApi).then(
		(user) =>
			new Promise((success, error) => {
				const opts = Object.assign(options, { success, error });

				user.settings.save(key, value, opts);
			}),
	);
