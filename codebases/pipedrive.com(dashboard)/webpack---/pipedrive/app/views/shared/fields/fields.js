const Pipedrive = require('pipedrive');
const _ = require('lodash');
const User = require('models/user');
const template = require('templates/shared/fields/fields.html');
const FieldView = require('views/shared/fields/field');
const NewFieldView = require('views/shared/fields/field-new');
const DropMenu = require('views/ui/dropmenu');
const FieldsOrderModel = require('models/fields-order');
const { Sortable } = require('sortablejs');
const $ = require('jquery');
const fieldUsageTracking = require('utils/analytics/field-component-usage-tracking');
const { addFlowCoachmark, closeFlowCoachmark } = require('utils/support/interface-tour');
const customFieldsCappingIndicator = require('components/custom-fields-capping/indicatorComponent');
const { requestCappingInfo } = require('components/custom-fields-capping/helpers');

/**
 * Create multiple Data Fields component
 *
 * Depends on Field component ({@link views/shared/Field})
 *
 * @example
 * <pre>
 * this.personFields = new FieldsView({
 *    type: 'person',
 *    model: new Person({ id: personId }),
 *    blacklist: ['visible_to', 'owner_id', 'org_id'],
 *    alwaysShow: ['name', 'phone', 'email']
 * });
 * </pre>
 *
 * @classdesc
 * Shows list of model fields and values. Values are editable one by one or as bulk edit.
 *
 * @param  {Object} options data and settings what fields and how to show
 * @class views/shared/Fields
 * @augments module:Pipedrive.View
 */

/**
 * Static reference to all possible component states
 *
 * @example
 * <pre>
 * personFields.setState(FieldsView.states.EDIT);
 * </pre>
 *
 * @type {Object}
 * @alias views/shared/Fields.states
 * @static
 * @enum
 */
const states = {
	PRELOADING: 'preloading',
	ERROR: 'error',
	READ: 'read',
	EDIT: 'edit',
	SAVING: 'saving',
	CUSTOMIZE: 'customize',
	EMPTY: 'empty'
};
const errorMessages = {
	403: _.gettext('You are not allowed to see this due to visibility settings.'),
	406: _.gettext('You are not allowed to see detailed information due to visibility settings.'),
	default: _.gettext('Data not available')
};
const emptyMessages = {
	deal: _.gettext('What else do you know about the deal?'),
	person: _.gettext('What else do you know about the person?'),
	organization: _.gettext('What else do you know about the organization?'),
	default: _.gettext('Would you like to add details?')
};
const logger = new Pipedrive.Logger('deal', 'fields');
const KEY = Pipedrive.common.keyCodes();

let activeEditor = null;

module.exports = Pipedrive.View.extend(
	/** @lends views/shared/Fields.prototype */
	{
		template: _.template(template.replace(/>\s+</g, '><')),
		states,
		/**
		 * Current state of view. Value is one of predefined states, see {@link views/shared/Fields.states}
		 * @type {String}
		 */
		state: null,

		/**
		 * Model where values are taken and updated
		 * @type {Model}
		 */
		model: null,

		/**
		 * Optional model of the page class.
		 * For example in deal details page person fields section the relatedModel is still Deal.
		 * @type {Model}
		 */
		relatedModel: null,

		/**
		 * Name of the object - this is shown above spinner before model data is pulled from server
		 * @type {String}
		 */
		name: null,

		/**
		 * Model type like "deal", "organization". Used in User.fields.get(type) to get fields list.
		 * @type {String}
		 */
		type: null,

		fields: [],

		/**
		 * List of fields keys which are not shown at all
		 *
		 * @example
		 * <pre>
		 * blacklist: ['visible_to', 'owner_id', 'org_id']
		 * </pre>
		 * @type {Array}
		 */
		blacklist: [],

		/**
		 * List of fields which are always shown, even if they have no value. Usually most important fields.
		 * @example
		 * <pre>
		 * alwaysShow: ['name', 'phone', 'email']
		 * </pre>
		 *
		 * @type {Array}
		 */
		alwaysShowFields: [],

		fieldViews: [],

		expanded: false,

		/**
		 * Optional parameter to show a footer template view when needed.
		 */
		footerView: null,

		confirmOnCancel: _.gettext(
			'You haven’t saved your previous changes yet. Are you sure you want to continue?'
		),
		confirmOnPageExit: _.gettext(
			'You haven’t saved your changes yet. Do you want to leave this page without saving?'
		),

		initialize: function(options, subFieldOptions) {
			this.options = options;
			this.subFieldOptions = subFieldOptions;

			this.type = options.type;
			this.name = options.name;
			this.relatedModel = options.relatedModel;
			this.footerView = options.footerView;
			this.conditionsCollection = this.options.conditionsCollection;
			this.additionalFields = options.additionalFields;
			this.additionalFieldsSort = options.additionalFieldsSort;

			// Blacklist and always visible fields have to be defined before getting all the fields
			this.initializeFieldDisplayOptions();
			this.fields = this.getFields();

			if (!options.type || !this.fields || options.hidden) {
				if (options.hidden) {
					this.setState(states.ERROR, _.isNull(options.name) ? 403 : 406);
				}

				// return when no specific field found or
				//             there are no fields for this type or
				//             it is set in options that this field is hidden
				return;
			}

			// Using sockets for everyone in details.
			User.fields.on('add', this.eventRender());
			User.fields.on('delete', this.eventRender());

			this.initializeModelPull();
			this.initializeBinds();
		},

		initializeFieldDisplayOptions: function() {
			this.alwaysShowFields = this.getImportantCustomFields(this.options.alwaysShow) || [];
			this.blacklist = this.options.blacklist || [];

			this.expanded = User.settings.get(`${this.model.type}_details_open`);
		},

		initializeModelPull: function() {
			const modelNeedsPull = !this.model.isNew() && _.keys(this.model.attributes).length <= 1;

			if (modelNeedsPull) {
				this.setState(states.PRELOADING);
				this.pull(this.model, {
					error: _.bind(this.onPullError, this),
					success: _.bind(this.onPullSuccess, this)
				});
			} else {
				this.onPullSuccess();
			}
		},

		initializeBinds: function() {
			this.onBeforeRouterNavigate = _.bind(this.onBeforeRouterNavigate, this);
			this.onKeyUp = _.bind(this.onKeyUp, this);
			this.onKeyDown = _.bind(this.onKeyDown, this);
			app.global.bind(
				'*.model.*.update',
				function(fieldModel) {
					if (fieldModel.fieldType === this.type) {
						this.fields = this.getFields();
						this.alwaysShowFields =
							this.getImportantCustomFields(this.options.alwaysShow) || [];

						if (this.state === states.READ && !fieldModel.active_flag) {
							this.updateFields(this.state);
						}
					}
				},
				this
			);

			this.onWindow('resize.field', _.bind(this.checkStaticActionBar, this));
		},

		eventRender: function() {
			return _.bind(function() {
				this.updateFields(null, true);

				this.render();
			}, this);
		},

		// PUBLIC
		/**
		 * Start edit mode
		 * @void
		 */
		edit: function() {
			if (activeEditor && activeEditor !== this && !activeEditor.cancel()) {
				logger.log('Other editor denied cancel', activeEditor);

				return false;
			}

			// lock current instance as active editor
			this.lock();

			this.setState(states.EDIT);

			return true;
		},

		/**
		 * Start saving changes to server
		 * @void
		 */
		save: function(callback) {
			// Read data from editable fields
			const data = {};

			_.forEach(this.fieldViews, (fieldView) => {
				if (fieldView.hasChanges()) {
					_.assignIn(data, fieldView.getValue());
				}
			});

			if ($.isEmptyObject(data)) {
				logger.log('No changed data to save');
				this.setStateDefault();
			} else {
				logger.log('sending changes to server', data);
				this.setState(states.SAVING);
				this.model.save(data, {
					success: _.bind(function() {
						logger.log('Save success!');
						this.setStateDefault();
						fieldUsageTracking.trackFieldSaved(this.model.type, data);

						if (callback && typeof callback === 'function') {
							return callback(this.model);
						}
					}, this),
					error: _.bind(this.setStateDefault, this)
				});
			}
		},

		/**
		 * Is any model value been changed in inline edit or bulk_edit states
		 * @return Boolean
		 */
		hasChanges: function() {
			const fieldView = _.find(this.fieldViews, (fieldView) => {
				return fieldView.hasChanges();
			});

			return !!fieldView;
		},

		/**
		 * update fields after changin blacklist, whitelist etc
		 * @param {String} forceState {optional} If update is needed & fields are forced to some specific state
		 * @param {Boolean} autoState {optional} If predefined state switching for fields is needed
		 * @void
		 */
		updateFields: function(forceState, autoState) {
			// remove current views
			_.forEach(
				this.fieldViews,
				_.bind(function(fieldView) {
					this.removeView(`[data-field-key="${fieldView.field.key}"]`);
				}, this)
			);

			// add again
			this.fields = this.getFields();
			this.alwaysShowFields = this.getImportantCustomFields(this.options.alwaysShow);
			this.createFieldViews();

			if (autoState) {
				this.autoState();
			} else {
				if (forceState) {
					this.setState(forceState);
				} else {
					this.setStateDefault();
					this.render();
				}
			}
		},

		setStateDefault: function() {
			if (!this.fieldViews.length) {
				this.setState(states.EMPTY);

				return;
			}

			this.setState(this.options.defaultState || states.READ);
		},

		autoState: function() {
			let state;

			if (this.fieldViews.length) {
				state = this.state === states.EMPTY ? states.READ : this.state;
			} else {
				state = states.EMPTY;
			}

			this.setState(state);
		},

		setState: function(_state, statusCode) {
			this.state = _state;

			this.statusCode = this.state === states.ERROR ? statusCode : null;

			// change field states
			_.forEach(
				this.fieldViews,
				_.bind(function(fieldView) {
					if (this.state === states.READ) {
						fieldView.setState(FieldView.states.READ);
					} else if (this.state === states.CUSTOMIZE) {
						fieldView.setState(FieldView.states.CUSTOMIZE);
					} else {
						fieldView.setState(FieldView.states.EDIT_BULK);
					}
				}, this)
			);

			if (this.state === states.SAVING) {
				// don't render everything again, just disable inputs
				this.$('.fieldsActions .cui4-button').attr('disabled', true);
			} else {
				this.render();
			}

			// focus on first field
			if (
				this.state === states.EDIT &&
				this.fieldViews.length &&
				!this.options.disableFocus
			) {
				setTimeout(
					_.bind(function() {
						this.fieldViews[0].focusInput();
					}, this),
					1
				);
			}

			this.$el.attr('data-state', this.state);
		},

		/**
		 * Cancel editing - reverts all changes and goes back to READ mode with original values
		 *
		 * @param [boolean] confirmed Cancelling will show browser confirm dialog to prevent user from
		 * loosing changes. Pass true to force cancel.
		 */
		cancel: function(confirmed) {
			const needsConfirm = !confirmed && this.hasChanges();

			logger.log(`cancel needs confirm: ${needsConfirm}`, confirmed, this.hasChanges());

			if (needsConfirm) {
				if (window.confirm(this.confirmOnCancel)) {
					logger.log('Confirmed bulk edit cancel!');
				} else {
					logger.log('Cancel bulk edit denied!');

					return false;
				}
			}

			this.unlock();

			this.setState(states.READ);

			return true;
		},

		onPullError: function(model, response) {
			this.setState(states.ERROR, response.status);
		},

		onPullSuccess: function() {
			this.createFieldViews();
			this.createNewFieldView();
			this.setStateDefault();
		},

		getFields: function() {
			let fields = User.fields.get(this.type);

			if (!fields) {
				return null;
			}

			if (this.blacklist.length) {
				fields = _.reject(
					fields,
					_.bind(function(field) {
						// checks if field is in blacklist or deleted
						return _.includes(this.blacklist, field.key) || field.active_flag === false;
					}, this)
				);
			}

			if (!_.isEmpty(this.additionalFields)) {
				fields = _.concat(fields, this.additionalFields);
			}

			if (_.isFunction(this.additionalFieldsSort)) {
				this.additionalFieldsSort(fields);
			}

			this.sortByName(fields);

			return fields;
		},

		sortByName: function(fields) {
			if (this.options.nameFirst) {
				// Special sorting for key=name field
				for (let i = 0; i < fields.length; i++) {
					const field = fields[i];

					if (field.key === 'name') {
						fields.splice(i, 1);
						fields.unshift(field);
						continue;
					}
				}
			}
		},

		getEditableFields: function() {
			return _.filter(this.fields, { bulk_edit_allowed: true });
		},

		createFieldViews: function() {
			this.fieldViews = this.getEditableFields().map(_.bind(this.createFieldView, this));
		},

		createFieldView: function(field) {
			const fieldOptions = _.assignIn(this.subFieldOptions || {}, {
				model: this.model,
				relatedModel: this.relatedModel,
				field,
				type: this.type,
				nameLink: this.options.nameLink,
				trackingData: this.options.trackingData,
				refreshAddNewFieldViewCappingInfo: async () => {
					if (!this.newFieldView.cappingInfo) {
						return;
					}

					await customFieldsCappingIndicator.reRenderAll();
					this.newFieldView.cappingInfo = await requestCappingInfo();

					if (this.newFieldView.state === states.SAVING) {
						this.newFieldView.setState(states.EDIT);
					}

					this.newFieldView.render();
				}
			});
			const fieldView = new FieldView(fieldOptions);

			this.addView(`[data-field-key="${fieldView.field.key}"]`, fieldView);

			return fieldView;
		},

		createNewFieldView: function(newView) {
			this.newFieldView = new NewFieldView({
				type: this.type,
				newView
			});

			if (User.settings.get('can_add_custom_fields')) {
				this.addView('.newFieldContainer', this.newFieldView);
			}
		},

		isVisible: function(fieldView) {
			const isInWhitelist = _.includes(this.alwaysShowFields, fieldView.field.key);

			return isInWhitelist || fieldView.fieldClass.isVisible();
		},

		getErrorMessage: function() {
			let errorMessage = '';

			if (this.state === states.ERROR) {
				if (errorMessages.hasOwnProperty(Number(this.statusCode))) {
					errorMessage = errorMessages[Number(this.statusCode)];
				} else {
					errorMessage = errorMessages.default;
				}
			}

			return errorMessage;
		},

		getEmptyMessage: function() {
			let emptyMessage = '';

			if (this.state === states.EMPTY) {
				if (emptyMessages.hasOwnProperty(this.type)) {
					emptyMessage = emptyMessages[this.type];
				} else {
					emptyMessage = emptyMessages.default;
				}
			}

			return emptyMessage;
		},

		createDropMenuSelectSettings: function() {
			if (this.type === 'product') {
				return;
			}

			const selectSettingsButton = this.$('.selectSettingsButton');

			if (this.options.settingsData.length && selectSettingsButton.length) {
				this.dropMenuSelectSettings = new DropMenu({
					target: selectSettingsButton,
					ui: 'arrowDropmenu',
					alignRight: false,
					getContentOnOpen: true,
					activeOnClick: false,
					onOpen: _.bind(function(d, dropMenuCallback) {
						d.config.data = this.options.settingsData;
						dropMenuCallback();
					}, this)
				});
			}
		},

		addNewDetails: function() {
			const self = this;

			this.$('.addDetails').on('click', () => {
				if (self.type === 'product') {
					app.router.go(null, '/settings/fields?type=PRODUCT');
				} else {
					self.createNewFieldView(true);
					self.setState(self.states.CUSTOMIZE);
				}
			});
		},

		canEditCustomFields: function() {
			return (
				User.get('is_admin') ||
				User.get('can_add_custom_fields') ||
				User.get('can_edit_custom_fields') ||
				User.get('can_delete_custom_fields')
			);
		},

		canRender: function() {
			return this.canEditCustomFields() || this.getEditableFields().length;
		},

		saveCurrentFieldsOrder: function() {
			const fieldIds = [];
			const fieldsOrder = new FieldsOrderModel({
				id: this.model.type
			});

			this.$('.fieldsList > .reorder').each(function() {
				const key = $(this).data('fieldId');

				if (key) {
					fieldIds.push(key);
				}
			});

			if (fieldIds.length > 1) {
				fieldsOrder.save({
					fieldIds,
					type: this.model.type.toUpperCase()
				});

				if (this.state === 'customize') {
					this.fields = [];
					this.updateFields(this.state);
				}

				logger.log('Save fields order!');
			}

			this.fields = _.sortBy(this.fields, (field) => {
				return _.indexOf(fieldIds, field.id);
			});

			this.createFieldViews();
			this.setStateDefault();
		},

		customizeFields: function() {
			const draggableClass = '.draggableHandle';
			const list = this.$('.fieldsList');

			this.$(draggableClass).on('mousedown', function() {
				$(this)
					.closest('.customize')
					.addClass('hideActions');
			});

			Sortable.create(list.get(0), {
				draggable: '.reorder',
				handle: draggableClass,
				ghostClass: 'ghost',
				onStart: function(ev) {
					list.addClass('sorting');
					$(ev.item)
						.find(draggableClass)
						.trigger('mouseout');
					app.global.fire('ui.dnd.dropzone.disable');
				},
				onEnd: _.bind(function() {
					list.removeClass('sorting');
					app.global.fire('ui.dnd.dropzone.enable');
					this.$('.customize.hideActions').removeClass('hideActions');
				}, this)
			});
		},

		templateHelpers: function() {
			const editableFields = _.filter(this.fieldViews, (field) => {
				return field.key !== 'name';
			});
			const options = this.options;
			const visibleFieldsLength = this.alwaysShowFields.length;
			const settingsData = options.settingsData;
			const hasSettings = settingsData && settingsData.length;
			const helpers = {
				options,
				state: this.state,
				states,
				isDialog: !!options.isDialog,
				settingsData,
				hasSettings,
				hasOnlyCustomizeFieldsSetting:
					hasSettings === 1 && settingsData[0].className === 'customizeFields',
				expanded: this.expanded,
				link: options.link,
				fieldViews: this.state === states.CUSTOMIZE ? editableFields : this.fieldViews,
				visibleFieldsLength:
					options.type === 'deal'
						? visibleFieldsLength - options.alwaysShow.length
						: visibleFieldsLength,
				isVisible: _.bind(this.isVisible, this)
			};

			if (this.state === states.EMPTY) {
				helpers.emptyMessage = this.getEmptyMessage();
			} else if (this.state === states.ERROR) {
				helpers.errorMessage = this.getErrorMessage();
			}

			return helpers;
		},

		selfRender: function() {
			if (!this.canRender()) {
				return;
			}

			Pipedrive.View.prototype.selfRender.call(this);
		},

		afterRender: function() {
			if ([states.PRELOADING, states.ERROR].indexOf(this.state) < 0) {
				this.afterRenderNormal();
			}

			if (this.options.settingsData) {
				this.addNewDetails();
				this.createDropMenuSelectSettings();
			}

			this.initTooltips();

			const sidebarEl = document.querySelector('[data-coachmark="deal-sidebar"]');

			if (sidebarEl) {
				closeFlowCoachmark('closedeals_deal_customfieldsinfo');
				addFlowCoachmark('closedeals_deal_clickcustomizefields', sidebarEl);
			}
		},

		afterRenderNormal: function() {
			const hasHiddenFields = this.$('.fieldsList :not(.visible)').length;

			this.$('.fieldsActions > .cui4-button').on(
				'click',
				_.bind(function(ev) {
					ev.preventDefault();
					this.onButtonClick($(ev.currentTarget));
				}, this)
			);

			this.$('.columnTitle .columnActions button.cui4-button').on(
				'click',
				_.bind(function(ev) {
					ev.preventDefault();
					this.onButtonClick($(ev.currentTarget));
				}, this)
			);

			if (!hasHiddenFields) {
				this.$('.toggleAll').hide();
			}

			if (this.state === states.EDIT) {
				this.addListeners();
			} else {
				this.removeListeners();
			}

			if (this.state === states.CUSTOMIZE) {
				this.customizeFields();
			}

			if (this.footerView) {
				this.addView('.itemFooter', this.footerView);
			}
		},

		initTooltips: function() {
			const $tooltips = this.$('button[data-tooltip]');

			$tooltips.each((index, el) => {
				const $el = $(el);

				$el.tooltip({
					tip: $el.data('tooltip'),
					position: 'top',
					clickCloses: true
				});
			});
		},

		addListeners: function() {
			this.$el.on('keyup.field', this.onKeyUp);
			this.$el.on('keydown.field', this.onKeyDown);

			// checkStaticActionBar
			this.$el
				.closest('.detailViewWrapper')
				.on('scroll.field', _.bind(this.checkStaticActionBar, this));

			this.checkStaticActionBar();
		},

		removeListeners: function() {
			this.$el.off('keyup.field', this.onKeyUp);
			this.$el.off('keydown.field', this.onKeyDown);
			this.$el.closest('.detailViewWrapper').off('scroll.field');
		},

		onAttachedToDOM: function() {
			if (this.state === states.EDIT) {
				this.checkStaticActionBar();
			}
		},

		checkStaticActionBar: function() {
			const $scroll = this.$el.closest('.detailView');
			const $fieldActions = this.$('.fieldsActions');
			const $actionsWrapper = this.$('.actionsWrapper');
			const hasElements =
				this.$el.closest('body').length && $fieldActions.length && $actionsWrapper.length;

			if ($scroll.length && hasElements) {
				const windowBot = $scroll.scrollTop() + $(window).height();
				const navBarInfoBlock =
					$('.menuWrapper').height() + $scroll.find('.infoBlock').height();

				// actions height

				const actionsBot =
					$actionsWrapper.position().top + $actionsWrapper.height() + navBarInfoBlock;
				const isOffScreen = windowBot < actionsBot + $scroll.offset().top;

				$fieldActions.toggleClass('fixed', isOffScreen);
			}
		},

		onKeyDown: function(ev) {
			if (this.state !== states.EDIT) {
				return;
			}

			if (ev.keyCode === KEY.enter && !Pipedrive.common.isEnterClickedForNewLine(ev)) {
				ev.preventDefault();
			}
		},

		onKeyUp: function(ev) {
			if (this.state !== states.EDIT) {
				return;
			}

			if (ev.keyCode === KEY.escape) {
				this.cancel();
			}

			if (ev.keyCode === KEY.enter && !Pipedrive.common.isEnterClickedForNewLine(ev)) {
				ev.preventDefault();
				this.save();
			}
		},

		onButtonClick: function($el) {
			if ($el.hasClass('disabled')) {
				return;
			} else if ($el.hasClass('editAll')) {
				this.edit();
				this.checkStaticActionBar();
			} else if ($el.hasClass('saveAll')) {
				this.save();
			} else if ($el.hasClass('customFields')) {
				this.setState(states.CUSTOMIZE);

				closeFlowCoachmark('closedeals_deal_clickcustomizefields');
				addFlowCoachmark(
					'closedeals_deal_addcustomfield',
					document.querySelector('[data-coachmark="deal-sidebar"]')
				);
			} else if ($el.hasClass('cancelAll')) {
				this.cancel(true);
			} else if ($el.hasClass('toggleAll')) {
				this.toggleExpanded();
			} else if ($el.hasClass('saveFieldsOrder')) {
				this.saveCurrentFieldsOrder();

				closeFlowCoachmark('closedeals_deal_clickdone');
			}
		},

		toggleExpanded: function() {
			const $fieldsList = this.$el.find('.fieldsList');

			this.expanded = !this.expanded;
			User.settings.save(`${this.model.type}_details_open`, this.expanded);

			$fieldsList.toggleClass('collapsed', !this.expanded);

			this.$el.find('.toggleAll.collapse').toggleClass('hidden', this.expanded);
			this.$el.find('.toggleAll.expand').toggleClass('hidden', !this.expanded);

			$fieldsList.one(
				'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
				_.bind(this.render, this)
			);
		},

		getTemplate: function(data) {
			let template = this.template;

			if (_.isString(this.options.customTemplate)) {
				template = _.template(this.options.customTemplate);
			} else if (_.isFunction(this.options.customTemplate)) {
				template = this.options.customTemplate(this, template);
			}

			return data ? template(data) : template;
		},

		/**
		 * Get custom fields with important_flag = true
		 * @param  {array}  arrayOfItems Array of pre-given items needs to be always shown
		 * @return {array}               Array of items key's to be always shown
		 */
		getImportantCustomFields: function(array) {
			const fields = _.filter(User.fields.get(this.type), (field) => {
				const isCustomField = field.edit_flag === true;

				return isCustomField && field.important_flag === true;
			});

			let importantFields = _.isArray(array) ? array : [];

			importantFields = importantFields.concat(
				_.map(fields, (field) => {
					return field.key;
				})
			);

			return _.uniq(importantFields);
		},

		onBeforeRouterNavigate: function(ev) {
			const url = ev.path;
			const isOnSamePage = url.includes('#') || url === ev.previousPath;

			if (!isOnSamePage && this.state === states.EDIT && this.hasChanges()) {
				if (window.confirm(this.confirmOnPageExit)) {
					// force cancel, allow navigation
					this.cancel(true);
				} else {
					// deny navigation
					ev.preventDefault();
				}
			}
		},

		onBeforeBrowserUnload: function() {
			if (this.state === states.EDIT && this.hasChanges()) {
				// is onbeforeunload
				return this.confirmOnPageExit;
			}
		},

		lock: function() {
			if (window.onbeforeunload) {
				logger.warn('Existing window.onbeforeunload defined! Overwriting!');
			}

			// eslint-disable-next-line
			activeEditor = this;
			window.onbeforeunload = _.bind(this.onBeforeBrowserUnload, this);

			app.router.on('beforeNavigate', this.onBeforeRouterNavigate);
		},

		unlock: function() {
			window.onbeforeunload = null;
			app.router.off('beforeNavigate', this.onBeforeRouterNavigate);
			// eslint-disable-next-line
			activeEditor = null;
		},

		onUnload: function() {
			_.forEach(this.fieldViews, (fieldView) => {
				fieldView.unload();
			});

			this.removeListeners();

			if (this.state === states.EDIT) {
				this.unlock();
			}

			if (this.getView('.itemFooter')) {
				this.removeView('.itemFooter');
			}
		}
	},
	{
		states
	}
);
