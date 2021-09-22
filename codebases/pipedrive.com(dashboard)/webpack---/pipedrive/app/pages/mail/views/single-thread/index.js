'use strict';

const SingleThread = require('components/mail-components/thread/single-thread/index');
const _ = require('lodash');
const ThreadModel = require('models/mail/thread');
const ToolbarView = require('../../components/toolbar/toolbar');
const ActionsBarView = require('./toolbar/actions-bar');
const ContextualSidebarView = require('../../components/contextual-sidebar/contextual-sidebar');
const template = require('./single-thread.html');
const Helpers = require('utils/helpers');
const SingleThreadView = SingleThread.extend({
	section: null,

	template: _.template(template),
	templateHelpers: {},

	/**
	 * Should be passed in by router when user navigates to single-thread view from threads-list.
	 * It's used in the toolbar to navigate to next / previous thread.
	 * If user lands directly in the single-thread view (not via threads list), there will be no
	 * threads collection passed in and no navigation buttons in the toolbar.
	 */
	threadsCollection: null,

	initialize: function(options) {
		this.section = options.section;
		this.threadsCollection = options.threadsCollection;
		SingleThread.prototype.initialize.call(this, options);
	},

	getTemplateHelpers: function() {
		return {
			contextualSidebarClass: 'contextualSidebar'
		};
	},

	/**
	 * Initializes thread-model by either getting the data from CollectionStack (prefered) or pulling it from server
	 * After the thread-model data is received, render the view
	 * @void
	 */
	initThreadModel: function() {
		const stackedThreadModel =
			(this.threadsCollection &&
				this.threadsCollection.find({ id: this.options.threadId })) ||
			null;

		if (stackedThreadModel) {
			this.threadModel = stackedThreadModel;
			this.onThreadModelReady();
		} else {
			const pullOptions = {
				success: _.bind(this.onThreadModelReady, this),
				error: _.bind(this.onThreadModelPullFailed, this)
			};

			this.threadModel = new ThreadModel({ id: this.options.threadId });
			this.pull(this.threadModel, pullOptions);
		}
	},

	onThreadModelReady: function() {
		SingleThread.prototype.onThreadModelReady.call(this);
		this.setPageTitle();
	},

	onThreadModelPullFailed: function() {
		app.router.go(null, '/mail/inbox', true);
	},

	initChildViews: function() {
		SingleThread.prototype.initChildViews.call(this);

		this.initToolbarView();
		this.initDealSidebarView();
	},

	initToolbarView: function() {
		const actionsBarView = new ActionsBarView({
			section: this.options.section,
			threadsCollection: this.threadsCollection,
			threadModel: this.threadModel
		});

		this.toolbarView = new ToolbarView({
			actionsBarView,
			showEllipsisButton: false
		});

		this.addView({
			'.toolbar': this.toolbarView
		});
	},

	/**
	 * Initializes the deal sidebar once all necessary data is ready. In case the thread is not saved
	 * on the server side yet, we need to pass the thread model into the deal sidebar.
	 *
	 * @void
	 */
	initDealSidebarView: function() {
		this.addView({
			'.dealSidebar': new ContextualSidebarView({
				thread: this.threadModel
			})
		});
	},

	setPageTitle: function() {
		const title = `${this.threadModel.get('subject')} - `;

		Helpers.title.set(title + _.gettext('Mail'));
	}
});

module.exports = SingleThreadView;
