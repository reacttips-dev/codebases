import getTranslator from '@pipedrive/translator-client/fe';
import React from 'react';
import ReactDOM from 'react-dom';
import { WebappAPI } from 'Types/@pipedrive/webapp';
import { PublicApiParams } from 'Types/types';

import AddModals from './AddModals';

interface AddModalsLegacyProps {
	api: WebappAPI;
	el: HTMLElement;
	params: PublicApiParams;
}

const AddModalsLegacy = async ({ api, params, el }: AddModalsLegacyProps) => {
	if (!el) {
		api.logger('add-modals').remote(
			'error',
			'No element found to render the modal',
			{
				modalType: params.modalType,
				company_id: api.userSelf.get('company_id'),
				user_id: api.userSelf.get('id'),
			},
			'add-modals',
		);

		return null;
	}

	const userLanguage = api.userSelf.getLanguage();
	const [translatorClient, ffTranslatorClient, iamClient] = await Promise.all([
		getTranslator('add-modals', userLanguage),
		getTranslator('form-fields', userLanguage),
		api.componentLoader.load('iam-client').catch(() => Promise.resolve({})),
	]);

	const { userSelf, companyUsers, socketHandler, router, pdMetrics, componentLoader } = api;

	ReactDOM.render(
		<AddModals
			translatorClient={translatorClient}
			ffTranslatorClient={ffTranslatorClient}
			iamClient={iamClient}
			userSelf={userSelf}
			companyUsers={companyUsers}
			socketHandler={socketHandler}
			router={router}
			pdMetrics={pdMetrics}
			componentLoader={componentLoader}
			params={params}
		/>,
		el,
	);
};

export default AddModalsLegacy;
