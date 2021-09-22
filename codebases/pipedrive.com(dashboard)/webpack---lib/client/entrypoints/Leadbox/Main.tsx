import { useTranslator } from '@pipedrive/react-utils';
import { RelayEnvironmentProvider } from '@pipedrive/relay';
import initTimeStrings from '@pipedrive/time-strings';
import getTranslator from '@pipedrive/translator-client/fe';
import { CoachmarkProvider } from '@pipedrive/use-coachmark';
import { Leadbox } from 'Leadbox/Leadbox';
import { LeadboxContextProvider } from 'Leadbox/LeadboxContextProvider';
import React, { useCallback, useEffect, useState } from 'react';
import { WebappApiContextInterface } from 'Types/types';
import { setTimeStringsReference } from 'Utils/time-strings';
import { MicroFeProps } from 'Leadbox/MicroFeWrapper';
import { useFetch } from 'Hooks/useFetch';
import { getWebappApiContextValues, WebappApiContext } from 'Components/WebappApiContext';

export const Main = ({
	componentLoader,
	userSelf,
	pdMetrics,
	companyUsers,
	router,
	contextualView,
	frootProps,
	relayEnvironment,
	ffContext,
	modelCollectionFactory,
}: MicroFeProps) => {
	const { visible } = frootProps;
	const translator = useTranslator();
	const [webappApiContext, setWebappApiContext] = useState<WebappApiContextInterface>();
	const userLanguage = userSelf.getLanguage();
	const loader = useCallback(
		() =>
			Promise.all([
				componentLoader.load('iam-client').catch(() => null),
				initTimeStrings(userLanguage, getTranslator),
			]),
		[componentLoader, userLanguage],
	);
	const { response } = useFetch(loader);

	useEffect(() => {
		if (response) {
			const [, timeStrings] = response;
			setTimeStringsReference(timeStrings);
		}
	}, [response]);

	useEffect(() => {
		setWebappApiContext(
			getWebappApiContextValues({
				componentLoader,
				userSelf,
				pdMetrics,
				companyUsers,
				router,
				contextualView,
				modelCollectionFactory,
			}),
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [componentLoader, userSelf]);

	useEffect(() => {
		if (visible) {
			document.title = translator.gettext('Leads Inbox');
		}
	}, [visible, translator]);

	if (!response || !webappApiContext) {
		// What if the context or translator client never loads?
		// How do we know the application halted? 🤔
		return null;
	}

	const [iamClient] = response;

	return (
		<WebappApiContext.Provider value={webappApiContext}>
			<RelayEnvironmentProvider environment={relayEnvironment}>
				<LeadboxContextProvider pdMetrics={pdMetrics} ffContext={ffContext}>
					<CoachmarkProvider iamClient={iamClient} tags={['leads_email_integration_modal']}>
						<Leadbox />
					</CoachmarkProvider>
				</LeadboxContextProvider>
			</RelayEnvironmentProvider>
		</WebappApiContext.Provider>
	);
};
