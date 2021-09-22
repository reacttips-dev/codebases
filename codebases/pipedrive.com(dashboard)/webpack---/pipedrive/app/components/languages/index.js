const LanguagesCollection = require('./collection');

export default async () => {
	return new Promise((resolve, reject) => {
		const languages = new LanguagesCollection();

		return languages.ready(() => resolve(languages), reject);
	});
};
