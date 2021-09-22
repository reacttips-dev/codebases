import { FormFieldsContext } from '@pipedrive/form-fields';
import React, { useContext, useState } from 'react';
import styled from 'styled-components';

import { ApiContext } from '../../utils/ApiContext';
import { useTranslations } from '../../utils/useTranslations';
import { BulkEditField } from './BulkEditField';

function validateForm(formData: Record<string, unknown>, formErrors, fields) {
	if (Object.keys(formData).length === 0) {
		return false;
	}

	if (Object.keys(formErrors).length !== 0) {
		return false;
	}

	for (const [fieldKey, fieldValue] of Object.entries(formData)) {
		if (fieldValue === '' && fields.find((f) => f.key === fieldKey)?.isMandatory === true) {
			return false;
		}
	}

	return true;
}

function validateEntity(type, value, errorTextMap) {
	if (value && typeof value !== 'object') {
		return errorTextMap[type]?.();
	} else if (value === '') {
		return '';
	}
}

const fieldValidationMap = {
	organization: (value, errorTextMap) => validateEntity('organization', value, errorTextMap),
	participants: (value, errorTextMap) => validateEntity('person', value, errorTextMap),
	person: (value, errorTextMap) => validateEntity('person', value, errorTextMap),
	deal: (value, errorTextMap) => validateEntity('deal', value, errorTextMap),
};

const StyledRoot = styled.div`
	padding: 4px;
`;

interface Props {
	fields;
	initialFormState: Record<string, unknown>;
	onFormStateChange: (formState) => void;
	onFormValidChange: (isValid: boolean) => void;
}

const FIELDS_VALIDATED_ON_BLUR = ['organization', 'participants', 'person', 'deal'];

export function BulkEditForm({ fields, initialFormState, onFormStateChange, onFormValidChange }: Props) {
	const [values, setValues] = useState(initialFormState);
	const [errors, setErrors] = useState<Record<string, unknown>>({});
	const [touched, setTouched] = useState<Record<string, boolean>>({});
	const { translator, ffContextData } = useContext(ApiContext);
	const { formFieldErrorTextMap } = useTranslations();

	function validateField(field, value) {
		return fieldValidationMap[field.type]?.(value, formFieldErrorTextMap);
	}

	function handleFieldChange(value, field, action) {
		const newValues = { ...values };

		if (action === 'remove') {
			newValues[field.key] = null;
		} else if (action === 'keep' || typeof value === 'undefined' || value === null) {
			delete newValues[field.key];
		} else if (action === 'edit') {
			newValues[field.key] = value;
		}

		setTouched({ ...touched, [field.key]: true });
		setValues(newValues);
		onFormStateChange(newValues);

		const newErrors = { ...errors };

		// Remove error from field on change
		delete newErrors[field.key];

		if (action === 'edit') {
			const error = validateField(field, value);

			if (typeof error !== 'undefined') {
				newErrors[field.key] = error;
			}
		}

		setErrors(newErrors);
		onFormValidChange(validateForm(newValues, newErrors, fields));

		// Delay showing field errors until onBlur
		if (FIELDS_VALIDATED_ON_BLUR.includes(field.type)) {
			setTouched({ ...touched, [field.key]: false });
		}
	}

	function handleFieldBlur(_value, field) {
		if (FIELDS_VALIDATED_ON_BLUR.includes(field.type)) {
			setTouched({ ...touched, [field.key]: true });
		}
	}

	function getValue(field) {
		if (field.type === 'varchar' && !values.hasOwnProperty(field.key)) {
			return '';
		}

		return values[field.key];
	}

	function getLabel(field) {
		if (field.type === 'stage') {
			return translator.gettext('Pipeline/Stage');
		}

		return field.name;
	}

	return (
		<StyledRoot>
			<FormFieldsContext.Provider value={{ ffContextData, translator }}>
				{fields.map((field) => (
					<BulkEditField
						key={field.key}
						field={field}
						value={getValue(field)}
						label={getLabel(field)}
						error={touched[field.key] && errors[field.key]}
						translator={translator}
						onChange={handleFieldChange}
						onBlur={handleFieldBlur}
					/>
				))}
			</FormFieldsContext.Provider>
		</StyledRoot>
	);
}
