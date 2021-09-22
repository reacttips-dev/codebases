const Pipedrive = require('pipedrive');
const _ = require('lodash');
const User = require('models/user');
const template = require('templates/shared/flow/changelog.html');
const moment = require('moment');
const $ = require('jquery');
const Logger = require('utils/logger');
const logger = new Logger('changelog');

const fieldConverters = {
	date: function(value) {
		return this.getFormattedDate(value);
	},
	daterange: function(value) {
		return this.getFormattedDate(value);
	},
	time: function(value) {
		return this.getFormattedTime(value);
	},
	timerange: function(value) {
		return this.getFormattedTime(value);
	},
	status: function(value) {
		if (this.statuses.hasOwnProperty(value)) {
			return this.statuses[value];
		}

		return value;
	},
	enum: function(value) {
		const field = _.isFinite(value) ? value : Number(value);
		const label = (_.find(this.field.options, { id: field }) || {}).label;

		return label;
	},
	visible_to: function(value) {
		return fieldConverters.enum.call(this, value);
	},
	set: function(value) {
		const labels = [];

		if (value) {
			_.forEach(
				value.split(','),
				_.bind(function(id) {
					const label = (_.find(this.field.options, { id: Number(id) }) || {}).label;

					if (label) {
						labels.push(label);
					}
				}, this)
			);
		}

		return labels.join(', ');
	},
	phone: function(value) {
		if (_.isString(value)) {
			try {
				value = JSON.parse(value);
			} catch (e) {
				logger.log(`Cannot parse:${value}`);
			}
		}

		if (!_.isObject(value)) {
			value = [
				{
					value,
					label: ''
				}
			];
		}

		return value;
	},
	email: function(value) {
		return fieldConverters.phone.call(this, value);
	},
	im: function(value) {
		return fieldConverters.phone.call(this, value);
	},
	stage: function(value, model, old) {
		const pipelineName = old ? 'old_pipeline_name' : 'new_pipeline_name';
		const stageName = old ? 'old_stage_name' : 'new_stage_name';

		if (_.isNull(model.stageChangeInfo[pipelineName])) {
			return model.stageChangeInfo[stageName];
		}

		return `${model.stageChangeInfo[pipelineName]} (${model.stageChangeInfo[stageName]})`;
	}
};

module.exports = Pipedrive.View.extend({
	template: _.template(template),

	statuses: {
		won: _.gettext('Won'),
		lost: _.gettext('Lost'),
		open: _.gettext('Open'),
		deleted: _.gettext('Deleted')
	},

	initialize: function(options) {
		this.options = options || {};
		this.flowItemModel = this.options.flowItemModel;
		this.field = User.fields.getByKey(
			this.flowItemModel.get('data').modelType,
			this.model.get('field_key')
		);
		this.render();
	},

	getChangeTypeClass: function() {
		const oldValue = this.model.get('grouped_old_value')
			? this.model.get('grouped_old_value')
			: this.model.get('old_value');
		const newValue = this.model.get('new_value');
		const type = this.model.field.field_type;

		if (type === 'monetary' && Number(oldValue) < Number(newValue)) {
			return ' positive';
		} else if (type === 'monetary' && Number(oldValue) > Number(newValue)) {
			return ' negative';
		}

		if (type === 'status' && newValue === 'won') {
			return ' positive';
		} else if (type === 'status' && newValue === 'lost') {
			return ' negative';
		}

		return '';
	},

	/**
	 * Phone, email fields contain multiple values in one field - this calculates difference and shows only that
	 * @return {array}
	 */
	getChangedObjectData: function() {
		const oldValueObject = this.getChangedFrom(this.model);
		const newValueObject = this.getChangedTo(this.model);

		let changeData = [];

		if (newValueObject && oldValueObject) {
			for (let i = 0; i < Math.max(oldValueObject.length, newValueObject.length); i++) {
				changeData = this.getChangeData(oldValueObject, newValueObject, changeData, i);
			}

			return changeData;
		}
	},

	getChangeData: function(oldObject, newObject, changeData, key) {
		const oldValue = (oldObject[key] || {}).value;
		const newValue = (newObject[key] || {}).value;
		const oldLabel = (oldObject[key] || {}).label;
		const newLabel = (newObject[key] || {}).label;

		// if oldData !== newData
		if (newValue !== oldValue || newLabel !== oldLabel) {
			changeData.push({
				oldValue,
				oldLabel,
				newValue,
				newLabel
			});
		}

		return changeData;
	},

	getOldValue: function(model, includeGroupedOldValue = true) {
		const groupedValueExists = model.attributes.hasOwnProperty('grouped_old_value');
		const groupedValue = model.get('grouped_old_value');

		if (
			includeGroupedOldValue &&
			groupedValueExists &&
			groupedValue !== model.get('old_value')
		) {
			return groupedValue;
		}

		return model.get('old_value');
	},

	/**
	 * get formatted previous value
	 * @param  {model} model
	 * @return {string}
	 */
	getChangedFrom: function(model, includeGroupedOldValue = true) {
		if (model.get('additional_data') && model.get('additional_data').old_value_formatted) {
			return model.get('additional_data').old_value_formatted;
		}

		if (model.get('change_source') === 'lead') {
			model.field.source = 'lead';

			if (model.get('old_value')) {
				model.field.livechat = model.get('old_value');

				return _.gettext('Live chat');
			}

			return _.gettext('Lead');
		}

		const oldValue = this.getOldValue(model, includeGroupedOldValue);

		if (_.has(fieldConverters, model.field.field_type)) {
			return fieldConverters[model.field.field_type].call(this, oldValue, model, true);
		}

		return oldValue;
	},

	/**
	 * get formatted new value
	 * @param  {model} model
	 * @return {string}
	 */
	getChangedTo: function(model) {
		if (model.get('additional_data') && model.get('additional_data').new_value_formatted) {
			return model.get('additional_data').new_value_formatted;
		}

		if (model.get('change_source') === 'lead') {
			return 'Deal';
		}

		let newValue = model.get('new_value');

		if (_.has(fieldConverters, model.field.field_type)) {
			newValue = fieldConverters[model.field.field_type].call(this, newValue, model);
		}

		return newValue;
	},

	/**
	 * get tooltip of combined changes item
	 * @return {string}
	 */
	getCombinedTooltip: function() {
		if (!this.model.combined) {
			return;
		}

		const changes = _(this.model.combined)
			.sortBy((model) => model.get('log_time'))
			.uniqBy((model) => model.get('log_time'))
			.value()
			.reduce((memo, model) => {
				const changedFrom = this.getChangedFrom(model, false);

				if (changedFrom) {
					return `${memo + changedFrom} → `;
				}

				return `${memo + _.gettext('empty')} → `;
			}, '');

		let lastChange = `${this.getChangedTo(
			this.model.combined[this.model.combined.length - 1]
		)} → ${this.getChangedTo(this.model)}`;

		if (!this.getChangedTo(this.model)) {
			lastChange = _.gettext('empty');
		}

		return changes + lastChange;
	},

	getFormattedDate: function(date) {
		let formDate = moment.utc(date, 'YYYY-MM-DD HH:mm:ss');

		if (date && date.length > 10) {
			formDate = formDate.local();
		}

		return formDate.isValid() ? formDate.format('ll') : '';
	},

	getFormattedTime: function(time) {
		const formTime = moment.utc(time, 'HH:mm:ss');

		return formTime.isValid() ? formTime.format('LT') : '';
	},

	getOldValueLabel: function() {
		const oldValue = this.model.get('old_value');
		const groupedOldValue = this.model.get('grouped_old_value');

		if (this.model.field.field_type === 'status') {
			return this.statuses[groupedOldValue] || this.statuses[oldValue];
		}

		return this.getChangedFrom(this.model);
	},

	templateHelpers: function() {
		return {
			model: this.model,
			changedObjectData: this.getChangedObjectData(),
			flowItemModel: this.flowItemModel,
			combinedTooltip: this.getCombinedTooltip(),
			changedFrom: this.getChangedFrom(this.model),
			changedTo: this.getChangedTo(this.model),
			changeTypeClass: this.getChangeTypeClass(),
			oldValue: this.getOldValueLabel()
		};
	},

	afterRender: function() {
		this.$('[data-tooltip]').each(function() {
			$(this).tooltip({
				tip: this.getAttribute('data-tooltip'),
				preDelay: 200,
				postDelay: 200,
				zIndex: 20000,
				fadeOutSpeed: 100,
				position: 'top',
				clickCloses: true
			});
		});
	}
});
