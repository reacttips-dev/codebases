import { Translator } from '@pipedrive/react-utils';

import { MAX_REPORTS_IN_DASHBOARD } from './constants';

export const getErrorMessage = (translator: Translator) => {
	return translator.gettext(
		'Error! Something went wrong, please try again or contact our support.',
	);
};

export const getMoveItemToDashboardWarningMessage = ({
	isMaximumReportsReached,
	isAlreadyInDashboard,
	isGoalTypeReport,
	translator,
	isOtherUserReport = false,
	isOtherUserDashboard = false,
	dashboardOwnerName = '',
}: {
	isMaximumReportsReached: boolean;
	isAlreadyInDashboard: boolean;
	isGoalTypeReport: boolean;
	translator: Translator;
	isOtherUserReport?: boolean;
	isOtherUserDashboard?: boolean;
	dashboardOwnerName?: string;
}) => {
	if (isAlreadyInDashboard) {
		return isGoalTypeReport
			? translator.gettext('Goal already added to this dashboard')
			: translator.gettext('Report already added to this dashboard');
	}

	if (isMaximumReportsReached) {
		return translator.pgettext(
			'Dashboard can contain up to [number] reports.',
			'Dashboard can contain up to %s reports',
			MAX_REPORTS_IN_DASHBOARD,
		);
	}

	if (isOtherUserDashboard) {
		return translator.pgettext(
			'Only the owner [name] can make changes here.',
			'Only the owner %s can make changes here',
			dashboardOwnerName,
		);
	}

	if (isOtherUserReport) {
		return translator.gettext(
			"Shared reports can't be added to personal dashboards",
		);
	}

	return '';
};

export const getSharedItemTooltipContent = ({
	isSharedReport,
	translator,
	isSharedDashboard = false,
}: {
	isSharedReport: boolean;
	translator: Translator;
	isSharedDashboard?: boolean;
}) => {
	if (isSharedDashboard) {
		return translator.gettext('Shared with other users');
	}

	if (isSharedReport) {
		return translator.gettext('Added to at least one shared dashboard');
	}

	return '';
};
