const _ = require('lodash');
const moment = require('moment');
const Pipedrive = require('pipedrive');
const SyncEventModel = require('models/sync-event');
const User = require('models/user');
const Company = require('collections/company');
const Cookies = require('js-cookie');
const CustomFieldHelper = require('models/customfieldhelper');
const fieldModelMapUtils = require('utils/field-model-map');
const validateRequiredFields = require('utils/validate-required-fields');
const webappComponentLoader = require('webapp-component-loader');
const logger = new Pipedrive.Logger('deal', 'model');

const DealModel = SyncEventModel.extend(CustomFieldHelper).extend({
	allowDirectSync: true,
	ownerKey: 'user_id',
	readonly: [
		'next_activity_subject',
		'next_activity_date',
		'next_activity_time',
		'next_activity_type',
		'next_activity_duration',
		'next_activity_note',
		'next_activity_id',
		'last_activity_subject',
		'last_activity_date',
		'last_activity_time',
		'last_activity_id',
		'close_time',
		'stage',
		'stage_change_time',
		'stage_order_nr',
		'update_time',
		'formatted_value',
		'group_id',
		'permission_group_id',
		'visible_to_groups',
		'weighted_value',
		'formatted_weighted_value',
		'active',
		'rotten_time',
		'org_name',
		'org_hidden',
		'person_name',
		'person_hidden',
		'owner_name',
		'stay_in_pipeline_stages',
		'age',
		'cc_email',
		'organization',
		'person'
	],
	getMatchingFilters: true,
	/**
	 * Map specific fields to models
	 * @type {Object}
	 * @enum {Object}
	 */
	fieldModelMap: fieldModelMapUtils.buildFieldModelMapFn(['person', 'organization']),

	url: function() {
		if (!this.get('id')) {
			return `${app.config.api}/deals`;
		}

		return `${app.config.api}/deals/${this.get('id')}`;
	},

	type: 'deal',

	relationKey: 'deal_id',

	initialize: function() {
		this.addListeners();

		this.on('afterPull', _.bind(this.addListeners, this));

		app.global.bind(`deal.model.${this.get('id')}.delete`, this.updateDeleted, this);
		app.global.bind(`deal.model.${this.get('id')}.update`, this.trackSocketReliability, this); // temporary

		this.selfUpdateFromSocket();
	},

	// tracking events temporary
	trackSocketReliability(update) {
		const isFromSocket = !!update?.meta?.routingKey;

		if (this._socketTimeout && isFromSocket) {
			// tracking is active and real socket event has arrived, all ok this time!
			clearTimeout(this._socketTimeout);
			this._socketTimeout = null;
		} else if (!this._socketTimeout && !isFromSocket) {
			// not tracking yet and virtual socket event - expect real socket event soon
			this._socketTimeout = setTimeout(() => {
				logger.remote('warning', 'No socket update event after deal change in 30 seconds');
				this._socketTimeout = null;
			}, 30e3);
		}
	},

	getLink: function() {
		return !this.isNew() && `/deal/${this.get('id')}`;
	},

	addListeners: function() {
		this.removeListeners();

		if (this.get('org_id')) {
			app.global.bind(
				`organization.model.${this.get('org_id')}.update`,
				this.updateOrg,
				this
			);
		}

		if (this.get('person_id')) {
			app.global.bind(
				`person.model.${this.get('person_id')}.update`,
				this.updatePerson,
				this
			);
		}
	},

	removeListeners: function() {
		if (this.get('org_id')) {
			app.global.unbind(
				`organization.model.${this.get('org_id')}.update`,
				this.updateOrg,
				this
			);
		}

		if (this.get('person_id')) {
			app.global.unbind(
				`person.model.${this.get('person_id')}.update`,
				this.updatePerson,
				this
			);
		}
	},

	updateOrg: function(orgModel) {
		if (orgModel.get('name') !== this.get('org_name')) {
			this.set({
				org_name: orgModel.get('name')
			});

			// hack - because org_name is in readonly and filtered out of change list, we must trigger this ourselve
			this.trigger('change:org_name', this);
		}
	},

	updatePerson: function(model) {
		if (model.get('name') !== this.get('person_name')) {
			this.set({
				person_name: model.get('name')
			});

			// hack - because person_name is in readonly and filtered out of change list, we must trigger this ourselve
			this.trigger('change:person_name', this);
		}
	},

	updateDeleted: function() {
		this.set({
			status: 'deleted'
		});
	},

	/**
	 * merge another deal into this deal. On properties conflict, the current deal wins
	 * @param {dealModel} anotherDeal will be deleted
	 * @param {Object} options
	 * @void
	 */
	merge: function(anotherDeal, options) {
		const data = {
			merge_with_id: this.id
		};

		this.save(
			data,
			_.assignIn(options, {
				url: `${app.config.api}/deals/${anotherDeal.get('id')}/merge`
			})
		);
	},

	/**
	 * dealUpdateProperties and backboneModelSave are separated because:
	 * - dealUpdateProperties: we need to know which properties were updated to decide whether we want to check for required fields or not
	 * - backboneModelSave: in some cases, this will be `null` because the backbone model properties are already set prior to calling the save function
	 */
	saveIfRequiredFieldsPopulated: async function(
		dealUpdateProperties,
		backboneModelSave = {},
		options
	) {
		if (this.get('id')) {
			validateRequiredFields({
				dealModel: this,
				dealUpdateProperties,
				updateDealOnSave: true,
				onSave: () => {
					this.save(backboneModelSave, options);
				},
				onError: () => this.save(backboneModelSave, options),
				onCancel: () => {
					if (options.cancel) {
						options.cancel(backboneModelSave);
					}
				}
			});

			return;
		}

		this.save(backboneModelSave, options);
	},

	/**
	 * duplicate deal
	 */
	duplicateDeal: function(options) {
		const newDeal = new DealModel();

		newDeal.save(
			{ _forceSave: true },
			_.assignIn(options, {
				url: `${app.config.api}/deals/${this.id}/duplicate`
			})
		);
	},

	/**
	 * download deal
	 */
	download: function() {
		window.location.href = `${app.config.api}/deals/${
			this.id
		}/download?session_token=${Cookies.get('pipe-session-token')}`;
	},

	convertToLead: async function() {
		const modals = await webappComponentLoader.load('froot:modals');

		const isInContextualView = window.location.pathname.includes('/activities/');

		const navigateBack = () => app.router.go(null, '/', true, false);

		const params = {
			dealId: this.id,
			onCloseCallback: isInContextualView ? null : navigateBack,
			view: 'Detail'
		};

		modals.open('leadbox-fe:convert-modal', params);
	},

	/**
	 * get attribute used by other models to relate to this
	 * for deal it is {deal_id: 123}
	 *
	 * @return {Object}
	 */
	getRelatedBy: function() {
		return { deal_id: this.get('id') };
	},

	isDeleted: function() {
		return this.get('deleted');
	},

	getCustomTypeIcon: function(activityType) {
		return User.getActivityIconByType(activityType);
	},

	daysInStage: function(stageModels) {
		return stageModels.map(
			_.bind(function(stage) {
				const time =
					this.get('stay_in_pipeline_stages') &&
					this.get('stay_in_pipeline_stages').times_in_stages[stage.id]
						? this.get('stay_in_pipeline_stages').times_in_stages[stage.id]
						: 0;
				const days = time > 0 ? Math.round(moment.duration(time, 'seconds').as('days')) : 0;

				return {
					id: stage.get('id'),
					name: stage.get('name'),
					days: time ? days : '',
					time,
					pipelineName: stage.get('pipeline_name')
				};
			}, this)
		);
	},

	hasRelatedPerson: function() {
		return !!this.get('person_id');
	},

	getRottingDuration: function(days) {
		const rottenTime = moment.utc(this.get('rotten_time')).local();
		const diff = moment().diff(rottenTime);
		const diffInDays = Math.abs(moment().diff(rottenTime, 'days'));

		if (diff < 0) {
			return null;
		}

		return days ? diffInDays : diff;
	},

	getRelatedPerson: function() {
		if (this.hasRelatedPerson()) {
			return this.getRelatedModel('person', this.get('person_id'));
		}

		return null;
	},

	getOwnerProfilePictureUrl: function() {
		const ownerId = this.get('user_id');
		const user = Company.getUserById(ownerId);

		if (user) {
			return user.get('icon_url');
		}
	},

	unbindAllSocketEvents: function() {
		app.global.unbind(`deal.model.${this.get('id')}.delete`, this.updateDeleted, this);
		app.global.unbind(`deal.model.${this.get('id')}.update`, this.trackSocketReliability, this); // temporary
		clearTimeout(this._socketTimeout); // temporary

		this.removeListeners();

		SyncEventModel.prototype.unbindAllSocketEvents.apply(this);
	}
});

module.exports = DealModel;
