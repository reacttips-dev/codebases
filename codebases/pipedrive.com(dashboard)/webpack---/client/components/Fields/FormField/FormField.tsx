import { Tooltip, Icon } from '@pipedrive/convention-ui-react';
import { getComponent, mapFieldType, PipelinesAndStages } from '@pipedrive/form-fields';
import { ModalContext } from 'components/AddModal/AddModal.context';
import { isRequiredField } from 'components/AddModal/AddModal.error';
import Duplicates from 'components/Fields/Duplicates';
import { RelatedContactFormField } from 'components/Fields/RelatedContactFormField/RelatedContactFormField';
import AddProducts from 'components/Products/AddProducts';
import React, { useContext } from 'react';
import { Field, FormFieldsOnChange, ItemType, ModalConfig, ModalType, OnUpdateState } from 'Types/types';
import { closeRenewalTypeFieldCoachmark, showRenewalTypeFieldCoachmark } from 'utils/coachmarks';
import { TitleField } from '../TitleField/TitleField';
import MarketingStatusField from '../MarketingStatusField';

import {
	isRenewalTypeField,
	isContactField,
	isDuplicateDetectionField,
	isTitleField,
	isMarketingStatusField,
} from './Form.field.utils';
import styles from './FormField.pcss';

interface Props {
	type: ModalType;
	className?: string;
	field: Field;
	disabled?: boolean;
	value: ItemType[] | string | number | null;
	modalConfig?: ModalConfig;
	onUpdateState: OnUpdateState;
}

export const FormField: React.FC<Props> = ({ type, className, field, disabled, value, modalConfig, onUpdateState }) => {
	const { componentLoader, translator, features, modalType } = useContext(ModalContext);

	// @ts-expect-error
	const fieldType = mapFieldType(field.key, field.field_type);

	React.useEffect(() => {
		if (field.key === 'renewal_type') {
			showRenewalTypeFieldCoachmark(componentLoader, translator);

			return () => {
				closeRenewalTypeFieldCoachmark();
			};
		}
	}, []);

	return (
		<div
			className={`${className || ''} ${styles.formField}`}
			data-test-type={fieldType}
			data-test-key={field.key}
			data-coachmark={field.key}
		>
			<FieldLabel type={type} field={field} disabled={disabled} />
			<div>
				<FieldElement
					type={type}
					field={field}
					disabled={disabled}
					value={value}
					modalConfig={modalConfig}
					onUpdateState={onUpdateState}
				/>
			</div>
			{features.products && field.key === 'value' && modalType !== 'lead' && <AddProducts />}
		</div>
	);
};

interface FieldElementProps {
	type: ModalType;
	field: Field;
	disabled?: boolean;
	value: string | ItemType[] | number | null;
	modalConfig?: ModalConfig;
	onUpdateState: OnUpdateState;
}

const validateMarketingStatusMessage = (modalConfig, modalState, translator) => {
	const { validateMarketingStatus } = modalConfig || {};

	if (validateMarketingStatus) {
		return validateMarketingStatus(modalState, translator);
	}

	return null;
};

// eslint-disable-next-line complexity
const FieldElement: React.FC<FieldElementProps> = ({ type, field, disabled, value, modalConfig, onUpdateState }) => {
	const { modalState, errors, onPipelineStageUpdate, translator } = useContext(ModalContext);

	const options = field.options ? field.options : [];

	// @ts-expect-error
	const fieldType = mapFieldType(field.key, field.field_type);

	const onComponentChange = (changedValue: FormFieldsOnChange, additionaParams?: Record<string, unknown>) => {
		onUpdateState({
			key: field.key,
			value: changedValue,
			type: fieldType,
			...additionaParams,
		});
	};

	const elementProps = {
		value,
		error: errors[type][field.key],
		fieldKey: field.key,
		fieldType: type,
		disabled,
		options,
		portalTo: document.body,
		allowClear: false,
		startOpen: false,
		fieldId: field.id,
	};

	// These fields don't need portalTo and actually are a bit buggy with it
	if (['enum', 'set', 'user'].includes(field.field_type)) {
		// @ts-expect-error
		delete elementProps.portalTo;
	}

	if (field.field_type === 'monetary') {
		// @ts-expect-error
		delete elementProps.options;
	}

	// @ts-expect-error
	const { Component } = getComponent(field.field_type, field.key);

	if (isDuplicateDetectionField(field.key)) {
		if (field.key === 'email') {
			const errorMessage = validateMarketingStatusMessage(modalConfig, modalState, translator);

			if (errorMessage) {
				elementProps.error = errorMessage;
			}
		}

		return <Duplicates type={type} Element={Component} onComponentChange={onComponentChange} {...elementProps} />;
	}

	if (field.key === 'pipeline_id') {
		const initValue = {
			stage_id: modalState.stage_id.value as number,
			pipeline_id: modalState.pipeline_id.value as number,
		};

		return (
			<PipelinesAndStages
				onComponentChange={onPipelineStageUpdate}
				value={initValue}
				error={errors[type][field.key]}
			/>
		);
	}

	if (isContactField(field.key)) {
		return <RelatedContactFormField Element={Component} onComponentChange={onComponentChange} {...elementProps} />;
	}

	if (isMarketingStatusField(field.key)) {
		return <MarketingStatusField onComponentChange={onComponentChange} value={value as unknown as string} />;
	}

	if (isTitleField(field.key)) {
		return <TitleField Element={Component} onComponentChange={onComponentChange} {...elementProps} />;
	}

	if (isRenewalTypeField(field.key)) {
		// @ts-expect-error
		elementProps.allowEmpty = false;
	}

	// @ts-expect-error
	return <Component onComponentChange={onComponentChange} {...elementProps} />;
};

interface FieldLabelProps {
	type: ModalType;
	field: Field;
	disabled?: boolean;
}

const FieldLabel: React.FC<FieldLabelProps> = ({ type, field, disabled }) => {
	const { modalState, translator, requiredFields } = useContext(ModalContext);

	const fieldName =
		{
			tax: translator.gettext('Tax %'),
		}[field.key] || field.name;

	const infoComponent = {
		unit: (
			<Tooltip
				placement="right"
				content={translator.gettext(
					'A measurement or standard amount of a physical quantity, \
				such as length, mass, energy, time, money, etc.',
				)}
			>
				<Icon icon="help" size="s" color="black-32" className={styles.inlineInfo} />
			</Tooltip>
		),
	}[field.key];

	return (
		<div className={styles.text}>
			{fieldName} {infoComponent}
			{!disabled && isRequiredField(modalState, field.key, requiredFields[type])
				? `(${translator.gettext('Required')})`
				: ''}
		</div>
	);
};
