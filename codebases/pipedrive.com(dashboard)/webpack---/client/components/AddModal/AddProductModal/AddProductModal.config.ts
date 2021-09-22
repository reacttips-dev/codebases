import TranslatorClient from '@pipedrive/translator-client';
import { ModalConfig } from 'Types/types';

import { getProductErrors } from './AddProductModal.utils';

export const getConfig = (translator: TranslatorClient): ModalConfig => {
	return {
		title: translator.gettext('Add product'),
		defaultVisibilitySettingsKey: 'productDefaultVisibility',
		fixedOrderFields: ['name', 'code', 'category', 'unit', 'unit_prices', 'tax'],
		customFieldsSettingsUrl: '/settings/fields?type=PRODUCT',
		createSnackbarMessage: (product) => translator.gettext('New product "%s" created', product.name),
		createDetailsUrl: (id: string) => `/product/${id}`,
		getErrorsReference: getProductErrors,
	};
};
