import React, { useEffect, useState, useRef } from 'react';
import {
	Modal,
	Button,
	Icon,
	Radio,
	Progressbar,
	Spacing,
} from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import { get } from '@pipedrive/fetch';

import { findExportList } from '../../utils/exportUtils';
import { MapDataReturnType } from '../../types/data-layer';
import useExport from './useExport';
import ModalMessage from '../../atoms/ModalMessage';
import { getErrorMessage } from '../../utils/messagesUtils';
import { getLogger } from '../../api/webapp';
import { ListViewSegmentDataType } from '../../types/list-view';
import useBlockNavigation from '../../hooks/useBlockNavigation';
import { QuickFilters } from '../../types/apollo-query-types';

import styles from './ExportDialog.pcss';

interface ExportDialogProps {
	reportId: string;
	setIsExportListViewDialogVisible: React.Dispatch<
		React.SetStateAction<boolean>
	>;
	itemsCount: number;
	reportData: MapDataReturnType;
	setIsListViewVisible?: React.Dispatch<React.SetStateAction<boolean>>;
	multiSelectFilter?: number[];
	listSegmentData?: ListViewSegmentDataType;
	isListView?: boolean;
	quickFilters?: QuickFilters;
}

interface ExportResponseData {
	active_flag: boolean;
	criteria: unknown;
	expire_time: string;
	filename: string;
	filesize: number;
	finished_time: string;
	format: 'csv' | 'xls';
	id: number;
	item_type: string;
	items_finished: number;
	items_total: number;
	finished: boolean;
	parameters: {
		total_items: number;
	};
	error_message?: string;
}

const ExportDialog: React.FC<ExportDialogProps> = ({
	reportId,
	itemsCount,
	setIsExportListViewDialogVisible,
	setIsListViewVisible,
	reportData,
	listSegmentData,
	isListView = false,
	multiSelectFilter,
	quickFilters,
}) => {
	const translator = useTranslator();

	const EXPORT_STEPS = {
		init: 'init',
		progress: 'progress',
		download: 'download',
	};
	const EXPORT_FORMATS: Record<string, string> = {
		xls: translator.gettext('XLS (Excel)'),
		csv: translator.gettext('CSV (comma separated values)'),
	};

	const [activeExportStep, setActiveExportStep] = useState(EXPORT_STEPS.init);
	const [itemsFinished, setItemsFinished] = useState(0);
	const [totalItems, setTotalItems] = useState(itemsCount);
	const [exportId, setExportId] = useState(0);
	const [downloadingFinished, setDownloadingFinished] = useState(false);
	const [exportFormat, setExportFormat] = useState('csv');
	const [error, setError] = useState(false);
	const timer = useRef<NodeJS.Timer>(null);

	const stopPolling = () => {
		if (timer.current) {
			clearInterval(timer.current);
		}
	};

	useEffect(() => {
		if (
			[EXPORT_STEPS.init, EXPORT_STEPS.download].includes(
				activeExportStep,
			)
		) {
			stopPolling();
		}
	}, [activeExportStep]);

	// Stop polling if component is not mounted
	useEffect(() => {
		return () => stopPolling();
	}, []);

	const { requestExportListFields, downloadExportResults } = useExport({
		reportId,
		uniqueSegments: reportData.uniqueSegments,
		groupedAndSegmentedData: reportData.groupedAndSegmentedData,
		listSegmentData,
		exportFormat,
		isListView,
		multiSelectFilter,
		quickFilters,
	});

	useBlockNavigation({
		isBlocked: downloadingFinished,
		onNavigate: () => {
			setDownloadingFinished(false);
		},
	});

	const pollingFunction = async (exportId: number) => {
		const result = await get<ExportResponseData>(
			`/api/v1/exports/${exportId}`,
		);

		if (!result.success) {
			throw new Error(result?.data?.error_message);
		}

		const exportTotalItems = result?.data?.items_total || 0;

		if (exportTotalItems > 0 && exportTotalItems !== totalItems) {
			setTotalItems(exportTotalItems);
		}

		setItemsFinished(result.data?.items_finished || 0);

		return result?.data.finished;
	};

	const startPolling = async (exportId: number) => {
		if (await pollingFunction(exportId)) {
			return setActiveExportStep(EXPORT_STEPS.download);
		}

		let attempts = 0;

		timer.current = setInterval(() => {
			pollingFunction(exportId)
				.then((isFinished) => {
					if (isFinished) {
						setActiveExportStep(EXPORT_STEPS.download);
					}

					if (attempts >= 50) {
						setActiveExportStep(EXPORT_STEPS.init);
					}

					attempts += 1;
				})
				.catch((e) => {
					throw e;
				});
		}, 2000);

		return timer.current;
	};

	const handleExport = async () => {
		try {
			setActiveExportStep(EXPORT_STEPS.progress);

			const requestedDataFields = await requestExportListFields();
			const exportList = findExportList(requestedDataFields);

			setExportId(exportList.id);

			await startPolling(exportList.id);
		} catch (e) {
			getLogger().remote('error', e);
			setError(true);
			setActiveExportStep(EXPORT_STEPS.init);
		}
	};

	const initContent = () => {
		return (
			<div data-test="export-dialog-init-container">
				<p>{translator.gettext('Choose file format for export')}</p>
				<Spacing
					vertical="m"
					horizontal="s"
					className={styles.subHeader}
				>
					{Object.keys(EXPORT_FORMATS).map((key) => {
						return (
							<Spacing bottom="xs" key={key}>
								<Radio
									data-test={`export-format-button-${key}`}
									name="format"
									defaultChecked={key === exportFormat}
									onChange={() => setExportFormat(key)}
								>
									{EXPORT_FORMATS[key]}
								</Radio>
							</Spacing>
						);
					})}
				</Spacing>
				<p className={styles.bottomTextWithMargin}>
					{translator.pgettext(
						'All [item count] items will be exported',
						'All %s items will be exported',
						totalItems,
					)}
				</p>
			</div>
		);
	};

	const progressContent = () => {
		return (
			<div data-test="export-dialog-progress-container">
				<p>
					{translator.pgettext(
						'Exporting...([processed items]/[total items])',
						'Exporting...(%s/%s)',
						[itemsFinished, totalItems || '?'],
					)}
				</p>
				<Spacing vertical="m">
					<Progressbar
						percent={
							totalItems === 0
								? 0
								: (itemsFinished / totalItems) * 100
						}
						color="green"
					/>
				</Spacing>
				<p className={styles.bottomText}>
					{translator.gettext(
						'Download link will be available when export is done.',
					)}
				</p>
			</div>
		);
	};

	const resultsContent = () => {
		return (
			<div
				className={styles.downloadStepContainer}
				data-test="export-dialog-results-container"
			>
				<p>{translator.gettext('Data export finished successfully')}</p>
				<Spacing all="m">
					<Button
						color="green"
						onClick={() => {
							downloadExportResults(exportId);
							setIsExportListViewDialogVisible(false);
						}}
					>
						{translator.gettext('Download')}
					</Button>
				</Spacing>
			</div>
		);
	};

	const renderFooter = () => {
		const showExportButton = activeExportStep === EXPORT_STEPS.init;
		const buttonText =
			activeExportStep === EXPORT_STEPS.progress
				? translator.gettext('Close')
				: translator.gettext('Cancel');

		return (
			<div className={styles.footerWrapper}>
				<div>
					{activeExportStep === EXPORT_STEPS.init && (
						<Button
							onClick={() => {
								setIsListViewVisible &&
									setIsListViewVisible(true);
								setIsExportListViewDialogVisible(false);
							}}
						>
							<Icon icon="arrow-back" size="s" />
							{translator.gettext('Back')}
						</Button>
					)}
				</div>
				<div>
					<Button
						onClick={() => setIsExportListViewDialogVisible(false)}
						data-test={`export-dialog-${buttonText.toLowerCase()}-button`}
					>
						{buttonText}
					</Button>
					{showExportButton && (
						<Button
							color="green"
							className={styles.buttonPrimary}
							onClick={handleExport}
							data-test="export-dialog-export-button"
						>
							{translator.gettext('Export')}
						</Button>
					)}
				</div>
			</div>
		);
	};

	const contentOptions: Record<string, Function> = {
		init: initContent,
		progress: progressContent,
		download: resultsContent,
	};

	return (
		<Modal
			visible
			closeOnEsc
			backdrop={false}
			spacing="none"
			className={styles.exportModal}
			onClose={() => {
				setActiveExportStep(EXPORT_STEPS.init);
				setIsExportListViewDialogVisible(false);
			}}
			header={translator.gettext('Export results')}
			footer={
				activeExportStep !== EXPORT_STEPS.download && renderFooter()
			}
		>
			{error && <ModalMessage content={getErrorMessage(translator)} />}
			<Spacing all="m">{contentOptions[activeExportStep]()}</Spacing>
		</Modal>
	);
};

export default ExportDialog;
