import { useTranslator } from '@pipedrive/react-utils';

import { ModalType } from '../../../utils/constants';
import { Goal } from '../../../types/goals';
import {
	GoalDetailsModalProps,
	OnSaveProps,
} from '../../../molecules/GoalDetailsModal/GoalDetailsModal';
import { getErrorMessage } from '../../../utils/messagesUtils';
import localState from '../../../utils/localState';
import { GET_USER_SETTINGS } from '../../../api/graphql';
import { SettingsApiClient } from '../../../api/apollo/settingsApiClient';
import { isDuplicateGoalError, getDuplicateGoal } from './errorUtils';
import { updateGoal } from '../../../api/commands/goals';
import { FetchPolicy } from '../../../api/apollo/utils';

const useEditGoalOptions = (
	setVisibleModal: React.Dispatch<React.SetStateAction<ModalType>>,
	goal: Goal,
	hideEditButton: () => void,
) => {
	const translator = useTranslator();
	const { removeCachedReport, setCachedReport, getCurrentUserSettings } =
		localState();

	const handleUpdateGoal = async ({
		setError,
		setDuplicateGoal,
		setLoading,
	}: OnSaveProps) => {
		try {
			setLoading(true);
			await updateGoal(goal.id);

			removeCachedReport(goal.report_ids[0]);

			await SettingsApiClient.query({
				query: GET_USER_SETTINGS,
				fetchPolicy: FetchPolicy.NETWORK_ONLY,
			});

			const { reports } = getCurrentUserSettings();
			const updatedReport = reports.find(
				(report) => report.id === goal.report_ids[0],
			);

			setCachedReport(goal.report_ids[0], updatedReport);

			setVisibleModal(null);
			hideEditButton();
		} catch (error) {
			if (isDuplicateGoalError(error)) {
				setDuplicateGoal(getDuplicateGoal(error));
			} else {
				setError(getErrorMessage(translator));
			}
		} finally {
			setLoading(false);
		}
	};

	const getEditGoalOptions = (): GoalDetailsModalProps => {
		return {
			closeModal: () => {
				setVisibleModal(null);
				hideEditButton();
			},
			modalType: 'edit',
			goalId: goal.id,
			onSave: handleUpdateGoal,
		};
	};

	return {
		getEditGoalOptions,
	};
};

export default useEditGoalOptions;
