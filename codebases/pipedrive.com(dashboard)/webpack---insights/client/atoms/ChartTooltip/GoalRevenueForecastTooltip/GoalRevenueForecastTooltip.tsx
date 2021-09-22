import React from 'react';
import classNames from 'classnames';
import { TooltipProps } from 'recharts';
import { useTranslator } from '@pipedrive/react-utils';
import { types as insightsTypes } from '@pipedrive/insights-core';
import { Icon } from '@pipedrive/convention-ui-react';

import { ValueFormat, getFormattedValue } from '../../../utils/valueFormatter';
import useReportOptions from '../../../hooks/useReportOptions';
import { getCustomFieldName } from '../../../utils/filterUtils';
import {
	GOAL_TARGET_DATAKEY,
	isGoalActiveInPeriod,
} from '../../ChartTypes/Column/columnUtils';
import {
	getTotalAmount,
	getFormattedSubtitleValue,
} from '../RevenueForecastTooltip/getTooltipSubtitle';
import { Goal } from '../../../types/goals';

import styles from './GoalRevenueForecastTooltip.pcss';

interface TooltipOwnProps {
	measureByFilter: string;
	goal: Goal;
}

export interface GoalRevenueForecastTooltipProps
	extends TooltipProps,
		TooltipOwnProps {}

const GoalRevenueForecastTooltip = (props: GoalRevenueForecastTooltipProps) => {
	const translator = useTranslator();

	const { active, payload = [], measureByFilter, goal } = props;
	const { duration } = goal;
	const goalPayload = payload?.find(
		(item) => item?.dataKey === GOAL_TARGET_DATAKEY,
	);

	if (
		active &&
		payload.length &&
		isGoalActiveInPeriod(
			duration.start,
			duration.end,
			goalPayload?.payload?.id,
		)
	) {
		const revenuePayload = payload?.filter(
			(item) => item?.dataKey !== GOAL_TARGET_DATAKEY,
		);
		const reverseOrderedRevenuePayload = [...revenuePayload].reverse();

		const { fields } = useReportOptions(insightsTypes.DataType.DEALS);
		const goalAndValueDufference =
			getTotalAmount(reverseOrderedRevenuePayload) -
			Number(goalPayload?.value);

		return (
			<div className={styles.tooltip}>
				<div
					className={styles.tooltipTitle}
					data-test="goal-revenue-tooltip-title"
				>
					{reverseOrderedRevenuePayload?.[0]?.payload?.name}
				</div>

				<div
					className={styles.tooltipRow}
					data-test="goal-revenue-tooltip-target"
				>
					<div className={styles.tooltipRowTitle}>
						<Icon icon="goal" size="s" />

						<span>{translator.gettext('Goal')}</span>
					</div>
					<div className={styles.tooltipRowValue}>
						{getFormattedValue(
							Number(goalPayload?.value),
							ValueFormat.MONETARY,
						)}
					</div>
				</div>

				<div
					className={styles.tooltipRow}
					data-test="goal-revenue-tooltip-total"
				>
					<div className={styles.tooltipRowTitle}>
						<Icon icon="deal" size="s" />

						<span>{translator.gettext('Total')}</span>
					</div>
					<div className={styles.tooltipRowValue}>
						{getFormattedSubtitleValue({
							totalAmount: getTotalAmount(
								reverseOrderedRevenuePayload,
							),
							measureByFilter,
							measureByFilterName: getCustomFieldName(
								fields,
								measureByFilter,
							),
						})}
					</div>
				</div>

				<div
					className={styles.tooltipIndentedRow}
					data-test="goal-revenue-tooltip-indented-row"
				>
					{reverseOrderedRevenuePayload.map((item, index) => {
						return (
							<div
								className={styles.tooltipIndentedSubrow}
								key={index}
								data-test="goal-revenue-tooltip-indented-item"
							>
								<div className={styles.tooltipSubrowTitle}>
									<div
										className={styles.dot}
										style={{ background: item.color }}
									/>
									<div>{item.name}</div>
								</div>
								<div className={styles.tooltipSubrowValue}>
									{getFormattedValue(
										Number(item.value),
										ValueFormat.MONETARY,
									)}
								</div>
							</div>
						);
					})}
				</div>

				<div
					className={styles.tooltipFooter}
					data-test="goal-revenue-tooltip-footer"
				>
					<div className={styles.tooltipFooterTitle}>
						{translator.gettext('Difference')}
					</div>
					<div
						className={classNames({
							[styles.tooltipNegativeDifference]:
								getTotalAmount(reverseOrderedRevenuePayload) <
								goalPayload.value,
							[styles.tooltipPositiveDifference]:
								getTotalAmount(reverseOrderedRevenuePayload) >=
								goalPayload.value,
						})}
						data-test="goal-revenue-tooltip-value-difference"
					>
						{getFormattedValue(
							goalAndValueDufference,
							ValueFormat.MONETARY,
						)}
					</div>
				</div>
			</div>
		);
	}

	return null;
};

export default GoalRevenueForecastTooltip;
