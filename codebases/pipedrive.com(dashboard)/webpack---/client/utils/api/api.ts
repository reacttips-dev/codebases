import { get, post } from '@pipedrive/fetch';
import { transformLeadData } from 'components/AddModal/AddLeadModal/AddLeadModal.api';

import {
	APIResponse,
	Deal,
	DuplicateType,
	FieldsByType,
	Lead,
	LeadLabels,
	ModalType,
	Organization,
	Person,
	Product,
	PublicApiParams,
	RelatedEntityFieldIds,
	RequiredFieldsByType,
	SearchParams,
} from 'Types/types';
import { SearchResults } from './api.types';

import {
	cleanData,
	createRequiredFieldsMap,
	getDuplicatesApiType,
	getQueryParams,
	createProductFromSearchEntity,
} from './api.utils';

/**
 * TODO: Correct URL, and specify a type!
 */
export const getRequiredFields = async (modalType: ModalType): Promise<RequiredFieldsByType> => {
	const {
		data: { requiredFields },
	} = await get('/api/v1/data-police/dataQualityRules?rules=requiredFields');

	const requiredFieldsByType = {
		[modalType]: (requiredFields[modalType] || requiredFields[modalType.toUpperCase()] || []).reduce(
			createRequiredFieldsMap(modalType),
			{},
		),
	};

	if (modalType === 'deal') {
		requiredFieldsByType.person = (requiredFields.person || requiredFields.PERSON || []).reduce(
			createRequiredFieldsMap('person'),
			{},
		);
	}

	if (['deal', 'person'].includes(modalType)) {
		requiredFieldsByType.organization = (requiredFields.organization || requiredFields.ORGANIZATION || []).reduce(
			createRequiredFieldsMap('organization'),
			{},
		);
	}

	return requiredFieldsByType;
};

export const getRelatedEntityFields = async (modalType: ModalType): Promise<RelatedEntityFieldIds> => {
	const { data } = await get('/api/v1/data-police/fields/dialogRelatedEntityfields');

	if (modalType === 'deal' || modalType === 'lead') {
		return {
			person: data.dealDialogAdditionalFields.PERSON || [],
			organization: data.dealDialogAdditionalFields.ORGANIZATION || [],
		};
	} else if (modalType === 'person') {
		return {
			organization: data.personDialogAdditionalFields.ORGANIZATION || [],
		};
	}

	return {};
};

// Creating person/org/deal/product/lead object
export const createItem = async (
	data: any,
	type: ModalType,
	fields?: FieldsByType,
	source?: PublicApiParams['source'],
): Promise<APIResponse<Deal | Person | Organization | Lead>> => {
	if (type === 'lead') {
		return await post('/api/v1_internal/leads', transformLeadData(cleanData(data), fields));
	} else {
		const queryParams = getQueryParams(source);

		return await post(`/api/v1/${type}s`, cleanData(data), { queryParams });
	}
};

// Searching for person/org duplicates
export const searchDuplicates = async (params: SearchParams, type: ModalType): Promise<DuplicateType[]> => {
	const LIMIT = 10;

	const cleanParams = Object.keys(params).reduce(
		(acc, key) => (params[key] ? { ...acc, [key]: params[key] } : acc),
		{},
	);
	const response = await get(`/api/v1/searchResults/${getDuplicatesApiType(type)}Duplicates`, {
		queryParams: { ...cleanParams, limit: String(LIMIT) },
	});

	return response.data || [];
};

export const searchProducts = async (term: string): Promise<Product[]> => {
	const PARAMS = `fields=name,code&include_fields=product.price&term=${term}`;

	const { data } = await get<SearchResults>(`/api/v1/products/search?${PARAMS}`);

	return data.items.map(createProductFromSearchEntity);
};

export const getPersonDetails = async (personId: number): Promise<any> => {
	const { data: person, related_objects: relatedObjects } = await get(`/api/v1/persons/${personId}`);

	return { person, relatedObjects };
};

export const getOrganizationDetails = async (orgId: number): Promise<any> => {
	const { data: organization } = await get(`/api/v1/organizations/${orgId}`);

	return { organization };
};

export const getLeadLabels = async (): Promise<LeadLabels> => {
	const { data: labels } = await get('/api/v1_internal/leadLabels');

	return labels;
};

export const getUsageCaps = async (modalType: ModalType): Promise<any> => {
	const cappingTypes = {
		deal: 'deals'
	}

	const { data } = await get(`/v1/usage-caps/features/${cappingTypes[modalType]}`);

	return data;
};

export const getUsageCapsMapping = async (): Promise<any> => {
	const { data } = await get(`/v1/usage-caps/mapping`);

	return data;
};

export default {
	createItem,
	searchDuplicates,
	searchProducts,
	getPersonDetails,
	getOrganizationDetails,
	getUsageCaps
};
