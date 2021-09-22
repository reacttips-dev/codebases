import React, { useState } from 'react';
import { Modal, Spacing, Button } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import { DataType } from '@pipedrive/insights-core/lib/types';

import { getModalData } from '../../utils/modalUtils';
import { Entity, SharedAddModalView, SubEntity } from '../../types/modal';
import localState from '../../utils/localState';
import ReportCreationErrorMessage from '../../atoms/ReportCreationErrorMessage';
import EntitySelection from './EntitySelection';
import TypeSelection from './TypeSelection';
import { resetUnsavedGoalCache } from '../../api/vars/unsavedGoalCache';
import useNewItemModal from './useNewItemModal/useNewItemModal';
import { getCappings } from '../../api/commands/capping';
import {
	getReportsLimitData,
	showCappingFeatures,
} from '../featureCapping/cappingUtils';

import styles from './NewItemModal.pcss';

interface OnSaveProps {
	entityType: Entity;
	entitySubType: SubEntity;
	dataType: DataType;
	setLoading: (state: boolean) => void;
	setError: (state: string) => void;
	resetModal: () => void;
}

interface NewItemModalProps {
	isVisible: boolean;
	toggleModal: () => void;
	type: SharedAddModalView;
	onSave: (props: OnSaveProps) => void;
}

const NewItemModal: React.FC<NewItemModalProps> = ({
	isVisible,
	toggleModal,
	type,
	onSave,
}) => {
	const { cap: cappingLimit } = getCappings();

	const translator = useTranslator();
	const { getCurrentUserSettings } = localState();
	const { reports } = getCurrentUserSettings();
	const {
		numberOfReports,
		hasReachedReportsLimit,
		isNearReportsLimit,
		limitAsString,
	} = getReportsLimitData(reports, cappingLimit);

	const [error, setError] = useState<string>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const modalData = getModalData(translator)[type];
	const entities = modalData.entities;

	const {
		selectedEntityType,
		setSelectedEntityType,
		selectedEntitySubType,
		setSelectedEntitySubType,
		selectedDataType,
		setSelectedDataType,
	} = useNewItemModal({ type });

	const resetModal = () => {
		setError(null);
		toggleModal();
		resetUnsavedGoalCache();
	};

	const selectedEntity = entities[selectedEntityType];
	const showLimitWarning = showCappingFeatures(false)
		? isNearReportsLimit
		: hasReachedReportsLimit;

	return (
		<Modal
			className={styles.modal}
			visible={isVisible}
			onClose={resetModal}
			closeOnEsc
			spacing="none"
			header={modalData.title}
			onBackdropClick={resetModal}
			data-test={`${type}-new-modal`}
			footer={
				<div>
					<Spacing right="s" display="inline">
						<Button
							onClick={resetModal}
							data-test={`${type}-new-modal-cancel-button`}
						>
							{translator.gettext('Cancel')}
						</Button>
					</Spacing>
					<Button
						color="green"
						disabled={
							!selectedEntitySubType ||
							(type === SharedAddModalView.REPORTS &&
								hasReachedReportsLimit)
						}
						onClick={() =>
							onSave({
								entityType: selectedEntityType,
								entitySubType: selectedEntitySubType,
								dataType: selectedDataType,
								setLoading,
								setError,
								resetModal,
							})
						}
						loading={loading}
						data-test={`${type}-new-item-save-button`}
					>
						{translator.gettext('Continue')}
					</Button>
				</div>
			}
		>
			{showLimitWarning && (
				<ReportCreationErrorMessage
					numberOfReports={numberOfReports}
					error={error}
					shouldNotDisplayReportLimitMessage={
						type !== SharedAddModalView.REPORTS
					}
					hasReachedReportsLimit={hasReachedReportsLimit}
					isNearReportsLimit={isNearReportsLimit}
					limitAsString={limitAsString}
				/>
			)}
			<div className={styles.modalContent}>
				<EntitySelection
					entities={entities}
					selectedEntityType={selectedEntityType}
					onClick={(entityType) => {
						if (entityType !== selectedEntityType) {
							setSelectedEntitySubType(null);
							setSelectedEntityType(entityType);
						}
					}}
				/>
				<TypeSelection
					selectedEntitySubType={selectedEntitySubType}
					onClick={({ subType, dataType }) => {
						setSelectedEntitySubType(subType);
						setSelectedDataType(dataType);
					}}
					types={selectedEntity.subTypes}
					columnTitle={modalData.subTitle}
				/>
			</div>
		</Modal>
	);
};

export default NewItemModal;
