const Pipedrive = require('pipedrive');
const _ = require('lodash');
const { sanitizeHtml, createLinks } = require('@pipedrive/sanitize-html');
const User = require('models/user');
const customFieldOptionTemplate = require('templates/shared/fields/custom-field-option.html');
const FieldModel = require('models/field');
const fieldUsageTracking = require('utils/analytics/field-component-usage-tracking');
const { Sortable } = require('sortablejs');
const bccExtractor = require('utils/bcc-extractor');
const FieldFactory = require('views/shared/fields/fieldset/field-factory');
const $ = require('jquery');
const salesPhone = require('utils/sales-phone');
const iamClient = require('utils/support/iam');
const AddToDealModal = require('../../../views/shared/add-product-deal-modal');
const CustomFieldAnalytics = require('utils/analytics/custom-field-analytics');
const validateRequiredFields = require('utils/validate-required-fields');
const Helpers = require('utils/helpers');
const { fieldCUIIconMap } = require('./field-cui-icon-map');
const QuickInfoCard = require('views/quick-info-card');
const componentLoader = require('webapp-component-loader');
const modals = require('utils/modals');

/**
 * Create new Data Field component
 *
 * @example
 * <pre>
 * this.fieldView = new FieldView({
 *    el: this.$('.titleDiv'),
 *    key: 'title',
 *    type: 'deal',
 *    model: this.dealModel,
 *    state: FieldView.states.EDIT,
 *    settings: {
 *        autoSave: true
 *    }
 * });
 *
 * @classdesc
 * Supports viewing, editing, saving of one data field
 * and any field type - string, monetary, date, enum, contact, person, organisation, emails, custom fields etc..
 *
 * @param  {Object} options data and settings what field and how to show
 * @class views/shared/Field
 * @augments module:Pipedrive.View
 */

/**
 * Static reference to all possible Field component states
 *
 * @example
 * <pre>
 * //Set state when creating field
 * var viewer = new FieldView({
 *    state: FieldView.states.EDIT
 * });
 *
 * //change state later
 * myField.setState(FieldView.states.EDIT);
 * </pre>
 *
 * @type {Object}
 * @alias views/shared/Field.states
 * @static
 * @enum
 */
const states = {
	READ: 'read',
	EDIT: 'edit',
	EDIT_BULK: 'edit-bulk',
	SAVING: 'saving',
	CUSTOMIZE: 'customize',
	CUSTOMIZE_EDIT: 'customize-edit'
};
const baseTemplates = {};

baseTemplates[states.READ] = _.template(
	require('templates/shared/fields/field-read.html').replace(/>\s+</g, '><')
);
baseTemplates[states.EDIT] = _.template(
	require('templates/shared/fields/field-edit.html').replace(/>\s+</g, '><')
);
baseTemplates[states.EDIT_BULK] = _.template(
	require('templates/shared/fields/field-edit-bulk.html').replace(/>\s+</g, '><')
);
// Saving template is same as EDIT
baseTemplates[states.SAVING] = _.template(
	require('templates/shared/fields/field-edit.html').replace(/>\s+</g, '><')
);
baseTemplates[states.CUSTOMIZE] = _.template(
	require('templates/shared/fields/field-customize.html').replace(/>\s+</g, '><')
);
baseTemplates[states.CUSTOMIZE_EDIT] = _.template(
	require('templates/shared/fields/field-customize-edit.html').replace(/>\s+</g, '><')
);

// EVENTS: save read edit cancel
/**
 * Fired when save has succeeded
 * @event views/shared/Field#save
 */

/**
 * Fired when read mode started or saving failed
 * @event views/shared/Field#read
 */

/**
 * Fired when edit started
 * @event views/shared/Field#edit
 */

/**
 * Fired when editing is canceled by user
 * @event views/shared/Field#cancel
 *
 * @example
 * <pre>
 * this.fieldView.on('cancel save', this.closePopup, this);
 * </pre>
 */
const logger = new Pipedrive.Logger('deal', 'field');
const KEY = Pipedrive.common.keyCodes();
const editableFieldKey = 'bulk_edit_allowed';
const fieldTextMap = {
	varchar: _.gettext('Text'),
	text: _.gettext('Long Text'),
	varchar_auto: _.gettext('Autocomplete'),
	double: _.gettext('Numeric'),
	int: _.gettext('Numeric'),
	monetary: _.gettext('Monetary'),
	date: _.gettext('Date'),
	set: _.gettext('Multiple options'),
	enum: _.gettext('Single option'),
	people: _.gettext('Person'),
	org: _.gettext('Organization'),
	user: _.gettext('User'),
	phone: _.gettext('Phone'),
	time: _.gettext('Time'),
	timerange: _.gettext('Time range'),
	daterange: _.gettext('Date range'),
	address: _.gettext('Address'),
	deal: _.gettext('Deal')
};

module.exports = Pipedrive.View.extend(
	/** @lends views/shared/Field.prototype */ {
		template: baseTemplates,
		customFieldOptionTemplate: _.template(customFieldOptionTemplate),
		states,
		fieldTextMap,
		maxCustomFieldNameLength: 64,
		isResultsFound: true,
		/**
		 * Current state of view. Value is one of predefined states, see {@link views/shared/Field.states}
		 * @type {String}
		 */
		state: null,
		/**
		 * Model where value is taken and saved
		 * @type {Model}
		 */
		model: null,
		submodel: null,
		/**
		 * optional model of the page where field is displayed
		 * @type {module:Pipedrive.Model}
		 */
		relatedModel: null,
		/**
		 * Field key, like "title" or "value"
		 * @type {String}
		 */
		key: '',
		/**
		 * Field model name like "deal", "organization". Passed to User.fields.get(type) to get detailed field information.
		 * @type {String}
		 */
		type: '',
		/**
		 * Field object - you can get this with User.fields.get(type) or it will be filled automatically
		 * when you pass "type" and "key"
		 * @type {Object}
		 */
		field: null,
		subfield: null,
		/**
		 * Current settings key-value object
		 * @type {Object}
		 */
		settings: {},
		/**
		 * bcc field for emails
		 * @type {module:Pipedrive.Model}
		 */
		bcc: null,
		/**
		 * Default settings, override these in constructor options. <br> Use this as example what to pass into constructor
		 *
		 * @example
		 * <pre>
		 * this.fieldView = new FieldView({
		 *     el: this.$('.titleDiv'),
		 *     settings: {
		 *         autoSave: true
		 *         ...
		 *     }
		 * });
		 * </pre>
		 *
		 * @const {Object}
		 * @enum {string}
		 */
		defaultSettings: {
			editable: true,
			popoverEditable: false,
			popoverEditableOrig: null,
			autoSave: false,
			valueOnly: false,
			clickToEdit: false,
			customTitle: '',
			buttonSize: 's',
			swapSaveCancel: false,
			requireValue: false,
			removableField: false,
			listenToModelChange: true
		},
		// in database & model format
		value: null,
		removeValue: false,
		// for visual
		value_visual: null,
		// as editor control needs it
		value_editor: null,
		prefix: '',
		addNewDialogCopy: {
			deal: _.gettext('Appears in "Add new deal" dialogue'),
			person: _.gettext('Appears in "Add new person" dialogue'),
			organization: _.gettext('Appears in "Add new organization" dialogue'),
			searchResults: _.gettext('Appears in search results'),
			default: _.gettext('Appears in "Add new" dialogue')
		},

		companyHasProducts: User.companyFeatures.get('products'),

		// fields that are editable as a single field but not in bulk edit mode
		fieldsNotBulkEditable: ['probability'],

		get isAdmin() {
			return User.get('is_admin');
		},

		get canAddCustomFields() {
			return User.settings.get('can_add_custom_fields');
		},

		get canEditCustomFields() {
			return User.settings.get('can_edit_custom_fields');
		},

		get canDeleteCustomFields() {
			return User.settings.get('can_delete_custom_fields');
		},

		events: {
			'click .phoneNumber': 'addSalesPhone',
			'click .salesPhoneOptions': 'addSalesPhone', // caller 1.2 uses this
			'click .salesPhoneButton': 'addSalesPhone',
			'click .salesPhoneCallButton': 'startQuickCallFromButton',
			'click .salesPhoneButton--caller12 .salesPhoneNumber': 'startQuickCallFromNumber',
			'mouseenter .salesPhoneCallButton': 'updateQuickCallTooltip',
			'mouseenter .salesPhoneButton--caller12 .salesPhoneNumber': 'updateQuickCallTooltip'
		},

		initialize: function(options) {
			this.options = options;
			this.relatedModel = options.relatedModel;
			this.sanitizeHtml = sanitizeHtml;
			this.createLinks = createLinks;

			// Fill options.type automatically from the model (if available)
			if (!options.type && options.model && options.model.type) {
				options.type = options.model.type;
			}

			this.setField(options);
			this.key = this.getKey();
			this.type = options.type;
			// for data-test attributes
			this.prefix = this.field.key;

			if (this.isEmailLinkRelatedField()) {
				this.initializeBcc();
			}

			this.initializeFieldComponent();
			this.typePeopleToPerson(options);

			this.fieldType = this.field.phoneCustomField
				? fieldCUIIconMap.phone
				: fieldCUIIconMap[this.field.field_type];
			this.openEmailsInNewTab = User.settings.get('open_email_links_in_new_tab');

			// @TEST Is this necessary now?
			this.applyAPIhacks();
			this.resetFromModel();
			this.bindListeners();
			this.setState(options.state || states.READ);
		},

		isEmailLinkRelatedField: function() {
			return (
				_.includes(['varchar', 'varchar_auto', 'text'], this.field.field_type) ||
				this.key === 'email'
			);
		},

		getKey: function() {
			return this.field.key === 'person_id' && this.model.type === 'activity'
				? 'participants'
				: this.field.key;
		},

		typePeopleToPerson: function(options) {
			if (options.field && options.field.field_type === 'people') {
				options.field.field_type = 'person';
			}
		},

		initializeBcc: function() {
			this.bcc = bccExtractor.extractBcc(this.relatedModel, this.model, User);
		},

		/**
		 * Initialize this.settings
		 * @void
		 */
		initializeSettings: function() {
			this.settings = _.assignIn({}, this.defaultSettings, this.options.settings || {});
			// in this case the only way to start edit is click
			this.settings.clickToEdit = !!(this.settings.editable && this.settings.valueOnly);
			// editable not allowed by field setting or is visibility type and user is not admin
			this.settings.editable = this.isEditable();

			this.settings.popoverEditableOrig = this.settings.popoverEditable;
			this.settings.popoverEditable =
				this.settings.popoverEditableOrig &&
				this.settings.editable &&
				User.fields.isEditable(this.field, this.model, editableFieldKey);
			this.settings.removableField = this.getRemovableFlag();
			this.settings.addTrashIcon = this.canRemoveValue();

			// Name, title, subject and product code fields should have value
			this.settings.requireValue = _.includes(
				['name', 'title', 'due_date', 'code', 'subject'],
				this.key
			);
		},

		canRemoveValue: function() {
			const dateField = this.field.field_type === 'date';
			const inlineEditor = this.settings.inlineEditor;
			const popoverEditable = this.settings.popoverEditable;

			return this.getRemovableFlag() && ((dateField && inlineEditor) || popoverEditable);
		},

		initializeFieldComponent: function() {
			const Factory = new FieldFactory();
			const fieldModel = new FieldModel(this.field, {
				type: this.type
			});

			const options = {
				model: fieldModel,
				key: this.key,
				value: this.model.get(this.key),
				states,
				state: this.state,
				contentModel: this.model,
				contentRelatedModel: this.relatedModel,
				fieldOptions: this.options.fieldOptions,
				pipelineDealProbability: this.options.pipelineDealProbability,
				onSave: (data) => {
					this.value = data;
					this.saveModel();
					this.setVisibleClass();
					fieldUsageTracking.trackFieldSaved(this.model.type, this.value);
				},
				onCancel: () => {
					this.cancel();
				},
				bcc: this.bcc
			};

			this.fieldClass = Factory.createClass(options);
		},

		getRemovableFlag: function() {
			if (_.isObject(this.field.mandatory_flag)) {
				return !(_.isEmpty(this.model.attributes)
					? !User.fields.matchesCondition(
							this.field,
							this.model,
							this.field.mandatory_flag
					  )
					: false);
			}

			return !this.field.mandatory_flag;
		},

		isEditable: function() {
			const standAloneEditableFields = _.includes(this.fieldsNotBulkEditable, this.key);
			const closedAndNotEditable =
				_.includes(['won_time', 'lost_time'], this.key) &&
				!User.settings.get('can_edit_deals_closed_date');
			const editableField = this.field[editableFieldKey] && !closedAndNotEditable;
			const isChangeAbleVisibletoField =
				this.field.field_type === 'visible_to' &&
				User.settings.get('can_change_visibility_of_items');
			const isFormulaField = this.field.field_type === 'formula';

			if (isFormulaField) {
				return false;
			}

			return editableField || isChangeAbleVisibletoField || standAloneEditableFields;
		},

		forceToReadState: function(hasChanges, handleValue) {
			if (!hasChanges && handleValue) {
				this.read();
			}
		},

		// PUBLIC
		/**
		 * Start edit mode
		 * @void
		 */
		edit: function() {
			this.setState(states.EDIT);
			this.trigger('edit');
		},

		/**
		 * Start read mode
		 * @void
		 */
		read: function() {
			this.setState(states.READ);
			this.trigger('read');
		},

		/**
		 * Start custom field editing mode
		 * @void
		 */
		editCustomize: function() {
			this.setState(states.CUSTOMIZE_EDIT);

			if (_.includes(['set', 'enum'], this.field.field_type)) {
				const draggableClass = '.draggableHandle';
				const $list = this.$('.fieldOptionsList');
				const $input = this.$('.fieldOptions .newValue input');

				this.optionSortable = Sortable.create($list.get(0), {
					draggable: '.reorder-option',
					handle: draggableClass,
					ghostClass: 'ghost',
					dataIdAttr: 'data-label',
					onStart: function(ev) {
						$list.addClass('sorting');
						$(ev.item)
							.find(draggableClass)
							.trigger('mouseout');
						app.global.fire('ui.dnd.dropzone.disable');
					},
					onEnd: _.bind(function() {
						$list.removeClass('sorting');
						app.global.fire('ui.dnd.dropzone.enable');
						this.$('.customize.hideActions').removeClass('hideActions');
					}, this)
				});

				$input.on(
					'keyup',
					_.bind(function(ev) {
						if (ev.keyCode === KEY.enter) {
							this.addNewOption(ev);
						}
					}, this)
				);

				this.$('.fieldOptions .customAdd').on('click', _.bind(this.addNewOption, this));

				this.$el.off('click', '.fieldOptionsList .optionTrash').on(
					'click',
					'.fieldOptionsList .optionTrash',
					_.bind(function(ev) {
						const $el = $(ev.currentTarget);

						ev.preventDefault();

						if (
							window.confirm(
								_.gettext(
									'Are you sure that you want to remove option "%s"?',
									$el.prev().val()
								)
							)
						) {
							$el.parent().remove();
						}

						this.toggleAlphabetise($('.fieldOptionsList li'));
					}, this)
				);

				this.$('.fieldOptions .alphabeticSort').on(
					'click',
					_.bind(function(ev) {
						ev.preventDefault();

						const order = this.optionSortable.toArray();

						this.optionSortable.sort(
							_.sortBy(order, (a) => {
								return a.toLowerCase();
							})
						);
					}, this)
				);
			}
		},
		/**
		 * Add new option to set or enum
		 * @void
		 */
		addNewOption: function(ev) {
			ev.preventDefault();

			const $list = this.$('.fieldOptionsList');

			let $listItems = this.$('.fieldOptionsList li');

			const $input = this.$('.fieldOptions .newValue input');
			const label = $input.val();

			if (label && _.includes(this.optionSortable.toArray(), label)) {
				window.alert(_.gettext('Option with name "%s" already exists!', label));
			} else if (label) {
				$list.append(
					this.customFieldOptionTemplate({
						label
					})
				);
				$listItems = this.$('.fieldOptionsList li');
				$input.val('');

				// Make sure the newly added value is visible to the user by scrolling the list to the bottom
				$list.scrollTop($list.prop('scrollHeight'));
			}

			this.$('.customizeEdit').removeClass('error');

			this.toggleAlphabetise($listItems);
			$input.focus();
		},
		// Hide-Show the alphabetise button based on number of list items
		toggleAlphabetise: function($listItems) {
			if ($listItems.length > 1) {
				this.$('.fieldOptions .alphabeticSortWrap').removeClass('isHidden');
			} else {
				this.$('.fieldOptions .alphabeticSortWrap').addClass('isHidden');
			}
		},
		/**
		 * Set field component to any predefined states
		 * @void
		 */
		setState: function(toState) {
			if (!this.isStateChangeAllowed(toState)) {
				return;
			}

			this.setStateSwitch(toState);
			this.state = toState;
			this.fieldClass.setState(this.state);
			this.render();

			if (this.state === states.EDIT) {
				this.focusInput();
			}
		},

		setStateSwitch: function(toState) {
			switch (toState) {
				case states.READ:
				case states.CUSTOMIZE:
					this.prepareReadFormat();
					break;
				case states.EDIT_BULK:
					// take non saved value from EDIT mode to BULK_EDIT mode
					if (this.state === states.EDIT) {
						this.value = this.readFromEditor();
					}

					// Leaving bulk edit always resets value from model
					// (because we do not know if parent saved data or not)
					this.resetFromModel();
					this.prepareEdit();
					break;
				case states.CUSTOMIZE_EDIT:
					break;
				default:
					this.prepareEdit();
			}
		},

		isStateChangeAllowed: function(toState) {
			let isChangeAllowed = false;

			if (toState !== this.state) {
				if (toState === states.READ) {
					isChangeAllowed = true;
				} else {
					if (this.settings.editable) {
						isChangeAllowed = true;
					}
				}
			}

			return isChangeAllowed;
		},

		prepareReadFormat: function() {
			if (this.fieldClass.hasValue()) {
				this.value_visual = _.assignIn({}, this.fieldClass.getReadValue(), {
					// Access to original value
					value: this.fieldClass.getValue(),
					hasValue: true
				});
			} else {
				this.value_visual = {
					label: '',
					value: null
				};
			}
		},

		prepareEdit: function() {
			this.value_editor = this.fieldClass.getEditValue();
		},

		readFromEditor: function() {
			return this.fieldClass.getValueFromEditor(this.$el);
		},

		/**
		 * Focuses on input element in EDIT or BULK_EDIT mode
		 * @param  {boolean} [selectAll] After focus to select all current text
		 * @void
		 */
		focusInput: function(selectAll) {
			if (this.state !== states.EDIT && this.state !== states.EDIT_BULK) {
				return;
			}

			const inp = this.$('select, input[type!="hidden"], textarea')
				.not('input[type="radio"]')
				.get(0);

			if (inp) {
				if (inp.selectionStart) {
					const inputLen = inp.value.length;

					inp.selectionStart = inputLen;
					inp.selectionEnd = inputLen;
				}

				inp.focus();
			}

			if (selectAll) {
				inp.select();
			}

			if (this.settings.autoSave) {
				this.$('.valueWrap').on('change', _.bind(this.save, this));
				// save on select2 dropdown close
				this.$('.valueWrap').on('select2-close', _.bind(this.save, this));

				setTimeout(
					_.bind(function() {
						const select2 = this.$('.select2-container').data('select2');

						if (select2) {
							select2.open();
						}
					}, this),
					10
				);
			}
		},
		/**
		 * Return changed value in object form
		 * One field can change multiple values - deal value is made up from numeric value and string currency
		 *
		 * The returned object is used mostly for model.save(data);
		 *
		 * @return Object Returns key-value pairs of changed data fields
		 *
		 * @example
		 * <pre>
		 * var data = this.fieldView.getValue();
		 * console.log(data);
		 * // output
		 * data = {
		 *  value: 11,
		 *  currency: 'eur'
		 * }
		 * </pre>
		 */
		getValue: function() {
			if (this.state !== states.READ) {
				// not sure if right way - only used on bulk edit mode
				return this.readFromEditor();
			}

			return this.value;
		},
		/**
		 * Has value been set for this field
		 * @return {Boolean}
		 */
		hasValue: function() {
			return this.fieldClass.hasValue();
		},
		/**
		 * Clears values from field & subfield in editor
		 * and sets values to view from editor
		 * @void
		 */
		clearValue: function() {
			this.$('input, select').val('');
		},
		/**
		 * Start saving changes to server
		 * If save was not valid still track click for sesheta
		 * @void
		 */
		save: function() {
			if (this.isSaveValid()) {
				this.saveModel();
				this.setVisibleClass();
				fieldUsageTracking.trackFieldSaved(this.model.type, this.value);
			} else {
				this.trigger('trackSave');
			}

			fieldUsageTracking.trackDealFieldComponent(this.model, this.type);
		},

		isSaveValid: function() {
			const self = this;

			let valid = true;

			const isValidState = _.includes([states.READ, states.SAVING], this.state);
			const hasChanges = this.hasChanges();
			const handleValue = this.handleValue();

			if (isValidState || (!hasChanges && !this.removeValue) || !handleValue) {
				// we want to close edit popover if the value hasn't been changed and is valid
				this.forceToReadState(hasChanges, handleValue);
				valid = false;
			}

			if (this.isMatchFailing()) {
				valid = false;
			}

			// If saving status to 'lost', force to enter 'lost reason'
			if (this.isValueStatusLost()) {
				validateRequiredFields({
					dealModel: this.model,
					dealUpdateProperties: {
						status: 'lost'
					},
					updateDealOnSave: true,
					onSave: () => {
						self.openDealLostModal();
					},
					onError: () => {
						self.openDealLostModal();
					},
					onCancel: () => {}
				});

				// Here we don't have to and shouldn't call this.saveModel,
				// as clicking "Save" in the "Lost reason" modal saves the deal model anyway.

				valid = false;
			}

			return valid;
		},

		openDealLostModal: function() {
			modals.open('webapp:modal', {
				modal: 'deal/lost',
				params: {
					deal: this.model
				}
			});
		},

		setVisibleClass: function() {
			if (this.hasValue()) {
				this.el.classList.add('visible');
			} else if (!this.field.important_flag) {
				this.el.classList.remove('visible');
			}
		},

		isValueStatusLost: function() {
			return this.value.hasOwnProperty('status') && this.value.status === 'lost';
		},

		isMatchFailing: function() {
			return this.fieldClass.matchRequired && !this.isResultsFound;
		},

		handleValue: function() {
			this.value = this.readFromEditor();

			if (this.removeValue && !this.hasValue()) {
				logger.log('Not removing, because field is already empty');
				this.read();

				return false;
			}

			return true;
		},

		isValidFieldValue: function() {
			return !this.settings.requireValue || !!_.get(this.value, this.key);
		},

		showValidationError: function() {
			const $field = this.$(`input[name=${this.key}]`);
			const $button = this.$('.actions .input.save .cui4-button');

			$button.toggleClass('disabled', true);
			$field.toggleClass('error', true);

			$field.on('input change', function() {
				$button.toggleClass('disabled', _.isEmpty(this.value));
				$field.toggleClass('error', _.isEmpty(this.value));
			});
		},

		/**
		 * Actually saves the model and syncs with server
		 * @void
		 */
		saveModel: function() {
			if (!this.isValidFieldValue()) {
				this.showValidationError();

				return;
			}

			const originalValues = _.pickBy(
				{
					stage_id: this.model.get('stage_id'),
					status: this.model.get('status'),
					pipeline_id: this.model.get('pipeline_id')
				},
				_.identity
			);

			this.model.set(this.value);
			this.fieldClass.setValue(this.model.get(this.key));
			this.setState(states.SAVING);

			let query;

			const collection = this.model.collection;

			if (
				collection &&
				collection.options &&
				collection.options.filter &&
				collection.options.filter.filter_id
			) {
				query = `get_matching_filters=${encodeURIComponent(
					collection.options.filter.filter_id
				)}`;
			}

			const options = {
				query,
				success: _.bind(this.onSaved, this),
				cancel: () => {
					Object.keys(originalValues).forEach((key) => {
						this.model.set(key, originalValues[key]);
					});
				},
				error: _.bind(function(model, response, options) {
					this.read();

					this.trigger('error', {
						error_message:
							response && response.responseJSON && response.responseJSON.error
								? response.responseJSON.error
								: 'No error message'
					});

					if (
						options.xhr.status === 400 ||
						options.xhr.responseJSON.code === 'feature_capping_deals_limit'
					) {
						this.model.set(this.model.previousAttributes());
						this.cancel();

						if (options.xhr.status === 400) {
							window.alert(_.gettext('This item could not be updated!'));
						}
					}
				}, this)
			};

			if (
				this.type === 'deal' &&
				(this.value.stage_id || this.value.pipeline_id || this.value.status)
			) {
				this.model.saveIfRequiredFieldsPopulated(
					{ stage_id: this.value.stage_id, status: this.value.status },
					null,
					options
				);
			} else {
				this.model.save(null, options);
			}
		},

		/**
		 * Cancel editing - reverts all changes and goes back to READ mode with original data
		 * @void
		 */
		cancel: function() {
			this.resetFromModel();
			this.read();
			this.trigger('cancel');
		},

		/**
		 * Has value been changed in editor or bulk_edit
		 * @return Boolean
		 */
		hasChanges: function() {
			if (this.state === states.READ) {
				return false;
			}

			const newValue = this.readFromEditor();

			// Compare only field or subfield key values! Ignore all "_helper" etc value changes

			const valueChanged =
				!this.fieldClass.isEqual(this.value[this.key], newValue[this.key]) ||
				(this.key.indexOf('_id') > -1 && newValue[this.key] === 0);
			const subfieldChanged =
				this.subfield &&
				!this.fieldClass.isEqual(
					this.value[this.subfield.key],
					newValue[this.subfield.key]
				);

			return !!(valueChanged || subfieldChanged);
		},

		// hacks (fixes non-standard API)
		applyAPIhacks: function() {
			// SPECIAL CASE #1 for 'email' key
			if (
				this.field.key === 'email' &&
				this.field.field_type === 'varchar' &&
				_.isString(this.model.get('email'))
			) {
				this.model.set('email', [{ value: this.model.get('email'), label: 'work' }]);
			}

			if (this.field.field_type === 'phone' && this.field.key !== 'phone') {
				this.field.phoneCustomField = true;
				this.field.field_type = 'varchar';
			}
		},

		showDealProbabilityFieldInStageField: function(options) {
			if (options.key && options.key === 'stage_id') {
				this.field.showProbabilityField = options.pipelineDealProbability;
			}
		},

		setField: function(options) {
			let pieces;

			// .field
			if (options.field) {
				// If field name containts model type, split field name.
				if (options.field.key.indexOf('.') > -1) {
					pieces = options.field.key.split('.');
					options.field.key = pieces[1];
					options.type = pieces[0];
				}

				this.field = options.field;
			} else if (options.key && options.type) {
				// find field by type and key
				if (options.key.indexOf('.') > -1) {
					pieces = options.key.split('.');
					options.key = pieces[1];
					options.type = pieces[0];
				}

				this.field = User.fields.getByKey(options.type, options.key);

				this.showDealProbabilityFieldInStageField(options);
			} else {
				logger.log(
					'Wrong field option parameters - provide "field" object or "type" and "key"'
				);
			}

			if (!this.field) {
				logger.log(
					'No field found, defaulting to read-only varchar -',
					options.type,
					':',
					options.key
				);
				this.field = {
					edit_flag: false,
					bulk_edit: false,
					bulk_edit_allowed: false,
					field_type: 'varchar',
					key: options.key
				};
			}

			// Block entering free form text when feature is turned off
			// Very nasty way of doing it
			if (this.field.key === 'lost_reason') {
				this.field.freeTextAllowed = User.companyFeatures.get('free_form_lost_reasons');
			}
		},

		resetFromModel: function() {
			this.initializeSettings();
			this.value = {};
			this.value[this.key] = this.model.get(this.key);
			this.fieldClass.setValue(this.model.get(this.key));

			// subfields - we support only 1 subfield atm, sorry
			if (this.field.subfields) {
				this.subfield = this.field.subfields[0];
				this.value[this.subfield.key] = this.model.get(this.subfield.key);
			}
		},

		bindListeners: function() {
			// lock this for removing listeners
			this.onKeyUp = _.bind(this.onKeyUp, this);
			this.onKeyDown = _.bind(this.onKeyDown, this);

			app.global.bind(`field.model.${this.field.id}.update`, this.updateModel, this);

			// Eg. fields in a popover shouldn't listen to model change
			if (!this.settings.listenToModelChange) {
				return;
			}

			// bind listeners
			this.listenTo(this.model, `change:${this.field.key}`, this.onModelChange);

			if (this.subfield) {
				this.listenTo(this.model, `change:${this.subfield.key}`, this.onModelChange);
			}

			// If, for example, deal related contact person's name changed, rerender deal model related field
			if (!this.model.parentModel && _.isFunction(this.model.fieldModelMap)) {
				_.forEach(
					this.model.fieldModelMap(),
					function(Model) {
						if (this.key === Model.prototype.relationKey) {
							this.listenTo(this.model, `change:${this.key}`, this.updateSubmodel);
							this.updateSubmodel();
						}
					},
					this
				);
			}
		},

		updateModel: function(model) {
			if (model.isFieldModel) {
				this.setField({
					field: model.toJSON()
				});
				this.onModelChange();
			}
		},

		updateSubmodel: function() {
			const submodelId = this.model.get(this.key);

			// if previous submodel exists, stop listening to it
			if (this.submodel) {
				this.stopListening(this.submodel);
			}

			this.submodel = this.model.getRelatedModel(this.field.field_type, submodelId);

			if (this.submodel) {
				this.listenTo(this.submodel, 'change:name', this.onModelChange);
			}
		},

		unbindListeners: function() {
			app.global.unbind(`field.model.${this.field.id}.update`, this.updateModel, this);
			this.stopListening(this.model);

			if (this.subfield) {
				this.stopListening(this.model);
			}

			if (this.submodel) {
				this.stopListening(this.submodel);
			}
		},

		onButtonClick: function(ev) {
			ev.preventDefault();
			ev.stopPropagation();

			const $btn = $(ev.currentTarget);

			if ($btn.attr('disabled')) {
				return;
			}

			if ($btn.hasClass('prepare-edit')) {
				this.prepareEdit();
			} else if ($btn.hasClass('edit')) {
				this.edit();
			} else if ($btn.hasClass('save')) {
				this.save();
			} else if ($btn.hasClass('cancel')) {
				this.cancel();
			} else if ($btn.hasClass('remove')) {
				this.clearValue();
				this.removeValue = true;
				this.save();
			} else {
				this.customFieldButtonClicks(ev);
			}
		},

		/**
		 * Actions on custom field
		 */
		customFieldButtonClicks: function(ev) {
			const $btn = $(ev.currentTarget);

			if ($btn.hasClass('fieldRemove')) {
				const removeText = _.gettext(
					'You will delete the field from everywhere in your Pipedrive' +
						' as well as delete data stored within this field. Are you sure you want to delete?'
				);

				if (window.confirm(removeText)) {
					this.removeField();
				}
			} else if ($btn.hasClass('fieldEdit')) {
				this.editCustomize();
			} else if ($btn.hasClass('customSave')) {
				this.saveCustomFieldEdit();
			} else if ($btn.hasClass('customCancel')) {
				this.setState(states.CUSTOMIZE);
			} else {
				logger.log('unknown button');
			}
		},

		saveCustomFieldEdit: function() {
			const name = this.$('.inputIcon input').val();
			const options = [];
			const sidebarFlag = this.$('.visibilityOptions input[name="visibleOnSidebar"]').prop(
				'checked'
			);
			const dialogueFlag = this.$('.visibilityOptions input[name="visibleOnDialogue"]').prop(
				'checked'
			);
			const searchFlag = this.$('.visibilityOptions input[name="visibleOnSearch"]').prop(
				'checked'
			);
			const fieldModel = new FieldModel(this.field, {
				type: this.type
			});
			const data = {
				name,
				important_flag: sidebarFlag,
				add_visible_flag: dialogueFlag,
				searchable_flag: searchFlag
			};

			if (_.includes(['set', 'enum'], this.field.field_type)) {
				const previousOptions = _.map(this.field.options, (option) => {
					return {
						label: option.label,
						id: option.id
					};
				});

				this.$('.fieldOptionsList li').each(
					_.bind((i, li) => {
						const option = {
							label: $(li)
								.find('input')
								.val()
						};
						const id = Number(li.getAttribute('data-id')) || null;

						if (_.isInteger(id)) {
							option.id = id;
						}

						options.push(option);
					}, this)
				);

				if (!_.isEqual(options, previousOptions)) {
					data.options = options;
				}
			}

			if (!this.validateFields(data, options)) {
				return;
			}

			fieldModel.set(data);

			if (fieldModel.hasChanged()) {
				fieldModel.save();
				CustomFieldAnalytics.trackCustomFieldEdited(this.field, fieldModel.attributes);
			}

			this.field = fieldModel.toJSON();
			this.setState(states.CUSTOMIZE);
		},

		validateFields: function(data, options) {
			let isValid = true;

			this.$('.error').removeClass('error');

			if (!data.name) {
				this.$('.customizeEdit .fieldName')
					.addClass('error')
					.find('input')
					.focus();
				isValid = false;
			}

			if (_.includes(['set', 'enum'], this.field.field_type) && !options.length) {
				this.$('.customizeEdit')
					.addClass('error')
					.find('.newValue input')
					.focus();

				return;
			}

			return isValid;
		},

		removeField: function() {
			const field = new FieldModel(this.field, {
				type: this.type
			});

			field.destroy({
				success: async () => {
					if (User.companyFeatures.get('custom_fields_usage_capping')) {
						await this.options.refreshAddNewFieldViewCappingInfo();
					}
				}
			});
			this.remove();
			CustomFieldAnalytics.trackCustomFieldDeleted(this.field);
		},

		showOnMap: function(ev) {
			ev.preventDefault();

			modals.open('webapp:modal', {
				modal: 'map',
				params: {
					type: this.type,
					field: this.field,
					model: this.model,
					userSettings: User.settings
				}
			});
		},

		onLabelClick: function(ev) {
			ev.preventDefault();
			this.edit();
		},

		getTemplate: function(data) {
			let template = function() {
				return `error!${this.state}`;
			};

			if (_.isObject(this.template) && this.template.hasOwnProperty(this.state)) {
				template = this.template[this.state];
			} else if (_.isFunction(this.template)) {
				template = this.template;
			}

			if (_.isString(this.options.customTemplate)) {
				template = _.template(this.options.customTemplate);
			} else if (_.isFunction(this.options.customTemplate)) {
				template = this.options.customTemplate(this, template);
			}

			return data ? template(data) : template;
		},

		openEditPopover: async function(ev) {
			ev.preventDefault();

			// Deal value field that has a product attached
			// opens product dialog instead of simple field change popup.
			if (this.isDealValueField() && this.hasProducts()) {
				this.openProductDialog();
			} else {
				const popover = await componentLoader.load('webapp:popover');

				popover.open({
					popover: 'changefieldvalue',
					params: {
						model: this.model,
						title: _.gettext('Edit ') + this.field.name,
						fieldKey: this.key,
						position: 'auto',
						target: ev.delegateTarget
					}
				});
			}
		},

		hasProducts: function() {
			return this.model.get('products_count');
		},

		isDealValueField: function() {
			return this.type === 'deal' && this.field.key === 'value';
		},

		openProductDialog: function() {
			const personId = this.model.get('person_id');
			const organizationId = this.model.get('org_id');
			const relatedPerson = this.model.getRelatedObjects().person;
			const relatedOrganization = this.model.getRelatedObjects().organization;

			if (personId && relatedPerson && relatedPerson[personId]) {
				this.model.set({
					person_name: relatedPerson[personId].name
				});
			}

			if (organizationId && relatedOrganization && relatedOrganization[organizationId]) {
				this.model.set({
					org_name: relatedOrganization[organizationId].name
				});
			}

			return AddToDealModal.openProductDealModal(this.model);
		},

		// Evaluates whether the text field contents are in an accepted form. True if:
		// 1. the field has the initial value
		// 2. autocomplete results were found
		// 3. the field is empty (used for deletion)
		isAcceptedResult: function(results) {
			const value =
				_.get(
					this.value_editor,
					`prefillModel.attributes.${this.fieldClass.displayAttr}`
				) || this.value_editor.value;

			return results.query === value || results.collection.length || !results.query.length;
		},

		// Enables / disables Save button
		matchRequiredEvent: function(results) {
			this.isResultsFound = this.isAcceptedResult(results);

			this.$el.find('.input.save .cui4-button').attr('disabled', !this.isResultsFound);
		},

		attachProduct: function(e) {
			e.preventDefault();
			this.openProductDialog();
		},

		render: function() {
			if (this.fieldClass.matchRequired) {
				this.field.onResultsFound = _.bind(this.matchRequiredEvent, this);
			}

			this.removeInputControls();
			this.$el.html(this.getTemplate(this));

			this.bindDOMEventListeners();

			if (_.isFunction(this.options.onRender)) {
				this.options.onRender(this);
			}

			this.afterRender();
		},

		bindDOMEventListeners: function() {
			this.$('.action').on('click', _.bind(this.onButtonClick, this));

			if (this.settings.popoverEditable) {
				this.$('.editField').on('click.editTableField', _.bind(this.openEditPopover, this));
			}

			if (this.companyHasProducts) {
				this.$('.attachProducts').on('click', _.bind(this.attachProduct, this));
			}

			this.$('[data-action="showOnMap"]').on('click', _.bind(this.showOnMap, this));

			if (this.state === states.READ && this.settings.clickToEdit) {
				this.$('.item').on('click', _.bind(this.onLabelClick, this));
			}

			if (this.state === states.EDIT) {
				this.$el.on('keyup.field', this.onKeyUp);
				this.$el.on('keydown.field', this.onKeyDown);
			}

			if (_.isFunction(this.fieldClass.trackValueClick)) {
				this.$('.value')
					.off('click.valueClickTracking')
					.on('click.valueClickTracking', () => {
						this.fieldClass.trackValueClick(this.options.trackingData);
					});
			}
		},

		initTooltips: function() {
			this.$('[data-tooltip]').each(function() {
				$(this).tooltip({
					tip: this.getAttribute('data-tooltip'),
					preDelay: 200,
					postDelay: 200,
					zIndex: 20000,
					fadeOutSpeed: 100,
					position: this.getAttribute('data-tooltip-position') || 'top',
					clickCloses: true
				});
			});
		},

		addQuickInfoCard: function({ el, id, type, source }) {
			this.quickInfoCard = new QuickInfoCard({
				el,
				id,
				type,
				source,
				popoverProps: {
					placement: 'right'
				}
			});
		},

		beforeRender: function() {
			if (this.quickInfoCard) {
				this.quickInfoCard.onDestroy();
			}
		},

		afterRender: function() {
			if (this.key === 'name' && this.state === states.READ && this.model) {
				const id = this.model.get('id');
				const type = this.type;
				const source = `linked_${this.type}`;
				const el = this.$('.contactName').get(0);

				if (!this.quickInfoCard) {
					this.addQuickInfoCard({ el, id, type, source });
				}
			}

			if (this.state === states.CUSTOMIZE_EDIT) {
				this.$('.customizeEdit .fieldName input').focus();
			}

			if (_.isFunction(this.fieldClass.bindSanitizing)) {
				this.fieldClass.bindSanitizing(this.$el);
			}
		},

		onAttachedToDOM: function() {
			const fcbElement = document.querySelector('a[data-target="call"]');

			if (this.shouldShowSalesPhone() && fcbElement) {
				iamClient.addCoachmark(iamClient.coachmarks.SALES_PHONE_CAPABILITY, fcbElement);
			}

			this.initTooltips();
		},

		createSalesPhoneView: function({
			phoneFieldElement,
			customPhoneNumberData,
			phoneNumber,
			clickedOnNumber,
			quickCallMethod,
			quickCallButtonElement,
			quickCallNumberElement,
			source
		}) {
			const {
				deal_id: dealId,
				person_id: personId,
				org_id: orgId
			} = _.mapValues(this.getRelatedObjectsIds(), (v) => (v ? Number(v) : null));

			salesPhone.createView({
				phoneNumber,
				dealId,
				personId,
				relatedModel: this.relatedModel || this.model,
				orgId,
				phoneFieldElement,
				phoneNumbersArray: this.model.get('phone'),
				customPhoneNumberData,
				createPhoneLink: Helpers.createPhoneLink,
				clickedOnNumber,
				quickCallMethod,
				quickCallButtonElement,
				quickCallNumberElement,
				source
			});
		},

		shouldShowSalesPhone() {
			return salesPhone.isAvailable();
		},

		isCaller11() {
			return salesPhone.isCaller11();
		},

		isCaller12() {
			return salesPhone.isCaller12();
		},

		getQuickCallButtonTooltip: function() {
			const method = salesPhone.getQuickCallMethod();

			return salesPhone.getQuickCallButtonTooltip(method);
		},

		startQuickCall: function(event, source) {
			const method = salesPhone.getQuickCallMethod();

			this.addSalesPhone(event, method, source);
		},

		startQuickCallFromButton: function(event) {
			this.startQuickCall(event, salesPhone.SOURCE_QUICK_CALL);
		},

		startQuickCallFromNumber: function(event) {
			this.startQuickCall(event, salesPhone.SOURCE_QUICK_CALL_PHONE_NUMBER);
		},

		// update call button tooltip on hover so user doesn't have to
		// refresh after finishing onboarding/changing call method
		updateQuickCallTooltip: function(event) {
			const button = event.target;

			$(button).tooltip({
				tip: this.getQuickCallButtonTooltip(),
				position: 'top'
			});
		},

		getPhoneGroup: function(eventTarget) {
			if (this.isCaller12()) {
				return $(eventTarget).closest('.salesPhoneButton--caller12');
			}

			return this.isCaller11() ? $(eventTarget) : $(eventTarget).parent();
		},

		addSalesPhone: function(event, quickCallMethod, source) {
			if (!this.shouldShowSalesPhone()) {
				return null;
			}

			const $phoneGroup = this.getPhoneGroup(event.currentTarget);
			const isClickOnOptionButton = $(event.currentTarget).hasClass('salesPhoneOptions');
			const phoneNumber = $phoneGroup.find('a').text();

			const phoneFieldElement = this.isCaller12()
				? $phoneGroup.find('.salesPhoneOptions')[0]
				: this.isCaller11()
				? $phoneGroup[0]
				: $phoneGroup.find('.phoneNumber, .salesPhoneNumber')[0];
			const customPhoneNumberData = {
				id: this.model.id,
				key: this.field.key,
				type: this.field.item_type,
				isCustomField: !!this.field.phoneCustomField
			};
			const quickCallButtonElement =
				source === salesPhone.SOURCE_QUICK_CALL
					? $phoneGroup.find('.salesPhoneCallButton')[0]
					: null;
			const quickCallNumberElement =
				source === salesPhone.SOURCE_QUICK_CALL_PHONE_NUMBER
					? $phoneGroup.find('.salesPhoneNumber')[0]
					: null;

			event.preventDefault();

			this.createSalesPhoneView({
				phoneFieldElement,
				customPhoneNumberData,
				phoneNumber,
				clickedOnNumber: !isClickOnOptionButton,
				quickCallMethod,
				quickCallButtonElement,
				quickCallNumberElement,
				source
			});
		},

		getRelatedObjectsIds: function() {
			const attributes = this.model && this.model.attributes;
			const relatedAttributes = this.relatedModel && this.relatedModel.attributes;
			const relatedItem = _.assign(
				{ id: null, type: null },
				_.pick(this.relatedModel, ['id', 'type'])
			);

			const relatedIds = _.assign(
				{
					deal_id: this.type === 'deal' ? this.model.id : null,
					org_id: this.type === 'organization' ? this.model.id : null,
					person_id: this.type === 'person' ? this.model.id : null
				},
				_.pick(attributes, ['deal_id', 'org_id', 'person_id']),
				_.pick(this.relatedModel, ['deal_id', 'org_id', 'person_id']),
				_.pick(relatedAttributes, ['deal_id', 'org_id', 'person_id'])
			);

			switch (relatedItem.type) {
				case 'deal':
					relatedIds.deal_id = relatedItem.id;
					break;
				case 'organization':
					relatedIds.org_id = relatedItem.id;
					break;
				case 'person':
					relatedIds.person_id = relatedItem.id;
					break;
			}

			return relatedIds;
		},

		onSaved: function() {
			this.resetFromModel();
			this.fieldClass.setValue(this.model.get(this.key));
			this.read();
			this.trigger('save');

			// Needed to render all the fields with related data
			this.model.trigger(`change:${this.field.key}`);
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

			if (
				ev.keyCode === KEY.enter &&
				this.isResultsFound &&
				!Pipedrive.common.isEnterClickedForNewLine(ev)
			) {
				ev.preventDefault();
				this.save();
			}
		},

		onModelChange: function() {
			this.resetFromModel();

			if (this.state === states.READ) {
				if (this.field.isRequired) {
					this.field.showYellowDot = !this.model.get(this.key);
				}

				this.prepareReadFormat();
			} else if (this.state === states.EDIT || this.state === states.EDIT_BULK) {
				// In future show values changed sign, do not just update editor value!
				this.prepareEdit();
			}

			this.render();
		},

		// this should be automatic
		removeInputControls: function() {
			const select2 = this.$('.select2-container').data('select2');

			if (select2) {
				select2.destroy();
			}
		},

		getPropertiesTexts: function() {
			const texts = [];

			if (this.field.important_flag) {
				texts.push(_.gettext('Always visible on sidebar'));
			}

			if (this.field.add_visible_flag) {
				texts.push(this.addNewDialogCopy[this.model.type || 'default']);
			}

			return texts;
		},

		onUnload: function() {
			this.removeInputControls();
			this.unbindListeners();
			this.$el.empty();

			if (this.quickInfoCard) {
				this.quickInfoCard.onDestroy();
			}
		},

		onDestroy: function() {
			if (this.quickInfoCard) {
				this.quickInfoCard.onDestroy();
			}
		}
	},
	{
		states
	}
);
