import React, { useState } from 'react';
import { useReactiveVar } from '@apollo/client';
import { Spacing } from '@pipedrive/convention-ui-react';

import {
	UNBLOCKED_MODAL_TYPES,
	DialogType,
	ModalType,
} from '../utils/constants';
import localState from '../utils/localState';
import useBlockNavigation from '../hooks/useBlockNavigation';
import usePlanPermissions from '../hooks/usePlanPermissions';
import ReportActionBar from './actionBar/ReportActionBar';
import ReportFiltersHeader from '../molecules/ReportFiltersHeader';
import FiltersApplied from '../molecules/FiltersApplied';
import VisualBuilder from '../molecules/VisualBuilder';
import { cachedReportsVar } from '../api/vars/insightsApi';
import { findCachedReportById } from '../utils/reportsUtils';
import { ReportId } from '../types/report-options';
import ReportCreationErrorMessage from '../atoms/ReportCreationErrorMessage';
import { getCappings } from '../api/commands/capping';
import {
	getReportsLimitData,
	showCappingFeatures,
} from '../shared/featureCapping/cappingUtils';

import styles from './Report.pcss';

interface ReportProps {
	reportId: ReportId;
}

const Report: React.FC<ReportProps> = ({ reportId }) => {
	const { setCachedReport } = localState();
	const cachedReports = useReactiveVar(cachedReportsVar);
	const cachedReport = findCachedReportById(
		reportId,
		cachedReports,
		setCachedReport,
	);

	const [visibleModal, setVisibleModal] = useState<ModalType>(null);
	const [visibleDialog, setVisibleDialog] = useState<DialogType>();

	const isEditing = cachedReport?.unsavedReport?.is_editing || false;
	const isNew = cachedReport?.is_new || false;

	useBlockNavigation({
		isBlocked:
			(isNew || isEditing) &&
			!UNBLOCKED_MODAL_TYPES.includes(visibleModal),
		onNavigate: () =>
			setVisibleDialog(
				isNew
					? DialogType.REPORT_DISCARD
					: DialogType.REPORT_DISCARD_CHANGES,
			),
	});

	const { canSeeReport } = usePlanPermissions();
	const canSeeCurrentReport = canSeeReport(cachedReport);
	const { getCurrentUserSettings } = localState();
	const { reports } = getCurrentUserSettings();
	const { cap: cappingLimit } = getCappings();

	const reportLimits = getReportsLimitData(reports, cappingLimit);
	const {
		numberOfReports,
		hasReachedReportsLimit,
		isNearReportsLimit,
		limitAsString,
	} = reportLimits;
	const [visibleWarning, setVisibleWarning] = useState<boolean>(
		hasReachedReportsLimit,
	);

	const [isFiltersBlockExpanded, setIsFilterAppliedExpanded] =
		useState(canSeeCurrentReport);

	const showCappingWarning =
		showCappingFeatures(hasReachedReportsLimit) &&
		isEditing &&
		hasReachedReportsLimit &&
		visibleWarning;

	return (
		<div className={styles.reportWrapper}>
			<div className={styles.stickyHeader}>
				{showCappingWarning && (
					<ReportCreationErrorMessage
						numberOfReports={numberOfReports}
						hasReachedReportsLimit={hasReachedReportsLimit}
						isNearReportsLimit={isNearReportsLimit}
						showLimitForSaveAsNew={true}
						limitAsString={limitAsString}
						onClose={() => setVisibleWarning(false)}
					/>
				)}
				<ReportActionBar
					isNew={isNew}
					isEditing={isEditing}
					report={cachedReport}
					canSeeCurrentReport={canSeeCurrentReport}
					visibleDialog={visibleDialog}
					setVisibleDialog={setVisibleDialog}
					visibleModal={visibleModal}
					setVisibleModal={setVisibleModal}
					reportLimits={reportLimits}
				/>
				<ReportFiltersHeader
					canSeeCurrentReport={canSeeCurrentReport}
					report={cachedReport}
					setFilterAppliedExpanded={setIsFilterAppliedExpanded}
					isFiltersBlockExpanded={isFiltersBlockExpanded}
				/>
			</div>
			<Spacing left="m" right="m" bottom="m" top="none">
				<FiltersApplied
					canSeeCurrentReport={canSeeCurrentReport}
					report={cachedReport}
					isFiltersBlockExpanded={isFiltersBlockExpanded}
				/>
				<VisualBuilder report={cachedReport} />
			</Spacing>
		</div>
	);
};

export default React.memo(Report);
