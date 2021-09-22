import { useTranslator } from '@pipedrive/react-utils';

import { ModalType, NEW_GOAL_ID } from '../../../utils/constants';
import {
	GoalDetailsModalProps,
	OnSaveProps,
} from '../../../molecules/GoalDetailsModal/GoalDetailsModal';
import { getErrorMessage } from '../../../utils/messagesUtils';
import { GET_USER_SETTINGS } from '../../../api/graphql';
import { SettingsApiClient } from '../../../api/apollo/settingsApiClient';
import { isDuplicateGoalError, getDuplicateGoal } from './errorUtils';
import { addGoal } from '../../../api/commands/goals';
import useRouter from '../../useRouter';
import { FetchPolicy } from '../../../api/apollo/utils';

const useAddGoalOptions = (
	setVisibleModal: React.Dispatch<React.SetStateAction<ModalType>>,
) => {
	const [goTo] = useRouter();
	const translator = useTranslator();

	const handleAddGoal = async ({
		setError,
		setDuplicateGoal,
		setLoading,
	}: OnSaveProps) => {
		try {
			setLoading(true);

			const {
				data: { addGoal: newGoal },
			} = await addGoal();

			await SettingsApiClient.query({
				query: GET_USER_SETTINGS,
				fetchPolicy: FetchPolicy.NETWORK_ONLY,
			});

			goTo({
				id: newGoal?.id,
				type: 'goals',
			});

			setVisibleModal(null);
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

	const getAddGoalOptions = (): GoalDetailsModalProps => {
		return {
			closeModal: () => setVisibleModal(null),
			modalType: 'create',
			goalId: NEW_GOAL_ID,
			onSave: handleAddGoal,
			onBack: () => setVisibleModal(ModalType.GOAL_CREATE),
		};
	};

	return {
		getAddGoalOptions,
	};
};

export default useAddGoalOptions;
