import UnreachableCaseError from 'Errors/UnreachableCaseError';

import { ContextValueType } from './LeadboxFiltersContext';

export type LeadsFilterState = {
	readonly labels: Array<string>;
	readonly owners: Array<string>;
	readonly sources: Array<string>;
	readonly filterID: string | null;
	readonly isActive: boolean;
	readonly initialized: boolean;
};
export type LeadsFilterAction =
	| { type: 'ownerToggle'; ownerID: string | null }
	| { type: 'sourceToggle'; sourceID: string | null }
	| { type: 'labelToggle'; labelID: string | null }
	| { type: 'filterChange'; filterID: string | null }
	| { type: 'initialize'; params: ContextValueType['get']['filter'] }
	| { type: 'reset' };

/**
 * []       <- aa
 * [aa]     <- bb
 * [aa, bb] <- aa
 * [bb]     <- null
 * []
 */
function toggleArrayValue<T extends string>(array: Array<T>, value: T | null): Array<T> {
	if (value === null) {
		return [];
	}

	return array.includes(value) ? array.filter((el) => el !== value) : [...array, value];
}

export const defaultFilter: LeadsFilterState = {
	labels: [],
	owners: [],
	sources: [],
	filterID: null,
	isActive: false,
	initialized: false,
};

function isActive(state: Pick<LeadsFilterState, 'labels' | 'owners' | 'sources' | 'filterID'>): boolean {
	// NB: this doesn't take into account status since it doesn't make the filter context active
	// per say (it's rather a different mode and can be inactive when in archive for example).
	return state.labels.length > 0 || state.owners.length > 0 || state.sources.length > 0 || state.filterID !== null;
}

export function leadboxFiltersContextReducer(state: LeadsFilterState, action: LeadsFilterAction): LeadsFilterState {
	let modifiedState = state;

	switch (action.type) {
		case 'ownerToggle':
			modifiedState = {
				...state,
				owners: action.ownerID ? [action.ownerID] : [],
				filterID: null, // we can set owner OR filter ID but not both
			};
			break;
		case 'sourceToggle':
			modifiedState = {
				...state,
				sources: toggleArrayValue(state.sources, action.sourceID),
			};
			break;
		case 'initialize': {
			const newStateParams = {
				sources: action.params.sources,
				labels: action.params.labels,
				owners: action.params.owner ? [action.params.owner] : [],
				filterID: action.params.filter,
			};
			modifiedState = {
				...state,
				...newStateParams,
			};
			break;
		}
		case 'labelToggle':
			modifiedState = {
				...state,
				labels: toggleArrayValue(state.labels, action.labelID),
			};
			break;
		case 'filterChange':
			modifiedState = {
				...state,
				owners: [], // we can set owner OR filter ID but not both
				filterID: action.filterID,
			};
			break;
		case 'reset':
			modifiedState = defaultFilter;
			break;
		default:
			throw new UnreachableCaseError(action);
	}

	return {
		...modifiedState,
		initialized: true,
		isActive: isActive(modifiedState),
	};
}
