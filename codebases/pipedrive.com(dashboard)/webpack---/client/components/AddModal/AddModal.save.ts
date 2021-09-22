import { post } from '@pipedrive/fetch';
import { useDataMapping } from '@pipedrive/form-fields';
import { isNewContact } from 'components/AddModal/AddModal.initialState.utils';
import { getOrgFieldKey, getPersonFieldKey, getDealFieldKey } from 'components/Fields/Fields.utils';
import { isEmpty, isObject, isString } from 'lodash';
import {
	Deal,
	FieldsByType,
	ModalField,
	ModalState,
	ModalType,
	Product,
	PublicApiParams,
	RelatedEntityState,
} from 'Types/types';
import * as api from 'utils/api/api';

export interface CreateNewContactProps {
	relatedEntityState: RelatedEntityState;
	type: ModalType;
	name: string | number;
	orgId?: string | number | null;
	visibleTo?: string | number;
	source?: PublicApiParams['source'];
}

export interface CreateNewDealProps {
	relatedEntityState: RelatedEntityState;
	type: ModalType;
	title: string | number;
	orgId?: string | number | null;
	personId?: string | number | null;
	visibleTo?: string | number;
	source?: PublicApiParams['source'];
}

export const saveModal = async (
	modalType: ModalType,
	modalState: ModalState,
	relatedEntityState: RelatedEntityState,
	fields: FieldsByType,
	source?: PublicApiParams['source'],
) => {
	const stateWithRelatedEntities = await createRelatedContactEntities(
		modalType,
		modalState,
		relatedEntityState,
		source,
	);

	const response = await api.createItem(
		applyFormFieldsDataMapping(stateWithRelatedEntities),
		modalType,
		fields,
		source,
	);

	if (modalType === 'deal' && relatedEntityState.product) {
		await createProducts(response.data as Deal, relatedEntityState.product.products.value || []);
	}

	return response;
};

const createRelatedContactEntities = async (
	modalType: ModalType,
	modalState: ModalState,
	relatedEntityState: RelatedEntityState,
	source?: PublicApiParams['source'],
) => {
	const orgFieldKey = getOrgFieldKey(modalType);
	const personFieldKey = getPersonFieldKey(modalType);

	let updatedState = Object.assign({}, modalState);

	const orgField = updatedState[orgFieldKey];
	const personField = updatedState[personFieldKey];

	const contactCustomFields = Object.values(modalState).filter(
		({ type, key }) =>
			(type === 'organization' || type === 'person') && key !== orgFieldKey && key !== personFieldKey,
	);

	// If there are any custom fields with new contacts, created it first
	await Promise.all(
		contactCustomFields.map(async (field) => {
			if (isNewContact(field.value)) {
				updatedState[field.key].value = await createNewContactFromCustomField(field, source);
			}
		}),
	);

	// If there is org_id which isNew we want to create it first
	if (orgField && (orgField.isNew || isString(orgField.value))) {
		updatedState[orgField.key].value = await createNewContact({
			relatedEntityState,
			type: 'organization',
			name: orgField.value as string,
			source,
		});
	}

	// And if we also create new person, we want to pass there newly created org
	if (personField && (personField.isNew || isString(personField.value))) {
		let orgId = orgField && updatedState[orgField.key] ? updatedState[orgField.key].value : null;

		// In case existing organization was selected
		if (isObject(orgId)) {
			orgId = (orgId as unknown as { id: number }).id;
		}

		updatedState[personField.key].value = await createNewContact({
			relatedEntityState,
			type: 'person',
			name: personField.value as string,
			orgId: orgId as number,
			source,
		});
	}

	updatedState = await createNewDealFromFilledTitle(
		updatedState,
		relatedEntityState,
		{ orgField, personField },
		source,
	);

	return updatedState;
};

const createNewDealFromFilledTitle = async (
	updatedState: ModalState,
	relatedEntityState: RelatedEntityState,
	fields: { orgField: ModalField; personField: ModalField },
	source: PublicApiParams['source'],
) => {
	const dealFieldKey = getDealFieldKey();
	const dealField = updatedState[dealFieldKey];
	const fieldHasNewValue = dealField && (dealField.isNew || isString(dealField.value));

	if (!fieldHasNewValue) {
		return updatedState;
	}

	const { orgField, personField } = fields;

	let orgId = orgField && updatedState[orgField.key] ? updatedState[orgField.key].value : null;
	let personId = personField && updatedState[personField.key] ? updatedState[personField.key].value : null;

	// In case existing organization was selected
	if (isObject(orgId)) {
		orgId = (orgId as unknown as { id: number }).id;
	}

	// In case existing person was selected
	if (isObject(personId)) {
		personId = (personId as unknown as { id: number }).id;
	}

	updatedState[dealField.key].value = await createNewDeal({
		relatedEntityState,
		type: 'deal',
		title: dealField.value as string,
		orgId: orgId as number,
		personId: personId as number,
		source,
	});

	return updatedState;
};

const createProducts = async (deal: Deal, products: Product[]) => {
	for (const product of products) {
		if (!product.id && product.name && isString(product.name) && product.name.length > 0) {
			const { data: createdProduct } = await post(`/api/v1/products`, {
				name: product.name,
			});

			product.id = createdProduct.id;
		}

		if (!product.id) {
			return;
		}

		await post(`/api/v1/deals/${deal.id}/products`, {
			product_id: product.id,
			item_price: product.price || 0,
			amount: product.amount || 0,
			quantity: product.quantity || 0,
			enabled_flag: true,
		});
	}
};

const createNewContact = async ({ relatedEntityState, type, name, orgId = null, source }: CreateNewContactProps) => {
	const additionalDataFields = getRelatedEntities(relatedEntityState, type);

	// No need to pass visible_to here, as API takes care of setting the correct default value
	const contactObject: any = {
		name,
		...additionalDataFields,
	};

	if (orgId) {
		contactObject.org_id = orgId;
	}

	const createdContact = await api.createItem(contactObject, type, undefined, source);

	return createdContact.data.id;
};

const createNewDeal = async ({
	relatedEntityState,
	type,
	title,
	orgId = null,
	personId = null,
	source,
}: CreateNewDealProps) => {
	const additionalDataFields = getRelatedEntities(relatedEntityState, type);

	// No need to pass visible_to here, as API takes care of setting the correct default value
	const contactObject: any = {
		title,
		...additionalDataFields,
	};

	if (orgId) {
		contactObject.org_id = orgId;
	}

	if (personId) {
		contactObject.person_id = personId;
	}

	const createdContact = await api.createItem(contactObject, type, undefined, source);

	return createdContact.data.id;
};

const createNewContactFromCustomField = async ({ type, value }, source?: PublicApiParams['source']) => {
	const contactObject: any = { name: value };

	const createdContact = await api.createItem(contactObject, type, undefined, source);

	return createdContact.data.id;
};

const getRelatedEntities = (relatedEntityState: RelatedEntityState, type) => {
	if (!isEmpty(relatedEntityState)) {
		return applyFormFieldsDataMapping(relatedEntityState[type]);
	}

	return {};
};

const applyFormFieldsDataMapping = (modalState: ModalState) => {
	return Object.entries(modalState).reduce((mapped, [key, field]) => {
		// @ts-ignore
		const mappedData = useDataMapping(key, field.value, field.type);

		return { ...mapped, ...mappedData };
	}, {});
};
