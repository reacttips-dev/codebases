const TeamsCollection = require('./collection');

export default async (componentLoader) => {
	const user = await componentLoader.load('webapp:user');

	return new Promise((resolve, reject) => {
		const teams = new TeamsCollection();

		if (user.companyFeatures.get('teams')) {
			return teams.ready(() => resolve(teams), reject);
		}

		return resolve(teams);
	});
};
