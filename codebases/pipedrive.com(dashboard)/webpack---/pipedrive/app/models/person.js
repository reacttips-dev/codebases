const SyncEventModel = require('models/sync-event');
const _ = require('lodash');
const CustomFieldHelper = require('models/customfieldhelper');
const fieldModelMapUtils = require('utils/field-model-map');
const PDMetrics = require('utils/pd-metrics');

module.exports = SyncEventModel.extend(CustomFieldHelper).extend(
	/** @lends models/Person.prototype */ {
		readonly: ['cc_email', 'won_deals_count', 'lost_deals_count'],
		getMatchingFilters: true,

		urlRoot: `${app.config.api}/persons`,

		/**
		 * Type of the model
		 * @type {String}
		 * @default
		 */
		type: 'person',

		allowDirectSync: true,

		/**
		 * Fallback attributes for when name or icon_url is missing
		 * @type {Object}
		 * @enum {String}
		 */
		fallback: {
			/**
			 * Fallback avatar of the person (blue dood)
			 * @type {String}
			 * @default '/images/icons/profile_120x120.jpg'
			 */
			icon_url: `${app.config.static}/images/icons/profile_120x120.svg`
		},

		relationKey: 'person_id',

		/**
		 * Map specific fields to models
		 * @type {Object}
		 * @enum {Object}
		 */
		fieldModelMap: fieldModelMapUtils.buildFieldModelMapFn(['person', 'organization']),

		/**
		 * Person model that also updates itself automatically from web socket.
		 *
		 * @classdesc Person model
		 * @constructs
		 * @augments {module:Pipedrive.Model}
		 * @void
		 */
		initialize: function() {
			this.selfUpdateFromSocket();
		},

		getLink: function() {
			return !this.isNew() && `/person/${this.get('id')}`;
		},

		/**
		 * get attribute used by other models to relate to this
		 * for deal it is {deal_id: 123}
		 *
		 * @return {Object}
		 */
		getRelatedBy: function() {
			return { person_id: this.get('id') };
		},

		/**
		 * Gets the persons picture URL.
		 * @param  {string} size The size string of the picture required.
		 *     If it's large then 512px wide image is returned. Otherwise 128px wide image is returned.
		 * @return {string} URL of the picture.
		 */
		getPictureUrl: function(size) {
			const pictureId = this.get('picture_id');
			const requiredSize = size === 'large' ? 512 : 128;

			let url;

			if (!pictureId) {
				return '';
			}

			const picture = this.getRelatedData('picture', pictureId);

			if (
				picture &&
				_.isObject(picture.pictures) &&
				picture.pictures.hasOwnProperty(requiredSize)
			) {
				url = picture.pictures[requiredSize];
			}

			return url;
		},

		/**
		 * merge another person into this person. On properties conflict, the current person wins
		 * @param  {dealModel} anotherDeal will be deleted
		 * @void
		 */
		merge: function(another, options) {
			const data = {
				merge_with_id: this.id
			};

			this.save(
				data,
				_.assignIn(options, {
					url: `${app.config.api}/persons/${another.get('id')}/merge`
				})
			);
		},

		/**
		 * Extends the core model's sync method. Adds a success callback to track new
		 * person creation, if parameter "method" = "create".
		 */
		sync: function(method, model, options) {
			if (method === 'create') {
				options = options || {};

				const success = options.success;

				options.success = _.bind(function() {
					if (_.isFunction(success)) {
						// eslint-disable-next-line prefer-rest-params
						success.apply(this, arguments);
					}

					this.sendNRTrackingData();
				}, this);
			}

			return SyncEventModel.prototype.sync.call(this, method, model, options);
		},

		/**
		 * Sends new person creation related data to New Relic
		 * @void
		 */
		sendNRTrackingData: function() {
			const nrData = {
				'person.action': 'create_new',
				'person.create_new.automatic': false,
				'person.create_new.user_id': app.global.user_id,
				'person.create_new.company_id': app.global.company_id
			};

			PDMetrics.addPageAction('person:actions', nrData);
		},

		hasEmailAddress: function(email) {
			const personEmail = this.get('email');

			return typeof personEmail === String
				? personEmail === email
				: _.find(personEmail, ['value', email]);
		},

		unsetAddressAttribute: function(attributes) {
			if (_.isObject(attributes[0])) {
				delete attributes[0].address_geocoded;
				delete attributes[0].address;
			}

			if (this.hasChanged('address')) {
				const changedAttributes = _.clone(this.changedAttributes() || {});

				// eslint-disable-next-line no-undefined
				changedAttributes.address = undefined;
				// eslint-disable-next-line no-undefined
				changedAttributes.address_geocoded = undefined;
				this.set(changedAttributes, { silent: true });
			}
		}
	}
);
