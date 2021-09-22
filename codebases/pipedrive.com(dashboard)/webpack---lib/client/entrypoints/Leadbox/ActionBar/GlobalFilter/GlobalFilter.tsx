import React, { useContext, useMemo } from 'react';
import { LeadboxFiltersContext } from 'Leadbox/LeadboxFiltersContext';
import { createFragmentContainer, graphql, useRelayEnvironment } from '@pipedrive/relay';
import { useExternalComponent } from 'Hooks/useExternalComponent';
import {
	FiltersCoachmarkWrapper,
	CUSTOM_FILTERS_COACHMARK_TAG,
	TEAM_FILTERING_COACHMARK_TAG,
} from 'Leadbox/ActionBar/GlobalFilter/CustomFiltersCoachmarkWrapper';
import { UserSettingFilterKeys } from 'Leadbox/UserSettingFilterKeys';
import { useSetUserSettingMutation } from 'Leadbox/ActionBar/SetUserSettingMutation';
import { useUnselectLead } from 'Hooks/useUnselectLead';
import { VisibleTo } from 'Components/MenuLeadActions/Options/hooks/__generated__/useArchiveLeadMutation.graphql';
import { useFeatureFlags } from 'Hooks/useFeatureFlags';
import { useTranslator } from '@pipedrive/react-utils';

import { fetchFilterByInternalId } from './fetchFilterByInternalId';
import { useUpdateFilter } from './useUpdateFilter';
import { useActiveFilterForFilterMenuComponent } from './useActiveFilterForFilterMenuComponent';
import { useGetFilterIdFromUserSettings } from './useGetFilterIdFromUserSettings';
import { FilterType, FilterValue, useFilterModals } from './useFilterModal';
import type { GlobalFilter_data } from './__generated__/GlobalFilter_data.graphql';

enum VisibleToOptions {
	PRIVATE = '1',
	SHARED = '3',
	SHARED_BELOW = '5',
	GLOBAL = '7',
}

type Props = {
	readonly data: GlobalFilter_data;
};

const GlobalFilterWithoutData: React.FC<Props> = ({ data }) => {
	const translator = useTranslator();

	const inboxFilters = useContext(LeadboxFiltersContext);
	const setUserSetting = useSetUserSettingMutation();
	const FilterMenuComponent = useExternalComponent(
		'filter-components:filters-menu', // https://github.com/pipedrive/filter-components
	);
	const unselectLead = useUnselectLead();
	const RelayEnvironment = useRelayEnvironment();
	const { deleteFilter, addTemporaryFilter, removeTemporaryFilter } = useUpdateFilter();
	const getFilterIdFromUserSettings = useGetFilterIdFromUserSettings();
	const activeFilterForFilterMenuComponent = useActiveFilterForFilterMenuComponent({
		userFilters: data.users,
		customFilters: data.filters,
		activeFilter: inboxFilters.get.filter,
		teams: data.teams,
	});
	const [LEADS_FILTERING_BY_TEAMS, TEAMS] = useFeatureFlags(['LEADS_FILTERING_BY_TEAMS', 'TEAMS']);

	const filterHelper = useMemo(() => {
		return {
			getUserFilterById: (filterId: string | undefined) => data.users?.find((filter) => filter?.id === filterId),
			getUserFilterByValue: (filterValue: FilterValue['value']) =>
				data.users?.find((filter) => Number(filter?.legacyID) === Number(filterValue)),
			getTeamFilterById: (filterId: string | undefined) => data.teams?.find((filter) => filter?.id === filterId),
			getTeamFilterByValue: (filterValue: FilterValue['value']) =>
				data.teams?.find((filter) => Number(filter?.legacyID) === Number(filterValue)),
			getCustomFilterById: (filterId: string | undefined) =>
				data.filters?.find((filter) => filter?.id === filterId),
			getCustomFilterByValue: (filterValue: FilterValue['value']) =>
				data.filters?.find((filter) => Number(filter?.legacyID) === Number(filterValue)),
		};
	}, [data]);

	const setInboxFilter = (filterId: string | undefined) => {
		if (filterHelper.getCustomFilterById(filterId)) {
			inboxFilters.set.customFilter(filterId ?? null);
		} else if (filterHelper.getUserFilterById(filterId)) {
			inboxFilters.set.userFilter(filterId ?? null);
		} else if (filterHelper.getTeamFilterById(filterId)) {
			inboxFilters.set.userFilter(filterId ?? null);
		}
	};

	const applyCustomFilter = (filterId: string | undefined, isTemp: boolean) => {
		inboxFilters.set.customFilter(filterId ?? null);
		if (!isTemp) {
			setUserSetting(UserSettingFilterKeys.FILTER, filterId ?? null);
		}
	};

	const { handleAddNewFilter, handleEditFilter } = useFilterModals({
		onFilterReset() {
			removeTemporaryFilter();
			setInboxFilter(getFilterIdFromUserSettings());
		},
		async onFilterUpdate(updatedFilter) {
			const filter = await fetchFilterByInternalId(RelayEnvironment, Number(updatedFilter.value));

			applyCustomFilter(filter?.id, updatedFilter.isTemp);

			if (updatedFilter.isTemp && filter && !filterHelper.getCustomFilterById(filter.id)) {
				addTemporaryFilter(filter?.id);
			} else {
				removeTemporaryFilter();
			}
		},
		async onFilterRemoved(removedFilter, fallbackFilter) {
			removeTemporaryFilter();
			const removedFilterInternalId = removedFilter.value;
			const fallbackFilterInternalId = fallbackFilter.value;

			const filterIdFromUserSettings = getFilterIdFromUserSettings();
			const savedCustomFilter = filterHelper.getCustomFilterById(filterIdFromUserSettings);
			const savedUserFilter = filterHelper.getUserFilterById(filterIdFromUserSettings);
			const savedTeamFilter = filterHelper.getTeamFilterById(filterIdFromUserSettings);
			const savedFilterInternalId = Number(
				savedCustomFilter?.legacyID || savedUserFilter?.legacyID || savedTeamFilter?.legacyID,
			);

			if (removedFilterInternalId === savedFilterInternalId) {
				const newFilter = await fetchFilterByInternalId(RelayEnvironment, Number(fallbackFilterInternalId));
				const newFilterId = newFilter?.id;
				setInboxFilter(newFilterId);
				setUserSetting(UserSettingFilterKeys.FILTER, newFilterId ?? null);
			} else {
				setInboxFilter(filterIdFromUserSettings);
				const filterToRemove = filterHelper.getCustomFilterByValue(removedFilter.value);
				filterToRemove && deleteFilter(filterToRemove?.id);
			}
		},
		async saveFilterAsNew(updatedFilter) {
			const filter = await fetchFilterByInternalId(RelayEnvironment, Number(updatedFilter.value));
			removeTemporaryFilter();
			applyCustomFilter(filter?.id, false);
		},
	});

	const mapVisibility = (visibleTo: VisibleTo | null): VisibleToOptions => {
		switch (visibleTo) {
			case 'PRIVATE':
				return VisibleToOptions.PRIVATE;
			case 'SHARED':
				return VisibleToOptions.SHARED;
			case 'SHARED_BELOW':
				return VisibleToOptions.SHARED_BELOW;
			default:
				return VisibleToOptions.GLOBAL;
		}
	};

	// eslint-disable-next-line complexity
	const handleFilterChange = (filterType: FilterType, filterValue: FilterValue) => {
		const value = filterValue.value;

		if (filterType === 'user' && filterValue.value === 'everyone') {
			inboxFilters.set.userFilter(null);
			setUserSetting(UserSettingFilterKeys.FILTER, null);
		} else if (filterType === 'user') {
			const filter = filterHelper.getUserFilterByValue(value);
			inboxFilters.set.userFilter(filter?.id ?? null);
			setUserSetting(UserSettingFilterKeys.FILTER, filter?.id ?? null);
		} else if (filterType === 'team') {
			const filter = filterHelper.getTeamFilterByValue(value);
			inboxFilters.set.userFilter(filter?.id ?? null);
			setUserSetting(UserSettingFilterKeys.FILTER, filter?.id ?? null);
		} else if (filterType === 'filter') {
			const filter = filterHelper.getCustomFilterByValue(value);
			inboxFilters.set.customFilter(filter?.id ?? null);
			setUserSetting(UserSettingFilterKeys.FILTER, filter?.id ?? null);
		}

		unselectLead();
	};

	if (FilterMenuComponent === null) {
		return null;
	}

	return (
		<FiltersCoachmarkWrapper
			appearance={{
				placement: 'bottomLeft',
				zIndex: 3,
			}}
			tag={CUSTOM_FILTERS_COACHMARK_TAG}
			content={translator.gettext('Create your own private or shared custom filters')}
			render={(closeCustomFiltersCoachmark) => {
				const handleCustomFiltersPopupVisibleChange = (isVisible: boolean) => {
					if (isVisible) {
						closeCustomFiltersCoachmark();
					}
				};

				return (
					<FiltersCoachmarkWrapper
						disabled={!LEADS_FILTERING_BY_TEAMS || !TEAMS || !data.teams?.length}
						appearance={{
							placement: 'bottomLeft',
							zIndex: 3,
						}}
						tag={TEAM_FILTERING_COACHMARK_TAG}
						content={translator.gettext(
							'You can now filter the leads based on what teams they are assigned to',
						)}
						render={(closeTeamFiltersCoachmark) => {
							const handleTeamFiltersPopupVisibleChange = (isVisible: boolean) => {
								if (isVisible) {
									closeTeamFiltersCoachmark();
								}
							};

							return (
								<FilterMenuComponent
									onSelectFilter={handleFilterChange}
									type="lead"
									activeFilter={activeFilterForFilterMenuComponent}
									excludeTeams={!LEADS_FILTERING_BY_TEAMS}
									filters={data.filters?.map((filter) => ({
										id: Number(filter?.legacyID),
										name: filter?.name,
										value: Number(filter?.legacyID),
										visible_to: mapVisibility(filter?.visibleTo ?? null),
										user_id: Number(filter?.user?.legacyID),
										custom_view_id: Number(filter?.customView?.legacyID),
									}))}
									onAddNewFilter={handleAddNewFilter}
									onEditFilter={handleEditFilter}
									onPopupVisibleChange={(isVisible: boolean) => {
										handleCustomFiltersPopupVisibleChange(isVisible);
										handleTeamFiltersPopupVisibleChange(isVisible);
									}}
								/>
							);
						}}
					/>
				);
			}}
		/>
	);
};

export const GlobalFilter = createFragmentContainer(GlobalFilterWithoutData, {
	data: graphql`
		fragment GlobalFilter_data on RootQuery @argumentDefinitions(teamsFeature: { type: "Boolean!" }) {
			users {
				id
				legacyID: id(opaque: false)
				name
			}
			teams @include(if: $teamsFeature) {
				id
				legacyID: id(opaque: false)
				name
			}
			filters {
				id
				legacyID: id(opaque: false)
				name
				visibleTo
				user {
					id
					legacyID: id(opaque: false)
				}
				customView {
					legacyID: id(opaque: false)
				}
			}
		}
	`,
});
