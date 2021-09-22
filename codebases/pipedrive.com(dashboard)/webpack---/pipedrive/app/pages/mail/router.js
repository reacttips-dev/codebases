const SimpleRouter = require('components/routing/simple-router');
const _ = require('lodash');
const ViewStack = require('components/routing/view-stack');
const ThreadsListViewFactory = require('./views/threads-list/index');
const CollectionStack = require('./collection-stack');
const SearchThreadsCollection = require('collections/mail/search-threads');
const MailConnections = require('collections/mail/global-singletons/mail-connections');
const PDMetrics = require('utils/pd-metrics');
const listSections = ['inbox', 'drafts', 'outbox', 'sent', 'archive'];
const singleThreadSections = ['inbox', 'drafts', 'outbox', 'sent', 'archive', 'search'];

module.exports = SimpleRouter.extend({
	routes: {
		'new': 'newMailThreadComposer',
		'new/:threadId': 'newMailThreadComposer',

		'search/byparty/:partyId': 'searchByPartyId',
		'search/bykeyword/:searchKeyword': 'searchByKeyword',

		':folder': 'threadList',
		':folder/:threadId': 'singleThread',

		'*path': 'defaultRoute'
	},

	initialize: function(options) {
		this.options = options;
		this.viewStack = new ViewStack();
		this.collectionStack = new CollectionStack();
		this.initSearchCollection();
	},

	switchCurrentView: function(View, viewKey, viewOptions) {
		const currentView = this.viewStack.getCurrent();

		let cachedView;

		if (currentView && currentView.key === 'mail/new') {
			this.viewStack.remove(currentView);
		} else if (currentView) {
			this.viewStack.hide(currentView);
		}

		cachedView = this.viewStack.get(viewKey);

		if (cachedView) {
			this.viewStack.setCurrent(cachedView);
			this.viewStack.show(cachedView);
		} else {
			cachedView = this.viewStack.create(viewKey, View, viewOptions);
		}

		this.currentView = cachedView.instance;

		if (_.isFunction(this.currentView.setPageTitle)) {
			this.currentView.setPageTitle();
		}
	},

	defaultRoute: function() {
		app.router.go(null, '/mail/inbox', true, true);
		this.threadList('inbox');
	},

	initSearchCollection: function() {
		const opts = {
			key: 'threads/search',
			Collection: SearchThreadsCollection,
			models: null,
			collectionOptions: { section: 'search' }
		};

		this.collectionStack.createCollection(opts);
	},

	/**
	 * Starts a completely new and clean draft - 'mail/new/',
	 * or opens a saved draft-only thread - 'mail/new/[thread_id]'
	 *
	 * @param  {Number|String} threadId
	 * @void
	 */
	newMailThreadComposer: function(threadId) {
		MailConnections.onReady(() => {
			if (this.options.toShowSilverGoldPlatinumMailPromo()) {
				app.router.go(null, '/mail/drafts', true, false);

				return;
			}

			threadId = threadId ? Number(threadId) : null;

			const View = require('./views/compose-new-thread/index');
			const viewKey = threadId ? `mail/new/${threadId}` : 'mail/new';
			const threadsCollection = this.collectionStack.getStackedCollection('threads/drafts');
			const viewOptions = {
				threadId,
				threadsCollection,
				router: this
			};

			this.validateSingleThreadView(viewKey, threadId, threadsCollection);
			this.switchCurrentView(View, viewKey, viewOptions);
			this.trigger('sectionChange', 'drafts');

			if (!threadId) {
				this.sendPageActionMetrics('route-change-to-/mail/new');
			}
		});
	},

	/**
	 * Opens a threads list view based on the section parameter
	 *
	 * @param  {String} section
	 * @void
	 */
	threadList: function(section) {
		if (!_.includes(listSections, section)) {
			this.defaultRoute();

			return;
		}

		const View = ThreadsListViewFactory.getFolderView(section);
		const navigatedFromSameSectionThreadId = this.getNavigatedFromSameSectionThreadId(section);
		const viewOptions = {
			collectionStack: this.collectionStack,
			currentRowThreadId: navigatedFromSameSectionThreadId
		};

		this.switchCurrentView(View, `mail/${section}`, viewOptions);
		this.trigger('sectionChange', section);

		this.highlightRow(navigatedFromSameSectionThreadId);
	},

	/**
	 * Returns the id of the thread the user is navigating from, IF navigating in the same "section".
	 * Otherwise, returns null.
	 * @param  {String} section
	 * @return {Number|Null}	The thread id
	 */
	getNavigatedFromSameSectionThreadId: function(section) {
		const threadId =
			!!this.currentView &&
			section === this.currentView.section &&
			this.currentView.options.threadId;

		return threadId || null;
	},

	highlightRow: function(threadId) {
		if (!this.currentView.threadsCollection) {
			return;
		}

		const threadModel = this.currentView.threadsCollection.get(threadId);

		if (threadModel) {
			threadModel.trigger('highlight');
		}
	},

	/**
	 * Opens a thread that already has sent mails in it.
	 *
	 * @param  {String} section
	 * @param  {Number|String} threadId
	 * @void
	 */
	singleThread: function(section, threadId) {
		if (!_.includes(singleThreadSections, section)) {
			this.defaultRoute();

			return;
		}

		threadId = Number(threadId);

		const View = require('./views/single-thread/index');
		const viewKey = `mail/${section}/${threadId}`;
		const threadsCollection = this.collectionStack.getStackedCollection(`threads/${section}`);
		const viewOptions = {
			section,
			threadId,
			threadsCollection
		};

		this.validateSingleThreadView(viewKey, threadId, threadsCollection);
		this.switchCurrentView(View, viewKey, viewOptions);
		this.trigger('sectionChange', section);
	},

	/**
	 * If
	 * - single-thread view exists
	 * - and doesn't have a threads collection attached to it
	 * - but the collection exists in the collection stack
	 * - and the thread model exists in that collection
	 * then the method removes the view from the view-stack, so that the view will be reinitialized and rerendered
	 * with up-to-date data (for example: with navigation arrow-buttons in the toolbar).
	 *
	 * @param  {String} viewKey
	 * @param  {Number} threadId
	 * @param  {Object} threadsCollection
	 * @void
	 */
	validateSingleThreadView: function(viewKey, threadId, threadsCollection) {
		const singleThreadViewData = this.viewStack.get(viewKey);
		const singleThreadView = singleThreadViewData && singleThreadViewData.instance;
		const threadInCollection = threadsCollection && threadsCollection.find({ id: threadId });

		if (singleThreadView && !singleThreadView.threadsCollection && threadInCollection) {
			this.viewStack.remove(singleThreadViewData);
		}
	},

	searchByKeyword: function(keyword) {
		if (keyword.length < 2) {
			this.defaultRoute();

			return;
		}

		const View = ThreadsListViewFactory.getFolderView('search');
		const currentRowThreadId = this.currentView && this.currentView.options.threadId;
		const viewOptions = {
			collectionStack: this.collectionStack,
			currentRowThreadId
		};
		const searchCollection = this.collectionStack.getStackedCollection('threads/search');
		const searchData = {
			keyword
		};

		searchCollection.searchByKeyword({ data: searchData });
		this.switchCurrentView(View, 'mail/search', viewOptions);
		this.trigger('sectionChange', 'search');

		this.highlightRow(currentRowThreadId);
	},

	searchByPartyId: function(partyId) {
		const searchCollection = this.collectionStack.getStackedCollection('threads/search');
		const searchData = {
			mail_party_id: Number(partyId)
		};

		searchCollection.searchByPartyId({
			data: searchData,
			success: this.onSearchByPartyIdSuccess.bind(this)
		});
	},

	onSearchByPartyIdSuccess: function onSearchByPartyIdSuccess() {
		const View = ThreadsListViewFactory.getFolderView('search');
		const currentRowThreadId = this.currentView && this.currentView.options.threadId;
		const viewOptions = {
			collectionStack: this.collectionStack,
			currentRowThreadId
		};

		this.switchCurrentView(View, 'mail/search', viewOptions);
		this.trigger('sectionChange', 'search');
		this.highlightRow(currentRowThreadId);
	},

	removeViewFromViewStack: function(viewKey) {
		this.viewStack.removeByKey(viewKey);
	},

	sendPageActionMetrics: function(action) {
		PDMetrics.trackUsage(null, 'mail_view', 'action_taken', {
			'mail-v2.feature': 'mail-router',
			'mail-v2.action': action
		});
	},

	blurCurrentView: function() {
		if (this.currentView) {
			this.currentView.blur();
		}
	},

	destroyViewStack: function() {
		this.viewStack.destroy();
	}
});
