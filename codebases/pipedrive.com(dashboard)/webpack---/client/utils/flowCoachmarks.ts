import React from 'react';
import { getComponentLoader, getCompanyTier, isAdmin, isOnboardingFlowEnabled } from '../shared/api/webapp/index';
import { FlowCoachmarkTypes } from './constants';

let lastAddedDealId = 0;

async function getInterfaceTour() {
	try {
		if (isOnboardingFlowEnabled() && isAdmin() && getCompanyTier() === 'platinum') {
			return await getComponentLoader().load('interface-tour');
		}

		return null;
	} catch (e) {
		return null;
	}
}

const config = {
	[FlowCoachmarkTypes.DRAG_AND_DROP]: {
		selector: '[data-coachmark="drag-and-drop"]',
		spotlightSelectors: ['[data-coachmark="0"]', '[data-coachmark="1"]'],
		placement: 'right',
		removePadding: true,
	},
	[FlowCoachmarkTypes.EDIT_PIPELINE]: {
		selector: '[data-coachmark="pipeline-select"]',
		placement: 'bottom-end',
	},
	[FlowCoachmarkTypes.ADD_NEW_STAGE]: {
		selector: '[data-coachmark="add-edit-stage"]',
		placement: 'left-end',
	},
	[FlowCoachmarkTypes.SAVE_STAGE]: {
		selector: '[data-coachmark="save-stage"]',
		placement: 'bottom-end',
	},
	[FlowCoachmarkTypes.ADD_DEAL]: {
		selector: '[data-coachmark="pipeline-add-deal"]',
		placement: 'bottom-start',
	},
	[FlowCoachmarkTypes.SAVE_DEAL_MODAL]: {
		selector: '[data-coachmark="add-modals-save"]',
		spotlightSelectors: [
			'[data-coachmark="person_id"]',
			'[data-coachmark="org_id"]',
			'[data-coachmark="title"]',
			'[data-coachmark="add-modals-save"]',
		],
		placement: 'top',
		zIndex: 6001,
	},
	[FlowCoachmarkTypes.DEAL_DETAILS]: {
		selector: '[data-coachmark="pipeline-deal-tile"]',
		placement: 'right-end',
	},
};

export const addFlowCoachmark = async (tag: string, options?: { parentToObserve: Element | string }) => {
	const tour = await getInterfaceTour();

	if (!tour) {
		return;
	}

	const props = {
		...options,
		...config[tag],
	};

	tour.addFlowCoachmark(tag, props);
};

export const closeFlowCoachmark = async (tag: string, options?: { persistInBrowser: boolean }) => {
	const tour = await getInterfaceTour();

	if (!tour) {
		return;
	}

	tour.closeFlowCoachmark(tag, options);
};

export const hideFlowCoachmark = async (tag: string) => {
	const tour = await getInterfaceTour();

	if (!tour) {
		return;
	}

	tour.hideFlowCoachmark(tag);
};

export function useAddFlowCoachmark(type: string) {
	React.useEffect(() => {
		addFlowCoachmark(type);
	}, []);
}

export function setRecentlyAddedDeal(deal: Partial<Pipedrive.Deal>) {
	lastAddedDealId = deal.data.id;
}

export function getRecentlyAddedDeal() {
	return lastAddedDealId;
}
