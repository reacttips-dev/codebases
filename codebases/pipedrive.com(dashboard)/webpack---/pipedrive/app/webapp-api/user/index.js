const UserModel = require('./model');

export default new Promise((resolve, reject) => {
	const user = new UserModel();

	user.getUser(
		() => {
			resolve(user);
		},
		(user, xhr, data) => {
			reject(data, user, xhr);
		}
	);
});
