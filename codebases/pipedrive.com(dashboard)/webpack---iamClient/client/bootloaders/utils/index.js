export default (getData) => async (componentLoader) => {
	const [iamClient, user, metrics, router] = await getData(componentLoader);

	iamClient.setup({
		user: {
			id: user.get('id'),
			language: user.get('language').language_code,
			locale: user.get('locale'),
			created: user.get('created'),
			isAdmin: !!user.get('is_admin'),
			importEnabled: !!user.settings.get('can_use_import'),
		},
		company: {
			id: user.get('company_id'),
			created: user.get('company_add_time'),
			features: {
				nylas_calendar_sync: user.companyFeatures.get('nylas_calendar_sync'),
				leadbooster_addon: user.companyFeatures.get('leadbooster_addon'),
			},
		},
		metrics,
		componentLoader,
	});

	router.on('routeChange', iamClient.suggestArticles);
	router.on('routeChange', iamClient.clearCoachmarksQueue);

	return iamClient;
};
