import { getModalTypes } from 'components/AddModal/AddModal.utils';
import { ModalErrors } from 'Types/types';

export default function createModalErrors(partialModalErrors: Partial<ModalErrors>): ModalErrors {
	return getModalTypes().reduce((modalErrors, modalType) => {
		if (!modalErrors[modalType]) {
			modalErrors[modalType] = {};
		}

		return modalErrors;
	}, partialModalErrors) as ModalErrors;
}
