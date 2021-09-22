'use strict';

const Pipedrive = require('pipedrive');
const _ = require('lodash');
const ComposerComponent = require('components/mail-components/composer/index');
const NewThreadComposerView = ComposerComponent.getComposer('new-mail');
const ThreadModel = require('models/mail/thread');
const DraftModel = require('models/mail/draft');
const MailsCollection = require('collections/mail/messages');
const $ = require('jquery');
const ComposeNewThreadView = Pipedrive.View.extend({
	draftModel: null,

	initialize: function(options) {
		this.options = _.isObject(options) ? options : {};
		this.threadsCollection = options.threadsCollection;
		this.initModels(options.threadId);
	},

	onLoad: function() {
		this.render();
	},

	onFocus: function() {
		if (this.newThreadComposerView) {
			this.newThreadComposerView.headerView.focusField('to');
		}
	},

	/**
	 * Get and return data, from the url, to fill the composer's fields with.
	 *
	 * @return {Object} params
	 */
	getDataFromUrl: function() {
		let params;

		if (document.location.search) {
			const p = location.search.match(/\?([^#]+)/);

			if (p && p[1]) {
				params = {};
				_.forEach(p[1].split('&'), function(param) {
					const qs = param.split('=', 2);

					if (qs[0].length) {
						params[qs[0]] = qs[1] || null;
					}
				});
			}
		}

		return params;
	},

	/**
	 * HACK-method to change url after getting data from query params. HAve to do two app.router.go cause
	 * otherwise no URL change is triggerd cause its stays the same
	 * @void
	 */
	changeUrl: function() {
		app.router.go(null, '/mail/new', true, true);
	},

	initModels: function(threadId) {
		this.threadModelDfrd = $.Deferred();
		this.draftModelDfrd = $.Deferred();

		const deferredList = [this.threadModelDfrd, this.draftModelDfrd];

		$.when.apply($, deferredList).done(this.onModelsReady.bind(this));

		this.initThreadModel(threadId);
		this.setDraftModel();
	},

	onModelsReady: function() {
		this.initNewThreadComposerView();
	},

	/**
	 * Assigns the thread model to the current view. If the thread model doesn't exist yet, creates it.
	 * @void
	 */
	initThreadModel: function(threadId) {
		const stackedThreadModel =
			(threadId && this.threadsCollection && this.threadsCollection.find({ id: threadId })) ||
			null;

		// If the collection has already been pulled. For example, when navigating here from the corresponding folder
		if (stackedThreadModel) {
			this.threadModel = stackedThreadModel;
			this.onThreadModelReady();

			// If landing in a draft-only thread via a link or url and the corresponding collection has not been pulled yet before
		} else if (threadId) {
			const pullOptions = {
				success: _.bind(this.onThreadModelReady, this),
				error: _.bind(this.onThreadModelPullFailed, this)
			};

			this.threadModel = new ThreadModel({ id: threadId });
			this.pull(this.threadModel, pullOptions);

			// If starting a completely new thread
		} else {
			this.threadModel = new ThreadModel({ has_draft_flag: true });
			this.onThreadModelReady();
		}
	},

	/**
	 * This method should be overridden by extending layers
	 * @void
	 */
	onThreadModelReady: function() {
		this.threadModelDfrd.resolve();
	},

	/**
	 * This method can be overridden by extending layers
	 * @void
	 */
	onThreadModelPullFailed: function() {},

	setDraftModel: function() {
		if (this.options.threadId) {
			this.mailsCollection = new MailsCollection(null, {
				threadId: this.options.threadId
			});
			this.mailsCollection.pull({
				success: _.bind(function(mailsCollection) {
					const draftModel = mailsCollection.getDraft();

					if (!draftModel) {
						throw new Error(
							'No draft attached to the mails collection in compose-new-thread!'
						);
					}

					this.draftModel = draftModel;
					this.draftModel.setThreadModel(this.threadModel);
					this.onDraftModelReady();
				}, this)
			});
		} else {
			const dataFromUrl = this.getDataFromUrl();

			if (dataFromUrl) {
				this.setDraftModelWithUrlParamaters(dataFromUrl);
			} else {
				this.draftModel = new DraftModel({ sendmode: 'new' });
			}

			this.draftModel.setThreadModel(this.threadModel);
			this.onDraftModelReady();
		}
	},

	setDraftModelWithUrlParamaters: function(params) {
		this.draftModel = new DraftModel({
			sendmode: 'new',
			to: [
				{
					name: '',
					email_address: params.to ? this.sanitizeEmailUrlParameter(params.to) : ''
				}
			],
			subject: params.subject ? params.subject : ''
		});

		this.changeUrl();
	},

	sanitizeEmailUrlParameter: function(urlParameter) {
		return decodeURIComponent(urlParameter).trim();
	},

	onDraftModelReady: function() {
		this.draftModelDfrd.resolve();
	},

	initNewThreadComposerView: function() {
		let composerOptions = {
			subject: '',
			expandDynamically: true,
			expDynOpts: {
				hasWindowHeight: true,
				$scrollableContainer: this.$el
			},
			draftModel: this.draftModel
		};

		composerOptions = _.assignIn(composerOptions, this.getComposerCallbacks());

		this.newThreadComposerView = new NewThreadComposerView(composerOptions);
		this.addView('.newThreadComposer', this.newThreadComposerView);
	},

	getComposerCallbacks: function() {
		return {};
	}
});

module.exports = ComposeNewThreadView;
