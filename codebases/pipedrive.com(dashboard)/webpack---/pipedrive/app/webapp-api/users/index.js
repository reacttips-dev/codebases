const UsersCollection = require('./collection');

export default new Promise((resolve, reject) => {
	const users = new UsersCollection();

	users.ready(() => {
		resolve(users);
	}, reject);
});
