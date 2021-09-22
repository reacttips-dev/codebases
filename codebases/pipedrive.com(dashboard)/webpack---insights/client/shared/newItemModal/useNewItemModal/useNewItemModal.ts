import { useState } from 'react';

import { Entity, SharedAddModalView, SubEntity } from '../../../types/modal';
import { useUnsavedGoal } from '../../../hooks/goals';
import {
	getGoalEntity,
	getGoalEntitySubtype,
	getGoalDataType,
} from './newItemModalUtils';
import { NEW_GOAL_ID } from '../../../utils/constants';

interface UseNewItemModalProps {
	type: SharedAddModalView;
}

const useNewItemModal = ({ type }: UseNewItemModalProps) => {
	const { unsavedGoalUtils } = useUnsavedGoal(NEW_GOAL_ID);

	const getDefaultEntity = (): Entity => {
		if (type === SharedAddModalView.GOALS) {
			const goalType = unsavedGoalUtils.getGoalType();

			return getGoalEntity(goalType);
		}

		return Entity.ACTIVITY;
	};

	const getDefaultEntitySubType = (): SubEntity => {
		if (type === SharedAddModalView.GOALS) {
			const goalType = unsavedGoalUtils.getGoalType();

			return getGoalEntitySubtype(getDefaultEntity(), goalType);
		}

		return null;
	};

	const getDefaultDataType = () => {
		if (type === SharedAddModalView.GOALS) {
			const goalType = unsavedGoalUtils.getGoalType();

			return getGoalDataType(goalType);
		}

		return null;
	};

	const [selectedEntityType, setSelectedEntityType] = useState<Entity>(
		getDefaultEntity(),
	);
	const [selectedEntitySubType, setSelectedEntitySubType] =
		useState<SubEntity>(getDefaultEntitySubType());
	const [selectedDataType, setSelectedDataType] = useState(
		getDefaultDataType(),
	);

	return {
		selectedEntityType,
		setSelectedEntityType,
		selectedEntitySubType,
		setSelectedEntitySubType,
		selectedDataType,
		setSelectedDataType,
	};
};

export default useNewItemModal;
