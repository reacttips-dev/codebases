'use strict';

const Pipedrive = require('pipedrive');
const _ = require('lodash');
const ThreadsListTable = require('./threads-list-table/threads-list-table');
const EmptyThreadsList = require('./empty-threads-list/empty-threads-list');
const template = require('./threads-list-body.html');
const $ = require('jquery');
const ThreadsListBody = Pipedrive.View.extend({
	template: _.template(template),
	templateHelpers: {},

	emptyView: null,

	initialize: function(options) {
		this.options = options;
		this.initChildViews();
	},

	onLoad: function() {
		this.bindEvents();
		this.pullFirstPage();
		this.render();
	},

	onFocus: function() {
		this.pullCollectionIfErrorDisplayed();
	},

	afterRender: function() {
		const evName = `click.threadlist.${this.options.collection.section}`;

		$('#mainmenu .key-mailbox a').on(evName, this.onMainHeaderMailBtnClicked.bind(this));
	},

	initChildViews: function() {
		this.tableView = new ThreadsListTable({
			collection: this.collection,
			currentRowThreadId: this.options.currentRowThreadId
		});

		this.addView({
			'.tableContainer': this.tableView
		});
	},

	bindEvents: function() {
		this.listenTo(this.collection, 'add remove sync', this.toggleEmptyListView);
	},

	onMainHeaderMailBtnClicked: function() {
		if (this.focused) {
			this.pullCollectionIfErrorDisplayed();
		}
	},

	pullFirstPage: function() {
		this.collection.pullFirstPageWithRetry({
			view: this,
			error: _.bind(this.displayErrorMessage, this)
		});
	},

	pullCollectionIfErrorDisplayed: function() {
		if (this.collection.failedOnInitialPull) {
			this.pullFirstPage();
		}
	},

	toggleEmptyListView: function() {
		this.hideErrorMessage();

		const hasThreads = !!this.collection.length;

		this.$('.tableContainer').toggle(hasThreads);
		this.$('.emptyListContainer').toggle(!hasThreads);

		if (this.emptyView) {
			this.emptyView.destroy(true);
		}

		if (!hasThreads) {
			this.emptyView = new EmptyThreadsList({
				section: this.options.collection.section,
				threadsCollection: this.collection
			});

			this.addView({
				'.emptyListContainer': this.emptyView
			});
		}
	},

	displayErrorMessage: function() {
		this.$('.tableContainer, .emptyListContainer').hide();
		this.$('.errorMessageContainer').show();
	},

	hideErrorMessage: function() {
		this.$('.errorMessageContainer').hide();
	},

	onUnload: function() {
		$('#mainmenu .key-mailbox a').off(`click.threadlist.${this.options.collection.section}`);
	}
});

module.exports = ThreadsListBody;
