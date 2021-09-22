import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/client';
import { TranslatorContext } from '@pipedrive/react-utils';
import { FormFieldsContext } from '@pipedrive/form-fields';
import { CoachmarkProvider } from '@pipedrive/use-coachmark';
import getTranslator from '@pipedrive/translator-client/fe';
import Logger from '@pipedrive/logger-fe';

import { CoachmarkTags, LOGGER_FACILITY } from '../../utils/constants';
import { WebappApiContext } from '../../utils/context';
import {
	removeBackbonePropertiesFromWebappApi,
	set as setWebappApi,
	get as getWebappApi,
} from '../../api/webapp';
import App from '../../pages/App';
import ErrorBoundary from '../../atoms/ErrorBoundary';
import wrapFrootRouter from '../../api/webapp/wrapFrootRouter';
import { SettingsApiClient } from '../../api/apollo/settingsApiClient';
import setPreviousRoutePath from './setPreviousRoutePath';
import { isViewInFocusVar } from '../../api/vars/settingsApi';

const logger = new Logger(LOGGER_FACILITY);

export const prepareReactComponent = async (api: any) => {
	const userLanguage = api.userSelf.getLanguage();
	const translatorClient = await getTranslator('insights', userLanguage);
	const iamClient = await api.componentLoader.load('iam-client').catch(() =>
		Promise.resolve(() => {
			logger.remote('warning', 'Failed to load iam-client');

			return {};
		}),
	);
	const dragDropContext = api.getDragDropContext();
	const DraggableApp = dragDropContext(App);

	api.logger = logger;

	setWebappApi(removeBackbonePropertiesFromWebappApi(api));
	const WebappApi = getWebappApi();

	return ({ visible }: { visible: boolean }) => {
		useEffect(() => {
			isViewInFocusVar(visible);

			if (visible) {
				document.title = translatorClient.gettext('Insights');

				setPreviousRoutePath(WebappApi.router.getPreviousPath());
			}
		}, [visible]);

		const {
			userSelf: {
				language: { language_code: languageCode },
				locale,
			},
		} = WebappApi;

		return (
			<WebappApiContext.Provider value={WebappApi}>
				<ErrorBoundary>
					<CoachmarkProvider
						iamClient={iamClient}
						tags={[
							CoachmarkTags.INSIGHTS_ONBOARDING_INTRO_DIALOG,
							CoachmarkTags.INSIGHTS_ONBOARDING_SHARING_DASHBOARD_COACHMARK,
							CoachmarkTags.INSIGHTS_ONBOARDING_CUSTOMIZE_REPORT_COACHMARK,
							CoachmarkTags.INSIGHTS_ONBOARDING_CUSTOMIZE_REPORT_VIEW_BY_COACHMARK,
							CoachmarkTags.INSIGHTS_UPDATE_INTERNAL_SHARING_COACHMARK,
							CoachmarkTags.INSIGHTS_CAPPING_COACHMARK,
						]}
					>
						<TranslatorContext.Provider value={translatorClient}>
							<ApolloProvider client={SettingsApiClient}>
								<FormFieldsContext.Provider
									value={{
										languageCode,
										locale,
										translator: translatorClient,
									}}
								>
									<DraggableApp />
								</FormFieldsContext.Provider>
							</ApolloProvider>
						</TranslatorContext.Provider>
					</CoachmarkProvider>
				</ErrorBoundary>
			</WebappApiContext.Provider>
		);
	};
};

export default async function (componentLoader: any) {
	const [
		userSelf,
		companyUsers,
		teams,
		pdMetrics,
		dragDropContext,
		router,
		modals,
		cappingDialog,
		cappingPopover,
	] = await Promise.all([
		componentLoader.load('webapp:user'),
		componentLoader.load('webapp:users'),
		componentLoader.load('webapp:teams'),
		componentLoader.load('webapp:metrics'),
		componentLoader.load('froot:dragDropContext'),
		componentLoader.load('froot:router'),
		componentLoader.load('froot:modals'),
		componentLoader.load('froot:cappingDialog'),
		componentLoader.load('froot:cappingPopover'),
	]);

	const api = {
		router: wrapFrootRouter(router),
		modals,
		cappingDialog,
		cappingPopover,
		pdMetrics,
		companyUsers,
		teams,
		userSelf,
		componentLoader,
		getDragDropContext: () => dragDropContext,
	};

	const InsightsService = await prepareReactComponent(api);

	return {
		mount: async ({ props, el }: { props: any; el: Element }) => {
			ReactDOM.render(<InsightsService {...props} />, el);
		},
		update: async ({ props, el }: { props: any; el: Element }) => {
			ReactDOM.render(<InsightsService {...props} />, el);
		},
		unmount: async ({ el }: { el: Element }) => {
			ReactDOM.unmountComponentAtNode(el);
		},
		isMicroFEComponent: true,
	};
}
