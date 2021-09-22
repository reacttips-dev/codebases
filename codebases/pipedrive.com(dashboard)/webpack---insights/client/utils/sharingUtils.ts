import { uniqBy } from 'lodash';

import { Dashboard, Report, SharingOption } from '../types/apollo-query-types';

export const isItemSharedWithOthers = (
	item: Dashboard | Report,
	currentUserId: number,
) => {
	if (item?.shared_with) {
		const isCurrentUserItemOwner = item.user_id === currentUserId;

		return (
			isCurrentUserItemOwner &&
			item.shared_with.some(
				(sharedUserOrTeam) =>
					sharedUserOrTeam && sharedUserOrTeam.id !== currentUserId,
			)
		);
	}

	return false;
};

export const isCurrentUserItemOwner = (item: any, currentUserId: number) => {
	if (item?.user_id) {
		return item.user_id === currentUserId;
	}

	return true;
};

export const doesItemHaveAnotherOwner = (item: any, currentUserId: number) => {
	return !isCurrentUserItemOwner(item, currentUserId);
};

export const hasPeerItems = (items: any, currentUserId: number) =>
	items?.some((item: Dashboard | Report) =>
		doesItemHaveAnotherOwner(item, currentUserId),
	);

export const getOwnItems = (items: any, currentUserId: number) =>
	items?.filter((item: Dashboard | Report) =>
		isCurrentUserItemOwner(item, currentUserId),
	);

const hasEditingRights = (item: Dashboard | Report, currentUserId: number) =>
	item?.shared_with?.some(
		(sharedUserOrTeam) =>
			sharedUserOrTeam?.id === currentUserId && sharedUserOrTeam.can_edit,
	);

export const canEditItem = (item: Report | Dashboard, currentUserId: number) =>
	isCurrentUserItemOwner(item, currentUserId) ||
	hasEditingRights(item, currentUserId);

export const getEditableItems = (items: any, currentUserId: number) =>
	items?.filter((item: Dashboard | Report) =>
		canEditItem(item, currentUserId),
	);

export const getInheritedSharingOptions = (
	report: Report,
	dashboards?: Dashboard[],
) => {
	const parentDashboards = dashboards?.filter(
		(dashboard) =>
			!!dashboard.reports?.find(
				(dashboardReport) => dashboardReport.id === report.id,
			),
	);

	const sharingOptions =
		parentDashboards?.reduce<SharingOption[]>((options, dashboard) => {
			const { shared_with = [] } = dashboard;

			return options.concat(shared_with || []);
		}, []) || [];

	return uniqBy(sharingOptions, (option) =>
		[option?.id, option?.type].join(),
	);
};
