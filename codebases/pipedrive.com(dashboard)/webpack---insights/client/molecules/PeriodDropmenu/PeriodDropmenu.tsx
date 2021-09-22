import React, { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { get } from 'lodash';
import { types as insightsTypes, periods } from '@pipedrive/insights-core';
import { useTranslator } from '@pipedrive/react-utils';
import { Select, Separator } from '@pipedrive/convention-ui-react';

import useFilterState from '../FiltersApplied/useFilterState';
import { FilterTypenameType } from '../../utils/constants';
import { Goal } from '../../types/goals';
import { Report } from '../../types/apollo-query-types';
import { getPeriodTranslations } from '../../utils/labels';

import styles from './PeriodDropmenu.pcss';

interface PeriodDropmenuProps {
	report: Report;
	goal: Goal;
}

const PeriodDropmenu: React.FC<PeriodDropmenuProps> = ({ report, goal }) => {
	const translator = useTranslator();
	const translatedPeriods = useMemo(
		() => getPeriodTranslations(translator),
		[],
	);
	const appliedFilters = get(report, 'unsavedReport.parameters.filter_by');
	const { editReportFilter } = useFilterState(appliedFilters);
	const unsavedReportPeriod =
		report?.unsavedReport?.parameters?.filter_by[0]?.period;

	const [activeFilter, setActiveFilter] = useState(null);

	useEffect(() => {
		if (unsavedReportPeriod !== undefined) {
			setActiveFilter(unsavedReportPeriod);
		}
	}, [unsavedReportPeriod]);

	const updatePeriod = (newValue: string) => {
		if (newValue === 'custom') {
			const duration = goal?.duration;

			editReportFilter(0, {
				operands: [
					{
						defaultValue: duration.start,
						name: insightsTypes.OperandType.FROM,
					},
					{
						defaultValue: duration.end
							? duration.end
							: moment(Date.parse(duration.start))
									.add(1, 'y')
									.format(periods.dateFormat),
						name: insightsTypes.OperandType.TO,
					},
					{
						defaultValue: periods.gqlDateFormat,
						name: insightsTypes.OperandType.FORMAT,
					},
				],
				period: newValue,
				__typename: FilterTypenameType.SELECTED_FILTER,
			});
		} else {
			editReportFilter(0, {
				operands: periods
					.getTimePeriodDates(newValue)
					.map((period) => ({
						...period,
						__typename: FilterTypenameType.SELECTED_OPERAND,
					})),
				period: newValue,
				__typename: FilterTypenameType.SELECTED_FILTER,
			});
		}
	};

	const renderOptionsBlock = (
		blockName: string,
		blockPeriods: {
			[period: string]: string;
		},
	) => (
		<>
			<Separator type="block">{blockName}</Separator>

			{Object.keys(blockPeriods).map((period) => (
				<Select.Option
					key={period}
					value={period}
					data-test={`period-select-option-${blockPeriods[period]}`}
				>
					{blockPeriods[period]}
				</Select.Option>
			))}
		</>
	);

	return (
		<div
			className={classNames(styles.periodDropmenu)}
			data-test="period-dropmenu"
		>
			<Select
				onChange={updatePeriod}
				portalTo={document.body}
				value={activeFilter}
				filter
				icon={'calendar'}
				placement={'bottom-end'}
				popperProps={{
					modifiers: {
						preventOverflow: { enabled: false },
					},
				}}
				data-test="period-dropmenu"
			>
				{renderOptionsBlock(
					translator.gettext('Relative dates'),
					translatedPeriods.relativeDates,
				)}
				{renderOptionsBlock(
					translator.gettext('Relative periods'),
					translatedPeriods.relativePeriods,
				)}
				{renderOptionsBlock(
					translator.gettext('Rolling periods'),
					translatedPeriods.rollingPeriods,
				)}

				<Separator />
				<Select.Option
					value="custom"
					data-test="period-select-option-custom"
				>
					{translator.gettext('Goal duration')}
				</Select.Option>
			</Select>
		</div>
	);
};

export default PeriodDropmenu;
