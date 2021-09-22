'use strict';

const Logger = require('@pipedrive/logger-fe').default;
const _ = require('lodash');
const md5 = require('blueimp-md5');
const Sesheta = require('@pipedrive/pdw-sesheta');
const Cookies = require('js-cookie');
const browser = require('utils/browser');
const Tracking = require('./tracking');
const proactiveEvents = require('./tracked-proactive-events');
const produceKafkaFeEvent = require('./kafka-fe-events-producer');

const logger = new Logger('utils', 'pdmetrics');
const config = { user: {}, appVersion: '', header: {} };
const eventNamePrefix = 'pdmetrics.';

let seshetaClient = null;

const trackedViews = {
	'/deal': 'deal_detail_view',
	'/deals': 'deal_list_view',
	'/pipeline': 'deal_pipeline_view',
	'/activities/list': 'activity_list_view',
	'/person': 'person_detail_view',
	'/persons/list': 'person_list_view',
	'/organization': 'organization_detail_view',
	'/organizations/list': 'organization_list_view',
	'/timeline': 'deal_forecast_view',
	'/mail': 'mail_view',
	'/settings': 'settings_view',
	'/activities/calendar': 'activity_calendar_view',
	'/persons/timeline': 'person_timeline_view',
	'/organizations/timeline': 'organization_timeline_view',
	'/products': 'products_list_view',
	'/progress/insights': 'insights_view',
	'/leads': 'leads',
	'/leads/inbox': 'leads_inbox',
	'/leadfeeder': 'leads_web_visitors',
	'/leads/leadfeeder': 'leads_web_visitors',
	'/leads/web-visitors': 'leads_web_visitors',
	'/leads/conversations': 'leads_live_chat',
	'/leads/live-chat': 'leads_live_chat',
	'/leads/web-forms': 'leads_web_forms',
	'/leads/prospector': 'leads_prospector',
	'/leads/chatbot': 'leads_chatbot',
	'/person/details': 'person_detail_view',
	'/marketing/templates': 'templates_view',
	'/projects': 'projects'
};

const processKeys = function(convert, obj) {
	if (typeof obj !== 'object' || !obj) {
		return obj;
	} else if (obj instanceof Array) {
		return obj.map((item) => processKeys(convert, item));
	}

	return Object.keys(obj).reduce((result, key) => {
		if (obj.hasOwnProperty(key)) {
			result[convert(key)] = processKeys(convert, obj[key]);
		}

		return result;
	}, {});
};

const decamelizeKeys = function(jsonObject) {
	return processKeys(_.snakeCase, jsonObject);
};

const getView = function(view) {
	if (trackedViews[view]) {
		return trackedViews[view];
	}

	if (Object.values(trackedViews).includes(view)) {
		return view;
	}

	const currentPath = window.location.pathname.split('#')[0];
	const viewKeysFromPath = Object.keys(trackedViews).filter((key) => currentPath.startsWith(key));

	if (viewKeysFromPath.length) {
		return trackedViews[viewKeysFromPath.pop()];
	}

	return '#invalid_view_code';
};

const getEventName = function(view, component, action) {
	const nameComponents = [action];

	component ? nameComponents.unshift(component) : nameComponents.unshift(view);

	return _.compact(nameComponents).join('.');
};

const buildEvent = function(name, data) {
	const eventHeader = _.cloneDeep(config.header);

	// move event name from body to header
	eventHeader.name = _.snakeCase(name);

	// set pdmetrics prefix to the event if not present yet
	if (eventHeader.name.substring(0, eventNamePrefix.length) !== eventNamePrefix) {
		eventHeader.name = eventNamePrefix + eventHeader.name;
	}

	// replace punctuation in event name by dot
	eventHeader.name = eventHeader.name.replace(/[^A-Za-z0-9_]/g, '.');
	eventHeader.page_url = window.location.href;
	eventHeader.timestamp = new Date().toISOString();
	eventHeader.event_id = md5(JSON.stringify(eventHeader));
	eventHeader.session = Cookies.get('pipe-session-token');
	eventHeader.ua_name = browser.getUserWebBrowser();
	eventHeader.ua_ver = browser.getUserWebBrowserVersion();
	eventHeader.ua_device_type = browser.getUserDeviceType();
	eventHeader.ua_os_name = browser.getUserOperatingSystem();
	eventHeader.ua_string = navigator.userAgent;
	eventHeader.screen_height = screen.height;
	eventHeader.screen_width = screen.width;
	eventHeader.screen_avail_width = screen.availWidth;
	eventHeader.screen_avail_height = screen.availHeight;
	eventHeader.screen_orientation = screen.orientation ? screen.orientation.type : null;

	return {
		name: eventHeader.name,
		data: {
			header: eventHeader,
			body: decamelizeKeys(data)
		}
	};
};

const getEventData = function(name, data) {
	const { user, appVersion } = config;
	const eventCommonAttributes = {
		company_id: user.get('company_id'),
		user_id: user.id,
		ua_string: navigator.userAgent,
		platform: 'app',
		git_hash: appVersion,
		page_url: window.location.pathname,
		session: Cookies.get('pipe-session-token')
	};

	return {
		name,
		data: _.assign(eventCommonAttributes, data)
	};
};

const sendEvent = function(name, data) {
	if (seshetaClient === null) {
		return;
	}

	proactiveEvents.postPageEventTrigger(name, data);

	const event = buildEvent(name, data);

	seshetaClient.addEvent(event, (err) => {
		if (err instanceof Error) {
			logger.log('Error adding event to Sesheta:', err);
		}
	});
};

const isQATester = function() {
	const { user } = config;
	const userEmail = user.get('email');

	return userEmail && userEmail.match(/^.*test.pipedrive.com$/i);
};

const metricsAPI = {
	initialize(user, signupData, mailConnections) {
		try {
			seshetaClient = new Sesheta(app.config.sesheta);
		} catch (e) {
			logger.log('Error initializing Sesheta client:', {
				error: e instanceof Error ? e.message : e,
				config: app.config.sesheta
			});
		}

		Object.assign(config, {
			user,
			appVersion: app.config.version,
			header: {
				env: app.ENV || app.env,
				user_id: user.id,
				company_id: user.get('company_id'),
				version: app.config.version
			}
		});

		Tracking.initialize(user, signupData, mailConnections);
	},
	addPageAction: function(name, data) {
		sendEvent(name, data);
	},
	/**
	 * Function for tracking components
	 * view - can be sent as a key or value defined in trackedViews or as null
	 * component - has to be defined as component tracking convention
	 *   OR, in case of a view-specific action, component name should be the same as view key
	 * action - has to be sent (save, cancel, error etc)
	 * passedData -  optional - additional information
	 */
	trackUsage: function(view, component, action, passedData) {
		const viewName = getView(view);

		if (viewName && component && action) {
			const eventName = getEventName(viewName, component, action);
			const data = passedData || {};

			data.view_code = viewName;
			data.component_code = component;
			data.action_code = action;

			proactiveEvents.postUsageEventTrigger(eventName, data);

			const event = getEventData(eventName, data);

			seshetaClient &&
				seshetaClient.addEvent(event, (err) => {
					if (err instanceof Error) {
						logger.log('Error adding event to Sesheta:', err);
					}
				});

			if (!isQATester()) {
				Tracking.track(eventName, data);
			}

			produceKafkaFeEvent(eventName, data);
		}
	},
	addSeshetaEvent: function(name, data) {
		sendEvent(name, data);
	},
	finished: function() {
		sendEvent('finished');
	},
	/* Method to record page views */
	trackPage: function(name, properties = {}, options = {}, callback) {
		Tracking.page(name, properties, options, callback);
	},
	/* Method to be used only for extra tracking integrations, e.g. Fullstory */
	track: function(name, properties = {}, options = {}, callback) {
		Tracking.track(name, properties, options, callback);
	}
};

export default async (componentLoader) => {
	const [user, signupData, mailConnections] = await Promise.all([
		componentLoader.load('webapp:user'),
		componentLoader.load('webapp:signup-data'),
		componentLoader.load('webapp:mail-connections')
	]);

	metricsAPI.initialize(user, signupData, mailConnections);

	return metricsAPI;
};
