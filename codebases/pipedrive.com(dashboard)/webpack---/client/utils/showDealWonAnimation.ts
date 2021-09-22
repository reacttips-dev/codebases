import {
	get as getWebappApi,
	getCurrentUserId,
	getCurrentCompanyId,
	getComponentLoader,
	getLogger,
} from '../shared/api/webapp/index';

export default async function showDealWonAnimation(dealTitle: string): Promise<void> {
	try {
		const referralService = await getComponentLoader().load('referral-service');

		if (!referralService) {
			return;
		}

		referralService
			.setup({
				api: getWebappApi(),
				serviceUrl: app.config.baseurl,
				userId: getCurrentUserId(),
				companyId: getCurrentCompanyId(),
			})
			.createAnimation(document.createElement('div'), dealTitle)
			.show();
	} catch (error) {
		getLogger().logError(error, 'Error occured while trying to show deal won animation', 'warning');
	}
}
