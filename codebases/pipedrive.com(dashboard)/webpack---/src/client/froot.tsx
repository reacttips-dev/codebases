import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { TranslatorContext } from '@pipedrive/react-utils';
import getTranslator from '@pipedrive/translator-client/fe';
import Logger from '@pipedrive/logger-fe';

import App from './components/App';
import UserDataContext from './context/UserDataContext';
import ToolsContext from './context/ToolsContext';
import { buildMenu, getInitialMenuState } from './config/menu';
import { configureStore } from './store';
import { initialState } from './store/navigation/reducers';
import { registeredAllExternals } from './store/navigation/actions';
import { toggleFlowView } from './components/Header/helpers';
import { isNewUser } from './utils/isNewUser';

let configuration = null;

async function initIamClient(componentLoader: ComponentLoader) {
	try {
		return await componentLoader.load('iam-client');
	} catch (e) {
		return null;
	}
}

async function initInterfaceTour(componentLoader: ComponentLoader, user: any) {
	try {
		if (
			user?.companyFeatures.get('onboarding_flow') &&
			user?.get('current_company_plan').tier_code === 'platinum' &&
			user?.get('is_admin')
		) {
			const tour = await componentLoader.load('interface-tour');

			await tour.init(componentLoader, toggleFlowView);

			return tour;
		}
	} catch (e) {
		return null;
	}
}

async function initIntercom(componentLoader: ComponentLoader) {
	const intercom = await componentLoader.load('webapp:intercom');

	intercom.init({ id: configuration.INTERCOM_ID });
}

async function initDesktopNotificationsServiceWorker(componentLoader: ComponentLoader, logger: Logger) {
	try {
		const setupServiceWorker = await componentLoader.load('froot:desktopNotificationsServiceWorkerSetup');

		setupServiceWorker().catch((err) => {
			logger.error('Failed to setup service worker', err);
		});
	} catch (e) {
		return;
	}
}

async function initCacheServiceWorker(componentLoader: ComponentLoader, logger: Logger, user: any) {
	try {
		if (user?.companyFeatures.get('service_worker_caching')) {
			const setupServiceWorker = await componentLoader.load('froot:cacheServiceWorker');

			setupServiceWorker().catch((err) => {
				logger.error('Failed to setup service worker', err);
			});
		}
	} catch (e) {
		logger.error('Failed to load service worker', e);
	}
}

async function initUserTimezone(componentLoader: ComponentLoader) {
	const userTimezone = await componentLoader.load('webapp:user-timezone');

	userTimezone();
}

export default async (componentLoader: ComponentLoader) => {
	const logger = new Logger('froot');

	try {
		const router = await componentLoader.load('froot:router');

		const response = await fetch('/menu-waitress/v2');

		if (!response.ok) {
			logger.remote('error', 'Could not load menu-waitress.', { responseCode: response.status });
			return;
		}

		const {
			menus,
			rootUrl,
			services,
			hiddenPaths,
			user,
			user: { language },
			redirects,
			viewSelects,
			blacklist,
		} = await response.json();

		const items = buildMenu(menus, services);
		const initialMenuState = getInitialMenuState(items);
		const store = configureStore({
			navigation: {
				items,
				activeItem: null,
				menuState: initialMenuState,
				moreVisible: false,
				accountVisible: false,
				hasRegisteredAllExternals: false,
				showSecondaryMenuCoachmarks: true,
				rootUrl,
				services,
				hiddenPaths,
				hotkeys: [],
				redirects,
				viewSelects,
				blacklist,
				blacklistedUI: initialState.blacklistedUI,
			},
		});

		const trackRouteChange = (metrics) => {
			return router.on('routeChange', ({ path, previousPath }) => {
				path !== previousPath && metrics?.addPageAction('route_change', { path, previousPath });
			});
		};

		const toolsContextValue: ToolsContext = {
			componentLoader,
			logger,
			router,
			iamClient: null,
			metrics: null,
			interfaceTour: null,
		};

		let userDataContextValue: UserDataContext = {
			menuWaitressUser: user,
			user: null,
			users: null,
			configuration: null,
			teams: null,
			signupData: null,
			mailConnections: null,
		};

		const translator = await getTranslator('froot', language);

		return {
			setRegisteredAllExternals: async function (initMoment) {
				store.dispatch(registeredAllExternals());

				const [user, users, teams, signupData, metrics, mailConnections] = await Promise.all([
					componentLoader.load('webapp:user'),
					componentLoader.load('webapp:users'),
					componentLoader.load('webapp:teams'),
					componentLoader.load('webapp:signup-data'),
					componentLoader.load('webapp:metrics'),
					componentLoader.load('webapp:mail-connections'),
				]);

				initIntercom(componentLoader);
				initDesktopNotificationsServiceWorker(componentLoader, logger);
				initCacheServiceWorker(componentLoader, logger, user);
				initUserTimezone(componentLoader);

				initMoment = (await initMoment).default;
				await initMoment(user, componentLoader);

				toolsContextValue.iamClient = await initIamClient(componentLoader);
				toolsContextValue.metrics = metrics;

				toolsContextValue.interfaceTour = await initInterfaceTour(componentLoader, user);
				trackRouteChange(metrics);

				if (isNewUser(user)) {
					const fullstory = await componentLoader.load('webapp:fullstory');

					fullstory.record();
				}

				const webappTranslator = await getTranslator('webapp', language);
				user.setTierNames(webappTranslator);

				userDataContextValue = {
					...userDataContextValue,
					user,
					configuration,
					users,
					teams,
					signupData,
					mailConnections,
				};

				this.render();
			},
			render: () => {
				ReactDOM.render(
					<Provider store={store}>
						<ToolsContext.Provider value={toolsContextValue}>
							<UserDataContext.Provider value={userDataContextValue}>
								<TranslatorContext.Provider value={translator}>
									<App />
								</TranslatorContext.Provider>
							</UserDataContext.Provider>
						</ToolsContext.Provider>
					</Provider>,
					document.getElementById('root'),
				);
			},
			getRouter: async () => router,
			setConfiguration: (config) => {
				if (configuration) {
					throw new Error('Configuration already set');
				}

				configuration = config;
			},
			getUser: () => user,
			getConfiguration: async () => configuration,
		};
	} catch (error) {
		logger.logError(error, 'Could not load froot correctly');

		return {
			setRegisteredAllExternals: async () => {},
			render: (ErrorPage) => {
				ReactDOM.render(<ErrorPage />, document.getElementById('content-main'));
			},
			getRouter: () => null,
			setConfiguration: () => {},
			getUser: () => null,
			getConfiguration: () => null,
		};
	}
};
