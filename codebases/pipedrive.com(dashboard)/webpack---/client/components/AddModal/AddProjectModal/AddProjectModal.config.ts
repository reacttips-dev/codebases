import TranslatorClient from '@pipedrive/translator-client';
import { ModalConfig } from 'Types/types';

import { getProjectErrors } from './AddProjectModal.utils';

export const getConfig = (translator: TranslatorClient): ModalConfig => {
	return {
		title: translator.gettext('Add project'),
		fixedOrderFields: ['title'],
		createSnackbarMessage: (project) => translator.gettext('New project "%s" created', project.title),
		createDetailsUrl: (id: string) => `/projects/${id}`,
		getErrorsReference: getProjectErrors,
	};
};
