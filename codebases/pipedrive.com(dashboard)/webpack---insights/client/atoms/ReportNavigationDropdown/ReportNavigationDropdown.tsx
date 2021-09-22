import React from 'react';
import { useTranslator } from '@pipedrive/react-utils';
import { types as insightsTypes } from '@pipedrive/insights-core';
import { Button, Dropmenu, Icon } from '@pipedrive/convention-ui-react';

import localState from '../../utils/localState';
import { ReportParentType } from '../../utils/constants';
import {
	getReportTypeLabels,
	getReportParentTypeLabels,
	isTheSameParentType,
	getCurrentReportParentType,
	getReportTypesUnderSameEntity,
} from '../../utils/reportTypeUtils';
import ReportTypesList from '../../atoms/ReportTypesList';
import { getReportIcon } from '../../utils/styleUtils';
import { ReportSettingsType } from '../../types/apollo-query-types';

interface ReportNavigationDropdownProps {
	currentReportType: insightsTypes.ReportType;
	reportOriginalType: insightsTypes.ReportType;
	isEditing: boolean;
	isNew: boolean;
	reportId: string;
	toggleDialog: Function;
	canSeeCurrentReport?: boolean;
}

interface HandleTypeChangeProps {
	dataType: insightsTypes.DataType;
	defaultType: insightsTypes.ReportType;
}

const ReportNavigationDropdown: React.FC<ReportNavigationDropdownProps> = ({
	currentReportType,
	reportOriginalType,
	isEditing,
	isNew,
	reportId,
	toggleDialog,
	canSeeCurrentReport,
}) => {
	const translator = useTranslator();
	const {
		getReportTypes,
		setDefaultSettingsToUnsavedReport,
		resetUnsavedReport,
	} = localState();
	const { reportTypes } = getReportTypes();
	const currentReportParentType =
		getCurrentReportParentType(currentReportType);
	const { title } = getReportParentTypeLabels(
		currentReportParentType,
		translator,
	);
	const currentEntityReportTypes = getReportTypesUnderSameEntity(
		currentReportParentType,
		translator,
	);
	/**
	 * As adding Revenue Growth reports is disabled, we still need to
	 * show the correct report type for the existing Revenue Growth reports.
	 */
	const availableReportTypes = reportTypes.filter(
		(reportType: ReportSettingsType) => {
			const availableReportType =
				reportType.isAvailable &&
				currentEntityReportTypes?.includes(reportType.type);

			const isRevenueMovementReportType =
				currentReportType ===
				insightsTypes.ReportType.DEALS_RECURRING_REVENUE_MOVEMENT;

			if (isRevenueMovementReportType) {
				return availableReportType;
			}

			return (
				availableReportType &&
				reportType.type !== ReportParentType.RECURRING_REVENUE_MOVEMENT
			);
		},
	);

	const handleTypeChange = ({ defaultType }: HandleTypeChangeProps) => {
		if (isTheSameParentType(defaultType, currentReportType)) {
			return false;
		}

		const { newTitle } = getReportTypeLabels(defaultType, translator);

		if (isEditing) {
			const shouldUseSavedParameters =
				defaultType === reportOriginalType && !isNew;
			const callback = () =>
				shouldUseSavedParameters
					? resetUnsavedReport(reportId)
					: setDefaultSettingsToUnsavedReport(defaultType, newTitle);

			return toggleDialog(callback);
		}

		return setDefaultSettingsToUnsavedReport(defaultType, newTitle);
	};

	return (
		<Dropmenu
			content={
				<ReportTypesList
					reportTypes={availableReportTypes}
					currentReportType={currentReportType}
					onChange={handleTypeChange}
				/>
			}
			closeOnClick
			popoverProps={{
				placement: 'bottom-start',
				portalTo: document.body,
			}}
		>
			<Button
				disabled={!canSeeCurrentReport}
				data-test="report-navigation-dropdown-button"
			>
				<Icon
					icon={getReportIcon({ reportType: currentReportType })}
					size="s"
				/>
				{title}
				<Icon icon="triangle-down" />
			</Button>
		</Dropmenu>
	);
};

export default ReportNavigationDropdown;
