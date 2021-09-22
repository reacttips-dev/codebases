import TranslatorClient from '@pipedrive/translator-client';
import { CoachmarkProvider } from '@pipedrive/use-coachmark';
import AddModal from 'components/AddModal';
import { CUSTOM_FIELDS_COACHMARK_TAG } from 'components/AddModal/AddModal.utils';
import ErrorWrapper from 'components/AddModal/AddModal.ErrorWrapper';
import React from 'react';
import { CompanyUsers, ComponentLoader, PdMetrics, Router, SocketHandler, UserSelf } from 'Types/@pipedrive/webapp';
import { PublicApiParams } from 'Types/types';
import { FFContextDataType } from '@pipedrive/form-fields';

interface MainProps {
	translatorClient: TranslatorClient;
	ffTranslatorClient?: TranslatorClient;
	ffContextData?: FFContextDataType;
	iamClient: any;
	params: PublicApiParams;
	userSelf: UserSelf;
	companyUsers: CompanyUsers;
	pdMetrics: PdMetrics;
	socketHandler: SocketHandler;
	componentLoader: ComponentLoader;
	router: Router;
}

const AddModals = ({
	componentLoader,
	userSelf,
	companyUsers,
	translatorClient,
	ffTranslatorClient,
	iamClient,
	router,
	socketHandler,
	pdMetrics,
	params,
	ffContextData,
}: MainProps) => {
	return (
		<ErrorWrapper
			key={Math.random()}
			userSelf={userSelf}
			translator={translatorClient}
			modalType={params.modalType}
		>
			<CoachmarkProvider iamClient={iamClient} tags={[CUSTOM_FIELDS_COACHMARK_TAG]}>
				<AddModal
					userSelf={userSelf}
					companyUsers={companyUsers}
					pdMetrics={pdMetrics}
					socketHandler={socketHandler}
					router={router}
					componentLoader={componentLoader}
					params={params}
					translator={translatorClient}
					ffTranslatorClient={ffTranslatorClient}
					ffContextData={ffContextData}
				/>
			</CoachmarkProvider>
		</ErrorWrapper>
	);
};

export default AddModals;
