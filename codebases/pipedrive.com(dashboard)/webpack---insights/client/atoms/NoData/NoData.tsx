import React, { useMemo } from 'react';
import classnames from 'classnames';
import { Panel, Icon, Spinner } from '@pipedrive/convention-ui-react';
import { types as insightsTypes } from '@pipedrive/insights-core';
import { useTranslator } from '@pipedrive/react-utils';

import {
	getAvailableReportChartTypes,
	getAvailableReportTableTypeNames,
	TableTypeKey,
} from '../../utils/reportTypeUtils';

import styles from './NoData.pcss';

interface NoDataProps {
	loading: boolean;
	reportType: insightsTypes.ReportType;
	dataType: insightsTypes.DataType;
	chartType: insightsTypes.ChartType;
	isGoalsReport?: boolean;
}

const NoData: React.FC<NoDataProps> = ({
	loading,
	reportType,
	chartType,
	dataType,
	isGoalsReport,
}) => {
	const translator = useTranslator();

	const message = (
		<div className={styles.messageContainer}>
			{translator.gettext('No results found with applied conditions')}{' '}
			<Icon icon="warning" size="s" color="yellow" />
		</div>
	);

	const availableChartTypes = useMemo(
		() =>
			getAvailableReportChartTypes({
				translator,
				reportType,
				isGoalsReport,
			}),
		[reportType],
	);

	const availableTableTypes = useMemo(
		() =>
			getAvailableReportTableTypeNames({
				translator,
				chartType,
				dataType,
			}),
		[chartType, dataType],
	);

	return (
		<>
			<Panel
				className={classnames(styles.noData, {
					[styles['is-loading']]: loading,
				})}
				spacing="m"
			>
				<div className={styles.iconContainer}>
					{availableChartTypes.map((chartType) => {
						return (
							<Icon key={chartType.icon} icon={chartType.icon} />
						);
					})}
					{loading && <Spinner size="s" light />}
				</div>
				{!loading && message}
			</Panel>
			<Panel
				className={classnames(styles.noData, {
					[styles['is-loading']]: loading,
				})}
			>
				<div className={styles.tabsContainer}>
					{Object.keys(availableTableTypes).map(
						(tableType: TableTypeKey) => (
							<span key={availableTableTypes[tableType]}>
								{availableTableTypes[tableType]}
							</span>
						),
					)}
					{loading && <Spinner size="s" light />}
				</div>
				{!loading && message}
			</Panel>
		</>
	);
};

export default React.memo(NoData);
