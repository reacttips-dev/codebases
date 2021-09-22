import React, { useMemo, useReducer } from 'react';

import { defaultFilter, leadboxFiltersContextReducer } from './LeadboxFiltersContextReducer';

export type InboxFilter = {
	readonly filter: string | null;
	readonly labels: Array<string>;
	readonly owner: string | null;
	readonly sources: Array<string>;
};

export type ContextValueType = {
	readonly set: {
		// new filters:
		readonly userFilter: (ownerID: string | null) => void;
		readonly sourceFilter: (sourceID: string | null) => void;
		readonly labelsFilter: (labelID: string | null) => void;
		readonly customFilter: (filterID: string | null) => void;
		readonly initialize: (params: ContextValueType['get']['filter']) => void;
	};
	readonly reset: () => void;
	readonly get: {
		readonly filter: InboxFilter;
	};
	readonly is: {
		readonly active: boolean;
		readonly initialized: boolean;
	};
};

const noop = () => {}; // eslint-disable-line @typescript-eslint/no-empty-function

export const defaultValue = {
	set: {
		all: noop,
		archived: noop,
		status: noop,

		// new filters:
		userFilter: noop,
		sourceFilter: noop,
		labelsFilter: noop,
		customFilter: noop,
		initialize: noop,
	},
	reset: noop,
	get: {
		filter: {
			filter: defaultFilter.filterID,
			labels: defaultFilter.labels,
			owner: defaultFilter.owners[0] ?? null,
			sources: defaultFilter.sources,
		},
	},
	is: {
		active: false,
		all: false,
		archived: false,
		initialized: false,
	},
};

export const LeadboxFiltersContext = React.createContext<ContextValueType>(defaultValue);

export const LeadboxFiltersProvider: React.FC = ({ children }) => {
	const [reducer, dispatch] = useReducer(leadboxFiltersContextReducer, defaultFilter);

	const contextValue = {
		set: {
			// new filters:
			userFilter: (ownerID: string | null) => {
				dispatch({ type: 'ownerToggle', ownerID });
			},
			sourceFilter: (sourceID: string | null) => {
				dispatch({ type: 'sourceToggle', sourceID });
			},
			labelsFilter: (labelID: string | null) => {
				dispatch({ type: 'labelToggle', labelID });
			},
			customFilter: (filterID: string | null) => {
				dispatch({ type: 'filterChange', filterID });
			},
			initialize: (params: ContextValueType['get']['filter']) => {
				dispatch({ type: 'initialize', params });
			},
		},
		reset: () => dispatch({ type: 'reset' }),
		get: {
			// This matches 1:1 GraphQL `LeadsFilter` type for convenience
			filter: useMemo(
				() => ({
					filter: reducer.filterID,
					labels: reducer.labels,
					owner: reducer.owners[0] ?? null,
					sources: reducer.sources,
				}),
				[reducer.filterID, reducer.labels, reducer.owners, reducer.sources],
			),
		},
		is: {
			active: reducer.isActive,
			initialized: reducer.initialized,
		},
	};

	return <LeadboxFiltersContext.Provider value={contextValue}>{children}</LeadboxFiltersContext.Provider>;
};
