import { useTranslator } from '@pipedrive/react-utils';

import { stringToLocaleString } from '../../utils/dateFormatter';
import { getFormattedValue, ValueFormat } from '../../utils/valueFormatter';
import {
	getIntervalLabel,
	getGoalTypeLabel,
	isActivityGoal,
	isRevenueGoal,
} from '../../molecules/GoalDetailsModal/goalDetailsModalUtils';
import {
	Goal,
	AssigneeType,
	TrackingMetric,
	GoalDataKey,
} from '../../types/goals';
import {
	getActivityTypeById,
	getPipelineById,
	getStageById,
	getTeamById,
	getUserById,
} from '../../api/webapp';

interface UseGoalCardProps {
	goal: Goal;
}

const useGoalCard = ({ goal }: UseGoalCardProps) => {
	if (!goal) {
		return {};
	}

	const translator = useTranslator();

	enum Icon {
		PERSON = 'person',
		TEAM = 'ac-meeting',
		COMPANY = 'organization',
		DEAL = 'deal',
		PIPELINE = 'pipeline',
		INTERVAL = 'calendar',
		DURATION = 'timeline',
		EXPECTED_OUTCOME = 'goal',
	}

	const goalType = goal.type.name;

	const isActivityTypeGoal = isActivityGoal(goalType);
	const isRevenueForecastTypeGoal = isRevenueGoal(goalType);

	const getAssigneeField = () => {
		const {
			assignee: { type, id },
		} = goal;

		const ASSIGNEE_ICONS = {
			[AssigneeType.PERSON]: Icon.PERSON,
			[AssigneeType.TEAM]: Icon.TEAM,
			[AssigneeType.COMPANY]: Icon.COMPANY,
		};

		const assigneeFieldData = {
			icon: ASSIGNEE_ICONS[type],
			tooltipText: translator.gettext('Assignee'),
		};

		let assigneeName: string;

		switch (type) {
			case AssigneeType.COMPANY:
				assigneeName = translator.gettext('Everyone');
				break;
			case AssigneeType.PERSON:
				assigneeName = getUserById(id)?.name;
				break;
			case AssigneeType.TEAM:
				assigneeName = getTeamById(id)?.name;
				break;
			default:
				assigneeName = '';
				break;
		}

		return {
			...assigneeFieldData,
			label: assigneeName,
		};
	};

	const getTypeField = () => {
		const { type } = goal;

		const typeFieldData = {
			icon: Icon.DEAL,
			label: getGoalTypeLabel(goalType, translator),
			tooltipText: translator.gettext('Goal type'),
		};

		if (isActivityTypeGoal) {
			const activity = getActivityTypeById(type.params.activity_type_id);

			return {
				...typeFieldData,
				icon: `ac-${activity?.icon_key}`,
				label: `${typeFieldData.label} (${activity?.name})`,
			};
		}

		if (isRevenueForecastTypeGoal) {
			return {
				...typeFieldData,
				icon: 'revenue-recurring',
			};
		}

		return typeFieldData;
	};

	const getPipelineField = () => {
		const {
			type: {
				params: { pipeline_id: pipelineId, stage_id: stageId },
			},
		} = goal;

		const pipelineName =
			getPipelineById(pipelineId)?.name ||
			translator.gettext('All pipelines');

		const stageName = getStageById(stageId)?.name;

		return {
			icon: Icon.PIPELINE,
			label: stageName ? `${pipelineName}, ${stageName}` : pipelineName,
			tooltipText: translator.gettext('Pipeline'),
		};
	};

	const getIntervalField = () => {
		const { interval } = goal;

		return {
			icon: Icon.INTERVAL,
			label: getIntervalLabel(interval, translator),
			tooltipText: translator.gettext('Goal Interval'),
		};
	};

	const getDurationField = () => {
		const {
			duration: { start, end },
		} = goal;

		const endDateLabel = end
			? stringToLocaleString(end)
			: translator.gettext('No end date');

		return {
			icon: Icon.DURATION,
			label: `${stringToLocaleString(start)} - ${endDateLabel}`,
			tooltipText: translator.gettext('Goal duration'),
		};
	};

	const getExpectedOutcomeField = () => {
		const { expected_outcome: expectedOutcome } = goal;

		const { tracking_metric: trackingMetric, target } = expectedOutcome;
		const isMonetary = trackingMetric === TrackingMetric.VALUE;

		const getOutcomeLabel = () => {
			if (isMonetary) {
				return getFormattedValue(target, ValueFormat.MONETARY);
			}

			if (isActivityTypeGoal) {
				return translator.ngettext(
					'%s activity',
					'%s activities',
					target,
					getFormattedValue(target, ValueFormat.COUNT),
				);
			}

			return translator.ngettext(
				'%s deal',
				'%s deals',
				target,
				getFormattedValue(target, ValueFormat.COUNT),
			);
		};

		return {
			icon: Icon.EXPECTED_OUTCOME,
			label: getOutcomeLabel(),
			tooltipText: translator.gettext('Expected outcome'),
		};
	};

	return {
		[GoalDataKey.ASSIGNEE]: getAssigneeField(),
		[GoalDataKey.TYPE]: getTypeField(),
		[GoalDataKey.PIPELINE]: getPipelineField(),
		[GoalDataKey.INTERVAL]: getIntervalField(),
		[GoalDataKey.DURATION]: getDurationField(),
		[GoalDataKey.EXPECTED_OUTCOME]: getExpectedOutcomeField(),
	};
};

export default useGoalCard;
