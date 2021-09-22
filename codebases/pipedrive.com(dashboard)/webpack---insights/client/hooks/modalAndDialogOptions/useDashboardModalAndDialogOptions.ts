import escape from 'escape-html';
import { useTranslator } from '@pipedrive/react-utils';

import {
	trackDashboardCreated,
	trackDashboardCreationCanceled,
	DashboardActionSource,
	trackDashboardDeleted,
} from '../../utils/metrics/dashboard-analytics';
import { ModalType, DialogType } from '../../utils/constants';
import { Dashboard } from '../../types/apollo-query-types';
import {
	createDashboard,
	deleteDashboard,
} from '../../api/commands/dashboards';
import useRouter from '../useRouter';

import styles from './useModalAndDialogOptions.pcss';

interface UseDashboardModalAndDialogOptionsProps {
	setVisibleModal?: React.Dispatch<React.SetStateAction<ModalType>>;
	setVisibleDialog?: React.Dispatch<React.SetStateAction<DialogType>>;
	dashboard?: Dashboard;
}

export default () => {
	const translator = useTranslator();
	const [goTo] = useRouter();

	return ({
		setVisibleModal,
		setVisibleDialog,
		dashboard,
	}: UseDashboardModalAndDialogOptionsProps) => {
		const modal = () => {
			return {
				[ModalType.DASHBOARD_CREATE]: () => ({
					inputValue: '',
					placeholder: translator.gettext('Dashboard name'),
					header: translator.gettext('Add new dashboard'),
					onSave: async (name: string) => {
						const response = await createDashboard(name);

						goTo({
							id: response.data.createDashboard.id,
							type: 'dashboards',
						});

						setVisibleModal(null);
						trackDashboardCreated(
							response.data.createDashboard.id,
							DashboardActionSource.ADD_DASHBOARD,
						);
					},
					onCancel: () => {
						setVisibleModal(null);
						trackDashboardCreationCanceled(
							DashboardActionSource.ADD_DASHBOARD,
						);
					},
					isVisible: true,
				}),
			};
		};

		const dialog = () => {
			const question = translator.pgettext(
				'Are you sure you want to delete My Dashboard?',
				'Are you sure you want to delete %s?',
				`<strong class="${styles.textStrong}">${escape(
					dashboard?.name,
				)}</strong>`,
			);
			const info = translator.gettext(
				'Any reports it contains will not be deleted and will still be available under Reports.',
			);

			return {
				[DialogType.DASHBOARD_DELETE]: () => ({
					labels: {
						title: translator.gettext('Delete dashboard'),
						message: `${question} ${info}`,
						cancelButtonText: translator.gettext('Cancel'),
						agreeButtonText: translator.gettext('Delete'),
					},
					onDiscard: async () => {
						await deleteDashboard(dashboard?.id);

						setVisibleDialog(null);
						trackDashboardDeleted(dashboard);
					},
					onCancel: () => setVisibleDialog(null),
					isVisible: true,
				}),
			};
		};

		return {
			modal,
			dialog,
		};
	};
};
