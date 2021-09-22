'use strict';

const CoreTableView = require('views/shared/table');
const _ = require('lodash');
const ThreadsListRowView = require('./threads-list-row');
const ListSettings = require('models/list-settings');
const User = require('models/user');
const MailConnections = require('collections/mail/global-singletons/mail-connections');
const ThreadsListTable = CoreTableView.extend({
	className: function() {
		return this.openTrackingSettingEnabled() ? 'openTrackingEnabled' : '';
	},

	initialize: function(options) {
		const listSettings = new ListSettings({
			customView: User.customViews.getView('mail_list'),
			collection: this.collection
		});
		const tableViewOptions = {
			collection: this.collection,
			customColumnsCount: 9,
			listSettings,
			customRowView: ThreadsListRowView,
			sorting: true,
			serverSorting: true,
			selectableRows: true,
			callCollectionPull: false,
			hideHeader: true,
			nonBlockingLoading: true,
			currentRowThreadId: options.currentRowThreadId
		};

		CoreTableView.prototype.initialize.call(this, tableViewOptions);
	},

	onLoad: function() {
		this.bindEvents();
		this.render();
	},

	bindEvents: function() {
		this.listenTo(this.collection, 'threadsListSelectAll', this.selectAll);
		this.listenTo(this.collection, 'remove', this.onThreadRemove);

		MailConnections.onReady(() => {
			this.$el.toggleClass('openTrackingEnabled', !!this.openTrackingSettingEnabled());

			this.listenTo(
				MailConnections.getConnectedNylasConnection(),
				'change:mail_tracking_open_mail_flag',
				(model, newValue) => {
					this.$el.toggleClass('openTrackingEnabled', !!newValue);
				}
			);
		});
	},

	openTrackingSettingEnabled: function() {
		const activeConnection = MailConnections.getConnectedNylasConnection();
		const isEmailTrackingEnabled = MailConnections.isEmailTrackingEnabled();

		return (
			activeConnection &&
			isEmailTrackingEnabled &&
			activeConnection.get('mail_tracking_open_mail_flag')
		);
	},

	onThreadRemove: function(threadModel) {
		this.removeSelectedID(threadModel.get('id'));
		this.checkScrollForMore();
	},

	/**
	 * Add email specific data to be used when pulling more threads
	 * @return {Object}
	 */
	getDataForLoadingNextPage: function() {
		const sharedTableDataForLoadingMore = CoreTableView.prototype.getDataForLoadingNextPage.call(
			this
		);

		return _.assignIn(
			sharedTableDataForLoadingMore,
			this.collection.getPullBy(),
			this.collection.getActiveFilters()
		);
	},

	/**
	 * Removes thread-model ID from this.collection.selectedIds
	 * @param  {Number} threadId ID of the thread that was removed
	 * @void
	 */
	removeSelectedID: function(threadId) {
		const index = _.indexOf(this.collection.selectedIds, threadId);

		if (index > -1) {
			this.collection.selectedIds.splice(index, 1);
		}
	},

	afterLastRowInDOM: function() {
		CoreTableView.prototype.afterLastRowInDOM.call(this);

		if (this.options.currentRowThreadId) {
			this.highlightCurrentRow();
		}
	},

	highlightCurrentRow: function() {
		const currentRowModel = this.collection.get(this.options.currentRowThreadId);

		if (currentRowModel) {
			currentRowModel.trigger('highlight');
		}
	}
});

module.exports = ThreadsListTable;
