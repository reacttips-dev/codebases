import { openModal, createEmptyFiltersCollection, createFilterModel, getCurrentUserId } from './index';
import { FiltersActionsType } from '../../../actions/filters';
import { ViewTypes } from '../../../utils/constants';

export const addNewActivityModal = ({
	dealId,
	personId,
	orgId,
	next,
	onsave = null,
}: {
	dealId: number;
	personId: number;
	orgId: number;
	next: boolean;
	onsave?: (model: Partial<Pipedrive.Activity>) => void;
}) => {
	openModal({
		modal: 'activity/add',
		params: {
			deal: dealId,
			person: personId,
			organization: orgId,
			next,
			onsave,
		},
	});
};

export const editActivityModal = ({
	activity,
	onsave = null,
}: {
	activity: Pipedrive.Activity;
	onsave?: (model: Partial<Pipedrive.Activity>) => void;
}) => {
	openModal({
		modal: 'activity/edit',
		params: {
			activity: activity.id,
			onsave,
		},
	});
};
interface UpdatedFilter {
	isEdit: boolean;
	isTemp: boolean;
	name: string;
	type: 'filter';
	updated: boolean;
	value: number;
}

interface RemovedFilter {
	type: 'filter' | 'user';
	value: number;
}

const createFilterObject = (callbackFilter: UpdatedFilter) => {
	return {
		id: callbackFilter.value,
		value: callbackFilter.value,
		name: callbackFilter.name,
		user_id: getCurrentUserId(),
		// The callback object actually does not include whether filter is private or shared, so let's
		// hardcore it and after refresh it will fix itself.
		visible_to: 1,
	};
};

export const openAddNewFilterModal = (
	selectedFilter: Pipedrive.SelectedFilter,
	actions: FiltersActionsType,
	viewType: ViewTypes,
) =>
	openModal({
		modal: 'filter/add',
		params: {
			filtersCollection: createEmptyFiltersCollection(),
			filterType: 'deal',
			onFilterUpdate(filter: UpdatedFilter) {
				if (filter.isTemp) {
					actions.setTemporarySelectedFilter(
						{
							type: 'filter',
							name: filter.name,
							value: filter.value,
						},
						viewType,
					);
				} else {
					actions.addFilter(createFilterObject(filter));

					actions.setSelectedFilter(
						{
							type: 'filter',
							name: filter.name,
							value: filter.value,
						},
						viewType,
					);
				}
			},
			onFilterReset() {
				actions.setSelectedFilter(selectedFilter, viewType);
			},
		},
	});

export const editFilterModal = (
	id: number,
	selectedFilter: Pipedrive.SelectedFilter,
	actions: FiltersActionsType,
	viewType: ViewTypes,
) =>
	openModal({
		modal: 'filter/add',
		params: {
			filtersCollection: createEmptyFiltersCollection(),
			filterType: 'deal',
			filterModel: createFilterModel(id),
			onFilterUpdate(filter: UpdatedFilter) {
				if (filter.updated) {
					actions.updateFilter(createFilterObject(filter));
				}

				if (filter.isTemp) {
					actions.setTemporarySelectedFilter(
						{
							type: 'filter',
							name: filter.name,
							value: filter.value,
						},
						viewType,
					);
				} else if (filter.updated) {
					actions.setSelectedFilter(
						{
							type: 'filter',
							name: filter.name,
							value: filter.value,
						},
						viewType,
					);
				}
			},
			onFilterReset() {
				actions.setSelectedFilter(selectedFilter, viewType);
			},
			onFilterRemoved(filter: RemovedFilter, defaultFilter: RemovedFilter) {
				actions.removeFilter(filter.value);

				if (filter.value === Number(selectedFilter.value) && selectedFilter.type === 'filter') {
					actions.setSelectedFilter(
						{
							type: defaultFilter.type,
							value: defaultFilter.value,
						},
						viewType,
					);
				}
			},
			saveFilterAsNew(filter: UpdatedFilter) {
				actions.addFilter(createFilterObject(filter));
			},
		},
	});
