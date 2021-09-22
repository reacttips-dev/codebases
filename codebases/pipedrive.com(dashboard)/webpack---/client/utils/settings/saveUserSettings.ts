import { getUserSettings } from '../../shared/api/webapp';

export default function saveUserSettings(key: string, params: unknown): Promise<void> {
	return new Promise((resolve, reject) => {
		const userSettings = getUserSettings();

		userSettings.set({ [key]: params });
		const request = userSettings.save();

		if (!request) {
			// No request was made.
			return resolve();
		}

		request.done(resolve).fail(reject);
	});
}
