import TranslatorClient from '@pipedrive/translator-client';
import getTranslator from '@pipedrive/translator-client/fe';
import React from 'react';
import { CompanyUsers, ComponentLoader, PdMetrics, Router, SocketHandler, UserSelf } from 'Types/@pipedrive/webapp';
import { PublicApiParams } from 'Types/types';
import { getFFContextData, FFContextDataType } from '@pipedrive/form-fields';

import AddModals from './AddModals';

const AddModalsFroot = async (componentLoader: ComponentLoader) => {
	const userSelf: UserSelf = await componentLoader.load('webapp:user');
	const userLanguage = userSelf.getLanguage();

	const [translatorClient, iamClient, companyUsers, pdMetrics, router, socketHandler, ffContextData]: [
		TranslatorClient,
		any,
		CompanyUsers,
		PdMetrics,
		Router,
		SocketHandler,
		FFContextDataType,
	] = await Promise.all([
		getTranslator('add-modals', userLanguage),
		componentLoader.load('iam-client').catch(() => Promise.resolve({})),
		componentLoader.load('webapp:users').catch(() => Promise.resolve({})),
		componentLoader.load('webapp:metrics').catch(() => Promise.resolve({})),
		componentLoader.load('froot:router').catch(() => Promise.resolve({})),
		componentLoader.load('webapp:socket').catch(() => Promise.resolve({})),
		getFFContextData(componentLoader),
	]);

	return (props: PublicApiParams) => {
		const modalType = props.modalType || props.type;

		return (
			<>
				<AddModals
					translatorClient={translatorClient}
					iamClient={iamClient}
					componentLoader={componentLoader}
					userSelf={userSelf}
					companyUsers={companyUsers}
					pdMetrics={pdMetrics}
					socketHandler={socketHandler}
					router={router}
					params={{ ...props, modalType }}
					ffContextData={ffContextData}
				/>
			</>
		);
	};
};

export default AddModalsFroot;
