import React, { useState } from 'react';
import { flatten } from 'lodash';
import update from 'immutability-helper';
import {
	Icon,
	Button,
	Modal,
	Tooltip,
	Spacing,
} from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import {
	doesItemHaveAnotherOwner,
	getOwnItems,
} from '../../utils/sharingUtils';
import { getCurrentUserId } from '../../api/webapp';
import Dialog from '../../atoms/Dialog';
import { SidemenuReport } from '../../types/apollo-query-types';
import useReportModalAndDialogOptions from '../../hooks/modalAndDialogOptions/useReportModalAndDialogOptions';
import { DialogType } from '../../utils/constants';
import Section from './Section';

import styles from './BulkDeleteModal.pcss';

export interface SectionType {
	name: string;
	id: string;
	items: SidemenuReport[];
	disabled: boolean;
}

export interface ReportsToDelete {
	[key: string]: string[];
}

const BulkDeleteModal: React.FC<any> = ({ items }) => {
	const translator = useTranslator();
	const currentUserId = getCurrentUserId();
	const [bulkDeleteVisible, setBulkDeleteVisible] = useState(null);
	const ownItems = getOwnItems(items, currentUserId);
	const peerItems = (items as SidemenuReport[]).filter((menuItem) =>
		doesItemHaveAnotherOwner(menuItem, currentUserId),
	);
	const [isConfirmationDialogVisible, setConfirmationDialogVisibility] =
		useState(false);
	const reportOptions = useReportModalAndDialogOptions();
	const sections: SectionType[] = [
		{
			name: translator.gettext('Reports'),
			id: 'reports',
			items: [...ownItems],
			disabled: false,
		},
		{
			name: translator.gettext('Shared with me'),
			id: 'shared',
			items: [...peerItems],
			disabled: true,
		},
	];
	const getReportsToDeleteValue = (fillAll: boolean) => {
		return sections.reduce((acc: ReportsToDelete, section: SectionType) => {
			acc[section.id] = fillAll
				? section.items.map((item) => item.id)
				: [];
			return acc;
		}, {});
	};
	const [reportsToDelete, setReportsToDelete] = useState<ReportsToDelete>(
		getReportsToDeleteValue(false),
	);

	const manageCheckedItems = (sectionId: string, id: string) => {
		const sectionReports = reportsToDelete[sectionId];
		const reportIndex = sectionReports.findIndex(
			(reportId: string) => reportId === id,
		);

		if (sectionReports.length > 0 && reportIndex > -1) {
			setReportsToDelete(
				update(reportsToDelete, {
					[sectionId]: {
						$splice: [[reportIndex, 1]],
					},
				}),
			);

			return;
		}

		setReportsToDelete(
			update(reportsToDelete, {
				...reportsToDelete,
				[sectionId]: {
					$push: [id],
				},
			} as any),
		);
	};

	const manageHeaderCheckbox = (sectionId: string) => {
		const sectionItems = reportsToDelete[sectionId];

		setReportsToDelete({
			...reportsToDelete,
			[sectionId]: sectionItems.length
				? []
				: sections
						.find((section) => section.id === sectionId)
						?.items?.map((item) => item.id),
		});
	};

	const onSelectAllChecked = () => {
		setReportsToDelete(getReportsToDeleteValue(true));
	};

	const onDeselectAllChecked = () => {
		setReportsToDelete(getReportsToDeleteValue(false));
	};

	const getReportIdsForDeletion = (): string[] => {
		return flatten(Object.values(reportsToDelete));
	};

	const numberOfSelectedReports = getReportIdsForDeletion().length;

	const displayNumberOfDeletableReports = () => {
		if (numberOfSelectedReports > 0) {
			return translator.gettext(
				'Delete selected reports (%s)',
				numberOfSelectedReports,
			);
		}
		return translator.gettext('Delete selected reports');
	};

	function renderActions() {
		return (
			<div className={styles.selectActions}>
				<Button
					className={styles.selectButton}
					onClick={onSelectAllChecked}
				>
					{translator.gettext('Select all')}
				</Button>
				<Button
					className={styles.selectButton}
					onClick={onDeselectAllChecked}
				>
					{translator.gettext('Deselect all')}
				</Button>
			</div>
		);
	}

	function renderFooterActions() {
		return (
			<div>
				<Button
					className={styles.footerActions}
					onClick={() => {
						onDeselectAllChecked();
						setBulkDeleteVisible(false);
					}}
				>
					{translator.gettext('Close')}
				</Button>
				<Button
					className={styles.footerActions}
					onClick={() => {
						setBulkDeleteVisible(false);
						setConfirmationDialogVisibility(true);
					}}
					color="red"
					disabled={!getReportIdsForDeletion()?.length}
				>
					{displayNumberOfDeletableReports()}
				</Button>
			</div>
		);
	}

	const ConfirmationDialog = () => {
		const reportModalAndDialogOptions = reportOptions({
			setVisibleDialog: setConfirmationDialogVisibility as any,
			reportIds: getReportIdsForDeletion(),
		});

		return (
			<Dialog
				{...reportModalAndDialogOptions
					.dialog()
					[DialogType.REPORT_BULK_DELETE](onDeselectAllChecked)}
			/>
		);
	};

	return (
		<>
			<Tooltip
				placement="bottom"
				portalTo={document.body}
				content={<div>{translator.gettext('Bulk delete reports')}</div>}
			>
				<Button
					color="ghost"
					onClick={() => setBulkDeleteVisible(true)}
					disabled={!items.length}
				>
					<Icon
						color="black-64"
						icon="cogs"
						size="s"
						onClick={() => setBulkDeleteVisible(true)}
					/>
				</Button>
			</Tooltip>
			{bulkDeleteVisible && (
				<Modal
					visible={bulkDeleteVisible}
					closeOnEsc
					backdrop
					header={translator.gettext('Bulk delete reports')}
					onClose={() => {
						setBulkDeleteVisible(false);
					}}
					footer={renderFooterActions()}
				>
					<Spacing all="m" bottom="s">
						<div className={styles.content}>
							{renderActions()}
							{sections.map((section, index) => {
								if (section.items.length) {
									return (
										<Section
											sections={sections}
											manageHeaderChange={
												manageHeaderCheckbox
											}
											manageCheckedItems={
												manageCheckedItems
											}
											reportsToDelete={reportsToDelete}
											section={section}
											key={index}
										/>
									);
								}

								return null;
							})}
						</div>
					</Spacing>
				</Modal>
			)}
			{isConfirmationDialogVisible && <ConfirmationDialog />}
		</>
	);
};

export default BulkDeleteModal;
