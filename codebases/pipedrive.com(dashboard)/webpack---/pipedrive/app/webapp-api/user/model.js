const _ = require('lodash');
const { Model, Collection } = require('@pipedrive/webapp-core');
const Logger = require('@pipedrive/logger-fe').default;

const UserSettings = require('models/settings');
const UserCounts = require('models/counts');
const UserProfile = require('models/profile');
const Jwt = require('models/jwt');
const CompanyFeatures = require('models/company-features');
const UserFields = require('models/user-fields');

const CustomViews = require('collections/custom-views');
const Pipelines = require('collections/pipelines');
const AlternativeEmails = require('collections/mail/alternative-emails');

const GraphqlModel = require('models/graphql');
const { getUserSelf, parseToOldUsersSelf } = require('client/graphql/queries/user-self');

const logger = new Logger(`webapp.${app.ENV}`, 'userModel');

const UserModel = GraphqlModel.extend(
	/** @lends  models/User.prototype */ {
		/** @private */
		graph: () => ({ query: getUserSelf, fetchPolicy: 'no-cache' }),
		url: null,
		/** @private */
		pendingCallbacks: [],
		/** @private */
		ready: false,

		/**
		 * @const {String}
		 * @default
		 */
		type: 'user',

		allowDirectSync: true,

		/**
		 * Fallback data if any of the values are empty in API response
		 * @const {Object}
		 * @enum {string}
		 */
		fallback: {
			/** Fallback name */
			name: 'N/A',
			/** Fallback currency */
			default_currency: 'EUR',
			/** Fallback timezone name */
			timezone_name: 'Europe/Helsinki',
			/** Fallback avatar (blue dude) */
			icon_url: `${app.config.static}/images/icons/profile_120x120.svg`,
			/** Fallback locale */
			locale: 'en_US',
			/** Fallback language */
			language: { language_code: 'en', country_code: 'US' }
		},

		/**
		 * Default user settings and company features. It’s most likely
		 * not used any more, but just in case API does not give any values
		 * for these properties
		 * @type {Object}
		 */
		defaultSettings: {
			features: {
				products: false,
				product_duration: false,
				notifications: true
			},
			counts: {
				unread_email_threads_count: 0,
				unread_email_threads_with_label_none_count: 0,
				unread_email_threads_with_label_archive_count: 0,
				unread_email_threads_with_label_with_open_deal_count: 0,
				unread_email_messages_count: 0,
				unread_email_messages_with_label_none_count: 0,
				unread_email_messages_with_label_archive_count: 0,
				unread_email_messages_with_label_with_open_deal_count: 0,
				overdue_activities_count: 0
			},
			permissions: {
				can_change_visibility_of_items: 0
			},
			fields: {
				person: [],
				organization: [],
				deal: [],
				product: []
			},
			profile: {
				has_notifications: false,
				has_taf_notifications: false
			}
		},

		/**
		 * Default permissions for admin users. Admin user flag is taken
		 * from the API.
		 * @type {Object}
		 */
		adminPermissions: {
			can_change_visibility_of_items: 1,
			can_see_company_wide_statistics: 1,
			can_delete_deals: 1,
			can_add_products: 1,
			can_see_deals_list_summary: 1,
			can_export_data_from_lists: 1,
			can_see_other_users: 2,
			can_see_other_users_statistics: 1,
			can_follow_other_users: 1,
			default_deal_visibility: 3,
			default_org_visibility: 3,
			default_people_visibility: 3,
			default_product_visibility: 3
		},

		/**
		 * User model (aka `/self` request) contains all the data needed to
		 * render the application in a certain user state (user’s company,
		 * permissions, default pipelines, configured custom fields, etc.)
		 *
		 * @class Singleton User class that is shared across the app
		 * @augments module:Model
		 * @constructs
		 */
		initialize: function() {
			if (!this.get('name')) {
				this.set({ name: this.fallback.name });
			}

			app.global.bind('userSetting.model.default_currency.update', (model) => {
				this.set('default_currency', model.get('default_currency'));
			});
		},

		/**
		 * Destroys {@link models/User}
		 * @void
		 */
		clear: function() {
			this.destroy();
		},

		/** Parses API response to additionalData and submodels */
		parse: function(response /* , options */) {
			const data = parseToOldUsersSelf(response.data);
			const additionalData = data.additional_data;

			response = {
				loading: false,
				networkStatus: 7,
				stale: false,
				success: true,
				data,
				additional_data: additionalData
			};

			this.additionalData = additionalData;
			response.data.counts = {};

			const responseData =
				response instanceof Model ? { data: response.attributes } : response;

			app.global.user_id = response.data.id;
			app.global.company_id = response.data.company_id;

			this.setSubmodel('settings', UserSettings, responseData, 'current_user_settings');
			this.setSubmodel('counts', UserCounts, responseData);
			this.setSubmodel('profile', UserProfile, responseData);
			this.setSubmodel('jwt', Jwt, { data: { jwt: '' } });
			this.setSubmodel(
				'companyFeatures',
				CompanyFeatures,
				responseData,
				'current_company_features'
			);
			this.setSubmodel('companyFeatures', CompanyFeatures, responseData);
			this.setSubmodel('fields', UserFields, responseData);
			this.setSubmodel('customViews', CustomViews, responseData, 'custom_views');
			this.customViews.setUser(this);
			this.setSubmodel('pipelines', Pipelines, responseData, 'pipelines');
			this.setSubmodel(
				'alternativeEmails',
				AlternativeEmails,
				responseData,
				'alternative_emails'
			);

			return response.data;
		},

		/**
		 * Sets User submodel values
		 * @param {String} key      Submodel name to set
		 * @param {module:Model} Model Model to use for
		 *                          submodel (settings, counts, jwt or
		 *                          companyFeatures)
		 * @param {object} response Returns submodel data or undefined
		 */
		setSubmodel: function(key, Model, response, responseKey) {
			responseKey = responseKey || key;

			if (!response || !response.data || !(responseKey in response.data)) {
				return;
			}

			if (!key) {
				return;
			}

			let data = this.defaultSettings[key]
				? _.assignIn(this.defaultSettings[key], response.data[responseKey])
				: response.data[responseKey];

			if (_.isString(data)) {
				const keyValue = data;

				data = {};
				data[key] = keyValue;
			}

			if (this.hasOwnProperty(key) && _.isObject(this[key])) {
				this[key].set(data, { silent: true });
			} else {
				this.createSubmodel(key, Model, data);
			}

			delete response.data[responseKey];
		},

		/**
		 * Creates User submodel with values
		 */
		createSubmodel: function(key, Model, data) {
			const model = (this[key] = new Model(data));

			if (model instanceof Collection) {
				this[key].id = this[key].cid;
			} else {
				this[key].set('id', this[key].cid);
				_.unset(this[key].changed, 'id');
			}
		},

		/**
     * Return {@link models/User} data asynchronously
     *
     * If {@link models/User} has not been fetched, puts the callbacks
     * to queue, fetches data from the API, then fires all callbacks.

     * @param  {Function} callback      Callback to call when API returns success
     * @param  {Function} errorCallback Callback to call in case of API error
     * @void
     */
		getUser: function(callback, errorCallback) {
			const self = this;

			if (this.fetching) {
				this.pendingCallbacks.push({ callback, error: errorCallback });
			} else if (this.ready) {
				return callback(this);
			} else {
				this.fetching = true;
				this.pendingCallbacks.push({ callback, error: errorCallback });

				this.pull({
					success: function(user) {
						self.fetching = false;
						user.ready = true;

						self.setUserPermissions(user);
						self.insertHelpersIntoCurrentCompanyPlan();

						if (self.pendingCallbacks.length) {
							_.forEach(self.pendingCallbacks, (object) => {
								if (_.isFunction(object.callback)) {
									object.callback(user);
								}
							});
							self.pendingCallbacks = [];
						}

						if (self.additionalData && self.additionalData.serverTime) {
							app.timeOffset = new Date() - new Date(self.additionalData.serverTime);
							logger.log('Time offset:', app.timeOffset);
						}
					},
					error: function(model, xhr, data) {
						if (xhr?.status === 404 && data?.default) {
							const pattern = /([-._\w+]+)\.([a-z]+)\.pipedrive\.(dev|net|com)/;
							const match = location.host.match(pattern);
							const path = location.pathname.match(/^\/[^/]+/);

							if (match) {
								location.href = `${location.protocol}//${match[0].replace(
									match[1],
									data.default
								)}${path ? path[0] : '/'}`;

								return;
							}
						} else if (xhr?.status !== 404 && self.pendingCallbacks.length) {
							for (let i = 0; i < self.pendingCallbacks.length; i++) {
								if (_.isFunction(self.pendingCallbacks[i].error)) {
									self.pendingCallbacks[i].error(model, xhr, data);
								}
							}
							self.pendingCallbacks = [];
						}
					}
				});
			}
		},

		/**
		 * Updates user data
		 *
		 * Behaves the same way as getUser, only this forces update, whereas
		 * consecutive getUser calls only return data.
		 * @see    {@link models/User#getUser}
		 * @param  {Function} callback      Callback to call when API returns success
		 * @param  {Function} errorCallback Callback to call in case of API error
		 * @void
		 */
		updateUser: function(callback, errorCallback) {
			this.ready = false;
			this.fetching = false;
			this.getUser(callback, errorCallback);
		},

		/**
		 * Returns custom_view fields of a specific type
		 * @param  {String} type Type of fields to return (possible values
		 *                       product, person, organization, deal, activity, user)
		 * @return {Array}
		 */
		getCustomViewFields: function(type) {
			return (_.find(this.get('custom_views'), { view_type: type }) || {}).fields;
		},

		getCustomFieldSubfield: function(type, subfieldKey) {
			const customFieldKey = subfieldKey.slice(0, 40);
			const customField = this.fields.getByKey(type, customFieldKey);

			if (customField.subfields) {
				return _.find(customField.subfields, { key: subfieldKey });
			}
		},

		/**
		 * Returns custom_view columns object with key and name
		 * @param  {String} type Type of fields to return (possible values
		 *                       product, person, organization, deal, activity, user)
		 * @return {Array}       Returns array of objects. Example: {
		 *                                name: 'Name',
		 *                                email: 'Email',
		 *                                org_id: 'Organization',
		 *                                owner_id: 'Owner',
		 *                                open_deals_count: 'Open deals'
		 *                                }
		 * @deprecated Should use directly `User.customViews`.
		 */
		getCustomViewColumns: function(type) {
			return this.customViews.getView(type).getColumnsFields();
		},

		/**
		 * Get Activity Type Icon by a secified type
		 *
		 * This prepares {@link models/User#activityTypes} object hash for
		 * easier retrieval of activity type icons. From the API, only
		 * enumerated list of icons is available, this allows direct access to
		 * icons via icon key.
		 * @param  {String} type Activity Type icon name
		 * @return {Object}
		 */
		getActivityIconByType: function(type) {
			let icon = 'activity';

			if (!this.activityTypes) {
				/**
				 * List of all activity types and their icon and name data
				 * @this {models/User}
				 * @type {Object}
				 */
				this.activityTypes = {};
				this.get('activity_types').map(
					_.bind(function(o) {
						this.activityTypes[o.key_string] = o;
					}, this)
				);
			}

			if (type in this.activityTypes) {
				const activityType = this.activityTypes[type];

				icon = activityType.icon_key || activityType.key_string;
			}

			return icon;
		},

		/**
		 * Returns the user's activity types and ensures correct ordering.
		 *
		 * @return {Object} Activity types
		 */
		getActivityTypes: function(active) {
			const activityTypes = _.sortBy(this.get('activity_types'), 'order_nr');

			return active ? _.filter(activityTypes, { active_flag: true }) : activityTypes;
		},

		/**
		 * Returns the user's deactivated activity types and ensures correct ordering.
		 *
		 * @return {Object} Activity types
		 */
		getDeactivatedActivityTypeNames: function() {
			const deactivatedTypes = _.filter(this.getActivityTypes(), { active_flag: false });

			return _.map(deactivatedTypes, 'key_string');
		},

		/**
		 * Returns if user has profile image or default image is used
		 * @return {Boolean} true if user has profile image
		 */
		hasProfileImage: function() {
			return this.get('icon_url') !== this.fallback.icon_url;
		},

		setUserPermissions: function(user) {
			const regularUserPermissions = [
				'can_see_company_wide_statistics',
				'can_see_other_users_statistics',
				'can_see_other_users'
			];
			const isAdmin = this.get('is_admin');
			const permissionsTurnedOn = {};

			this.permissions = isAdmin ? this.adminPermissions : this.defaultSettings.permissions;

			if (isAdmin) {
				return;
			}

			_.forEach(regularUserPermissions, (permission) => {
				permissionsTurnedOn[permission] = user?.settings?.get(permission) ? 1 : 0;
			});

			this.permissions = permissionsTurnedOn;
		},

		getCompanyDomainName: function() {
			const activeCompany = this.get('companies')[this.get('company_id')];

			return _.get(activeCompany, 'domain');
		},

		setTierNames: function(translator) {
			if (this.companyFeatures.get('apollo_best_billing')) {
				this.set({
					tier_names: {
						get silver() {
							return translator.gettext('Essential');
						},
						get gold() {
							return translator.gettext('Advanced');
						},
						get platinum() {
							return translator.gettext('Professional');
						},
						get diamond() {
							return translator.gettext('Enterprise');
						}
					}
				});

				return;
			}

			this.set({
				tier_names: {
					get silver() {
						return translator.gettext('Silver');
					},
					get gold() {
						return translator.gettext('Gold');
					},
					get platinum() {
						return translator.gettext('Platinum');
					}
				}
			});
		},

		insertHelpersIntoCurrentCompanyPlan: function() {
			const planHelpers = {
				isGoldOrHigher: this.isGoldOrHigher(),
				isPlatinumOrHigher: this.isPlatinumOrHigher()
			};

			this.set({
				current_company_plan: {
					...this.get('current_company_plan'),
					...planHelpers
				}
			});
		},

		getCurrentCompanyTier: function() {
			let tier = this.get('current_company_plan')
				? this.get('current_company_plan').tier_code
				: null;

			/**
			 * If an unknown plan comes from the BE, fallback to 'silver'.
			 */
			if (!tier) {
				tier = 'silver';
			}

			return tier;
		},

		isSilver: function() {
			return this.getCurrentCompanyTier() === 'silver';
		},

		isGold: function() {
			return this.getCurrentCompanyTier() === 'gold';
		},

		/**
		 * @deprecated Use {@link User.isGoldOrHigher} instead
		 * @return {boolean}
		 */
		isGoldOrPlatinum: function() {
			return _.includes(['gold', 'platinum'], this.getCurrentCompanyTier());
		},

		/**
		 * @deprecated Use {@link User.isPlatinumOrHigher} instead
		 * @return {boolean}
		 */
		isPlatinum: function() {
			return _.includes(['platinum'], this.getCurrentCompanyTier());
		},

		isGoldOrHigher: function() {
			return !this.isSilver();
		},

		isPlatinumOrHigher: function() {
			return !this.isSilver() && !this.isGold();
		},

		isSilverAdmin: function() {
			return this.get('is_admin') && this.isSilver();
		},

		isValidatedEmailAddress: function(address) {
			const addresses = this.alternativeEmails.getConfirmedAddresses();

			addresses.push(this.get('email'));

			return _.includes(addresses, address);
		},

		getLanguage: function() {
			const { language_code: languageCode, country_code: countryCode } = this.get('language');

			return `${languageCode}-${countryCode}`;
		},

		hasSuite: function(suite) {
			if (!suite) {
				return false;
			}

			const suites = this.get('suites');

			return suites.includes(suite);
		},

		getPipelines: function() {
			return _.sortBy(
				this.pipelines
					.filter((pipeline) => pipeline.get('active'))
					.filter((pipeline) =>
						this.get('stages').some((stage) => stage.pipeline_id === pipeline.id)
					)
					.map((pipeline) => ({
						id: pipeline.get('id'),
						label: pipeline.get('name'),
						orderNr: pipeline.get('order_nr')
					})),
				'order_nr'
			);
		}
	}
);

module.exports = UserModel;
