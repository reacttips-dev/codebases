import React, { useState, useEffect, useRef } from 'react';
import {
	Modal,
	Button,
	Spacing,
	Input,
	Checkbox,
	// @ts-ignore;
} from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import {
	prepareReportObject,
	mergeReportWithUnsavedReport,
	getValueFromUnsavedOrOriginalReport,
} from '../../../utils/reportObjectHelpers';
import {
	hasMaximumAmountOfReportsInDashboard,
	isNameInputValid,
} from '../../../utils/helpers';
import {
	NAME_MAX_LENGTH,
	PERMISSION_TYPES,
	MAX_REPORTS_IN_DASHBOARD,
} from '../../../utils/constants';
import { getWidgetPositionOnDashboard } from '../../../utils/styleUtils';
import {
	trackDashboardCreated,
	DashboardActionSource,
} from '../../../utils/metrics/dashboard-analytics';
import {
	trackReportCreated,
	ReportActionSource,
} from '../../../utils/metrics/report-analytics';
import useSettingsApi from '../../../hooks/useSettingsApi';
import localState from '../../../utils/localState/index';
import usePlanPermissions from '../../../hooks/usePlanPermissions';
import NewDashboardFromInput from './newDashboardFromInput/NewDashboardFromInput';
import { Dashboard, Report } from '../../../types/apollo-query-types';
import { getErrorMessage } from '../../../utils/messagesUtils';
import { createDashboard } from '../../../api/commands/dashboards';
import { getEditableItems } from '../../../utils/sharingUtils';
import ReportCreationErrorMessage from '../../../atoms/ReportCreationErrorMessage';
import { getCappings } from '../../../api/commands/capping';
import {
	getReportsLimitData,
	showCappingFeatures,
} from '../../../shared/featureCapping/cappingUtils';

import styles from './ReportSaveModal.pcss';

interface DashboardCheckboxesProps extends Dashboard {
	isChecked: boolean;
	isMaximumReportsReached: boolean;
}

const prepareDashboards = (dashboards: Dashboard[], currentUserId: number) => {
	const editableDashboards = getEditableItems(dashboards, currentUserId);

	return editableDashboards.map((dashboard: Dashboard, index: number) => {
		return {
			...dashboard,
			isChecked:
				index === 0 &&
				dashboard.reports.length < MAX_REPORTS_IN_DASHBOARD,
			isMaximumReportsReached:
				hasMaximumAmountOfReportsInDashboard(dashboard),
		};
	});
};

const getDashboardsCount = (
	dashboardCheckboxes: DashboardCheckboxesProps[],
) => {
	return dashboardCheckboxes.filter((dashboard) => dashboard.isChecked)
		.length;
};

interface ReportSaveModalProps {
	report: any;
	isVisible: boolean;
	toggleModal: () => void;
	labels: {
		title: string;
		cancelButtonText: string;
		agreeButtonText: string;
	};
	isSave: boolean;
	isSaveAsNew: boolean;
	dashboards: Dashboard[];
	currentUserId: number;
}

const ReportSaveModal: React.FC<ReportSaveModalProps> = ({
	report,
	isVisible = false,
	toggleModal = () => {},
	labels: { title = '', cancelButtonText = '', agreeButtonText = '' } = {},
	isSave = false,
	isSaveAsNew = false,
	dashboards = [],
	currentUserId,
}) => {
	const translator = useTranslator();
	const reportName = getValueFromUnsavedOrOriginalReport(report, 'name');
	const [name, setName] = useState(reportName);
	const [dashboardCheckboxes, setDashboardCheckboxes] = useState<
		DashboardCheckboxesProps[]
	>(prepareDashboards(dashboards, currentUserId));
	const [isValid, setValid] = useState<boolean>(false);
	const [isLoading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | false>(false);
	const [showDashboardInput, setShowDashboardInput] =
		useState<boolean>(false);
	const [addReportToNewDashboard, setAddReportToNewDashboard] =
		useState<boolean>(true);

	const [newDashboardName, setNewDashboardName] = useState('');
	const { createReport, updateReport, addReportToDashboard } =
		useSettingsApi();
	const {
		resetUnsavedReport,
		getCachedSourceDataTable,
		getCurrentUserSettings,
	} = localState();
	const { hasPermission } = usePlanPermissions();
	const { cap: cappingLimit } = getCappings();

	const { reports } = getCurrentUserSettings();
	const {
		numberOfReports,
		hasReachedReportsLimit,
		isNearReportsLimit,
		limitAsString,
	} = getReportsLimitData(reports, cappingLimit);

	const canHaveMultipleDashboards = hasPermission(
		PERMISSION_TYPES.static.haveMultipleDashboards,
	);

	const inputElement = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const {
			name: currentReportName,
			unsavedReport: { name: unsavedReportName },
		} = report || {};

		setName(unsavedReportName || currentReportName || '');

		if (currentReportName) {
			setValid(true);
		}

		setShowDashboardInput(false);
		setNewDashboardName('');
	}, [report, isVisible, translator]);

	useEffect(() => {
		setDashboardCheckboxes(prepareDashboards(dashboards, currentUserId));
	}, [dashboards]);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;

		setValid(isNameInputValid(value));
		setName(value);
	};

	const handleCheckboxChange =
		(dashboard: Dashboard) =>
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setDashboardCheckboxes(
				dashboardCheckboxes.map((dashboardCheckbox) => ({
					...dashboardCheckbox,
					...(dashboardCheckbox.name === dashboard.name && {
						isChecked: event.target.checked,
					}),
				})),
			);
		};

	const resetModal = () => {
		setName('');
		setValid(false);
		setError(false);
		toggleModal();
	};

	const addReportToDashboards = async (reportItem: Report) => {
		const promises: Promise<any>[] = [];

		dashboardCheckboxes
			.filter((dashboardCheckbox) => dashboardCheckbox.isChecked)
			.forEach((dashboard) => {
				promises.push(
					addReportToDashboard(dashboard.id, reportItem.id),
				);
			});

		if (showDashboardInput) {
			const reports = addReportToNewDashboard
				? [
						{
							id: reportItem.id,
							position: getWidgetPositionOnDashboard(
								reportItem.chart_type,
							),
						},
				  ] // eslint-disable-line
				: [];

			const response = await createDashboard(newDashboardName, reports);

			trackDashboardCreated(
				response.data.createDashboard.id,
				DashboardActionSource.NEW_REPORT,
			);
		}

		try {
			await Promise.all(promises);
		} catch (err) {
			throw new Error(err);
		}
	};

	const handleSubmit = async (event: React.SyntheticEvent) => {
		event.preventDefault();

		if (!isValid) {
			return false;
		}

		setLoading(true);

		const reportObject = mergeReportWithUnsavedReport(report);
		const { columns } = getCachedSourceDataTable(report.id);

		const reportForSaving = prepareReportObject({
			...reportObject,
			columns,
		});

		const dashboardsCount = getDashboardsCount(dashboardCheckboxes);

		try {
			if (isSaveAsNew) {
				const {
					data: { createReport: createdReport },
				} = await createReport({
					name,
					dataType: getValueFromUnsavedOrOriginalReport(
						report,
						'data_type',
					),
					reportType: getValueFromUnsavedOrOriginalReport(
						report,
						'report_type',
					),
					data: {
						is_new: false,
						...reportForSaving,
					},
				});

				await addReportToDashboards(createdReport);

				trackReportCreated(
					reportForSaving,
					dashboardsCount,
					ReportActionSource.SAVE_AS_NEW,
				);
			} else {
				await updateReport(report.id, {
					...reportForSaving,
					name,
					is_new: false,
				});

				await addReportToDashboards(report);

				trackReportCreated(
					reportForSaving,
					dashboardsCount,
					ReportActionSource.ADD_REPORT,
				);
			}

			resetUnsavedReport(report.id);
			resetModal();
		} catch (err) {
			const errorMessage = getErrorMessage(translator);

			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Modal
			visible={isVisible}
			onClose={resetModal}
			closeOnEsc
			spacing="none"
			header={title}
			onBackdropClick={resetModal}
			data-test="report-save-modal"
			onTransitionEnd={() => inputElement?.current?.focus()}
			className={styles.modal}
		>
			{showCappingFeatures(hasReachedReportsLimit) && (
				<ReportCreationErrorMessage
					numberOfReports={numberOfReports}
					error={error}
					hasReachedReportsLimit={hasReachedReportsLimit}
					isNearReportsLimit={isNearReportsLimit}
					limitAsString={limitAsString}
				/>
			)}
			<form onSubmit={handleSubmit} autoComplete="off">
				<Spacing all="m">
					<Input
						value={name}
						name="report-name"
						label={
							isSave ? translator.gettext('Report name') : null
						}
						placeholder={translator.gettext('Report name')}
						onChange={handleInputChange}
						maxLength={NAME_MAX_LENGTH}
						data-test="report-save-name-input"
						inputRef={inputElement as any}
						allowClear
					/>

					<>
						<Spacing top="m">
							<p>{translator.gettext('Add to dashboards')}</p>
						</Spacing>
						<Spacing top="m" left="s">
							<ul>
								{dashboardCheckboxes.map((dashboard) => (
									<li
										key={dashboard.id}
										className={styles.listItem}
									>
										<Checkbox
											checked={dashboard.isChecked}
											disabled={
												dashboard.isMaximumReportsReached
											}
											onChange={handleCheckboxChange(
												dashboard,
											)}
										>
											{dashboard.name}
										</Checkbox>
										{dashboard.isMaximumReportsReached && (
											<p className={styles.notification}>
												{translator.pgettext(
													'Dashboard can contain up to [number] reports.',
													'Dashboard can contain up to %s reports',
													MAX_REPORTS_IN_DASHBOARD,
												)}
											</p>
										)}
									</li>
								))}
								{canHaveMultipleDashboards && (
									<li className={styles.listItem}>
										<NewDashboardFromInput
											addReportToNewDashboard={
												addReportToNewDashboard
											}
											setAddReportToNewDashboard={
												setAddReportToNewDashboard
											}
											showDashboardInput={
												showDashboardInput
											}
											setShowDashboardInput={
												setShowDashboardInput
											}
											newDashboardName={newDashboardName}
											setNewDashboardName={
												setNewDashboardName
											}
										/>
									</li>
								)}
							</ul>
						</Spacing>
					</>
				</Spacing>
				<footer className="cui4-modal__footer">
					<div>
						<Button
							type="button"
							onClick={resetModal}
							data-test="report-save-modal-close-button"
						>
							{cancelButtonText}
						</Button>
						<Button
							type="submit"
							color="green"
							className={styles.submit}
							disabled={
								!isValid ||
								isLoading ||
								(showDashboardInput && !newDashboardName)
							}
							loading={isLoading}
							data-test="report-save-modal-ok-button"
						>
							{agreeButtonText}
						</Button>
					</div>
				</footer>
			</form>
		</Modal>
	);
};

export default ReportSaveModal;
