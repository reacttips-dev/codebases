const User = require('models/user');
const _ = require('lodash');
const FieldView = require('views/shared/fields/field');
const VisibilityHelper = require('utils/visibility-helper');
const VisibilityTemplate = require('templates/shared/visibility-field.html');
const componentLoader = require('webapp-component-loader');
const defaultOptions = {
	key: 'visible_to',
	position: 'bottom-end',
	tooltipPosition: 'top',
	autoSave: true,
	small: false,
	dataType: null
};

module.exports = FieldView.extend({
	template: _.template(VisibilityTemplate),

	defaultSettings: _.assignIn(_.clone(FieldView.prototype.defaultSettings), {
		editable: false,
		valueOnly: true
	}),

	initialize: function(options) {
		const initializeOptions = _.assignIn({}, defaultOptions, options);

		if (options.dataType === 'filter') {
			if (!this.model.get('user_id')) {
				// a filter with no creator
				// - if it has an ID -> a default filter ('All deals', 'Rotten deals', etc)
				// - no ID -----------> a new filter
				this.enabled = !this.model.get('id') && User.settings.get('can_share_filters');
			} else if (this.model.get('user_id') === User.get('id')) {
				// an already existing filter created by current user
				this.enabled = User.settings.get('can_share_filters');
			} else {
				// an already existing filter created by another user
				this.enabled = User.settings.get('can_edit_shared_filters');
			}
		} else {
			this.enabled =
				User.get('is_admin') || User.settings.get('can_change_visibility_of_items');
		}

		FieldView.prototype.initialize.call(this, initializeOptions);
	},

	render: function() {
		FieldView.prototype.render.call(this);

		if (this.enabled) {
			this.$('.visibility-select').on(
				'click',
				_.bind(async function(ev) {
					ev.preventDefault();

					const popover = await componentLoader.load('webapp:popover');

					popover.open({
						popover: 'visibility-switch',
						params: {
							model: this.model,
							position: this.options.position,
							target: ev.currentTarget,
							autoSave: this.options.autoSave,
							dataType: this.options.dataType
						}
					});
				}, this)
			);
		}

		let tooltipText;

		if (this.options.small) {
			tooltipText = `<div class="title">${_.capitalize(this.value_visual.label)}</div>`;
			tooltipText += VisibilityHelper.getDescription(
				this.value_visual.value,
				this.options.dataType ? this.options.dataType : null
			);
		} else if (this.options.tooltipText) {
			tooltipText = this.options.tooltipText;
		}

		if (tooltipText) {
			this.$('.valueWrap').tooltip({
				tipHtml: tooltipText,
				preDelay: 200,
				postDelay: 200,
				zIndex: 20000,
				fadeOutSpeed: 100,
				position: this.options.tooltipPosition,
				clickCloses: true
			});
		}
	},

	getPermissionType: function() {
		return VisibilityHelper.getPermissionType();
	},

	getVisibilityLabel: function() {
		if (this.options.small) {
			return '';
		}

		return this.value_visual.label;
	}
});
