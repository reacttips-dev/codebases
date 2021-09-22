import { isDuplicateDetectionField } from 'components/Fields/FormField/Form.field.utils';
import { isArray, isEmpty } from 'lodash';
import { ItemType, ModalField, ModalState, SearchParams } from 'Types/types';

export const getActiveBlockName = (componentKey: string, searchParams: SearchParams) => {
	if (!searchParams[componentKey]) {
		return Object.keys(searchParams).find((param) => !!searchParams[param]) || '';
	}

	return componentKey;
};

const checkLength = (value: string | undefined) => {
	if (value) {
		return value.length > 2 && value.length < 50;
	}

	return true;
};

export const isLengthCorrect = (value: string | ItemType[]) => {
	if (isArray(value)) {
		return checkLength(parseValue(value));
	}

	return checkLength(value);
};

const parseValue = (field: string | ItemType[]) => {
	if (isArray(field)) {
		return field[0].value;
	}

	return field;
};

const getStateValue = (field: ModalField): string => {
	if (!field) {
		return '';
	}

	if (isArray(field.value)) {
		return field.value[0].value;
	}

	return String(field.value);
};

const parseModalState = ({ name, phone, email, address }: ModalState): SearchParams => ({
	name: getStateValue(name),
	phone: getStateValue(phone),
	email: getStateValue(email),
	address: getStateValue(address),
});

export const getSearchParams = (modalState: ModalState, value: string | ItemType[], componentKey: string) => {
	// Getting search params that was already defined
	const searchParams = parseModalState(modalState);

	// Calculating new search param that was added via onDuplicateFieldUpdate
	if (isLengthCorrect(value)) {
		searchParams[componentKey] = parseValue(value);
	} else {
		searchParams[componentKey] = '';
	}

	return searchParams;
};

export const isSearchTermsDefined = (searchParams: SearchParams) => {
	// If all is empty no need to search Duplicates
	if (Object.keys(searchParams).every((param) => isEmpty(searchParams[param]))) {
		return false;
	}

	// Checking that all serchParams that defined has valid length
	return Object.keys(searchParams).every((param) => {
		if (isEmpty(searchParams[param])) {
			return true;
		}

		return isLengthCorrect(searchParams[param] || '');
	});
};

export const isFirstKeyInObject = (prefill: any, fieldKey: string) => {
	const index = Object.keys(prefill)
		.filter((key) => isDuplicateDetectionField(key))
		.findIndex((key) => key === fieldKey);

	return index === 0;
};
