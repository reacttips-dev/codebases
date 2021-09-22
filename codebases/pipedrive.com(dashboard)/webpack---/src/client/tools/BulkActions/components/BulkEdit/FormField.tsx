import { getComponent } from '@pipedrive/form-fields';
import React, { useContext } from 'react';
import { ApiContext } from '../../utils/ApiContext';

import { MarketingStatusField } from './fields/MarketingStatusField';

interface Props {
	field;
	value?;
	error?;
	onChange: (value, field) => void;
	onBlur: (value, field) => void;
}

function getComponentByField(field) {
	let fieldKey = field.key;
	let fieldType = field.type;

	if (fieldKey === 'marketing_status') {
		return MarketingStatusField;
	}

	if (fieldKey === 'deal_id') {
		fieldKey = 'deal';
	}

	if (fieldKey === 'stage_id') {
		fieldKey = 'pipelines_and_stages';
	}

	// Initial type for Person custom field needs remapping for form-fields
	if (fieldType === 'people') {
		fieldType = 'person';
	}

	const { Component } = getComponent(fieldType, fieldKey);

	return Component;
}

const ENTITY_FIELDS = ['organization', 'participants', 'person', 'deal'];

function getComponentProps(field, value, onBlur) {
	const props: any = {};
	const { user, translator } = useContext(ApiContext);

	// NOTE: This workaround is needed because form-fields expects option id-s to be numbers.
	if (field.isBoolean) {
		if (typeof value !== 'undefined') {
			props.value = value === true ? 1 : 2;
		}

		props.options = field.options.map((option) => ({
			id: option.id === true ? 1 : 2,
			label: option.label,
		}));
	} else {
		props.value = value;
		props.options = field.options;
	}

	if (ENTITY_FIELDS.includes(field.type)) {
		Object.assign(props, {
			allowNewItem: false,
			showNewLabel: false,
			disableNewLabel: true,
			onBlur: () => onBlur?.(value, field),
		});
	} else if (field.type === 'monetary') {
		props.placement = 'bottom-end';
	} else if (field.key === 'category') {
		props.canCreateCategories = false;
	} else if (field.key === 'lost_reason') {
		props.freeform = user.companyFeatures.attributes.free_form_lost_reasons;
		props.freeformOptionText = translator.gettext('Other lost reason');
		props.inputPlaceholder = translator.gettext('Specify lost reason');
		props.selectPlaceholder = translator.gettext('Choose an option');
	}
	props.portalTo = document.body;

	return props;
}

export function FormField({ field, value, error, onChange, onBlur }: Props) {
	const Component = getComponentByField(field);

	function handleChange(value) {
		onChange(field.isBoolean ? value === 1 : value, field);
	}

	const genericProps = {
		error,
		fieldKey: field.key,
		fieldType: field.type,
		componentKey: field.key,
		startOpen: false,
		allowEmpty: false,
		autofocus: true,
		onComponentChange: handleChange,
	};

	const componentProps = getComponentProps(field, value, onBlur);

	return <Component {...genericProps} {...componentProps} />;
}
