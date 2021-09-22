import { useTranslator } from '@pipedrive/react-utils';
import { InboxFilter } from 'Leadbox/LeadboxFiltersContext';

import { GlobalFilter_data } from './__generated__/GlobalFilter_data.graphql';

type ActiveFilterForFilterMenuComponentProps = {
	userFilters: GlobalFilter_data['users'];
	customFilters: GlobalFilter_data['filters'];
	activeFilter: InboxFilter;
	teams?: GlobalFilter_data['teams'];
};

export const useActiveFilterForFilterMenuComponent = ({
	userFilters,
	customFilters,
	activeFilter,
	teams,
}: ActiveFilterForFilterMenuComponentProps) => {
	const translator = useTranslator();

	const isNotFilteredByOwner = activeFilter.filter != null;

	const activeCustomFilter = customFilters?.find((filter) => filter?.id === activeFilter.filter);

	const activeTeamFilter = teams?.find((team) => team?.id === activeFilter.owner);
	const activeUserFilter = userFilters?.find((user) => user?.id === activeFilter.owner);
	const activeOwnerFilter = activeTeamFilter ? activeTeamFilter : activeUserFilter;

	const getActiveFilterValueForFilterMenuComponent = () => {
		if (isNotFilteredByOwner) {
			return Number(activeCustomFilter?.legacyID);
		}

		if (activeOwnerFilter == null) {
			return 'everyone';
		}

		return Number(activeOwnerFilter.legacyID);
	};

	const getActiveFilterNameForFilterMenuComponent = () => {
		if (isNotFilteredByOwner) {
			return activeCustomFilter?.name ?? '';
		}

		if (activeOwnerFilter == null) {
			return translator.gettext('Everyone');
		}

		return activeOwnerFilter.name ?? '';
	};

	const getActiveFilterCustomViewForFilterMenuComponent = () => {
		if (isNotFilteredByOwner) {
			return activeCustomFilter?.customView?.legacyID ?? '';
		}

		return null;
	};

	return {
		type: isNotFilteredByOwner ? 'filter' : activeTeamFilter ? 'team' : 'user',
		value: getActiveFilterValueForFilterMenuComponent(),
		name: getActiveFilterNameForFilterMenuComponent(),
		custom_view_id: getActiveFilterCustomViewForFilterMenuComponent(),
	};
};
