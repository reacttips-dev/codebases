'use strict';

const Pipedrive = require('pipedrive');
const _ = require('lodash');
const User = require('models/user');
const MailConnections = require('collections/mail/global-singletons/mail-connections');
const ThreadModel = require('models/mail/thread');
const BulkEdit = require('models/mail/threads-bulk-edit');
const moment = require('moment');
const Retryable = require('utils/retryable');
const logger = new Pipedrive.Logger('mail', 'threads-list');
const FILTERS = {
	unread: {
		key: 'read_flag',
		value: 0,
		short_title: _.gettext('Unread')
	},
	linked: {
		key: 'has_deal',
		value: 1,
		group: 'linked_with_deal',
		short_title: _.gettext('Linked')
	},
	linked_with_open_deal: {
		key: 'deal_status',
		value: 'open',
		group: 'linked_with_deal',
		short_title: _.gettext('Linked: open')
	},
	not_linked: {
		key: 'has_deal',
		value: 0,
		group: 'linked_with_deal',
		short_title: _.gettext('Not linked')
	},
	shared: {
		key: 'shared_flag',
		value: 1,
		group: 'shared',
		short_title: _.gettext('Shared')
	},
	not_shared: {
		key: 'shared_flag',
		value: 0,
		group: 'shared',
		short_title: _.gettext('Not shared')
	},
	to_me: {
		key: 'first_message_to_me_flag',
		value: 1,
		short_title: `${_.gettext('To:')} ${_.gettext('me')}`
	},
	from_existing_contact: {
		key: 'from_existing_contact',
		value: 1,
		short_title: `${_.gettext('From:')} ${_.gettext('contact')}`
	},
	attachments: {
		key: 'has_real_attachments_flag',
		value: 1,
		short_title: _.gettext('Attachments')
	},
	mail_tracking_enabled: {
		key: 'mail_tracking_enabled',
		value: 1,
		short_title: _.gettext('Tracked emails')
	}
};

/**
 * Collection of threads
 */
module.exports = Pipedrive.Collection.extend({
	type: 'mailThread',

	section: null,

	model: ThreadModel,

	url: `${app.config.api}/mailbox/mailThreads`,

	activeFilters: null,

	/**
	 * Number of threads pulled once
	 * @type {Number}
	 */
	pullLimit: 50,

	failedOnInitialPull: false,

	initialize: function(models, options) {
		this.options = _.isObject(options) ? options : {};
		this.section = this.options.section;
		this.bulkEdit = new BulkEdit({ collection: this });

		this.setActiveFilters(this.getSavedFilters());
		this.bindEvents();
	},

	getSavedFilters: function() {
		let userSettingFilters = User.settings.get(`mail_filters_${this.section}`);

		// some users are getting filter value as string from User for unknown reasons
		if (_.isString(userSettingFilters)) {
			userSettingFilters = this.handleStringFilterValue(userSettingFilters);
		}

		// Allways contains one item in array, because settings json format requires array, to save
		const filters = _.head(userSettingFilters);

		return filters;
	},

	handleStringFilterValue: function(userSettingFilters) {
		try {
			userSettingFilters = JSON.parse(userSettingFilters);
		} catch (e) {
			userSettingFilters = [];
		}

		return userSettingFilters;
	},

	/**
	 * Orders model by timestamp of the last message in thread (descending)
	 * @param  {Object} a first model
	 * @param  {Object} b second model
	 * @return {Number}   check Backbone documentation for details
	 */
	comparator: function(a, b) {
		return moment(b.get(this.getSortByAttr(b))) - moment(a.get(this.getSortByAttr(a)));
	},

	bindEvents: function() {
		this.on(`change:${this.getSortByAttr()}`, _.bind(this.repositionThread, this));
		this.on('change:archived_flag', this.onThreadArchiveFlagChanged);

		app.global.bind('mailThread.model.*.add', this.addThread, this);
		app.global.bind('mailThread.model.*.update', this.addThread, this);
		app.global.bind('mailThread.model.*.delete', this.removeThread, this);
	},

	/**
	 * If the attribute, that the list is sorted by, changes, repositions the thread in the list.
	 * @param  {module:Pipedrive.Model} thread
	 * @void
	 */
	repositionThread: function(thread) {
		this.remove(thread.get('id'));
		this.add(thread);
	},

	/**
	 * Returns the attribute by what the current list is sorted by.
	 * @return {String} Thread model's attribute
	 */
	getSortByAttr: function(thread) {
		if (this.section === 'inbox' && thread && thread.get('last_message_received_timestamp')) {
			return 'last_message_received_timestamp';
		}

		return this.section === 'sent' ? 'last_message_sent_timestamp' : 'last_message_timestamp';
	},

	pullFirstPage: function(options) {
		options = options || {};

		const extendedSuccess = this.bindPullSuccess(options.success);
		const extendedError = this.bindPullError(options.error);
		const extendedOpts = _.assignIn({}, options, {
			reset: true,
			success: extendedSuccess,
			error: extendedError
		});

		extendedOpts.data = _.assignIn({}, this.getPullBy(), this.getActiveFilters());

		return this.pullPage(extendedOpts);
	},

	pullFirstPageWithRetry: function(options) {
		this.retryablePull = new Retryable({
			pullMethod: this.pullFirstPage.bind(this),
			pullOptions: options,
			onRetryError: function(collection, xhr, response) {
				if (_.has(response, 'statusCode')) {
					return true;
				}
			}
		});
		this.retryablePull.pull();
	},

	isRetryPending: function() {
		return !!this.retryablePull && this.retryablePull.isRetryPending();
	},

	abortPull: function() {
		if (this.isRetryPending()) {
			this.retryablePull.abort();
		}
	},

	setActiveFilters: function(filters) {
		this.activeFilters = filters;
	},

	getActiveFilters: function() {
		return this.activeFilters;
	},

	isAnyFilterActive: function() {
		return !_.isEmpty(this.getActiveFilters());
	},

	getActiveFiltersDataKeys: function() {
		const filtersDataKeys = [];
		const sectionActiveFilters = this.getActiveFilters();

		_.forEach(_.keys(sectionActiveFilters), (key) => {
			const keyValue = sectionActiveFilters[key];

			filtersDataKeys.push(
				_.findKey(FILTERS, (filter) => {
					return filter.key === key && filter.value === keyValue;
				})
			);
		});

		return filtersDataKeys;
	},

	getFiltersObject: function(selectedFilters) {
		const filtersObj = {};

		_.forEach(
			selectedFilters,
			_.bind((filter) => {
				if (FILTERS[filter].key) {
					filtersObj[FILTERS[filter].key] = FILTERS[filter].value;
				}
			}, this)
		);

		return filtersObj;
	},

	applyFilters: function(selectedFilters) {
		const filters = _.clone(this.getFiltersObject(selectedFilters));
		const opts = {};

		this.setActiveFilters(filters);
		this.saveFilters(filters);

		opts.data = _.assignIn({}, this.getPullBy(), filters);

		opts.success = this.trigger.bind(this, 'filters:applied');
		opts.error = opts.success;

		this.trigger('filters:change');
		this.pull(opts);
	},

	getPullBy: function() {
		return { folder: this.section };
	},

	saveFilters: function(filters) {
		User.settings.save(`mail_filters_${this.section}`, [filters]);
	},

	clearFilters: function() {
		this.applyFilters({});
	},

	getActiveFiltersShortTitles: function() {
		const titles = [];

		_.forEach(this.getActiveFiltersDataKeys(), (key) => {
			titles.push(FILTERS[key].short_title);
		});

		return titles;
	},

	getFilterGroup: function(selectedFilter) {
		return FILTERS[selectedFilter].group;
	},

	bindPullSuccess: function(successCallback) {
		const extendedCallback = function(collection, xhr, response) {
			if (_.isFunction(successCallback)) {
				successCallback(collection, xhr, response);
			}

			this.failedOnInitialPull = false;
		};

		return _.bind(extendedCallback, this);
	},

	bindPullError: function(errorCallback) {
		const extendedCallback = function(collection, xhr, response) {
			if (_.isFunction(errorCallback)) {
				errorCallback(collection, xhr, response);
			}

			this.failedOnInitialPull = true;
		};

		return extendedCallback.bind(this);
	},

	onThreadArchiveFlagChanged: function(thread) {
		if (!this.validateThreadBelonging(thread)) {
			this.remove(thread);
		}
	},

	/**
	 * Checks whether given thread should belong to this collection or not
	 * @param  {module:Pipedrive.Model} thread
	 * @return {Boolean}
	 */
	validateThreadBelonging: function(thread) {
		let belongsToThisCollection = true;

		if (this.section === 'inbox') {
			belongsToThisCollection = !thread.get('archived_flag');
		} else if (this.section === 'archive') {
			belongsToThisCollection = !!thread.get('archived_flag');
		}

		return belongsToThisCollection;
	},

	matchesFilters: function(thread) {
		const activeFilters = this.getActiveFilters();

		let matchesFilters = true;

		_.forIn(activeFilters, (value, key) => {
			if (key === 'has_deal') {
				if (
					(value === 1 && !thread.get('deal_id')) ||
					(value === 0 && thread.get('deal_id'))
				) {
					matchesFilters = false;
				}
			} else if (key === 'mail_tracking_enabled') {
				matchesFilters = this.matchesTrackingFilter(thread);
			} else if (thread.get(key) !== value) {
				matchesFilters = false;
			}
		});

		return matchesFilters;
	},

	matchesTrackingFilter: function(thread) {
		const activeConnection = MailConnections.getConnectedNylasConnection();
		const isEmailTrackingEnabled = MailConnections.isEmailTrackingEnabled();

		if (!activeConnection || !isEmailTrackingEnabled) {
			return false;
		}

		return (
			(activeConnection.get('mail_tracking_open_mail_flag') &&
				thread.get('mail_tracking_status')) ||
			(activeConnection.get('mail_tracking_link_flag') &&
				thread.get('mail_link_tracking_enabled_flag'))
		);
	},

	/**
	 * Adds thread to this collection.
	 * @param {module:Pipedrive.Model} thread 	Thread model to be added
	 * @void
	 */
	addThread: function(thread) {
		// Won't show shared threads of other users on the mail page
		if (thread.get('user_id') !== User.get('id')) {
			return;
		}

		if (!this.isPulled()) {
			return;
		}

		const isUpdateEvent = thread.meta && _.isEqual(thread.meta.action, 'updated');
		const threadId = thread.get('id');

		if (isUpdateEvent) {
			this.updateThread(thread);
		}

		if (this.toAddThread(thread)) {
			logger.log('Adding thread', threadId);
			this.add(thread);
		} else if (this.toRemoveThread(thread)) {
			this.removeThread(threadId);
		}
	},

	/**
	 * Helper method for moethod "addThread". Checks whether a thread should be added to this collection.
	 * @param  {module:Pipedrive.Model} thread
	 * @return {Boolean}
	 */
	toAddThread: function(thread) {
		const matchesFilters = this.matchesFilters(thread);
		const belongsToThisCollection =
			_.includes(thread.get('folders'), this.section) && matchesFilters;
		const alreadyInCollection = this.where({ id: thread.get('id') }).length > 0;
		const collIsEmpty = !this.length;
		const lessThanPullLimit = this.length < this.pullLimit;
		const inPulledRange =
			collIsEmpty ||
			Date.parse(this.last().get('last_message_timestamp')) <
				Date.parse(thread.get('last_message_timestamp'));
		const hasMessageInQueue = !!thread.get('has_message_in_queue');

		const toAddThread =
			belongsToThisCollection &&
			!alreadyInCollection &&
			(lessThanPullLimit || inPulledRange) &&
			!hasMessageInQueue;

		return toAddThread;
	},

	updateThread: function(thread) {
		const threadModel = this.findWhere({ id: thread.get('id') });

		threadModel && threadModel.set(thread);
	},

	/**
	 * Removes thread from collection.
	 * @param  {Number} threadId ID of the thread that is going to be removed from collection
	 * @void
	 */
	removeThread: function(threadId) {
		const thread = this.find({ id: threadId });

		if (thread) {
			logger.log('Removing thread', threadId);
			this.remove(thread);
		}
	},

	toRemoveThread: function(thread) {
		const matchesFilters = this.matchesFilters(thread);

		return (this.section === 'drafts' && !thread.get('has_draft_flag')) || !matchesFilters;
	},

	/**
	 * We don't really do (de)selecting all models in this class, but trigger an event and the
	 * table view does the work. This logic could be improved in the future.
	 *
	 * @param  {Object} ev 			Click event object
	 * @param  {Boolean} selectAll 	(Optional) Whether to select (true) or to deselect (false) all threads in this collection
	 * @void
	 */
	selectAll: function(ev, selectAll) {
		this.trigger('threadsListSelectAll', ev, selectAll);
	},

	/**
	 * Select all models from collection by whether it's read or unread
	 *
	 * @param  {Boolean} readMessages 	If to select read or unread messages
	 * @void
	 */
	selectThreadsByReadState: function(readMessages) {
		let selectableModels = [];

		selectableModels = this.filter((model) => {
			const modelIsRead = !!model.get('read_flag');

			return modelIsRead === readMessages;
		});

		this.selectThreads(selectableModels);
	},

	/**
	 * Select all models from collection filtered by shared_flag
	 * @param  {Boolean} sharedMessages If to select shared or private messages
	 * @void
	 */
	selectThreadsBySharedFlag: function(sharedMessages) {
		let selectableModels = [];

		selectableModels = this.filter((model) => {
			return sharedMessages ? !!model.get('shared_flag') : !model.get('shared_flag');
		});

		this.selectThreads(selectableModels);
	},

	/**
	 * Mark all given models selected
	 * @param  {array} models Array of models
	 * @void
	 */
	selectThreads: function(models) {
		if (!_.isArray(models)) {
			return;
		}

		this.resetSelection();
		_.forEach(
			models,
			_.bind((model) => {
				model.rowSelected = true;
				model.trigger('selected', model);
			}, this)
		);
	},

	/**
	 * Gets all of the selected models in this colletion
	 * @return {Array} All selected models
	 */
	getSelectedModels: function() {
		const selectedModels = [];

		_.forEach(
			this.selectedIds,
			_.bind(function(id) {
				const model = this.find({ id });

				if (model) {
					selectedModels.push(model);
				}
			}, this)
		);

		return selectedModels;
	},

	/**
	 * Unselect all threads in collection
	 * @void
	 */
	resetSelection: function() {
		this.selectedIds = [];
		this.each(
			_.bind((model) => {
				if (model.rowSelected) {
					model.rowSelected = false;
					model.trigger('selected', model);
				}
			}, this)
		);
	},

	/**
	 * Get the count of all threads in this list on the server side
	 * @return {Number}
	 */
	getCount: function() {
		const countFromUserSelf = User.counts.get(`${this.section}_mail_threads_count`);
		const countFromPagination = this.additionalData && this.additionalData.pagination.count;

		// Temporary, not needed if we get proper filter counters solution

		const hasActiveFilters = !_.isEmpty(this.getActiveFilters());

		let count = 0;

		if (!_.isUndefined(countFromUserSelf) && !hasActiveFilters) {
			count = countFromUserSelf;
		} else if (countFromPagination) {
			count = countFromPagination;
		}

		return count;
	},

	markAllThreadsAsRead: function() {
		this.each((model) => {
			model.set('read_flag', true);
		});
	},

	toggleArchiveFlagOnSelectedThreads: function(toArchive, callback) {
		this.bulkEdit.editThreads(this.selectedIds, 'archived_flag', toArchive, false, callback);
	},

	/**
	 * Gets selected models and sets the models read flag accoding to input
	 * @param  {Boolean} toRead   new value that will be set on selected models
	 * @void
	 */
	toggleReadFlagOnSelectedThreads: function(toRead) {
		const readFlagFilter = this.activeFilters && this.activeFilters.read_flag;
		const toRemoveThreads =
			(readFlagFilter === 0 && toRead) || (readFlagFilter === 1 && !toRead);

		this.bulkEdit.editThreads(this.selectedIds, 'read_flag', toRead, toRemoveThreads);
	},

	/**
	 * Gets selected models and sets the models visibility flag accoding to input
	 * @param  {Boolean} toShared    new value that will be set on selected models
	 * @void
	 */
	toggleVisibilityOnSelectedThreads: function(toShared) {
		const sharedFlagFilter = this.activeFilters && this.activeFilters.shared_flag;
		const toRemoveThreads =
			(sharedFlagFilter === 0 && toShared) || (sharedFlagFilter === 1 && !toShared);

		this.bulkEdit.editThreads(this.selectedIds, 'shared_flag', toShared, toRemoveThreads);
	},

	/**
	 * Deletes all of the selected models
	 * by calling Model.destroy on each of them
	 * @void
	 */
	deleteSelectedThreads: function(callbacks) {
		this.bulkEdit.deleteThreads(this.selectedIds, callbacks);
	},

	getThreadIndexById: function(threadId) {
		const model = this.get(threadId);

		return this.indexOf(model);
	},

	getNextThreadId: function(threadModel) {
		const currentThreadPosition = this.getThreadIndexById(threadModel.get('id'));
		const nextThread = this.at(currentThreadPosition + 1);
		const nextThreadId = nextThread ? nextThread.get('id') : null;

		return nextThreadId;
	},

	getPreviousThreadId: function(threadModel) {
		const currentThreadPosition = this.getThreadIndexById(threadModel.get('id'));
		const previousThreadPosition = currentThreadPosition - 1;
		const previousThread = previousThreadPosition >= 0 ? this.at(previousThreadPosition) : null;
		const previousThreadId = previousThread ? previousThread.get('id') : null;

		return previousThreadId;
	},

	discardDraftsOnSelectedThreads: function() {
		_.forEach(this.selectedIds, (id) => {
			const threadModel = this.findWhere({ id });

			threadModel.discardDraft();

			this.removeThread(id);
		});
	}
});
