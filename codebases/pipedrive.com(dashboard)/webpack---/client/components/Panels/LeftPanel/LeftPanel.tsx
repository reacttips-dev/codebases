import { Spacing } from '@pipedrive/convention-ui-react';
import { ModalContext } from 'components/AddModal/AddModal.context';
import FormField from 'components/Fields/FormField';
import VisibilityField from 'components/Fields/VisibilityField';
import CustomFieldsCoachmark from 'components/Panels/CustomFieldsCoachmark';
import React, { useContext } from 'react';
import { Field, ModalType } from 'Types/types';

import styles from './LeftPanel.pcss';

interface LeftPanelProps {
	modalType: ModalType;
}

// stage_id is merged into 1 component, together with pipeline_id
const IGNORED_FIELDS = ['stage_id'];

/**
 * The LeftPanel shows the main entity fields
 */
export function LeftPanel({ modalType }: LeftPanelProps) {
	const { pipelines, settings, fields, modalState, modalConfig, isAddingProducts, onUpdateState } =
		useContext(ModalContext);

	return (
		<div className={styles.panel}>
			<CustomFieldsCoachmark />

			<Spacing all="m" data-test="left-panel">
				{fields[modalType].visibleFields
					.filter((field) => !IGNORED_FIELDS.includes(field.key))
					.filter((field) => {
						if (field.key === 'probability') {
							const selectedPipelineId = modalState?.pipeline_id?.value;
							const selectedPipeline = (pipelines || []).find(
								(pipeline) => pipeline.id === selectedPipelineId,
							);

							return selectedPipeline && selectedPipeline.deal_probability;
						}

						return true;
					})
					.map((field: Field) => {
						const stateValue = modalState[field.key];

						return (
							<FormField
								type={modalType}
								key={field.id}
								field={field}
								value={stateValue?.value || null}
								onUpdateState={onUpdateState}
								modalConfig={modalConfig}
								disabled={field.key === 'value' && isAddingProducts}
							/>
						);
					})}

				{modalConfig.defaultVisibilitySettingsKey && (
					<VisibilityField
						initialValue={
							modalState?.visible_to.value || settings[modalConfig.defaultVisibilitySettingsKey]
						}
						onUpdateState={onUpdateState}
					/>
				)}
			</Spacing>
		</div>
	);
}
