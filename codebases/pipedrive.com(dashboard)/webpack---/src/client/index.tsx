import Logger from '@pipedrive/logger-fe';
import fetch from '@pipedrive/fetch';
import ComponentLoader from '@pipedrive/component-loader';
import getErrorLevel from './utils/getErrorLevel';
import namedExternalsMap from './utils/NamedExternals';
import { loadFuseConfiguration } from '@pipedrive/fuse/dist/src/loadFuseConfiguration';
import initVendastaNavigation from './utils/initVendastaNavigation';

// Start loading all important things but intentionally don't wait for them
function startPreloading(componentLoader) {
	Promise.all([
		componentLoader.load('webapp:user'),
		componentLoader.load('webapp:users'),
		componentLoader.load('webapp:teams'),
		componentLoader.load('webapp:intercom'),
		componentLoader.load('iam-client'),
		componentLoader.load('webapp:signup-data'),
	]);
}

async function lazyLoadAllOtherComponents(componentLoader, froot) {
	const [{ Events }] = await Promise.all([
		import(/* webpackChunkName: "@pipedrive/webapp-core" */ '@pipedrive/webapp-core'),
	]);
	const initMoment = import(/* webpackChunkName: "init-moment" */ './utils/moment/initMoment');

	window.app = {
		...window.app,
		global: Object.assign({}, Events),
	};
	startPreloading(componentLoader);
	froot.setRegisteredAllExternals(initMoment);
}

const getDerivedFacility = (error: ErrorEvent | Error | any): string | null => {
	let stack;

	if (error instanceof ErrorEvent) {
		stack = error.error?.stack;
	} else if (error instanceof Error) {
		stack = error.stack;
	}

	if (stack) {
		const lastMatch = stack.match(/pipedriveassets\.[a-z]+\/[a-z0-9-_]+\//gi);

		if (lastMatch) {
			const facility = lastMatch[0]?.split('/')[1];

			return facility;
		}
	}

	return null;
};

const logError = (logger, error: ErrorEvent | Error | any, level) => {
	const derivedFacility = getDerivedFacility(error);
	const extraData: any = {};

	if (derivedFacility) {
		extraData.facility_is_derived = 'true';
		const derivedLogger = new Logger(derivedFacility, 'unhandledError');

		derivedLogger.logError(error, null, level, extraData, derivedFacility);
		return;
	}

	logger.logError(error, null, level, extraData, derivedFacility);
};

(async () => {
	const logger = new Logger('froot', 'entry');
	const unhandledErrors = new Logger('unhandled-errors');

	let componentLoader;

	window.addEventListener('error', (event) => {
		logError(unhandledErrors, event, getErrorLevel(event));
	});
	window.addEventListener('unhandledrejection', (event) => {
		if (typeof event.reason === 'object' && event.reason?.componentName) {
			// remap the componentLoader rejections there's no reason to blame froot for x component not loading
			const derivedLogger = new Logger(event.reason.componentName, 'componentLoader');

			derivedLogger.logError(event.reason.message);
			event.preventDefault();

			return;
		}

		logError(unhandledErrors, event.reason, 'error');
		event.preventDefault();
	});

	if (window.defaultErrorHandler) {
		window.removeEventListener('error', window.defaultErrorHandler);
	}

	if (window.defaultRejectionHandler) {
		window.removeEventListener('unhandledrejection', window.defaultRejectionHandler);
	}

	try {
		const { data: configuration } = await fetch('/froot/configuration');
		const localConfiguration = await loadFuseConfiguration(configuration.ENV === 'test');

		const cdnPath = `//cdn.${configuration.CDN_DOMAIN}/webapp/`;
		const appDomain = 'app';

		const { protocol, hostname, host, href } = document.location;

		// Set global app to help things coming from webapp
		window.app = {
			...window.app,
			ENV: configuration.ENV,
			supportedBrowser: configuration.isSupportedBrowser,
			config: {
				...window.app.config,
				// General
				region: configuration.REGION,
				graphqlEnabled: true,
				build: 'latest',
				// URL related
				appDomain,
				baseDomain: configuration.BASE_DOMAIN,
				cookieDomain: configuration.BASE_DOMAIN,
				cdnDomain: configuration.CDN_DOMAIN,
				desktopNotificationsPublicKey: configuration.DESKTOP_NOTIFICATIONS_PUBLIC_KEY,
				emailTrackingDomain: configuration.EMAIL_TRACKING_DOMAIN,
				baseurl: `${protocol}//${host}`,
				api: `${protocol}//${
					hostname === `${appDomain}.${configuration.BASE_DOMAIN}`
						? `api.${configuration.BASE_DOMAIN}/v1`
						: `${hostname}/api/v1`
				}`,
				socket: `${protocol}//channel.${configuration.BASE_DOMAIN}/sockjs`,
				static: `${protocol}${cdnPath}`,
				login: `${protocol}//${hostname}/auth/login?return_url=${encodeURIComponent(href)}`,
				logout: `${protocol}//${hostname}/auth/logout`,
				// Third party
				intercom: {
					id: configuration.INTERCOM_ID,
				},
				sesheta: {
					id: configuration.SESHETA_ID,
					key: configuration.SESHETA_KEY,
				},
			},
		};

		componentLoader = new ComponentLoader();
		window.app.componentLoader = componentLoader;

		const components = {
			...configuration.componentLoaderConfig,
			...localConfiguration,
			webapp: {
				...configuration.componentLoaderConfig.webapp,
				...localConfiguration.webapp,
				vendors: [],
			},
			...(configuration.intercom && {
				intercom: {
					js: `https://widget.intercom.io/widget/${configuration.intercom.id}`,
				},
			}),
		};

		await componentLoader.register(components);
		componentLoader.registerDependencyLoader((external) => {
			if (namedExternalsMap[external] && typeof namedExternalsMap[external] === 'function') {
				return new Promise((resolve, reject) => {
					namedExternalsMap[external]()
						.then((dependency) => {
							resolve(dependency);
						})
						.catch((error) => {
							logError(unhandledErrors, new Error(`External failed to load: ${external}`), 'error');
							reject(error);
						});
				});
			} else {
				throw new Error(`You are trying to use an external that is not supported ${external}`);
			}
		});

		componentLoader.registerExternals({
			'utils/logger': Logger,
		});

		const froot = await componentLoader.load('froot');
		const user = froot.getUser();

		window.app.componentLoader = componentLoader;

		if (user) {
			initVendastaNavigation(componentLoader, configuration.CDN_DOMAIN);

			froot.setConfiguration(configuration);
			await froot.render();

			document.getElementById('skeleton').remove();

			lazyLoadAllOtherComponents(componentLoader, froot);
		} else {
			const [{ Events }] = await Promise.all([
				import(/* webpackChunkName: "@pipedrive/webapp-core" */ '@pipedrive/webapp-core'),
			]);

			window.app = {
				...window.app,
				global: Object.assign({}, Events),
			};
			const ErrorPage = await componentLoader.load('froot:ErrorPage');

			document.getElementById('loading-wrapper').remove();
			await froot.render(ErrorPage);
		}
	} catch (error) {
		logger.logError(error, 'Could not initialize froot');
	}
})();
