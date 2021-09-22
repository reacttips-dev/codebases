import { useTranslator } from '@pipedrive/react-utils';

import { DialogType } from '../../utils/constants';
import localState from '../../utils/localState';
import { Goal } from '../../types/goals';
import { SettingsApiClient } from '../../api/apollo/settingsApiClient';
import { GET_USER_SETTINGS } from '../../api/graphql';
import { deleteGoal } from '../../api/commands/goals';
import { resetUnsavedGoalCache } from '../../api/vars/unsavedGoalCache';
import { snackbarMessageVar } from '../../api/vars/settingsApi';
import { FetchPolicy } from '../../api/apollo/utils';
import { getRouter } from '../../api/webapp';

interface UseGoalModalAndDialogProps {
	setVisibleDialog?: React.Dispatch<React.SetStateAction<DialogType>>;
	goal?: Goal;
}

export default () => {
	const translator = useTranslator();
	const router = getRouter();
	const { resetUnsavedReport } = localState();

	const discardGoal = async (
		setVisibleDialog: (dialogType: DialogType) => void,
	) => {
		router.restoreBlockedNavigation();
		router.unblockNavigation();

		setVisibleDialog(null);
		resetUnsavedGoalCache();
	};

	return ({ setVisibleDialog, goal }: UseGoalModalAndDialogProps) => {
		return {
			[DialogType.GOAL_DELETE]: () => {
				if (!goal) {
					throw Error('Can not delete goal: goal is undefined');
				}

				return {
					labels: {
						title: `${translator.pgettext(
							'Are you sure you want to delete the goal [goal name]?',
							'Are you sure you want to delete the goal %s?',
							goal.name,
						)}`,
						message: `${translator.gettext(
							"Deleted goals can't be restored later. This goal will also disappear from dashboards and for other users that may see it.",
						)}`,
						cancelButtonText: translator.gettext('Cancel'),
						agreeButtonText: translator.gettext('Delete goal'),
					},
					onDiscard: async () => {
						await deleteGoal(goal.id);

						await SettingsApiClient.query({
							query: GET_USER_SETTINGS,
							fetchPolicy: FetchPolicy.NETWORK_ONLY,
						});

						setVisibleDialog(null);

						snackbarMessageVar(
							translator.pgettext(
								'[Goal name] goal has been deleted',
								'%s goal has been deleted',
								goal.name,
							),
						);
					},
					onCancel: () => {
						setVisibleDialog(null);
					},
					isVisible: true,
				};
			},
			[DialogType.GOAL_DISCARD_CHANGES]: () => ({
				labels: {
					title: translator.gettext('Discard changes'),
					message: translator.gettext(
						'Are you sure you want to discard changes to this goal chart?',
					),
					cancelButtonText: translator.gettext('Continue editing'),
					agreeButtonText: translator.gettext('Discard changes'),
				},
				onDiscard: async () => {
					resetUnsavedReport(goal?.report_ids?.[0]);
					setVisibleDialog(null);

					router.restoreBlockedNavigation();
				},
				onCancel: () => setVisibleDialog(null),
				isVisible: true,
			}),
		};
	};
};
