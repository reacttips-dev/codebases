import { getSQLmapping } from '@pipedrive/form-fields';
import { isNewContact } from 'components/AddModal/AddModal.initialState.utils';
import { getPersonFieldKey } from 'components/Fields/Fields.utils';
import { isNil } from 'lodash';
import { Dispatch, SetStateAction } from 'react';
import api, { searchDuplicates } from 'utils/api/api';
import {
	DuplicateType,
	Field,
	FormFieldsOnChange,
	ModalType,
	RelatedEntityFields,
	RelatedEntityState,
	SearchParams,
} from 'Types/types';

export const checkForDuplicates = async (value: FormFieldsOnChange, fieldKey: string, modalType: ModalType) => {
	if (value && isNewContact(value)) {
		const apiDuplicates = await searchDuplicates(
			{
				name: value,
			} as SearchParams,
			fieldKey === getPersonFieldKey(modalType) ? 'person' : 'organization',
		);

		return apiDuplicates.map((duplicateResult: DuplicateType) => {
			return {
				id: duplicateResult.id,
				name: `${duplicateResult.title}${
					duplicateResult.details.org_name ? ` (${duplicateResult.details.org_name})` : ''
				}`,
				details:
					duplicateResult.details.email ||
					duplicateResult.details.phone ||
					duplicateResult.details.org_address,
			};
		});
	}

	return [];
};

export const getPerson = async (personId: number) => {
	const { person, relatedObjects } = await api.getPersonDetails(personId);

	return {
		person,
		relatedObjects,
	};
};

export const getOrganization = async (orgId: number) => {
	const { organization } = await api.getOrganizationDetails(orgId);

	return organization;
};

export const setContactFieldsToRelatedEntityState = async ({
	contactType,
	contact,
	setRelatedEntityState,
	relatedEntityFields,
}: {
	contactType: string;
	contact: any;
	setRelatedEntityState: Dispatch<SetStateAction<RelatedEntityState>>;
	relatedEntityFields: RelatedEntityFields;
}) => {
	setRelatedEntityState((prevState) => {
		return {
			...prevState,
			// Transform to a value what can be read by FormFields library.
			[contactType]: Object.keys(contact).reduce((transformedContact, key) => {
				const field = relatedEntityFields[contactType]?.find((item: Field) => item.key === key);

				if (!field) {
					return transformedContact;
				}

				const value = getSQLmapping({ field, values: contact });

				if (!isNil(value)) {
					transformedContact[key] = {
						value,
					};
				}

				return transformedContact;
			}, {}),
		};
	});
};
