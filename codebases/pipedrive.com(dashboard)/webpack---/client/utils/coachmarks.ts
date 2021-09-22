import { ComponentLoader } from 'Types/types';

let renewalTypeFieldCoachmark;

const createRenewalTypeFieldCoachmark = async (API: any, translator) => {
	const content = translator.gettext('Separate your new business from repeat sales by using the deal type field.');
	const renewalTypeField = document.querySelector('[data-coachmark="renewal_type"] .cui4-select');

	renewalTypeFieldCoachmark = new API.Coachmark({
		tag: 'renewal_deals_add_deal',
		content,
		parent: renewalTypeField,
		appearance: {
			placement: 'right',
			zIndex: 6001,
		},
		__debug: false,
		detached: true,
	});

	return renewalTypeFieldCoachmark;
};

const showCoachmark = (
	createCoachmark: (API: any, translator) => Promise<any>,
	componentLoader: ComponentLoader,
	translator,
) => {
	if (!componentLoader) {
		return;
	}

	return componentLoader
		.load('iam-client')
		.then((API) => createCoachmark(API, translator))
		.catch(() => {});
};

export const showRenewalTypeFieldCoachmark = (componentLoader: ComponentLoader, translator) =>
	showCoachmark(createRenewalTypeFieldCoachmark, componentLoader, translator);

export const closeRenewalTypeFieldCoachmark = () => {
	if (renewalTypeFieldCoachmark && renewalTypeFieldCoachmark.close) {
		renewalTypeFieldCoachmark.close();
	}
};
