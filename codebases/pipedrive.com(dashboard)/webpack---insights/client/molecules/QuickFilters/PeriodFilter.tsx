import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { types as insightsTypes } from '@pipedrive/insights-core';
import { useTranslator } from '@pipedrive/react-utils';
import { Button, Icon, Popover } from '@pipedrive/convention-ui-react';

import { FilterDateRangeSelect } from '../../atoms/ReportFilterFields';
import { trackDashboardQuickFiltersApplied } from '../../utils/metrics/dashboard-analytics';
import { QuickFilters } from '../../types/apollo-query-types';
import { QuickFilterDateType } from '../../utils/quickFilterUtils';
import { stringToLocaleString } from '../../utils/dateFormatter';
import { updateQuickFilters } from '../../api/commands/quick-filters';
import { getFlatPeriodTranslations } from '../../utils/labels/staticLabels';

import styles from './QuickFilters.pcss';

interface PeriodFilterProps {
	dashboardId: string;
	quickFilters: QuickFilters;
}

const PeriodFilter: React.FC<PeriodFilterProps> = ({
	dashboardId,
	quickFilters,
}) => {
	const translator = useTranslator();
	const [activeFilter, setActiveFilter] = useState(null);
	const [isPopoverVisible, setPopoverVisible] = useState(false);
	const hasPeriodFilter = activeFilter !== null;

	useEffect(() => {
		if (quickFilters?.period !== undefined) {
			setActiveFilter(quickFilters?.period);
		}
	}, [quickFilters?.period]);

	const updateQuickFilter = (period: insightsTypes.Filter) => {
		setActiveFilter(period ? period.period : null);

		updateQuickFilters({
			dashboardId,
			period,
			user: quickFilters?.user || null,
		});
	};

	const updatePeriod = (period: insightsTypes.Filter) => {
		if (period === null) {
			setActiveFilter(null);
			updateQuickFilter(null);

			return;
		}

		trackDashboardQuickFiltersApplied(
			dashboardId,
			QuickFilterDateType.DATE,
			period.period,
		);

		period.type = 'date';

		updateQuickFilter(period);
	};

	const getButtonTitle = (activeFilter: insightsTypes.Filter) => {
		const filter = activeFilter || quickFilters.period;

		let title = translator.gettext('Period');

		if (filter?.period === 'custom') {
			const notSelectedText = translator.gettext('not selected');
			const startDate =
				stringToLocaleString(filter?.operands[0].defaultValue) ||
				notSelectedText;
			const endDate =
				stringToLocaleString(filter?.operands[1].defaultValue) ||
				notSelectedText;

			title = `${startDate} - ${endDate}`;
		}

		const flatPeriods = getFlatPeriodTranslations(translator);

		if (flatPeriods[filter?.period]) {
			title = flatPeriods[filter.period];
		}

		return title;
	};

	return (
		<div
			className={classNames(styles.periodSelect, {
				[styles.buttonWithOutBorderRadius]: hasPeriodFilter,
			})}
			data-test="quick-filter-period-select"
		>
			<Popover
				portalTo={document.body}
				placement="bottom-end"
				spacing={{ horizontal: 's', vertical: 's' }}
				visible={isPopoverVisible}
				onPopupVisibleChange={() => setPopoverVisible(false)}
				toggleOnTriggerClick={false}
				content={
					<div className={styles.popover}>
						{
							<>
								<FilterDateRangeSelect
									data={quickFilters.period}
									onFilterChange={(period) =>
										updatePeriod(period)
									}
									canSeeCurrentReport={true}
								/>
							</>
						}
					</div>
				}
			>
				<Button
					active={hasPeriodFilter}
					onClick={() => {
						setPopoverVisible(true);
					}}
				>
					<Icon icon="calendar" size="s" />
					{getButtonTitle(activeFilter)}
					<Icon icon="triangle-down" size="s" />
				</Button>
			</Popover>

			{hasPeriodFilter && (
				<Button
					className={styles.removeButton}
					onClick={() => updatePeriod(null)}
					active
					data-test="remove-period-quick-filter"
				>
					<Icon icon="cross" size="s" />
				</Button>
			)}
		</div>
	);
};

export default PeriodFilter;
