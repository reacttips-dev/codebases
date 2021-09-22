const ActivityModel = require('models/activity');
const CombinedObjects = require('collections/combined-objects');
const filteringUtils = require('utils/activity-filter-utils');
const _ = require('lodash');

module.exports = CombinedObjects.extend(
	/** @lends collections/Activities.prototype */ {
		/**
		 * Activity model
		 * @type {models/Activity}
		 */
		model: ActivityModel,
		type: 'activity',
		crossItemRequiredFields: [
			'id',
			'user_id',
			'org_id',
			'person_id',
			'deal_id',
			'lead_id',
			'due_date',
			'due_time',
			'done'
		],

		initialize: function(models, options) {
			options = options || {};
			options.customModelMatchers = _.union(options.customModelMatchers, [
				filteringUtils.matchesType,
				_.partialRight(filteringUtils.matchesStatus, options.statusFilterDisabled)
			]);
			CombinedObjects.prototype.initialize.call(this, models, options);
			this.bindSocketEvents();
		},

		getFieldsArray: function() {
			const fieldsArray = _.isArray(this.options.fields) ? this.options.fields : [];

			if (_.includes(fieldsArray, 'person_id')) {
				fieldsArray.push('participants');
			}

			return fieldsArray;
		},

		url: function() {
			let url = `${app.config.api}/activities/list`;

			const fields = this.getFieldsArray();

			if (this.options.relatedModel) {
				url = `${app.config.api}/${this.options.relatedModel.type}s/${this.options.relatedModel.id}/activities`;
			} else if (fields) {
				url += `:${this.buildFieldsParams(
					fields,
					this.type,
					this.crossItemRequiredFields
				)}`;
			}

			return url;
		},

		/**
		 * Get all overdue activities from this collection
		 * @return {Array} Array of all overdue activities
		 */
		getAllOverdueActivities: function() {
			return this.filter((activity) => {
				return activity.isOverdue();
			});
		},

		/**
		 * Get all today activities from this collection
		 * @return {Array} Array of all planned activities
		 */
		getAllTodayActivities: function() {
			return this.filter((activity) => {
				return activity.isToday() && !activity.isOverdue();
			});
		},

		/**
		 * Get all planned activities from this collection
		 * @return {Array} Array of all planned activities
		 */
		getAllPlannedActivities: function() {
			return this.filter((activity) => {
				return !activity.isOverdue() && !activity.isToday();
			});
		},

		/**
		 * Setting the data type while pulling the collection is only needed for combined-objects
		 */
		injectPullDataType: function() {}
	}
);
