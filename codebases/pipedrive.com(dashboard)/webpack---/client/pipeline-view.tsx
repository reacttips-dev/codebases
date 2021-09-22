import { TranslatorContext } from '@pipedrive/react-utils';
import getTranslator from '@pipedrive/translator-client/fe';
import React from 'react';
import { Provider } from 'react-redux';
import { set as setWebappApi } from './shared/api/webapp';
import App from './components/App';
import listenSocketEvents from './sockets/listen-events';
import configureStore from './store';
import getInitialState from './store/initialState';
import exposeFunctionsForTests from './utils/exposeFunctionsForTests';
import handleDealTileSize from './utils/handleDealTileSize';
import saveUserSettings from './utils/settings/saveUserSettings';
import { getSelectedPipelineId } from './selectors/pipelines';
import { CoachmarkProvider } from '@pipedrive/use-coachmark';
import { CoachmarkTags, ViewTypes } from './utils/constants';
import { initFormatter } from './utils/formatCurrency';

import Logger from '@pipedrive/logger-fe';

export default async function (componentLoader) {
	const [
		DragDropContext,
		userSelf,
		companyUsers,
		teams,
		modelCollectionFactory,
		pdMetrics,
		socketHandler,
		router,
		frootModals,
	] = await Promise.all([
		componentLoader.load('froot:dragDropContext'),
		componentLoader.load('webapp:user'),
		componentLoader.load('webapp:users'),
		componentLoader.load('webapp:teams'),
		componentLoader.load('webapp:model-collection-factory'),
		componentLoader.load('webapp:metrics'),
		componentLoader.load('webapp:socket-handler'),
		componentLoader.load('froot:router'),
		componentLoader.load('froot:modals'),
	]);

	await modelCollectionFactory.initAsync();

	const logger = new Logger('pipeline-view');

	const api = {
		componentLoader,
		DragDropContext,
		userSelf,
		companyUsers,
		teams,
		modelCollectionFactory,
		pdMetrics,
		socketHandler,
		router,
		frootModals,
		logger: () => logger,
	};

	const userLanguage = api.userSelf.getLanguage();

	setWebappApi(api);

	const translatorClient = await getTranslator('pipeline-view', userLanguage);

	const [initialState, iamClient] = await Promise.all([
		getInitialState(api, translatorClient),
		api.componentLoader.load('iam-client').catch(() => Promise.resolve({})),
		initFormatter(api.componentLoader),
	]);

	const store = configureStore(initialState, api);

	exposeFunctionsForTests(store.dispatch);
	listenSocketEvents(api.socketHandler, store.dispatch, ViewTypes.PIPELINE);
	handleDealTileSize(store.dispatch);
	// These will actually not do any HTTP requests if the existing value is the same as the new one.
	saveUserSettings('deals_view_mode', 'pipeline');
	saveUserSettings('current_pipeline_id', getSelectedPipelineId(store.getState()));

	// eslint-disable-next-line new-cap
	const DraggableApp = DragDropContext(App);

	return ({ visible }) => (
		<Provider store={store}>
			<CoachmarkProvider
				iamClient={iamClient}
				tags={[CoachmarkTags.PIPELINE_NO_ACTIVITIES, CoachmarkTags.PIPELINE_NO_DEALS]}
			>
				<TranslatorContext.Provider value={translatorClient}>
					<DraggableApp visible={visible} />
				</TranslatorContext.Provider>
			</CoachmarkProvider>
		</Provider>
	);
}
