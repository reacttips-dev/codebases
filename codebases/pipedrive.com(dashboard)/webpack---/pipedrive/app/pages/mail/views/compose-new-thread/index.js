'use strict';

const ComposeNewThread = require('components/mail-components/thread/compose-new-thread/index');
const _ = require('lodash');
const ToolbarView = require('../../components/toolbar/toolbar');
const ActionsBarView = require('./toolbar/actions-bar');
const ContextualSidebarView = require('../../components/contextual-sidebar/contextual-sidebar');
const template = require('./compose-new-thread.html');
const Helpers = require('utils/helpers');
const User = require('models/user');
const ComposeNewThreadView = ComposeNewThread.extend({
	section: 'drafts',

	template: _.template(template),

	initialize: function(options) {
		this.threadId = options.threadId;

		ComposeNewThread.prototype.initialize.call(this, options);
	},

	onLoad: function() {
		ComposeNewThread.prototype.onLoad.call(this);
	},

	onModelsReady: function() {
		ComposeNewThread.prototype.onModelsReady.call(this);

		this.initToolbarView();
		this.initDealSidebarView();

		this.setPageTitle(this.getSubjectSnippet(this.draftModel));

		this.listenTo(this.threadModel, 'destroy', this.onThreadDestroyed);
	},

	getSubjectSnippet: function(draftModel) {
		if (draftModel.messageModel) {
			return draftModel.messageModel.get('subject_snippet');
		}
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

	getTemplateHelpers: function() {
		return {
			contextualSidebar: 'contextualSidebar'
		};
	},

	onThreadModelPullFailed: function() {
		app.router.go(null, '/mail/inbox', true);
	},

	initToolbarView: function() {
		const actionsBarView = new ActionsBarView({
			section: 'drafts',
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

	getComposerCallbacks: function() {
		return {
			onDraftSent: _.bind(this.onDraftSent, this),
			onDraftSaved: _.bind(this.onDraftSaved, this),
			onDraftDiscarded: _.bind(this.onDraftCancel, this)
		};
	},

	setPageTitle: function(emailSubject) {
		const pageTitle = emailSubject || _.gettext('Composer');

		Helpers.title.set(`${pageTitle} - ${_.gettext('Mail')}`);
	},

	onDraftSent: function() {
		const draftSentRedirectUrl = User.companyFeatures.get('scheduled_emails')
			? '/mail/inbox'
			: '/mail/sent';

		app.router.go(null, draftSentRedirectUrl, true);
	},

	/**
	 * Updates the page's title in the browser and also adds the threads id to the url, if saved for the first time.
	 *
	 * @param  {module:Pipedrive.Model} draftModel
	 * @param  {Boolean} 				isFirstSave
	 * @void
	 */
	onDraftSaved: function(draftModel, isFirstSave) {
		if (!this.focused) {
			return;
		}

		this.setPageTitle(this.getSubjectSnippet(draftModel));

		if (isFirstSave) {
			this.updateUrl(draftModel);
		}
	},

	updateUrl: function(messageModel) {
		app.router.go(null, `/mail/new/${messageModel.get('mail_thread_id')}`, true, true);
	},

	/**
	 * Simply, redirects back to the last route.
	 * @void
	 */
	onDraftCancel: function(options) {
		const isFocused = options ? options.focused : this.focused;

		if (!isFocused) {
			return;
		}

		let previousRoute = app.router.previousRoutePath;

		// froot firstly navigates to mail/new/... and save this path as previousRoute
		// as by clicking on discard user should be redirected to mail/inbox or previousRoute
		// but in this case, as previousRoute is mail/new by discarding draft, new draft will be opened instead of inbox
		if (/^\/mail\/new/.test(previousRoute)) {
			previousRoute = '';
		}

		const destinationPath = previousRoute ? previousRoute : '/mail/inbox';

		app.router.go(null, destinationPath, true);
	},

	onThreadDestroyed: function() {
		this.onDraftCancel();
		this.removeThisViewFromViewStack();
	},

	removeThisViewFromViewStack: function() {
		this.options.router.removeViewFromViewStack(`mail/new/${this.threadModel.get('id')}`);
	}
});

module.exports = ComposeNewThreadView;
