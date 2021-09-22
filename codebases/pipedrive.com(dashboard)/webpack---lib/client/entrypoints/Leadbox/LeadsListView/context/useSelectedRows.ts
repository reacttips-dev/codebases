import { useCallback, useMemo, useReducer } from 'react';

export const LEADS_BULK_MAX_LIMIT = 500;

type SelectedMode = 'NONE' | 'PARTIAL_INCLUDING' | 'PARTIAL_EXCLUDING' | 'ALL';

type State = {
	ids: string[];
	mode: SelectedMode;
	totalLeads: number;
	totalSelected: number;
};

interface SetMode {
	(mode: Extract<SelectedMode, 'PARTIAL_INCLUDING' | 'PARTIAL_EXCLUDING'>, ids: string[]): void;
	(mode: Extract<SelectedMode, 'ALL' | 'NONE'>): void;
}

type Actions =
	| {
			type: Extract<SelectedMode, 'PARTIAL_INCLUDING' | 'PARTIAL_EXCLUDING'>;
			ids: string[];
			totalLeads: number;
	  }
	| { type: Extract<SelectedMode, 'ALL' | 'NONE'>; totalLeads: number }
	| { type: 'RESET' };

export type UseSelectedRows = {
	selectedIds: string[];
	selectedMode: SelectedMode;
	setMode: SetMode;
	hasRowSelected: boolean;
	isAboveTheLimit: boolean;
	totalSelected: number;
	totalLeads: number;
	reset: () => void;
};

const reducer = (state: State, action: Actions): State => {
	switch (action.type) {
		case 'NONE':
		case 'RESET':
			return {
				...state,
				mode: 'NONE',
				ids: [],
				totalLeads: 0,
				totalSelected: 0,
			};

		case 'PARTIAL_EXCLUDING':
			return {
				...state,
				mode: 'PARTIAL_EXCLUDING',
				ids: action.ids,
				totalLeads: action.totalLeads,
				totalSelected: Math.min(action.totalLeads, LEADS_BULK_MAX_LIMIT) - action.ids?.length,
			};
		case 'PARTIAL_INCLUDING':
			return {
				...state,
				mode: action.type,
				ids: action.ids ?? [],
				totalLeads: action.totalLeads,
				totalSelected: action.ids.length,
			};

		case 'ALL':
			return {
				...state,
				mode: 'ALL',
				ids: [],
				totalLeads: action.totalLeads,
				totalSelected: Math.min(action.totalLeads, LEADS_BULK_MAX_LIMIT),
			};

		default:
			return state;
	}
};

export const useSelectedRows = ({ totalLeads }: { totalLeads: number }): UseSelectedRows => {
	const [state, dispatch] = useReducer(reducer, { ids: [], mode: 'NONE', totalLeads, totalSelected: 0 });

	const setMode: SetMode = useCallback(
		(mode: SelectedMode, ids?: string[]) => {
			if (mode === 'ALL' || mode === 'NONE') {
				dispatch({ type: mode, totalLeads });
			} else {
				if (!ids) {
					throw new Error(`should contain ids with the mode selected: ${mode}`);
				}
				dispatch({ type: mode, ids, totalLeads });
			}
		},
		[totalLeads],
	);

	const reset = () => {
		dispatch({ type: 'RESET' });
	};

	const values = useMemo(() => {
		const hasRowSelected = state.mode !== 'NONE';
		const isAboveTheLimit = totalLeads > LEADS_BULK_MAX_LIMIT && state.totalSelected >= LEADS_BULK_MAX_LIMIT;

		return {
			reset,
			hasRowSelected,
			isAboveTheLimit,
			selectedIds: state.ids,
			selectedMode: state.mode,
			totalSelected: state.totalSelected,
			totalLeads: state.totalLeads,
			setMode,
		};
	}, [state, totalLeads, setMode]);

	return values;
};
