import { makeVar } from '@apollo/client';

import { Goal } from '../../types/goals';

export interface UnsavedGoal extends Goal {
	isNew?: boolean;
	isEditing?: boolean;
}

export const initialUnsavedGoal: UnsavedGoal = {
	name: null,
	isNew: false,
	isEditing: false,
	type: {
		name: null,
		params: {
			pipeline_id: null,
			activity_type_id: null,
		},
	},
	assignee: {
		type: null,
		id: null,
	},
	expected_outcome: {
		target: null,
		tracking_metric: null,
		currency_id: null,
	},
	interval: null,
	duration: {
		start: null,
		end: null,
	},
};

export const unsavedGoalCache = makeVar<UnsavedGoal>(initialUnsavedGoal);

export const getUnsavedGoalCache = () => {
	return unsavedGoalCache();
};

export const setUnsavedGoalCache = (newValue: UnsavedGoal) => {
	return unsavedGoalCache(newValue);
};

export const resetUnsavedGoalCache = () => {
	return unsavedGoalCache(initialUnsavedGoal);
};
