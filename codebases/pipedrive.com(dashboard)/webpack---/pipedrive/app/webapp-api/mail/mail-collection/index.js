const MailCollection = require('./collection');

export default async (componentLoader) => {
	const user = await componentLoader.load('webapp:user');

	return new Promise((resolve) => {
		const mailCollection = new MailCollection();

		return mailCollection.initialPull(
			user,
			() => {
				resolve(mailCollection);
			},
			resolve
		);
	});
};
