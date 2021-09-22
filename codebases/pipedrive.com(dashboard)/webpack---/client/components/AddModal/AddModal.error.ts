import { isEmpty } from 'lodash';
import { ModalErrors, ModalState, ModalType, ModalUpdateState, RelatedEntityType, RequiredFields } from 'Types/types';

import { getModalTypes } from './AddModal.utils';

export const hasNoErrors = (errors: ModalErrors) => {
	const modalTypes = getModalTypes();

	return modalTypes.every((type) => isEmpty(errors[type]));
};

export const isRequiredField = (modalState: ModalState, fieldKey: string, requiredFields: RequiredFields = {}) => {
	if (!requiredFields) {
		return false;
	}

	const requiredFieldConfig = requiredFields[fieldKey];

	return (
		requiredFieldConfig &&
		(!requiredFieldConfig.stage_ids || requiredFieldConfig.stage_ids.includes(modalState.stage_id.value as number))
	);
};

export const removeErrorFromState = (value: ModalUpdateState, modalType: ModalType | RelatedEntityType) => {
	return (errorState) => {
		if (value.key === 'person_id' || value.key === 'org_id') {
			delete errorState[modalType].person_id;
			delete errorState[modalType].org_id;
			delete errorState[modalType].title;
		}

		// related_person_id and related_org_id is used for add-lead modal validation
		if (value.key === 'related_person_id' || value.key === 'related_org_id') {
			delete errorState[modalType].related_person_id;
			delete errorState[modalType].related_org_id;
			delete errorState[modalType].title;
		}

		if (value.key === 'products' && errorState.deal) {
			delete errorState.deal.value;
		}

		if (errorState[modalType]) {
			delete errorState[modalType][value.key];
		}

		return errorState;
	};
};
