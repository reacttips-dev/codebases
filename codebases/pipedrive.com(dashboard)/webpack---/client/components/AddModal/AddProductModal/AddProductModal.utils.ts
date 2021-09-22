import createModalErrors from 'utils/createModalErrors';
import { ErrorsReferenceFunc, ModalError } from 'Types/types';

export const getProductErrors: ErrorsReferenceFunc = ({ state, translator }) => {
	const productErrors = {} as ModalError;

	if (!state.name || state.name.value === '') {
		productErrors.name = translator.gettext('Name is required');
	}

	return createModalErrors({
		product: productErrors,
	});
};
