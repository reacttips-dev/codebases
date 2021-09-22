const Pipedrive = require('pipedrive');
const _ = require('lodash');
const FieldModel = require('models/field');
const User = require('models/user');
const Template = require('templates/shared/fields/field-new.html');
const CustomFieldOptionTemplate = require('templates/shared/fields/custom-field-option.html');
const { Sortable } = require('sortablejs');
const FieldTypes = require('components/fieldset/lib/field-types');
const $ = require('jquery');
const CustomFieldAnalytics = require('utils/analytics/custom-field-analytics');
const { fieldCUIIconMap } = require('./field-cui-icon-map');
const { addFlowCoachmark, closeFlowCoachmark } = require('utils/support/interface-tour');
const states = {
	READ: 'read',
	EDIT: 'edit',
	SAVING: 'saving'
};
const KEY = Pipedrive.common.keyCodes();
const customFieldsCappingPopover = require('components/custom-fields-capping/upsellDialog');
const customFieldsCappingIndicator = require('components/custom-fields-capping/indicatorComponent');
const customFieldsErrorMessage = require('components/custom-fields-capping/errorMessage');
const { requestCappingInfo } = require('components/custom-fields-capping/helpers');

let reorderCount = 0;
let hasUpdatedCount = false;

module.exports = Pipedrive.View.extend(
	{
		template: _.template(Template),
		state: states.READ,
		maxCustomFieldNameLength: 64,
		customFieldOptionTemplate: _.template(CustomFieldOptionTemplate),

		addableFields: [
			'varchar',
			'varchar_auto',
			'text',
			'double',
			'monetary',
			'set',
			'enum',
			'user',
			'org',
			'people',
			'phone',
			'time',
			'timerange',
			'date',
			'daterange',
			'address'
		],

		addNewDialogCopy: {
			deal: _.gettext('Appears in "Add new deal" dialogue'),
			person: _.gettext('Appears in "Add new person" dialogue'),
			organization: _.gettext('Appears in "Add new organization" dialogue'),
			searchable: _.gettext('Appears in search results'),
			notSearchable: _.gettext('Not searchable'),
			default: _.gettext('Appears in "Add new" dialogue')
		},

		initialize: async function(options) {
			if (User.companyFeatures.get('custom_fields_usage_capping')) {
				this.cappingInfo = await requestCappingInfo();

				if (this.cappingInfo.customFieldsCappingUsage.cap === -1) {
					this.cappingInfo = null;
				}
			}

			this.options = options || {};
			this.initializeFieldData();
			this.render();
		},

		/**
		 * Initialize all field types from FieldTypes helper
		 * @void
		 */
		initializeFieldData: function() {
			let fieldTypes = FieldTypes.getAllTypes();

			fieldTypes = _.map(
				FieldTypes.getAllTypes(),
				_.bind(function(field) {
					if (!_.includes(this.addableFields, field.key)) {
						return false;
					}

					return {
						id: field.key,
						label: field.name,
						data: {
							icon: fieldCUIIconMap[field.key],
							description: field.description
						}
					};
				}, this)
			);

			this.fieldTypes = _.compact(fieldTypes);
		},

		openNewFieldForm: function() {
			if (
				this.state === states.READ &&
				!this.modelSaved &&
				!this.cancel &&
				this.options.newView
			) {
				this.state = states.EDIT;
				this.modelSaved = false;
				this.cancel = false;
			}
		},

		templateHelpers: function() {
			const templateHelpers = {
				newView: this.options.newView,
				type: this.options.type,
				state: this.state,
				states,
				addNewDialogCopy: this.addNewDialogCopy,
				fieldTypes: this.fieldTypes,
				maxCustomFieldNameLength: this.maxCustomFieldNameLength,
				$,
				cappingInfo: this.cappingInfo
			};

			this.options.newView = false;

			return templateHelpers;
		},

		beforeRender: function() {
			this.openNewFieldForm();
			this.unbindEvents();
		},

		afterRender: async function() {
			this.bindEvents();
			this.$('.newField .fieldName input').focus();

			if (
				document.querySelectorAll('.fieldsList.customize .reorder').length > reorderCount &&
				hasUpdatedCount
			) {
				addFlowCoachmark('closedeals_deal_clickdone');
			}

			if (this.cappingInfo) {
				await customFieldsCappingIndicator.render(
					this.$('.customFieldsCappingIndicator').get(0)
				);

				if (
					this.cappingInfo.customFieldsCappingUsage.usage >=
					this.cappingInfo.customFieldsCappingUsage.cap
				) {
					await customFieldsErrorMessage.render(
						this.$('.customFieldsCappingError').get(0)
					);
				}
			}
		},

		/**
		 * Set state of add new view
		 * @void
		 */
		setState: function(toState) {
			if (!_.includes(states, toState)) {
				return;
			}

			this.state = toState;

			if (this.state === states.SAVING) {
				this.save();
			} else {
				this.render();
			}
		},

		/**
		 * Save new field
		 * @void
		 */
		save: async function() {
			const data = this.$('input, select').serializeArray();
			const fieldData = {};

			this.toggleInputs(true);

			_.forEach(data, (field) => {
				fieldData[field.name] = field.value;
			});

			// Convert values to booleans
			this.convertValuesToBool(fieldData);

			if (_.includes(['enum', 'set'], fieldData.field_type)) {
				const options = [];

				this.$('.fieldOptionsList li').each(function() {
					options.push(
						$(this)
							.find('input')
							.val()
					);
				});

				fieldData.options = options;
			}

			if (!(await this.validateFields(fieldData))) {
				this.toggleInputs(false);

				return;
			}

			const model = new FieldModel(fieldData, {
				type: this.options.type
			});

			model.save(null, {
				success: _.bind(async function() {
					this.trigger('save', model.toJSON());
					this.modelSaved = true;
					this.setState(states.READ);

					closeFlowCoachmark('closedeals_deal_fillcustomfield');

					CustomFieldAnalytics.trackCustomFieldCreated(
						model.options.type,
						model.attributes
					);

					if (this.cappingInfo) {
						await customFieldsCappingIndicator.reRenderAll();
						this.cappingInfo = await requestCappingInfo();
					}
				}, this),

				error: _.bind(async function(model, response) {
					this.toggleInputs(false);

					if (response.responseJSON.code === 'feature_capping_custom_fields_limit') {
						this.cappingInfo = await requestCappingInfo(true);
						this.render();
					} else {
						window.alert(response.responseJSON.error);
					}
				}, this)
			});
		},

		convertValuesToBool: function(fieldData) {
			fieldData.important_flag = Boolean(fieldData.important_flag);
			fieldData.add_visible_flag = Boolean(fieldData.add_visible_flag);
			fieldData.searchable_flag = Boolean(fieldData.searchable_flag);
		},

		validateFields: async function(fieldData) {
			if (
				this.cappingInfo &&
				this.cappingInfo.customFieldsCappingUsage.usage >=
					this.cappingInfo.customFieldsCappingUsage.cap
			) {
				await customFieldsErrorMessage.render(this.$('.customFieldsCappingError').get(0));

				return false;
			}

			let isValid = true;

			this.$('.error').removeClass('error');

			if (!fieldData.name) {
				this.$('.newField .fieldName')
					.addClass('error')
					.find('input')
					.focus();
				isValid = false;
			}

			if (_.includes(['enum', 'set'], fieldData.field_type) && !fieldData.options.length) {
				this.$('.newField').addClass('error');
				// focussing to new value input to add value (can't focus before all fields are re-enabled)
				this.$('.newField')
					.find('.newValue input')
					.focus();
				isValid = false;
			}

			return isValid;
		},

		toggleInputs: function(state) {
			this.$('input, select').prop('disabled', state);
			this.$('.cui4-button').attr('disabled', state);
		},

		/**
		 * Bind all events that are needed for add new field view functionality
		 * @void
		 */
		bindEvents: function() {
			this.$el.on(
				'click',
				'a.addField',
				_.bind(function(ev) {
					ev.preventDefault();

					if (
						this.cappingInfo &&
						this.cappingInfo.customFieldsCappingUsage.usage >=
							this.cappingInfo.customFieldsCappingUsage.cap
					) {
						customFieldsCappingPopover.render(
							this.$('.customFieldsCappingPopover').get(0)
						);

						return;
					}

					this.setState(states.EDIT);

					closeFlowCoachmark('closedeals_deal_addcustomfield');
					addFlowCoachmark(
						'closedeals_deal_fillcustomfield',
						document.querySelector('[data-coachmark="new-field"]')
					);
					reorderCount =
						document.querySelectorAll('.fieldsList.customize .reorder').length || 0;
					hasUpdatedCount = true;
				}, this)
			);

			User.fields.once('add', _.bind(this.render, this));

			this.$el.on(
				'click',
				'.actions a',
				_.bind(function(ev) {
					ev.preventDefault();

					this.cancel = true;
					this.setState(ev.currentTarget.getAttribute('data-state'));
				}, this)
			);

			this.$el.on(
				'change',
				'select[name=field_type]',
				_.bind(function(ev) {
					this.$('.newField')
						.attr('data-field-type', ev.currentTarget.value)
						.removeClass('error');

					// Empty options
					this.$('.fieldOptionsList').html('');
				}, this)
			);

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

			this.$el.on(
				'notSearchableCustomField',
				_.bind(function(event, notSearchable) {
					this.notSearchableHandler(event, notSearchable);
				}, this)
			);

			this.bindOptionManagement();
		},

		notSearchableHandler: function(event, notSearchable) {
			const $el = $(event.currentTarget).find('[name="searchable_flag"]');
			const checkboxTextValue = $el.parent().get(0).childNodes[1];

			$el.prop('disabled', notSearchable);

			if (notSearchable) {
				$el.prop('checked', false);
				checkboxTextValue.nodeValue = this.addNewDialogCopy.notSearchable;
			} else {
				$el.prop('checked', true);
				checkboxTextValue.nodeValue = this.addNewDialogCopy.searchable;
			}
		},

		unbindEvents: function() {
			this.$el.off('click change');
		},

		onUnload: function() {
			this.unbindEvents();
		},
		/* Hide-Show the alphabetise button based on number of list items */
		toggleAlphabetise: function($listItems) {
			if ($listItems.length > 1) {
				this.$('.fieldOptions .alphabeticSortWrap').removeClass('isHidden');
			} else {
				this.$('.fieldOptions .alphabeticSortWrap').addClass('isHidden');
			}
		},
		/**
		 * If in edit state, bind functionality of fields reordering
		 * @void
		 */
		bindOptionManagement: function() {
			if (this.state !== states.EDIT) {
				return;
			}

			const draggableClass = '.draggableHandle';
			const $list = this.$('.fieldOptionsList');
			const $input = this.$('.fieldOptions .newValue input');

			this.optionSortable = Sortable.create($list.get(0), {
				draggable: '.reorder',
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

			this.$el.on('click', '.fieldOptions .customAdd', _.bind(this.addNewOption, this));

			this.$el.on(
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
		},
		/**
		 * Add new option to set or enum
		 * @void
		 */
		addNewOption: function(ev) {
			ev.preventDefault();

			const $list = this.$('.fieldOptionsList');
			const $input = this.$('.fieldOptions .newValue input');
			const label = $input.val();

			let $listItems = this.$('.fieldOptionsList li');

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

			this.$('.newField').removeClass('error');
			this.toggleAlphabetise($listItems);
			$input.focus();
		}
	},
	{
		states
	}
);
