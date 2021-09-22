import { SettingsApiClient } from '../../api/apollo/settingsApiClient';
import { GET_PUBLIC_LINKS } from '../../api/graphql';
import { selectedItemVar } from '../../api/vars/settingsApi';
import { getPdMetrics } from '../../api/webapp';
import { SharingOption } from '../../types/apollo-query-types';
import { wrapWithTryCatch, getSharedLinkUniqueId } from './helpers';

const getPublicLinksCount = (publicLinks: any) => {
	let publicLinksCount = null;

	if (publicLinks && publicLinks.data) {
		publicLinksCount = publicLinks.data.length;
	}

	return publicLinksCount;
};

export const trackDashboardLinkCreated = wrapWithTryCatch(
	(dashboardId: string, hash: string) => {
		getPdMetrics().trackUsage(null, 'dashboard_link', 'created', {
			dashboard_id: dashboardId,
			link_id: getSharedLinkUniqueId(dashboardId, hash),
		});
	},
);

export const trackDashboardLinkCopied = wrapWithTryCatch((hash: string) => {
	const selectedItem = selectedItemVar();

	getPdMetrics().trackUsage(null, 'dashboard_link', 'copied', {
		dashboard_id: selectedItem.id,
		link_id: getSharedLinkUniqueId(selectedItem.id, hash),
	});
});

export const trackDashboardLinkDeleted = wrapWithTryCatch(
	(dashboardId: string, hash: string) => {
		getPdMetrics().trackUsage(null, 'dashboard_link', 'deleted', {
			dashboard_id: dashboardId,
			link_id: getSharedLinkUniqueId(dashboardId, hash),
		});
	},
);

export const trackDashboardLinksOpened = wrapWithTryCatch(() => {
	const selectedItem = selectedItemVar();
	const { publicLinks } = SettingsApiClient.readQuery({
		query: GET_PUBLIC_LINKS,
		variables: { dashboardId: selectedItem.id },
	});

	getPdMetrics().trackUsage(null, 'dashboard_links_list', 'opened', {
		dashboard_id: selectedItem.id,
		link_count: getPublicLinksCount(publicLinks),
	});
});

export const trackDashboardLinksClosed = wrapWithTryCatch(() => {
	const selectedItem = selectedItemVar();
	const { publicLinks } = SettingsApiClient.readQuery({
		query: GET_PUBLIC_LINKS,
		variables: { dashboardId: selectedItem.id },
	});

	getPdMetrics().trackUsage(null, 'dashboard_links_list', 'closed', {
		dashboard_id: selectedItem.id,
		link_count: getPublicLinksCount(publicLinks),
	});
});

export const trackDashboardLinkRenamed = wrapWithTryCatch((hash: string) => {
	const selectedItem = selectedItemVar();

	getPdMetrics().trackUsage(null, 'dashboard_link', 'name_edited', {
		dashboard_id: selectedItem.id,
		link_id: getSharedLinkUniqueId(selectedItem.id, hash),
	});
});

export const trackDashboardLinksListHovered = wrapWithTryCatch(() => {
	const selectedItem = selectedItemVar();

	getPdMetrics().trackUsage(null, 'dashboard_links_list', 'hovered', {
		dashboard_id: selectedItem.id,
	});
});

export const trackDashboardInternalShareButtonClicked = wrapWithTryCatch(
	(dashboardId: string) => {
		getPdMetrics().trackUsage(null, 'dashboard', 'sharing_started', {
			dashboard_id: dashboardId,
		});
	},
);

export const trackDashboardInternallyShared = wrapWithTryCatch(
	(dashboardId: string, shareOptions: SharingOption[]) => {
		const targetType = {
			team: 0,
			user: 0,
			everyone: 0,
		};

		shareOptions?.forEach((option) => {
			targetType[option?.type] += 1;
		});

		getPdMetrics().trackUsage(null, 'dashboard', 'shared', {
			dashboard_id: dashboardId,
			team_count: targetType.team,
			user_count: targetType.user,
			shared_with_company: !!targetType.everyone,
		});
	},
);
