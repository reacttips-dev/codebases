import { useContext } from 'react';
import { FrootModals } from '@pipedrive/types/dist/froot';
import { WebappApiContext } from 'Components/WebappApiContext';
import { useExternalComponent } from 'Hooks/useExternalComponent';

export type FilterType = 'user' | 'filter' | 'team';

// { "filter_type": "user", "name": "User Name 2", "value": 10382877, …}
// { "filter_type": "user", "name": "Todos", "value": "everyone", …}
// { "filter_type": "filter", "name": "Leads with email", "value": "4083", …}
export type FilterValue = {
	readonly favorite: boolean;
	readonly filter_type: FilterType;
	readonly name: string;
	readonly value: string | number;
};

type Filter = {
	readonly type: FilterType;
	readonly value: FilterValue['value'];
	readonly name: string;
};

interface UpdatedFilter extends Filter {
	readonly isEdit: boolean;
	readonly isTemp: boolean;
	readonly updated: boolean;
	readonly custom_view_id: number;
}

interface RemovedFilter {
	type: FilterType;
	value: number;
}

type FilterModals = {
	onFilterUpdate?: (updatedFilter: UpdatedFilter) => void;
	onFilterReset?: () => void;
	onFilterRemoved?: (removedFilter: RemovedFilter, fallbackFilter: RemovedFilter) => void;
	saveFilterAsNew?: (updatedFilter: UpdatedFilter) => void;
};

export const useFilterModals = ({ onFilterReset, onFilterUpdate, onFilterRemoved, saveFilterAsNew }: FilterModals) => {
	const { createEmptyFiltersCollection, modelCollectionFactory } = useContext(WebappApiContext);
	const modals = useExternalComponent<FrootModals>('froot:modals');

	const handleAddNewFilter = () => {
		modals?.open('webapp:modal', {
			modal: 'filter/add',
			params: {
				filtersCollection: createEmptyFiltersCollection(),
				filterType: 'lead',
				onFilterUpdate,
				onFilterReset,
			},
		});
	};

	const handleEditFilter = (filter: UpdatedFilter) => {
		modals?.open('webapp:modal', {
			modal: 'filter/add',
			params: {
				filtersCollection: createEmptyFiltersCollection(),
				filterType: 'lead',
				filterModel: modelCollectionFactory.getModel('filter', {
					id: Number(filter.value),
					custom_view_id: filter.custom_view_id,
				}),
				onFilterUpdate,
				onFilterReset,
				onFilterRemoved,
				saveFilterAsNew,
			},
		});
	};

	return {
		handleEditFilter,
		handleAddNewFilter,
	};
};
