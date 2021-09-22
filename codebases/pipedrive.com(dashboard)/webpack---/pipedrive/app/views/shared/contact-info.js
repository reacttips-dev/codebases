const Pipedrive = require('pipedrive');
const _ = require('lodash');
const User = require('models/user');
const Field = require('models/field');
const DropMenu = require('views/ui/dropmenu');
const VisibilityFieldView = require('views/shared/visibility-field');
const OwnerView = require('views/shared/owner');
const LabelDropmenu = require('components/labels-management/label-dropmenu');
const Template = require('templates/shared/contact-info.html');
const MarketplaceAppExtensions = require('views/shared/marketplace-app-extensions/index');
const webappComponentLoader = require('webapp-component-loader');
const modals = require('utils/modals');

/**
 * Info block for contact details page
 *
 * @param  {Object}
 * @class views/shared/ContactInfo
 * @augments module:Pipedrive.View
 */
module.exports = Pipedrive.View.extend(
	/** @lends views/shared/ContactInfo.prototype */
	{
		template: _.template(Template.replace(/>\s+</g, '><')),

		/**
		 * The default options set.
		 *
		 * @memberOf views/shared/ContactInfo
		 * @enum {String}
		 */
		defaultOptions: {
			/**
			 * Title of the change title popover.
			 * @type {string}
			 */
			titlePopoverTitle: _.gettext('Rename this contact:'),

			/**
			 * Text for the visibility switch tooltip.
			 * @type {string}
			 */
			visibilityTooltipText: _.gettext('Who else can see this contact?'),

			/**
			 * Array containing the buttons for settings.
			 * @type {array|function}
			 */
			settingsData: [],

			/**
			 * Class for icon
			 * @type {string}
			 */
			iconClass: 'personProfile',

			/**
			 * Add deal modal prefill property name
			 * @type {string}
			 */
			addDealModalPrefill: false,

			/**
			 * Allow photo upload. This currently only works for persons.
			 * @type {Boolean}
			 */
			allowPhotoUpload: false
		},

		/**
		 * Info block for contact details page.
		 *
		 * @param {Object} options     Options to set for the Contact info View.
		 *                             See {@link views/ui/ContactInfo.defaultOptions defaultOptions} for default options.
		 */
		initialize: function(options) {
			this.options = _.assignIn({}, this.defaultOptions, options);
			this.model.onChange('name active_flag picture_id', this.render, this);

			this.render();
		},

		selfRender: function() {
			this.$el.html(
				this.template({
					model: this.model,
					noTitle:
						!_.isString(this.model.get('name')) ||
						_.isEmpty(this.model.get('name').trim()),
					addDealModalPrefill: this.options.addDealModalPrefill,
					showActionsDropdown: !!this.getSettingsData().length,
					allowPictureUpload: this.options.allowPictureUpload,
					iconClass: this.options.iconClass
				})
			);

			this.addButtonDropMenu = new DropMenu({
				data: [
					{
						title: _.gettext('Add new deal'),
						click: _.bind(this.handleDealModalOpen, this)
					},
					{
						title: _.gettext('Add new lead'),
						click: _.bind(this.handleLeadModalOpen, this)
					}
				],
				target: this.$('.buttonAddDealLeadDropmenuOpener'),
				ui: 'arrowDropmenu',
				alignRight: true
			});

			if (this.options.addDealModalPrefill) {
				this.$('.buttonAddDeal').on(
					'click.contactInfo',
					_.bind(this.handleDealModalOpen, this)
				);
			}

			this.$('H1 .editable').on(
				'click.contactInfo',
				_.bind(async function(ev) {
					ev.preventDefault();

					const popover = await webappComponentLoader.load('webapp:popover');

					popover.open({
						popover: 'changefieldvalue',
						params: {
							model: this.model,
							title: this.options.titlePopoverTitle,
							fieldKey: 'name',
							position: 'bottom-start',
							target: ev.delegateTarget
						}
					});
				}, this)
			);

			this.initVisibilitySwitch();

			this.addView(
				'.ownerView',
				new OwnerView({
					model: this.model
				})
			);

			this.createActionsDropdown();

			if (this.options.allowPictureUpload) {
				this.$('.pictureUpload')
					.on(
						'click.contactInfo',
						_.bind(async function(ev) {
							ev.preventDefault();
							const popover = await webappComponentLoader.load('webapp:popover');

							popover.open({
								popover: 'picture-upload',
								params: {
									model: this.model,
									position: 'bottom-start',
									target: ev.delegateTarget,
									offset: 4
								}
							});
						}, this)
					)
					.tooltip({
						tip: _.isEmpty(this.model.getPictureUrl())
							? _.gettext('Add photo')
							: _.gettext('Change photo'),
						preDelay: 200,
						postDelay: 200,
						zIndex: 20000,
						fadeOutSpeed: 100,
						position: 'bottom',
						clickCloses: true
					});
			}

			const fieldKey = 'label';
			const fieldAttributes = User.fields.getByKey(this.model.type, fieldKey);

			if (fieldAttributes) {
				this.labelDropmenu = new LabelDropmenu({
					el: this.$('.label-component'),
					fieldKey,
					fieldModel: new Field(fieldAttributes, { type: this.model.type }),
					entityModel: this.model
				});
			}
		},

		handleDealModalOpen: async function() {
			if (this.options.addDealModalPrefill) {
				const addDealModalOptions = {};

				// Old API
				addDealModalOptions[this.options.addDealModalPrefill] = this.model;

				modals.open('webapp:modal', {
					modal: 'deal/add',
					params: {
						...addDealModalOptions,
						// New API
						prefill: {
							..._.bind(this.getPersonId, this)('person_id'),
							..._.bind(this.getOrgId, this)('org_id')
						}
					}
				});
			}
		},

		handleLeadModalOpen: function() {
			if (this.options.addDealModalPrefill) {
				const addDealModalOptions = {};

				addDealModalOptions[this.options.addDealModalPrefill] = this.model;

				const prefill = {
					...addDealModalOptions,
					prefill: {
						..._.bind(this.getPersonId, this)('related_person_id'),
						..._.bind(this.getOrgId, this)('related_org_id')
					}
				};

				if (this.options.addDealModalPrefill === 'prefill_person') {
					prefill.prefillRelatedEntities = _.bind(
						this.getPersonRelatedEntitiesPrefill,
						this
					)();
				} else if (this.options.addDealModalPrefill === 'prefill_org') {
					prefill.prefillRelatedEntities = {
						organization: this.model.attributes
					};
				}

				const params = {
					...prefill,
					type: 'lead',
					metricsData: {
						source: 'manual'
					}
				};

				modals.open('add-modals:froot', params);
			}
		},

		getPersonId: function(personFieldKey) {
			if (this.model.type === 'person') {
				return {
					[personFieldKey]: {
						id: this.model.get('id'),
						name: this.model.get('name')
					}
				};
			}
		},

		getOrgId: function(orgFieldKey) {
			if (this.model.type === 'organization') {
				return {
					[orgFieldKey]: {
						id: this.model.get('id'),
						name: this.model.get('name')
					}
				};
			}
			// In case a person has a linked organization

			if (this.model.get('org_id')) {
				return {
					[orgFieldKey]: {
						id: this.model.get('org_id'),
						name: this.model.get('org_name')
					}
				};
			}
		},

		getPersonRelatedEntitiesPrefill: function() {
			const prefillRelatedEntities = {
				person: this.model.attributes
			};

			const orgId = this.model.get('org_id');

			// when person has linked org, prefill it as well
			if (orgId && this.model.relatedObjects?.organization[orgId]) {
				prefillRelatedEntities.organization = this.model.relatedObjects.organization[orgId];
			}

			return prefillRelatedEntities;
		},

		initVisibilitySwitch: function() {
			this.selectVisibility = new VisibilityFieldView({
				model: this.model,
				tooltipText: this.options.visibilityTooltipText,
				tooltipPosition: 'bottom-end',
				small: true
			});

			this.addView('.selectVisibility', this.selectVisibility);
		},

		getSettingsData: function() {
			if (_.isFunction(this.options.settingsData)) {
				return this.options.settingsData();
			} else if (_.isArray(this.options.settingsData)) {
				return this.options.settingsData;
			}

			return [];
		},

		createActionsDropdown: function() {
			const settingsData = this.getSettingsData();
			const additionalActionsParams = {
				type: 'action',
				model: this.model,
				resource: this.model.type,
				view: 'details'
			};

			if (settingsData.length) {
				this.selectSettings = new DropMenu({
					target: this.$('.selectSettings'),
					ui: 'arrowDropmenu',
					alignRight: true,
					getContentOnOpen: true,
					activeOnClick: false,
					additionalActionsView: new MarketplaceAppExtensions(additionalActionsParams),
					onOpen: _.bind((d, dropMenuCallback) => {
						d.config.data = settingsData;
						dropMenuCallback();
					}, this)
				});
			} else {
				additionalActionsParams.renderDropdown = true;

				this.addView(
					'.additionalActions',
					new MarketplaceAppExtensions(additionalActionsParams)
				);
			}
		},

		onUnload: function() {
			if (this.labelDropmenu) {
				this.labelDropmenu.unload();
			}
		}
	}
);
