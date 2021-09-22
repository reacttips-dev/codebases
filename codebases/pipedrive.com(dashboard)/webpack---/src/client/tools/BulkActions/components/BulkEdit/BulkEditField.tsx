import { Select } from '@pipedrive/convention-ui-react';
import React, { useState } from 'react';

import { FormField } from './FormField';
import { StyledLabel, StyledItem, StyledSelect } from './styled';

export type BulkEditFieldAction = 'keep' | 'edit' | 'remove';

export interface BulkEditFieldOption {
	id: BulkEditFieldAction;
	label: string;
}

function getBulkActionOptions(field, translator) {
	const options: BulkEditFieldOption[] = [
		{
			id: 'keep',
			label: translator.gettext('Keep current value'),
		},
		{
			id: 'edit',
			label: translator.gettext('Edit current value...'),
		},
	];

	if (!field.isMandatory || typeof field.isMandatory === 'object') {
		options.push({
			id: 'remove',
			label: translator.gettext('Clear the field'),
		});
	}

	return options;
}

interface Props {
	field;
	value;
	error;
	translator;
	label: string;
	onChange: (value, field, action: BulkEditFieldAction) => void;
	onBlur: (value, field) => void;
}

export function BulkEditField({ field, label, value, error, translator, onChange, onBlur }: Props) {
	const fieldOptions = getBulkActionOptions(field, translator);
	const [selectedAction, setSelectedAction] = useState<BulkEditFieldAction>(fieldOptions[0].id);

	function handleSelectChange(action: BulkEditFieldAction) {
		setSelectedAction(action);
		onChange(value, field, action);
	}

	function handleFieldChange(value) {
		onChange(value, field, 'edit');
	}

	function handleFieldBlur(value, field) {
		onBlur(value, field);
	}

	const showFormField = selectedAction === 'edit';

	return (
		<StyledItem data-coachmark={`bulk-edit-${field.key}`}>
			<StyledLabel isEditing={selectedAction === 'edit'} isRemoving={selectedAction === 'remove'}>
				{label}
			</StyledLabel>
			<StyledSelect
				placeholder={fieldOptions[0].label}
				value={selectedAction}
				onChange={handleSelectChange}
				data-field-key={field.key}
			>
				{fieldOptions.map((options) => (
					<Select.Option key={options.id} value={options.id}>
						{options.label}
					</Select.Option>
				))}
			</StyledSelect>
			{showFormField && (
				<FormField
					field={field}
					value={value}
					error={error}
					onChange={handleFieldChange}
					onBlur={handleFieldBlur}
				/>
			)}
		</StyledItem>
	);
}
