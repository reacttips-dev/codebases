import { useTranslator } from '@pipedrive/react-utils';

import { ModalType } from '../../utils/constants';
import { Goal, GoalDataType, GoalType } from '../../types/goals';
import { useUnsavedGoal } from '../goals';
import { ModalView, Entity, SubEntity } from '../../types/modal';
import localState from '../../utils/localState';
import { getWidgetPositionOnDashboard } from '../../utils/styleUtils';
import {
	DashboardActionSource,
	trackDashboardCreated,
	trackDashboardCreationCanceled,
} from '../../utils/metrics/dashboard-analytics';
import { isRevenueGoal } from '../../molecules/GoalDetailsModal/goalDetailsModalUtils';
import { createDashboard } from '../../api/commands/dashboards';
import useRouter from '../useRouter';

interface UseGoalModalAndDialogProps {
	setVisibleModal?: React.Dispatch<React.SetStateAction<ModalType>>;
	goal?: Goal;
}

interface ModalSelectedDataProps {
	dataType: GoalDataType;
	entityType: Entity;
	entitySubType: SubEntity;
}

export default () => {
	const translator = useTranslator();
	const { getCachedReport } = localState();
	const { unsavedGoalUtils } = useUnsavedGoal();
	const [goTo] = useRouter();

	return ({ setVisibleModal, goal }: UseGoalModalAndDialogProps) => {
		const handleAddGoalReportToNewlyCreatedDashboard = async (
			name: string,
		) => {
			const reportId = goal.report_ids[0];
			const response = await createDashboard(name, [
				{
					id: reportId,
					position: getWidgetPositionOnDashboard(
						getCachedReport(reportId).chart_type,
					),
				},
			]);

			goTo({
				id: response.data.createDashboard.id,
				type: 'dashboards',
			});

			setVisibleModal(null);

			trackDashboardCreated(
				response.data.createDashboard.id,
				DashboardActionSource.EXISTING_GOAL,
			);

			setVisibleModal(null);
		};

		const handleGoalTypeSelection = ({
			entitySubType,
			dataType,
		}: ModalSelectedDataProps) => {
			const selectedGoalType = isRevenueGoal(entitySubType as GoalType)
				? entitySubType
				: `${dataType}_${entitySubType}`;
			const unsavedGoalType = unsavedGoalUtils.getGoalType();

			if (selectedGoalType !== unsavedGoalType) {
				unsavedGoalUtils.setDefaultUnsavedGoal(
					selectedGoalType as GoalType,
				);
			}

			setVisibleModal(ModalType.GOAL_CREATE_DETAILS);
		};

		return {
			[ModalType.GOAL_CREATE]: () => ({
				toggleModal: () => setVisibleModal(null),
				isVisible: true,
				type: ModalView.GOALS,
				onSave: handleGoalTypeSelection,
			}),
			[ModalType.DASHBOARD_CREATE_AND_ADD_REPORT]: () => {
				if (!goal) {
					throw Error(
						'Can not add goal to dashboard: goal is undefined',
					);
				}

				return {
					inputValue: '',
					placeholder: translator.gettext('Dashboard name'),
					header: translator.gettext('Add new dashboard'),
					onSave: (name: string) =>
						handleAddGoalReportToNewlyCreatedDashboard(name),
					onCancel: () => {
						setVisibleModal(null);

						trackDashboardCreationCanceled(
							DashboardActionSource.EXISTING_GOAL,
						);
					},
					isVisible: true,
				};
			},
		};
	};
};
