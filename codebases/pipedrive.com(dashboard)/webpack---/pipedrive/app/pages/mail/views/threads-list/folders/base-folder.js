'use strict';

const _ = require('lodash');
const Pipedrive = require('pipedrive');
const ThreadsListBody = require('../threads-list-body/threads-list-body');
const ToolbarView = require('../../../components/toolbar/toolbar');
const ThreadsCollection = require('collections/mail/threads');
const template = require('../threads-list.html');
const Helpers = require('utils/helpers');

const ThreadsList = Pipedrive.View.extend({
	template: _.template(template),

	templateHelpers: {},

	titleCounter: null,

	initialize: function(options) {
		this.options = _.isObject(options) ? options : {};

		this.initThreadsCollection();
		this.initChildViews();
	},

	onLoad: function() {
		this.render();
	},

	initChildViews: function() {
		this.initActionsBarView();
		this.toolbarView = new ToolbarView({
			actionsBarView: this.actionsBarView,
			showEllipsisButton: true
		});
		this.threadsListBody = new ThreadsListBody({
			collection: this.threadsCollection,
			emptyListTemplate: this.emptyListTemplate,
			currentRowThreadId: this.options.currentRowThreadId
		});

		this.addView({
			'.toolbar': this.toolbarView,
			'.threadListContent': this.threadsListBody
		});
	},

	initThreadsCollection: function() {
		const collStack = this.options.collectionStack;
		const stackedCollection = collStack.getStackedCollection(`threads/${this.section}`);

		if (stackedCollection) {
			this.threadsCollection = stackedCollection;
		} else {
			const opts = {
				key: `threads/${this.section}`,
				Collection: ThreadsCollection,
				models: null,
				collectionOptions: { section: this.section }
			};

			this.threadsCollection = collStack.createCollection(opts);
		}
	},

	setPageTitle: function() {
		if (!this.focused) {
			return;
		}

		let pageTitle = this.sectionTitle;

		if (this.titleCounter) {
			pageTitle += ` (${this.titleCounter})`;
		}

		pageTitle += _.gettext(' - Mail');

		Helpers.title.set(pageTitle);
	},

	onActiveNavItemClick: function() {
		this.threadsListBody.pullCollectionIfErrorDisplayed();
	},

	onBlur: function() {
		this.threadsCollection.abortPull();
	}
});

module.exports = ThreadsList;
