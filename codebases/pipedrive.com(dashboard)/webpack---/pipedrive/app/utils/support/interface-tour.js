const Logger = require('@pipedrive/logger-fe').default;
const componentLoader = require('webapp-component-loader');
const logger = new Logger(`webapp.${app.ENV}`, 'interface-tour');
const User = require('models/user');

async function getInterfaceTour() {
	try {
		if (
			User.companyFeatures.get('onboarding_flow') &&
			User.get('current_company_plan').tier_code === 'platinum' &&
			User.get('is_admin')
		) {
			return await componentLoader.load('interface-tour');
		}
	} catch (e) {
		logger.remote('error', 'Could not initialize interface-tour', { stack: e.stack });

		return null;
	}
}

const config = {
	// 2nd subflow
	closedeals_deal_clickcustomizefields: {
		selector: '[data-coachmark="customize-fields"]',
		placement: 'top-start'
	},
	closedeals_deal_addcustomfield: {
		selector: '[data-coachmark="add-new-field"]',
		placement: 'top-start'
	},
	closedeals_deal_fillcustomfield: {
		selector: '[data-coachmark="new-field"]',
		spotlightSelectors: ['[data-coachmark="new-field"]', '[data-coachmark="deal-save"]'],
		placement: 'right'
	},
	closedeals_deal_clickdone: {
		selector: '[data-coachmark="save-fields-order"]',
		placement: 'top-start'
	},
	// 4th subflow
	closedeals_activity_add: {
		selector: '[data-coachmark="add-activity"]',
		placement: 'bottom-start'
	},
	closedeals_activity_fill: {
		selector: '[data-coachmark="add-activity-form"]',
		spotlightSelectors: [
			'[data-coachmark="add-activity-form"]',
			'[data-coachmark="save-activity-button"]'
		],
		placement: 'right-start',
		zIndex: 6001
	}
};

export const addFlowCoachmark = async (tag, elementToObserve) => {
	const tour = await getInterfaceTour();

	if (!tour) {
		return;
	}

	const options = {
		elementToObserve,
		...config[tag]
	};

	tour.addFlowCoachmark(tag, options);
};

export const closeFlowCoachmark = async (tag) => {
	const tour = await getInterfaceTour();

	if (!tour) {
		return;
	}

	tour.closeFlowCoachmark(tag);
};
