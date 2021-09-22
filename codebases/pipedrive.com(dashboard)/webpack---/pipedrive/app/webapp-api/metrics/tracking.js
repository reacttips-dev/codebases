/* eslint-disable no-undef */
const _ = require('lodash');
const moment = require('moment');
const Logger = require('@pipedrive/logger-fe').default;
const localStorageHelpers = require('utils/get-local-storage');
const { getUserActivatedFeatures, getUserSettings } = require('./tracking-helper');
const { getInstalledVideoCallApps } = require('../../utils/conference-meeting-utils');

const logger = new Logger('utils', 'tracking');
const isAnalyticsSet = typeof analytics !== 'undefined';

let sessionID;

const getUserPermissions = (user) => {
	const userAttributes = user.settings.attributes;

	return Object.keys(userAttributes).filter(
		(key) => key.startsWith('can_') && userAttributes[key] === true
	);
};

const splitCompanyFeaturesArray = (arr) => {
	// needed because the original array is too big and won't be shown fully in amplitude

	// ensure that result is whole number
	const middle = Math.floor(arr.length / 2);
	const arr1 = arr.slice(0, middle);
	const arr2 = arr.slice(middle);

	return [arr1, arr2];
};

const getCompanyFeatures = (user) => {
	const companyFeatures = user.companyFeatures.attributes;

	return Object.keys(companyFeatures).filter((key) => companyFeatures[key] === true);
};

const getTrialDaysCount = (user) => {
	const today = moment();

	return user.get('company_status') === 'in_trial'
		? today.diff(user.get('created'), 'days')
		: null;
};

const getPayingDaysCount = (user) => {
	const today = moment();
	const startedPayingTime = user.get('started_paying_time');

	return startedPayingTime ? today.diff(startedPayingTime, 'days') : null;
};

const getSignupDataUserProperties = (data, user) => {
	const signupData = { company_size: user.get('company_size') };

	if (data) {
		Object.keys(data.formData).forEach((key) => {
			signupData[_.snakeCase(key)] = _.snakeCase(data.formData[key].value);
		});
	}

	return signupData;
};

/**
 * Tracking functions
 *
 * @class utils/Tracking
 */
const Tracking = {
	/**
	 * Initialize tracking scripts
	 *  @return {void}
	 */

	getSesstionId: function() {
		const currentTime = Date.now();
		const sessionLength = 1800000;

		sessionID = localStorageHelpers.getItem('pd_amplitude_session_id');

		if (!sessionID || currentTime - sessionID > sessionLength) {
			localStorageHelpers.setItem('pd_amplitude_session_id', currentTime);
			sessionID = currentTime;
		}

		return sessionID;
	},

	initialize: function(user, signupData, mailConnections) {
		if (!isAnalyticsSet) {
			return;
		}

		this.user = user;

		/* Segment.com "load" call to load scripts */
		try {
			analytics.load(app.config.segmentKey);
		} catch (e) {
			logger.remote('info', 'Failed to load Segment scripts; already initialized?', {
				reason: e.message,
				initialized: analytics.initialized,
				invoked: analytics.invoked
			});
		}

		const userEmail = user.get('email');
		const isQaTester = userEmail && userEmail.match(/^.*test.pipedrive.com$/i);

		if (!isQaTester) {
			this.identify(user, signupData, mailConnections);
		}
	},

	identify: async function(user, signupData, mailConnections) {
		if (!isAnalyticsSet) {
			return;
		}

		const userId = user.get('id');
		const companyPlan = user.get('current_company_plan');
		const companyAddTime = user.get('company_add_time');
		const companyStatus = user.get('company_status');
		const today = moment();
		const userCreated = user.get('created');
		const userLanguage = user.get('language');
		const isAdmin = user.get('is_admin') ? 'yes' : 'no';
		const [
			companyEnabledFeaturesFirst,
			companyEnabledFeaturesSecond
		] = splitCompanyFeaturesArray(getCompanyFeatures(user));
		const traits = {
			'billing_cycle': user.get('current_company_plan').billing_cycle,
			'billing_plan': companyPlan && companyPlan.tier_code,
			'billing_plan_code': companyPlan && companyPlan.code,
			'company_add_date': user.get('company_add_time'),
			'company_age': today.diff(companyAddTime, 'days'),
			'company_country': user.get('company_country'),
			'company_enabled_features': companyEnabledFeaturesFirst,
			'company_enabled_features_2': companyEnabledFeaturesSecond,
			'company_id': user.get('company_id'),
			'company_mrr': user.get('current_company_mrr'),
			'company_status': companyStatus,
			'default_currency': user.settings.get('default_currency'),
			'has_created_company': user.get('has_created_company'),
			'is_admin': isAdmin,
			'is_pipedrive_internal_user': user.get('email').endsWith('@pipedrive.com'),
			'language':
				userLanguage && `${userLanguage.language_code}-${userLanguage.country_code}`,
			'locale': userLanguage && `${userLanguage.language_code}-${userLanguage.country_code}`,
			'marketplace_app': (await getInstalledVideoCallApps()).map((app) => app.client_id),
			'new_navigation_enabled': true,
			'paying_days_count': getPayingDaysCount(user),
			'screen_height': screen.height,
			'screen_width': screen.width,
			'seat_count': user.get('seats_quota'),
			'settings': await getUserSettings(user),
			'sso_enabled': user.settings.get('sso_login_enabled'),
			'sso_enforced': user.settings.get('enforce_sso'),
			'started_paying_date': user.get('started_paying_time'),
			'trial_days_count': getTrialDaysCount(user),
			'user_account_age': today.diff(userCreated, 'days'),
			'user_activated_features': await getUserActivatedFeatures(user, mailConnections),
			'user_add_date': user.get('created'),
			'user_company_count': Object.keys(user.get('companies')).length,
			'user_count': user.get('user_count'),
			'user_id': userId,
			'user_suites': user.get('suites'),
			'user_locale': user.get('locale'),
			'user_permissions': getUserPermissions(user),
			'2fa_enabled': user.get('2fa_enabled')
		};

		traits.signup_data = getSignupDataUserProperties(signupData.data, user);

		/* Segment.com "identify" call to global analytics object */
		analytics.identify(this.uuid, traits);

		logger.log('Identify user:', this.uuid, traits);
	},

	/**
	 * The track method lets you record any actions users perform.
	 * Tracking.track(event, [properties], [options], [callback]);
	 * @param  {string} name. The name of the event you’re tracking.
	 * @param  {object} properties (optional) A dictionary of properties for the event.
	 *     If the event was 'Added deal', it might have properties like title and value.
	 * @param  {object} options (optional) A dictionary options, that let you do things like
	 *     enable or disable specific integrations for the call.
	 * @param  {function} callback (optional) A callback function that gets called after
	 *     a short timeout, giving the browser time to make the track requests first.
	 * @return {void}
	 */
	track: function(name, properties = {}, options = {}, callback) {
		if (!isAnalyticsSet) {
			return;
		}

		const optionsWithAmplitude = {
			...options,
			integrations: {
				Amplitude: {
					session_id: this.getSesstionId()
				},
				...options.integrations
			}
		};

		const page = window.location.pathname.split('/')[1];
		const enhancedProps = { page, ...properties, ...this.ids };

		/* Segment.com "track" call to global analytics object */
		analytics.track(name, enhancedProps, optionsWithAmplitude, () => {
			if (_.isFunction(callback)) {
				return callback();
			}
		});

		logger.log('Track event:', name, enhancedProps);
	},

	/**
	 * The page method lets you record page views on your website,
	 *     along with optional extra information about the page being viewed.
	 * @param  {string} category (optional) The category of the page.
	 *      Useful for things like ecommerce where many pages might live under a larger category.
	 *      Note: if you only pass one string to page we assume it’s a name, not a category.
	 *      You must include a name if you want to send a category.
	 * @param  {string} name (optional) The name of the of the page, for example Signup or Home.
	 * @param  {object} properties (optional) A dictionary of properties of the page.
	 *      We’ll automatically send the url, title, referrer and path, but you can add your own too.
	 * @param  {object} options (optional) A dictionary options, that let you do things
	 *     like enable or disable specific integrations for the call.
	 * @param  {function} callback (optional) A callback function that gets called
	 *     after a short timeout, giving the browser time to make outbound requests first.
	 * @return {void}
	 */
	page: function(category, name, properties = {}, options = {}, callback) {
		if (!isAnalyticsSet) {
			return;
		}

		const propertiesWithIds = { ...properties, ...this.ids };

		/* Remove Vero integration from page methods to save money, Vero is by default enabled via Segment */
		const optionsWithoutVero = {
			...options,
			integrations: {
				Vero: false,
				...options.integrations
			}
		};

		/* Segment.com "page" call to global analytics object */
		analytics.page(category, name, propertiesWithIds, optionsWithoutVero, () => {
			if (_.isFunction(callback)) {
				return callback();
			}
		});

		if (!_.isString(name) && _.isString(category)) {
			name = category;
		}

		logger.log('Track page view:', name, propertiesWithIds);
	},

	/**
	 * As userId is has been used as uuid in segment,
	 * user_id is needed for joining data without parsing the id combained from company_id and user_id
	 * as companyId and company_id are used by different analytics teams, both need to exist
	 */
	get ids() {
		const pdUserId = this.user.get('id');
		const pdCompanyId = this.user.get('company_id');

		return {
			userId: [pdCompanyId, pdUserId].join(':'),
			user_id: pdUserId,
			companyId: pdCompanyId,
			company_id: pdCompanyId
		};
	},

	get uuid() {
		const userId = this.user.get('id');
		const companyId = this.user.get('company_id');

		return [companyId, userId].join(':');
	}
};

module.exports = Tracking;
