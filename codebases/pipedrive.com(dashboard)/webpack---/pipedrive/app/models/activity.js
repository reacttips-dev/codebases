const _ = require('lodash');
const SyncEventModel = require('models/sync-event');
const User = require('models/user');
const Company = require('collections/company');
const HelpersMoment = require('utils/helpers-moment');
const HelpersLodash = require('utils/helpers-lodash');
const moment = require('moment');
const momentLocale = require('utils/helpers-moment').LOCALE;
const CustomFieldHelper = require('models/customfieldhelper');
const fieldModelMapUtils = require('utils/field-model-map');
const modals = require('utils/modals');

const {
	default: convertToLocalDateTime,
	UTC_DATE_FORMAT,
	UTC_TIME_FORMAT,
	UTC_DATE_TIME_FORMAT
} = require('utils/convert-to-local-date-time');

module.exports = SyncEventModel.extend(CustomFieldHelper).extend(
	/** @lends models/Activity.prototype */ {
		ownerKey: 'user_id',
		readonly: [
			'deal_private_id',
			'deal_title',
			'person_name',
			'org_name',
			'organization',
			'person',
			'deal',
			'updates_story_id',
			'related_objects',
			'highlighted_in_list'
		],
		getMatchingFilters: true,

		/**
		 * Map specific fields to models
		 * @type {Object}
		 * @enum {Object}
		 */
		fieldModelMap: fieldModelMapUtils.buildFieldModelMapFn([
			'person',
			'organization',
			'deal',
			'lead'
		]),

		/**
		 * Type of model
		 * @type {String}
		 * @default
		 */
		type: 'activity',

		allowDirectSync: true,

		/**
		 * Moment object that holds the converted date and time for
		 * current activity.
		 * @type {moment}
		 */
		localDueDate: null,

		/**
		 * URL for Backbone pull requests
		 * @return {String} Returns URL to use
		 */
		url: function() {
			if (this.get('id')) {
				return `${app.config.api}/activities/${this.get('id')}`;
			} else {
				return `${app.config.api}/activities`;
			}
		},

		/**
		 * Initialize class
		 *
		 * @classdesc  Activity model
		 * @augments {module:Pipedrive.Model}
		 * @constructs
		 *
		 * @return {models/Activity}
		 */
		initialize: function() {
			this.cacheCalculatedValues();
			this.on('change', _.bind(this.cacheCalculatedValues, this));
			this.on('change:no_gcal', _.bind(this.handleNoGcalFlagChanges, this));
			this.on(
				'change:due_date change:due_time',
				_.bind(this.handleBulkEditPartlyChanges, this)
			);
			this.addListeners();
			this.selfUpdateFromSocket();

			this.original = this.toJSON();
			this.on(
				'sync',
				function() {
					this.original = this.toJSON();
				},
				this
			);

			return this;
		},

		addListeners: function() {
			this.removeListeners();

			if (this.get('lead_id')) {
				app.global.bind(`lead.model.${this.get('lead_id')}.update`, this.updateLead, this);
			}
		},

		removeListeners: function() {
			if (this.get('lead_id')) {
				app.global.unbind(
					`lead.model.${this.get('lead_id')}.update`,
					this.updateLead,
					this
				);
			}
		},

		updateLead: function(leadModel) {
			if (leadModel.get('title') !== this.get('lead_title')) {
				this.set({
					lead_title: leadModel.get('title')
				});
			}
		},

		/*
		 * we need to overwrite this.original with coming event from socket
		 * because otherwise we're not synced
		 */
		eventFromSocket: function(model) {
			const updateKey = 'update_time';
			const oldUpdatedTime = moment(this.get(updateKey)).unix();
			const newUpdatedTime = moment(model.get(updateKey)).unix();

			if (this.get(updateKey) && oldUpdatedTime > newUpdatedTime) {
				return;
			}

			SyncEventModel.prototype.eventFromSocket.call(this, model);
			this.original = model.toJSON();
		},

		/**
		 * Destroys model
		 * @deprecated Use .destroy() method directly
		 * @todo Is this really necessary?
		 * @void
		 */
		clear: function() {
			this.destroy();
		},

		getDateTime: function() {
			if (this.get('due_time')) {
				const date = `${this.get('due_date')} ${this.get('due_time')}`;

				return moment.utc(date, UTC_DATE_TIME_FORMAT).local();
			} else {
				return moment(this.get('due_date'), UTC_DATE_FORMAT).local();
			}
		},

		isOverdue: function() {
			return this.getDateTime() < moment() && (!this.isToday() || !this.isAllDay());
		},

		isDone: function() {
			return !!this.get('done');
		},

		isToday: function() {
			return moment().isSame(this.getDateTime(), 'day');
		},

		// Activities that have no time are definitely meant to be
		// all day activities
		isAllDay: function() {
			const dueTime = this.get('due_time');

			return dueTime === '' || _.isNull(dueTime) || _.isUndefined(dueTime);
		},

		// Activities that are renderable in the agenda grid
		// have time and are under 24 hours long.
		isForAgendaGrid: function() {
			return this.get('due_time') && !this.isOver24h();
		},

		isOver24h: function() {
			return this.get('due_time') && moment.duration(this.get('duration')).asHours() >= 24;
		},

		// Is activity starting in the next 24 hours
		isStartingWithin24h: function() {
			// getDateTime returns in local timezone
			const diffInHours = this.getDateTime().diff(moment(), 'hours');

			return diffInHours >= 0 && diffInHours <= 24;
		},

		getRelativeDate: function() {
			if (this.isDone()) {
				if (this.isToday() && this.isAllDay()) {
					return _.gettext('Done today');
				} else {
					return _.gettext(
						'Done %s ago',
						_.interactiveTimestamp(this.getDateTime(), 'relative', false)
					);
				}
			} else {
				if (this.isOverdue()) {
					return _.gettext(
						'%s overdue',
						_.interactiveTimestamp(this.getDateTime(), 'relative', false)
					);
				} else if (this.isToday() && this.isAllDay()) {
					return _.gettext('Today');
				} else {
					return _.gettext(
						'Due in %s',
						_.interactiveTimestamp(this.getDateTime(), 'relative', false)
					);
				}
			}
		},

		/**
		 * Extends default save operation
		 * Activity model special rule - trigger add next activity modal automatically when
		 * it's last active activity of this related deal, person or organization
		 */
		save: function(key, val, options) {
			let attrs;

			if (key === null || typeof key === 'object') {
				attrs = key;
				options = val;
			} else {
				(attrs = {})[key] = val;
			}

			options = options || {};

			const self = this;
			const successHandler = options.success;

			options.success = function(model, response) {
				const additionalData = response.additional_data;
				const isDeletedDeal = self.isDealDeleted(model, response);

				if (
					additionalData &&
					additionalData.more_activities_scheduled_in_context === false &&
					!isDeletedDeal
				) {
					modals.open('webapp:modal', {
						modal: 'activity/add',
						params: {
							next: true,
							deal: self.get('deal_id'),
							person: self.get('person_id'),
							organization: self.get('org_id')
						}
					});
				}

				if (_.isFunction(successHandler)) {
					successHandler(model, response);
				}
			};

			return CustomFieldHelper.save.call(this, attrs, options);
		},

		isDealDeleted: function(model, response) {
			return model && response.related_objects && response.related_objects.deal
				? response.related_objects.deal[model.get('deal_id')].status === 'deleted'
				: false;
		},

		saveChanges: function(data, options) {
			this.set(data, { silent: true });

			const changedData = HelpersLodash.diff(this.original, _.assignIn(this.toJSON(), data));
			const opts = _.assignIn(options, {
				data: changedData
			});

			// we need to reset changed attributes in order Backbone will not overwrite
			// our data
			this.changed = {};
			this.save(null, opts);
		},

		handleBulkEditPartlyChanges: function(model, value, options) {
			const changes = _.pick(this.changedAttributes(), 'due_date', 'due_time');
			const wasBulkEdited = this.wasBulkEdited(options);
			const hasSingleChange = _.keys(changes).length === 1;

			if (!value || !wasBulkEdited || !hasSingleChange) {
				return;
			}

			if (changes.due_date) {
				this.handleDueDateChanges();
			}

			if (changes.due_time) {
				this.handleDueTimeChanges();
			}
		},

		wasBulkEdited: function(options) {
			return options && options.updatedFromBulkEdit;
		},

		handleDueDateChanges: function() {
			const previousData = this.previousAttributes();

			const previousLocalTime = moment
				.utc(`${previousData.due_date} ${previousData.due_time}`, UTC_DATE_TIME_FORMAT)
				.local()
				.format(UTC_TIME_FORMAT);
			const newUtcDate = moment(
				`${this.get('due_date')} ${previousLocalTime}`,
				UTC_DATE_TIME_FORMAT
			)
				.utc()
				.locale(momentLocale);

			this.set('due_date', newUtcDate.format(UTC_DATE_FORMAT), { silent: true });
		},

		handleDueTimeChanges: function() {
			const previousData = this.previousAttributes();
			const previousLocalDate = moment
				.utc(`${previousData.due_date} ${previousData.due_time}`, UTC_DATE_TIME_FORMAT)
				.local()
				.format(UTC_DATE_FORMAT);
			const newLocalTime = moment
				.utc(this.get('due_time'), UTC_TIME_FORMAT)
				.local()
				.format(UTC_TIME_FORMAT);
			const newUtcDate = moment(`${previousLocalDate} ${newLocalTime}`, UTC_DATE_TIME_FORMAT)
				.utc()
				.locale(momentLocale);

			this.set('due_date', newUtcDate.format(UTC_DATE_FORMAT), { silent: true });
		},

		handleNoGcalFlagChanges: function() {
			const noGcalFlag = 'no_gcal';

			// we need to ignore changes to the no_gcal flag
			this.original[noGcalFlag] = this.get(noGcalFlag);
			_.unset(this.changed, noGcalFlag);
		},

		/**
		 * Calculates local due date based due_date and due_time. This method
		 * converts server time (UTC) to local time.
		 *
		 * @private
		 * @void
		 */
		cacheCalculatedValues: function() {
			this.localDueDate = convertToLocalDateTime(this.get('due_date'), this.get('due_time'));
			this.isOverdueCached = this.isOverdue();
			this.isTodayCached = this.isToday();
		},

		/**
		 * Returns activity type icon for the current activity. This handles
		 * both custom icon keys and default activity type icons.
		 *
		 * @return {String} Returns icon key as string
		 */
		getTypeIcon: function() {
			return User.getActivityIconByType(this.get('type'));
		},

		getOwnerName: function() {
			const user = Company.getUserById(this.get('user_id'));

			return user ? user.get('name') : `(${_.gettext('hidden user')})`;
		},

		getLink: function() {
			return `?activity=${this.get('id')}#dialog/activity/edit`;
		},

		getLocalDueTime: function() {
			const date = this.get('due_date') || moment().format(UTC_DATE_FORMAT);

			return moment.utc(`${date} ${this.get('due_time')}`, UTC_DATE_TIME_FORMAT).local();
		},

		getDynamicSubject: function() {
			const subject = this.get('subject');

			if (subject && subject.trim()) {
				return subject;
			}

			return this.getTypeName() || User.getActivityTypes(true)[0].name;
		},

		/* eslint-disable no-undefined */
		getTypeName: function() {
			const type = _.find(
				User.getActivityTypes(),
				_.bind(function(activityType) {
					return activityType.key_string === this.get('type');
				}, this)
			);

			return type ? type.name : undefined;
		},
		/* eslint-enable no-undefined */

		getTimeLabel: function() {
			const dueTime = this.getLocalDueTime();
			const format = HelpersMoment.getEditorTimeFormat();
			const label = [dueTime.format(format)];

			if (this.get('duration')) {
				const startTime = moment.duration(dueTime.format(UTC_TIME_FORMAT)).asMinutes();
				const endTime = startTime + moment.duration(this.get('duration')).asMinutes();

				label.push(
					moment()
						.startOf('day')
						.add(endTime, 'minutes')
						.format(format)
				);
			}

			return label.join(' &#10141; ');
		},

		updateDuration: function(durationMinutes) {
			const duration = moment()
				.startOf('day')
				.add(durationMinutes, 'minutes')
				.locale(momentLocale)
				.format(UTC_TIME_FORMAT);

			this.set('duration', duration);
		},

		updateDueTime: function(startMinutes) {
			const dueDateTime = moment(this.localDueDate, UTC_DATE_FORMAT)
				.startOf('day')
				.add(startMinutes, 'minutes')
				.utc()
				.locale(momentLocale);

			this.set({
				due_time: dueDateTime.format(UTC_TIME_FORMAT),
				due_date: dueDateTime.format(UTC_DATE_FORMAT)
			});
		},

		toggleDoneState: function(options) {
			const currentState = this.get('done');

			this.save('done', !currentState, options);
		},

		resetSendActivityNotifications: function() {
			if (this.get('send_activity_notifications')) {
				this.unset('send_activity_notifications', { silent: true });
			}
		},

		unbindAllSocketEvents: function() {
			this.removeListeners();

			SyncEventModel.prototype.unbindAllSocketEvents.apply(this);
		}
	},
	{ dateTimeAttributes: ['due_date', 'due_time'] }
);
