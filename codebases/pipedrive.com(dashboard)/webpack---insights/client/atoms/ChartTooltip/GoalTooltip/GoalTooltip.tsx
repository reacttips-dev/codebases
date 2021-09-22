import React from 'react';
import classNames from 'classnames';
import { useTranslator } from '@pipedrive/react-utils';
import { Icon } from '@pipedrive/convention-ui-react';

import { Goal, TrackingMetric } from '../../../types/goals';
import { getFormattedValue, ValueFormat } from '../../../utils/valueFormatter';
import { getActivityTypeById } from '../../../api/webapp';
import {
	getGoalTypeLabel,
	isActivityGoal,
	isDealGoal,
} from '../../../molecules/GoalDetailsModal/goalDetailsModalUtils';
import { isGoalActiveInPeriod } from '../../ChartTypes/Column/columnUtils';

import styles from './GoalTooltip.pcss';

interface RechartsTooltipProps {
	payload?: any;
	label?: string;
}

interface TooltipOwnProps {
	goal: Goal;
}

export interface GoalChartTooltipProps
	extends TooltipOwnProps,
		RechartsTooltipProps {}

const GoalTooltip = (props: GoalChartTooltipProps) => {
	const translator = useTranslator();
	const { goal, payload, label } = props;
	const valuePayload = payload.find(
		(value: any) => !value?.dataKey?.startsWith('goal'),
	);
	const goalPayload = payload.find((goal: any) =>
		goal?.dataKey?.startsWith('goal'),
	);

	const {
		expected_outcome: {
			target: goalTarget,
			tracking_metric: goalTrackingMetric,
		},
		type: {
			name: typeName,
			params: { activity_type_id: activityTypeId },
		},
		duration,
	} = goal;
	const valueFormat =
		goalTrackingMetric === TrackingMetric.VALUE
			? ValueFormat.MONETARY
			: ValueFormat.COUNT;

	const getFormattedTooltipValue = (value: number) =>
		getFormattedValue(value, valueFormat);

	const value = valuePayload?.value || 0;
	const difference = value - goalTarget;
	const formattedGoalValue = getFormattedTooltipValue(goalTarget);
	const formattedValue = getFormattedTooltipValue(value);
	const formattedDifference = getFormattedTooltipValue(difference);
	const goalTypeLabel = getGoalTypeLabel(typeName, translator);

	const getGoalTypeIcon = () => {
		if (isDealGoal(typeName)) {
			return <Icon icon="deal" size="s" />;
		}

		if (isActivityGoal(typeName) && activityTypeId) {
			const iconKey = getActivityTypeById(activityTypeId)?.icon_key;
			const icon = iconKey ? `ac-${iconKey}` : 'calendar';

			return <Icon icon={icon} size="s" />;
		}

		return null;
	};

	return (
		isGoalActiveInPeriod(
			duration.start,
			duration.end,
			goalPayload?.payload?.id,
		) && (
			<div className={styles.tooltip}>
				<div className={styles.tooltipTitle}>{label}</div>
				<div className={styles.tooltipRow}>
					<div className={styles.tooltipRowTitle}>
						<Icon icon="goal" size="s" />

						<span>{translator.gettext('Goal')}</span>
					</div>
					<div>
						<div data-test="column-goal-value">
							{formattedGoalValue}
						</div>
					</div>
				</div>
				<div className={styles.tooltipRow}>
					<div className={styles.tooltipRowTitle}>
						{getGoalTypeIcon()}
						<span>{goalTypeLabel}</span>
					</div>
					<div>
						<div data-test="column-value">{formattedValue}</div>
					</div>
				</div>
				<div className={styles.tooltipFooter}>
					<div className={styles.tooltipFooterTitle}>
						{translator.gettext('Difference')}
					</div>
					<div>
						<div
							className={classNames({
								[styles.tooltipNegativeDifference]:
									value < goalTarget,
								[styles.tooltipPositiveDifference]:
									value >= goalTarget,
							})}
							data-test="column-value-difference"
						>
							{formattedDifference}
						</div>
					</div>
				</div>
			</div>
		)
	);
};

export default GoalTooltip;
