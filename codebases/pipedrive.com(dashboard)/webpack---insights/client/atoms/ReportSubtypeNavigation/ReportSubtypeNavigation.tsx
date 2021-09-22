import React from 'react';
import { useTranslator } from '@pipedrive/react-utils';
import { types as insightsTypes } from '@pipedrive/insights-core';
import {
	ButtonGroup,
	Button,
	InlineInfo,
} from '@pipedrive/convention-ui-react';

import {
	getReportTypeLabels,
	getCurrentReportParentType,
	getReportParentTypeLabels,
} from '../../utils/reportTypeUtils';
import localState from '../../utils/localState';
import { ReportSettingsSubtype } from '../../types/apollo-query-types';

import styles from './ReportSubtypeNavigation.pcss';

interface ReportSubtypeNavigationProps {
	currentReportType: insightsTypes.ReportType;
	reportOriginalType: insightsTypes.ReportType;
	isEditing: boolean;
	isNew: boolean;
	reportId: string;
	toggleDialog: Function;
}

const ReportSubtypeNavigation: React.FC<ReportSubtypeNavigationProps> = ({
	currentReportType,
	reportOriginalType,
	isEditing,
	isNew,
	reportId,
	toggleDialog,
}) => {
	const translator = useTranslator();
	const {
		setDefaultSettingsToUnsavedReport,
		resetUnsavedReport,
		getReportParentType,
	} = localState();
	const currentReportParentType =
		getCurrentReportParentType(currentReportType);

	const handleSubtypeChange =
		(newSubtype: insightsTypes.ReportType) => () => {
			const { newTitle } = getReportTypeLabels(newSubtype, translator);

			if (newSubtype === currentReportType) {
				return false;
			}

			if (isEditing) {
				const shouldUseSavedParameters =
					newSubtype === reportOriginalType && !isNew;
				const callback = () =>
					shouldUseSavedParameters
						? resetUnsavedReport(reportId)
						: setDefaultSettingsToUnsavedReport(
								newSubtype,
								newTitle,
						  );

				return toggleDialog(callback);
			}

			return setDefaultSettingsToUnsavedReport(newSubtype, newTitle);
		};

	const renderReportSubtypeNavigation = () => {
		const { subtypes } = getReportParentType(currentReportType);

		if (!subtypes || subtypes.length <= 1) {
			return null;
		}

		return (
			<ButtonGroup className={styles.buttonGroup}>
				{subtypes.map(
					({ subtype, isAvailable }: ReportSettingsSubtype) => {
						const { subtypeLabel } = getReportTypeLabels(
							subtype,
							translator,
						);

						return isAvailable ? (
							<Button
								onClick={handleSubtypeChange(subtype)}
								active={subtype === currentReportType}
								key={subtype}
								data-test={`subtype-navigation-${subtypeLabel}`}
							>
								{subtypeLabel}
							</Button>
						) : null;
					},
				)}
			</ButtonGroup>
		);
	};

	const renderInfoTooltip = () => {
		const { info } = getReportParentTypeLabels(
			currentReportParentType,
			translator,
		);

		if (!info) {
			return null;
		}

		return (
			<div className={styles.inlineInfoWrapper}>
				<InlineInfo
					text={info}
					placement="top-start"
					portalTo={document.body}
				/>
			</div>
		);
	};

	return (
		<>
			{renderReportSubtypeNavigation()}
			{renderInfoTooltip()}
		</>
	);
};

export default ReportSubtypeNavigation;
