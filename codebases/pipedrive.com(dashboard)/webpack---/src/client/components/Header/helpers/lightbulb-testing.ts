import { useMemo } from 'react';

// Must match with test/constants.js in proactive-feed-ui
export const prefix = 'sales-assistant-lightbulb';

// Must match with test/components/lightbulb/constants.js
// in proactive-feed-ui
export const states = {
	default: 'default',
	highlighted: 'highlighted',
	selected: 'selected',
};

interface Props {
	isSidebarOpen: boolean;
	isBulbActive: boolean;
}

export function getStateName({ isSidebarOpen, isBulbActive }: Props): string {
	const { highlighted, selected } = states;

	if (isSidebarOpen) {
		return selected;
	}

	if (isBulbActive) {
		return highlighted;
	}

	return states.default;
}

export function getDataTestID(props: Props): string {
	const stateName = getStateName(props);

	return `${prefix}--${stateName}`;
}

export function useDataTestID({ isSidebarOpen, isBulbActive }: Props): string {
	return useMemo(() => {
		return getDataTestID({ isSidebarOpen, isBulbActive });
	}, [isSidebarOpen, isBulbActive]);
}
