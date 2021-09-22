import { isNumber } from 'lodash';

import {
	createActivity,
	// createLeadActivity,
	updateActivity,
} from '../../../../../api';
import {
	getDefaultActivityType,
	handleHiddenPerson,
	isHiddenOrg,
	handleHiddenOrg,
	handleHiddenDeal,
	isHiddenPerson,
	isHiddenDeal,
} from '../../../../../utils/activity';

const getSaveActivityHandler = ({ isUpdate }) => {
	const updator = updateActivity;
	const creator = createActivity;

	return isUpdate ? updator : (_ignoredActivityId, activity) => creator(activity);
};

function prepareNewActivityFields(webappApi) {
	return {
		userId: webappApi.userSelf.attributes.id,
		type: getDefaultActivityType(webappApi).key_string,
	};
}

const getHiddenItemId = (item) => item.id || item.value || (isNumber(item) ? item : null);

const wrapRelatedParticipants = (participants, hiddenText) => {
	if (!participants || !participants.length) {
		return null;
	}

	return participants.map((participant) =>
		isHiddenPerson(participant)
			? handleHiddenPerson(getHiddenItemId(participant), hiddenText)
			: participant,
	);
};
const wrapRelatedOrganization = (organization, hiddenText) => {
	if (!organization) {
		return null;
	}

	return isHiddenOrg(organization)
		? handleHiddenOrg(getHiddenItemId(organization), hiddenText)
		: organization;
};
const wrapRelatedDeal = (deal, hiddenText) => {
	if (!deal) {
		return null;
	}

	return isHiddenDeal(deal) ? handleHiddenDeal(getHiddenItemId(deal), hiddenText) : deal;
};

export {
	getSaveActivityHandler,
	prepareNewActivityFields,
	wrapRelatedParticipants,
	wrapRelatedOrganization,
	wrapRelatedDeal,
};
