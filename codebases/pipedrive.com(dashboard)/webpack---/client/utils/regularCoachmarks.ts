import { getComponentLoader } from '../shared/api/webapp/index';
import { CoachmarkTags } from './constants';
import { Translator } from '@pipedrive/react-utils';

const dealWonLostOrDeletedCoachmark = (API: any, t: Translator) => {
	const tag = CoachmarkTags.ACTIVITY_LOOP_DEAL_WON_LOST_OR_DELETED;
	const content = t.gettext('You can access won, lost and deleted deals through filters.');
	const filtersMenu = document.querySelector('[data-coachmark="iamcoachmark-filters-menu-container"]');

	let coachmark: Pipedrive.Coachmark;

	if (filtersMenu) {
		coachmark = new API.Coachmark({
			tag,
			content,
			parent: filtersMenu,
			appearance: {
				placement: 'bottomLeft',
				zIndex: 2,
			},
			// Change to true to test coachmarks.
			__debug: false,
			actions: [
				{
					label: t.gettext('Got it'),
					handler: () => {
						coachmark.close();
					},
				},
			],
		});
	}

	return coachmark;
};

export const setDealWonLostOrDeletedCoachmark = (t: Translator) => {
	return getIamClient()
		.then((API) => {
			dealWonLostOrDeletedCoachmark(API, t);
		})
		.catch((error) => error);
};

const singleDealActivityCoachmark = (API: any, t: Translator, position: string) => {
	const tag = CoachmarkTags.ACTIVITY_LOOP_SINGLE_DEAL_ACTIVITY;
	const content = t.gettext('Great start! Click on the icon to schedule a follow-up activity.');
	const statusIndicatorContainer = document.querySelector('[data-test*="activity-status-indicator-"]');
	const coachmarkContainer = document.createElement('div');
	coachmarkContainer.className = 'iamcoachmark-status-indicator-container';
	statusIndicatorContainer.appendChild(coachmarkContainer);

	let coachmark: Pipedrive.Coachmark;

	if (statusIndicatorContainer) {
		coachmark = new API.Coachmark({
			tag,
			content,
			parent: coachmarkContainer,
			appearance: {
				placement: position,
				zIndex: 2,
			},
			// Change to true to test coachmarks.
			__debug: false,
			actions: [
				{
					label: t.gettext('Got it'),
					handler: () => {
						coachmark.close();
					},
				},
			],
		});
	}

	return coachmark;
};

export const setSingleDealActivityCoachmark = (t: Translator, position: string) => {
	return getIamClient()
		.then((API) => {
			singleDealActivityCoachmark(API, t, position);
		})
		.catch((error) => error);
};

function getIamClient() {
	return getComponentLoader().load('iam-client');
}
