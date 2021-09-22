import UserTimezone from './model';

export default async (componentLoader) => {
	const user = await componentLoader.load('webapp:user');
	const userTimezone = new UserTimezone(user);

	return () => userTimezone.saveDeferred();
};
