import { ModalError, ErrorsReferenceFunc } from 'Types/types';
import createModalErrors from 'utils/createModalErrors';

export const getProjectErrors: ErrorsReferenceFunc = ({
	state,
	translator,
}) => {
	const projectErrors = {} as ModalError;

	if (!state.title || state.title.value === '') {
		projectErrors.title = translator.gettext('Title is required');
	}

	return createModalErrors({
		project: projectErrors,
	});
};
