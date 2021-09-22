import escape from 'escape-html';
import { useTranslator } from '@pipedrive/react-utils';

import {
	trackDashboardCreated,
	trackDashboardCreationCanceled,
	DashboardActionSource,
} from '../../utils/metrics/dashboard-analytics';
import {
	trackReportEditingCanceled,
	trackReportCreationCanceled,
	trackReportDeleted,
} from '../../utils/metrics/report-analytics';
import { whichDashboardContainsReport } from '../../utils/helpers';
import { ModalType, DialogType } from '../../utils/constants';
import { Entity, SharedAddModalView, SubEntity } from '../../types/modal';
import { getWidgetPositionOnDashboard } from '../../utils/styleUtils';
import localState from '../../utils/localState';
import { getReportTypeLabels } from '../../utils/reportTypeUtils';
import { getErrorMessage } from '../../utils/messagesUtils';
import useSettingsApi from '../../hooks/useSettingsApi';
import { createDashboard } from '../../api/commands/dashboards';
import { getRouter } from '../../api/webapp';
import useRouter from '../useRouter';
import { snackbarMessageVar } from '../../api/vars/settingsApi';

import styles from './useModalAndDialogOptions.pcss';

interface UseReportModalAndDialogOptionsProps {
	setVisibleModal?: React.Dispatch<React.SetStateAction<ModalType>>;
	setVisibleDialog?: React.Dispatch<React.SetStateAction<DialogType>>;
	reportId?: string;
	reportName?: string;
	reportIds?: string[];
}

interface OnSaveProps {
	entityType?: Entity;
	entitySubType?: SubEntity;
	setLoading?: (loadingState: boolean) => void;
	setError?: (errorMessage: string) => void;
	resetModal?: () => void;
}

type CallbackProp = () => void;

export default () => {
	const translator = useTranslator();
	const [goTo] = useRouter();
	const router = getRouter();

	const { createReport, deleteReport, deleteReports, updateReport } =
		useSettingsApi();
	const {
		getReportTypes,
		getCurrentUserSettings,
		resetUnsavedReport,
		getCachedReport,
	} = localState();
	const { reportTypes } = getReportTypes();
	const { dashboards } = getCurrentUserSettings();
	const getDeleteReportText = (
		dashboardsCount: number,
		reportName: string,
	) => {
		let subtext = '';

		if (dashboardsCount > 1) {
			subtext = translator.gettext(
				'After deletion, it will not longer be available on the %s dashboards it’s added to.',
				`<strong class="${styles.textStrong}">${dashboardsCount}</strong>`,
			);
		}

		if (dashboardsCount === 1) {
			subtext = translator.gettext(
				'After deletion, it will not longer be available on the %s dashboard it’s added to.',
				`<strong class="${styles.textStrong}">${dashboardsCount}</strong>`,
			);
		}

		return `${translator.pgettext(
			'Are you sure you want to delete This Report?',
			'Are you sure you want to delete %s?',
			`<strong class="${styles.textStrong}">${escape(
				reportName,
			)}</strong>`,
		)} ${subtext}`;
	};
	const getBulkDeleteMessage = (
		countOfReports: number,
		dashboardsCount: number,
	) =>
		countOfReports === 1
			? translator.ngettext(
					'The report will no longer be visible on the %s dashboard it is added.',
					'The report will no longer be visible on the %s dashboards it is added.',
					dashboardsCount,
					dashboardsCount,
			  )
			: translator.ngettext(
					'The reports will no longer be visible on the %s dashboard they are added.',
					'The reports will no longer be visible on the %s dashboards they are added.',
					dashboardsCount,
					dashboardsCount,
			  );

	const createNewReport = async ({
		entitySubType,
		resetModal,
		setError,
		setLoading,
	}: OnSaveProps) => {
		try {
			const { defaultType, dataType } = reportTypes.find((type: any) => {
				return type.type === entitySubType;
			});
			const { newTitle } = getReportTypeLabels(defaultType, translator);

			await createReport({
				name: newTitle,
				dataType,
				reportType: defaultType,
			});

			resetModal();
		} catch (err) {
			const errorMessage = getErrorMessage(translator);

			setError(errorMessage);
			setLoading(false);
		}
	};

	const getModalOptions = ({
		setVisibleModal,
		reportId,
		reportName,
	}: UseReportModalAndDialogOptionsProps) => {
		return {
			[ModalType.REPORT_CREATE]: () => ({
				toggleModal: () => setVisibleModal(null),
				isVisible: true,
				type: SharedAddModalView.REPORTS,
				onSave: ({
					entitySubType,
					setLoading,
					setError,
					resetModal,
				}: OnSaveProps) => {
					setLoading(true);

					createNewReport({
						entitySubType,
						resetModal,
						setError,
						setLoading,
					} as OnSaveProps);
				},
			}),
			[ModalType.REPORT_SAVE]: () => {
				return {
					dashboards,
					isVisible: true,
					isSave: true,
					toggleModal: () => setVisibleModal(null),
					labels: {
						title: translator.gettext('Save'),
						cancelButtonText: translator.gettext('Close'),
						agreeButtonText: translator.gettext('Save'),
					},
				};
			},
			[ModalType.REPORT_SAVE_AS_NEW]: () => {
				return {
					dashboards,
					isVisible: true,
					isSaveAsNew: true,
					toggleModal: () => setVisibleModal(null),
					labels: {
						title: translator.gettext('Save new report'),
						cancelButtonText: translator.gettext('Close'),
						agreeButtonText: translator.gettext('Save'),
					},
				};
			},
			[ModalType.DASHBOARD_CREATE_AND_ADD_REPORT]: () => ({
				inputValue: '',
				placeholder: translator.gettext('Dashboard name'),
				header: translator.gettext('Add new dashboard'),
				onSave: async (name: string) => {
					const response = await createDashboard(name, [
						{
							id: reportId,
							position: getWidgetPositionOnDashboard(
								getCachedReport(reportId).chart_type,
							),
						},
					]);

					goTo({
						id: response.data.createDashboard.id,
						type: 'dashboards',
					});

					setVisibleModal(null);
					trackDashboardCreated(
						response.data.createDashboard.id,
						DashboardActionSource.EXISTING_REPORT,
					);
				},
				onCancel: () => {
					setVisibleModal(null);
					trackDashboardCreationCanceled(
						DashboardActionSource.EXISTING_REPORT,
					);
				},
				isVisible: true,
			}),
		};
	};

	const getDialogOptions = ({
		setVisibleDialog,
		reportId,
		reportName,
		reportIds,
	}: UseReportModalAndDialogOptionsProps) => {
		return {
			[DialogType.REPORT_DELETE]: () => {
				const dashboardsCount = whichDashboardContainsReport(
					dashboards,
					reportId,
				).length;

				return {
					labels: {
						title: translator.gettext('Delete report'),
						message: getDeleteReportText(
							dashboardsCount,
							reportName,
						),
						cancelButtonText: translator.gettext('Cancel'),
						agreeButtonText: translator.gettext('Delete'),
					},
					onDiscard: async () => {
						await deleteReport(reportId, dashboards);
						setVisibleDialog(null);
						snackbarMessageVar(
							translator.pgettext(
								'[Report name] report has been deleted.',
								'%s report has been deleted.',
								escape(reportName),
							),
						);
						trackReportDeleted(reportId);
					},
					onCancel: () => {
						setVisibleDialog(null);
					},
					isVisible: true,
				};
			},
			[DialogType.REPORT_BULK_DELETE]: (callback: CallbackProp) => {
				const dashboardsCount = whichDashboardContainsReport(
					dashboards,
					reportId,
					reportIds,
				).length;
				const countOfReports = reportIds.length;
				const bulkDeleteTitle = translator.ngettext(
					'Are you sure you want to delete %s report?',
					'Are you sure you want to delete %s reports?',
					countOfReports,
					countOfReports,
				);
				const bulkDeleteMessage = getBulkDeleteMessage(
					countOfReports,
					dashboardsCount,
				);

				return {
					labels: {
						title: bulkDeleteTitle,
						message: bulkDeleteMessage,
						cancelButtonText: translator.gettext('Cancel'),
						agreeButtonText: translator.gettext('Delete'),
					},
					onDiscard: async () => {
						await deleteReports(reportIds, dashboards);
						setVisibleDialog(null);
						snackbarMessageVar(
							translator.ngettext(
								'%s report has been deleted.',
								'%s reports has been deleted.',
								countOfReports,
								countOfReports,
							),
						);
						trackReportDeleted(reportId);

						if (callback) {
							callback();
						}
					},
					onCancel: () => {
						if (callback) {
							callback();
						}
						setVisibleDialog(null);
					},
					isVisible: true,
				};
			},
			[DialogType.REPORT_DISCARD_CHANGES]: (callback: CallbackProp) => ({
				labels: {
					title: translator.gettext('Discard changes'),
					message: translator.gettext(
						'Are you sure you want to discard changes to this report?',
					),
					cancelButtonText: translator.gettext('Continue editing'),
					agreeButtonText: translator.gettext('Discard changes'),
				},
				onDiscard: async () => {
					resetUnsavedReport(reportId);
					setVisibleDialog(null);
					trackReportEditingCanceled(reportId);

					if (callback) {
						callback();
					}

					router.restoreBlockedNavigation();
				},
				onCancel: () => setVisibleDialog(null),
				isVisible: true,
			}),
			[DialogType.REPORT_DISCARD]: (callback: CallbackProp) => ({
				labels: {
					title: translator.pgettext(
						'Word "Discard" should match the word "Discard" as a standalone action',
						'Discard new report',
					),
					message: translator.gettext(
						'Are you sure you want to discard this new report?',
					),
					cancelButtonText: translator.gettext('Close'),
					agreeButtonText: translator.gettext('Discard'),
				},
				onDiscard: async () => {
					router.restoreBlockedNavigation();
					router.unblockNavigation();

					resetUnsavedReport(reportId);
					await deleteReport(reportId, dashboards);
					trackReportCreationCanceled();
					setVisibleDialog(null);

					if (callback) {
						callback();
					}
				},
				onCancel: () => setVisibleDialog(null),
				isVisible: true,
			}),
			[DialogType.REPORT_CHANGE_TYPE]: (
				callback: CallbackProp,
				setCallback: (callback: () => void) => void,
			) => ({
				labels: {
					title: translator.gettext('Change the report type?'),
					message: translator.gettext(
						'If you continue, you will lose all customizations you already did for this report.',
					),
					cancelButtonText: translator.gettext(
						'No, keep editing current',
					),
					agreeButtonText: translator.gettext(
						'Yes, change report type',
					),
				},
				onDiscard: () => {
					setVisibleDialog(null);

					if (callback) {
						callback();

						return setCallback(null);
					}

					return false;
				},
				onCancel: () => {
					setVisibleDialog(null);
					setCallback(null);
				},
				isVisible: true,
			}),
		};
	};

	return ({
		setVisibleModal,
		setVisibleDialog,
		reportId,
		reportName,
		reportIds,
	}: UseReportModalAndDialogOptionsProps) => {
		return {
			modal: () =>
				getModalOptions({
					setVisibleModal,
					reportId,
					reportName,
				}),
			dialog: () =>
				getDialogOptions({
					setVisibleDialog,
					reportId,
					reportName,
					reportIds,
				}),
		};
	};
};
