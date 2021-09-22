const _ = require('lodash').noConflict();
const $ = require('jquery');
const Logger = require('@pipedrive/logger-fe').default;
const { Events } = require('@pipedrive/webapp-core');
const User = require('models/user');
const Users = require('collections/company');
const Teams = require('collections/teams');
const MailConnections = require('collections/mail/global-singletons/mail-connections');
const Helpers = require('utils/helpers');
const GoogleFiles = require('utils/google-files');
const GoogleMaps = require('utils/google-maps');
const Formatter = require('utils/formatter');
const Modals = require('utils/modals');
const Languages = require('collections/languages');
const Cookies = require('js-cookie');
const webappComponentLoader = require('./webapp-component-loader');
const PDMetrics = require('utils/pd-metrics');
const setDragDropContext = require('utils/react-dnd-context').setDragDropContext;
const SignupData = require('models/signup-data');
const Intercom = require('components/intercom-support-chat/intercom');
const Fullstory = require('components/fullstory');

require('../assets/scss/app.scss');

// eslint-disable-next-line
__webpack_public_path__ = '//cdn.' + app.config.cdnDomain + '/webapp/'; // NOSONAR

// Global event dispatcher
app.global = app.global || _.assignIn({}, Events);

// Generic debug logger
const logger = new Logger(`webapp.${app.ENV}`, 'debug');

/* eslint-disable complexity */
module.exports = async (componentLoader) => {
	webappComponentLoader.setComponentLoader(componentLoader);

	if (`${location.protocol}//${location.host}` !== app.config.baseurl) {
		app.config.baseurl = `${location.protocol}//${location.host}`;
	}

	if (!Cookies.get('pipe-session-token')) {
		location.href = app.config.login;

		return;
	}

	// Blocking promise before we can execute rest of the app.
	const [
		user,
		users,
		teams,
		webappMetrics,
		socket,
		socketHandler,
		signupData,
		intercom,
		fullstory,
		sharedModelCollectionFactory,
		dragDropContext,
		googleFiles,
		mailConnections,
		languages,
		formatter,
		googleMaps,
		modals
	] = await Promise.all([
		componentLoader.load('webapp:user'),
		componentLoader.load('webapp:users'),
		componentLoader.load('webapp:teams'),
		componentLoader.load('webapp:metrics'),
		componentLoader.load('webapp:socket'),
		componentLoader.load('webapp:socket-handler'),
		componentLoader.load('webapp:signup-data'),
		componentLoader.load('webapp:intercom'),
		componentLoader.load('webapp:fullstory'),
		componentLoader.load('webapp:model-collection-factory'),
		componentLoader.load('froot:dragDropContext'),
		componentLoader.load('webapp:google-files'),
		componentLoader.load('webapp:mail-connections'),
		componentLoader.load('webapp:languages'),
		componentLoader.load('froot:formatter'),
		componentLoader.load('webapp:google-maps'),
		componentLoader.load('froot:modals'),
		// Load common parts
		componentLoader.load('webapp:common')
	]);

	User.setUser(user);
	Users.setUsers(users);
	Teams.setTeams(teams);
	PDMetrics.setMetrics(webappMetrics);
	SignupData.setSignupData(signupData);
	Intercom.setIntercom(intercom);
	Fullstory.setFullstory(fullstory);
	GoogleFiles.setGoogleFiles(googleFiles);
	GoogleMaps.setGoogleMaps(googleMaps);
	MailConnections.setMailConnection(mailConnections);
	Formatter.setFormatter(formatter);
	Languages.setLanguages(languages);
	Modals.setModals(modals);

	const WebappApi = require('webapp-api');

	WebappApi.assign({ socket, socketHandler });

	/**
	 * ModelCollectionFactory is so big and all-encompassing.
	 * As the first solution to share it everywhere we will need to load webapp to use it.
	 * A better solution will be created in a separate task later.
	 */
	const modelCollectionFactory = require('components/model-collection-factory');

	sharedModelCollectionFactory.setInstance(modelCollectionFactory);

	setDragDropContext(dragDropContext);

	const redirectUrl = await Helpers.getRedirectUrl();

	if (redirectUrl) {
		location.replace(`${location.protocol}//${redirectUrl}`);
	}

	if (Helpers.browser('msie') && Helpers.browserVersion() <= 8) {
		Helpers.showError('IE');

		return;
	}

	const $html = $('html');

	$html.addClass(_.browser());

	if (_.browser('msie')) {
		$html.addClass(`msie${_.browserVersion()}`);
	}

	if (Helpers.hasAdBlocker()) {
		logger.warn('Adblocker active');
	}

	const ext = Helpers.breakingExtensions();

	if (ext) {
		logger.warn('Breaking extensions active', ext);
	}

	if (app.ENV === 'dev') {
		if (location.href.match(/debuglang/)) {
			_.debugLang(true);
		}
	}

	const App = await import(
		/* webpackMode: "lazy", webpackChunkName: "app" */
		'./app'
	);

	App.initialize();
	App.start(socketHandler);

	const AppRouter = await import(
		/* webpackMode: "lazy", webpackChunkName: "app-router" */ './app-router'
	);

	if (!app.router) {
		app.router = await componentLoader.load('froot:router');
		app.router.isFrootRouter = true;
	}

	return {
		AppRouter,
		getModalsView: async () => {
			const ModalView = require('views/ui/modal');

			return ModalView;
		},
		getPopoverView: () => {
			const PopoverView = require('views/ui/popover');

			return PopoverView;
		}
	};
};
