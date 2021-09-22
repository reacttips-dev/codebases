export const isAccountLessThan30Days = (creationDate) => {
	const difference = new Date().getTime() - new Date(creationDate.replace(/-/g, '/')).getTime();
	const differenceInDays = difference / (1000 * 3600 * 24);

	return Math.round(differenceInDays) < 30;
};

export async function getApiConfig(componentLoader) {
	const [pdMetrics, userSelf] = await Promise.all([
		componentLoader.load('webapp:metrics'),
		componentLoader.load('webapp:user'),
	]);

	const config = { api: window.app.config.api };

	return {
		pdMetrics,
		userSelf,
		config,
	};
}