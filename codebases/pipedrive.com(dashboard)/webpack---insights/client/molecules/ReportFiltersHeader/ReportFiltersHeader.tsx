import React, { useCallback, useRef, useEffect, useState } from 'react';
import { get } from 'lodash';
import { withSize } from 'react-sizeme';
import { Panel, Icon, Button, Spacing } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import { getWidgetFilterLabels } from '../../utils/labels';
import useReportOptions from '../../hooks/useReportOptions';
import CollapsingList from '../CollapsingList';

import styles from './ReportFiltersHeader.pcss';

interface ReportFiltersHeaderOwnProps {
	canSeeCurrentReport: boolean;
	report: any;
	setFilterAppliedExpanded: any;
	isFiltersBlockExpanded: boolean;
}

interface ReactSizeMeProps {
	size: {
		width: number;
	};
}

interface ReportFiltersHeaderProps
	extends ReportFiltersHeaderOwnProps,
		ReactSizeMeProps {}

const ReportFiltersHeader: React.FC<ReportFiltersHeaderProps> = ({
	report,
	setFilterAppliedExpanded,
	isFiltersBlockExpanded,
	size,
}) => {
	const translator = useTranslator();
	const reportDataType = report.data_type;
	const { filters } = useReportOptions(reportDataType);
	const filtersNumberTitle = useRef<HTMLInputElement>();
	const [widthsArray, setWidthsArray] = useState(0);

	const appliedFilters = get(report, 'unsavedReport.parameters.filter_by');
	const collapsButtonWidth = 64;
	const filtersListSummaryPadding = 64;

	const filterData = appliedFilters.map((filter: any) => {
		return getWidgetFilterLabels(filters, filter, translator);
	});

	const renderTogglePanel = useCallback(() => {
		return (
			<Button
				onClick={() =>
					setFilterAppliedExpanded(!isFiltersBlockExpanded)
				}
			>
				<Icon
					icon={isFiltersBlockExpanded ? 'collapse' : 'expand'}
					size="s"
					className={styles.icon}
				/>
			</Button>
		);
	}, [isFiltersBlockExpanded]);

	useEffect(() => {
		const outerWidth =
			filtersNumberTitle.current.getBoundingClientRect().width;

		setWidthsArray(
			size.width -
				outerWidth -
				collapsButtonWidth -
				filtersListSummaryPadding,
		);
	}, [size]);

	const renderPanelHeader = useCallback(() => {
		return (
			<Spacing horizontal="m" top="s">
				<div style={{ position: 'relative' }}>
					<div className={styles.header}>
						<div
							ref={filtersNumberTitle}
							className={styles.panelTitle}
							data-test="reports-filters-panel-header"
						>
							<Icon
								icon="filter"
								color="black"
								className={styles.panelIcon}
							/>
							<div className={styles.filtersCountTitle}>
								{translator.ngettext(
									'%d filter applied',
									'%d filters applied',
									appliedFilters?.length,
									appliedFilters?.length,
								)}
							</div>
						</div>
						<div className={styles.headerActions}>
							<div style={{ width: `${widthsArray}px` }}>
								<CollapsingList
									data={filterData}
									alignment="right"
								/>
							</div>
							{renderTogglePanel()}
						</div>
					</div>
				</div>
			</Spacing>
		);
	}, [appliedFilters, isFiltersBlockExpanded, widthsArray]);

	return (
		<Spacing horizontal="m" top="m">
			<Panel
				noBorder
				elevation="01"
				className={styles.panel}
				spacing="none"
			>
				{renderPanelHeader()}
			</Panel>
		</Spacing>
	);
};

export default withSize()(ReportFiltersHeader);
