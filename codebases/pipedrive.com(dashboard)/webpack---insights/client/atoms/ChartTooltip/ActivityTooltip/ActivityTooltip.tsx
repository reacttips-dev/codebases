import React from 'react';
import { types as insightsTypes } from '@pipedrive/insights-core';
import { useTranslator } from '@pipedrive/react-utils';

import { hasTypeAsSegmentInActivityReport } from '../../../utils/helpers';
import ActivityIcon from '../../../atoms/ActivityIcon';
import {
	getActivityChartTooltipItems,
	ActivityChartTooltipItem,
	getTooltipTitle,
} from './activityTooltipUtils';
import { getActivityTypeIconKey } from '../../../utils/activityHelpers';

import styles from './ActivityTooltip.pcss';

interface RechartsTooltipProps {
	active?: boolean;
	payload?: any;
}

interface TooltipOwnProps {
	groupByFilter: string;
	segmentByFilter: string;
	hasSegment: boolean;
	measureByFilter: string;
}

export interface ActivityChartTooltipProps
	extends TooltipOwnProps,
		RechartsTooltipProps {}

const ActivityTooltip = (props: ActivityChartTooltipProps) => {
	const translator = useTranslator();
	const {
		payload,
		groupByFilter,
		segmentByFilter,
		hasSegment,
		measureByFilter,
		active,
	} = props;

	if (!payload || !payload.length) {
		return <div />;
	}

	const hasTypeGrouping = hasTypeAsSegmentInActivityReport({
		reportType: insightsTypes.ReportType.ACTIVITIES_STATS,
		hasSegment,
		segmentByFilter,
		groupByFilter,
	});
	const title = getTooltipTitle({
		segmentByFilter,
		measureByFilter,
		payload,
		translator,
	});
	const tooltipItems = getActivityChartTooltipItems({
		payload,
		labelPrefixPath: 'name',
		dotColorPath: 'fill',
		measureByFilter,
		translator,
	});

	const getItemWithActivityIcon = (item: ActivityChartTooltipItem) => {
		const activityTypeIcon = getActivityTypeIconKey(item.key);

		return (
			<>
				<ActivityIcon icon={activityTypeIcon} color={item.dotColor} />
				<div>{item.label}</div>
			</>
		);
	};

	const getItemWithColouredDot = (item: ActivityChartTooltipItem) => {
		return (
			<>
				<div
					className={styles.dotWithoutIndentation}
					style={{ background: item.dotColor }}
				/>
				<div>{item.label}</div>
			</>
		);
	};

	return (
		active && (
			<div className={styles.tooltip}>
				{title && <div className={styles.tooltipTitle}>{title}</div>}
				{tooltipItems.map(
					(item: ActivityChartTooltipItem, index: number) => (
						<div
							className={styles.tooltipItemContainer}
							key={index}
						>
							{hasTypeGrouping
								? getItemWithActivityIcon(item)
								: getItemWithColouredDot(item)}
						</div>
					),
				)}
			</div>
		)
	);
};

export default ActivityTooltip;
