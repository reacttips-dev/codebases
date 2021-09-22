import { isArray, omit } from 'lodash';
import { ModalType, Product, PublicApiParams } from 'Types/types';
import { SearchEntity } from './api.types';

export const getDuplicatesApiType = (type: ModalType) => {
	if (type === 'organization') {
		return 'org';
	}

	return type;
};

// Cleans properties (f.e. added by FormFields) that are not supposed to be passed in API request
export const cleanData = (data: any) => {
	const cleanedData = data;

	// For phone fields, a "changed" property is added by FormFields.
	if (data.phone && isArray(data.phone)) {
		cleanedData.phone = data.phone.map((phone: any) => omit(phone, 'changed'));
	}

	// For email fields, a "changed" property is added by FormFields.
	if (data.email && isArray(data.email)) {
		cleanedData.email = data.email.map((email: any) => omit(email, 'changed'));
	}

	// Products requires this specific object name
	if (data.unit_prices) {
		cleanedData.prices = data.unit_prices;

		delete cleanedData.unit_prices;
	}

	// Products category must only send the option id to the API.
	if (data.category) {
		data.category = data.category.id;
	}

	return cleanedData;
};

export const createRequiredFieldsMap = (modalType: ModalType) => (acc, field: any) => {
	if (!field.enabled) {
		return acc;
	}

	acc[field.fieldKey] = {
		type: field.type,
		enabled: field.enabled,
		stage_ids: modalType === 'deal' ? field.stage_ids : undefined,
	};

	return acc;
};

export const getQueryParams = (source: PublicApiParams['source']) => {
	if (source && source.type) {
		return {
			source: source.type,
			...(source.id && { source_id: source.id }),
		};
	}

	return undefined;
};

export const createProductFromSearchEntity = ({ item }: SearchEntity): Product => {
	return {
		id: item.id,
		name: item.name,
		prices: item.prices,
	};
};
