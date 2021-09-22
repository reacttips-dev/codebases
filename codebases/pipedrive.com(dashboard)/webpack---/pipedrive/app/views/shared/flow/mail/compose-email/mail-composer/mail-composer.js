const Pipedrive = require('pipedrive');
const _ = require('lodash');
const template = require('./mail-composer.html');
const ComposerComponent = require('components/mail-components/composer/index');
const NewMailComposer = ComposerComponent.getComposer('new-mail');
const DraftModel = require('models/mail/draft');
const ThreadModel = require('models/mail/thread');

module.exports = Pipedrive.View.extend(
	/** @lends views/shared/flow/ComposeEmailView.prototype */ {
		template: _.template(template),

		/**
		 * Related deal or person model
		 * @type {module:Pipedrive.Model}
		 */
		relatedModel: null,

		discarded: false,
		closed: true,

		/**
		 * Compose Email View is responsible for handling mail composer in
		 * Flow compose email tab
		 *
		 * @class Compose Email view class
		 * @constructs
		 * @augments module:Pipedrive.View
		 *
		 * @param {Object} options Options for ComposeEmailView
		 * @param {Object} options.relatedModel Model related to the message.
		 *                                      Required parameter.
		 * @void
		 */
		initialize: function(options) {
			this.options = options || {};
			this.relatedModel = options.relatedModel;
			this.mailTo = this.options.mailTo;

			app.global.bind('deal.flow.compose.update', _.bind(this.updateComposer, this));
		},

		onLoad: function() {
			this.initComposer();
			app.global.bind('deal.flow.compose.close', _.bind(this.handleCloseTabCall, this));
		},

		getTemplateHelpers: function() {
			return {};
		},

		/**
		 * Actions to fire when tab is re-rendered
		 * @void
		 */
		update: function() {
			if (!this.mailComposeView && !this.discarded && !this.closed) {
				this.initComposer();
			}

			this.closed = false;
			this.discarded = false;
		},

		updateComposer: function(mailTo) {
			this.mailTo = mailTo;

			if (this.mailComposeView && this.mailComposeView.headerView) {
				const recipient = this.getMailRecipient();

				this.mailComposeView.headerView.updateMailTo(recipient);
			}
		},

		onFocus: function() {
			if (this.mailTo) {
				return;
			}

			_.delay(
				this.mailComposeView.headerView.focusField.bind(
					this.mailComposeView.headerView,
					'to'
				),
				0
			);
		},

		/**
		 * Initializes the composer
		 * @void
		 */
		initComposer: function() {
			const dealId = this.relatedModel.type === 'deal' ? this.relatedModel.get('id') : null;
			const personId = this.getRelatedPerson()?.id;
			const orgId = this.getRelatedOrgId();
			const threadModel = new ThreadModel({
				has_draft_flag: true,
				deal_id: dealId,
				person_id: personId,
				org_id: orgId
			});
			const draftModel = new DraftModel({
				to: this.getPrefilledMailRecipient(),
				deal_id: dealId,
				sendmode: 'new'
			});
			const options = {
				relatedModel: this.relatedModel,
				draftModel,
				onDraftSent: _.bind(this.onDraftSent, this),
				onDraftDiscarded: _.bind(this.onDraftDiscarded, this),
				expandDynamically: true,
				expDynOpts: {
					hasWindowHeight: true
				}
			};

			draftModel.setThreadModel(threadModel);

			this.mailComposeView = new NewMailComposer(options);
			this.addView('.mailComposeView', this.mailComposeView);

			this.ready();

			this.mailComposeView.setBodyMaxHeight();
		},

		getRelatedOrgId: function() {
			if (this.relatedModel.type === 'organization') {
				return this.relatedModel.get('id');
			}

			if (this.relatedModel.type === 'deal' || this.relatedModel.type === 'person') {
				return this.relatedModel.get('org_id');
			}

			return null;
		},

		getRelatedPerson: function() {
			let person;

			if (this.relatedModel.type === 'person') {
				person = this.relatedModel;
			} else if (this.relatedModel.type === 'deal' && this.relatedModel.hasRelatedPerson()) {
				person = this.relatedModel.getRelatedPerson();
			}

			return person;
		},

		getPrefilledMailRecipient: function() {
			const mailData = [];

			if (this.mailTo) {
				mailData.push(this.getMailRecipient());

				return mailData;
			}

			const person = this.getRelatedPerson();

			if (person) {
				const mailParty = this.getPersonMailParty(person);

				if (mailParty) {
					mailData.push(mailParty);
				}
			}

			return mailData;
		},

		getPersonMailParty: function(person) {
			let mailParty = null;

			_.forEach(
				person.get('email'),
				_.bind(function(mail) {
					if (mail.primary && mail.value) {
						mailParty = {
							email_address: mail.value,
							name: person.get('name'),
							linked_person_id: person.get('id')
						};
					}
				}, this)
			);

			return mailParty;
		},

		getMailRecipient: function() {
			const recipient = { email_address: this.mailTo };
			const person = this.getRelatedPerson();

			if (person && person.hasEmailAddress(this.mailTo)) {
				Object.assign(recipient, {
					name: person.get('name'),
					linked_person_id: person.get('id')
				});
			}

			return recipient;
		},

		/**
		 * Success callback for sending mail
		 * @void
		 */
		onDraftSent: function() {
			this.close();
		},

		onDraftDiscarded: function() {
			this.discarded = true;
			this.close();
		},

		/**
		 * Triggers `onRender` callback option and focuses first field
		 * @void
		 */
		ready: function() {
			if (_.isFunction(this.options.onRender)) {
				this.options.onRender();
			}
		},

		/**
		 * Handle global calls to close email compose tab
		 * @void
		 */
		handleCloseTabCall: function(data) {
			if (!_.isObject(data) || !this.mailComposeView) {
				return;
			}

			if (data.tab === 'email' && data.id === this.mailComposeView.draftModel.get('id')) {
				this.close();
			}
		},

		/**
		 * Closes composer
		 * @void
		 */
		close: function() {
			this.destroyComposer();

			// We use DOM events because flow composer does not have direct
			// reference to editors and catches with bubbling
			this.$el.parent().trigger('closeComposer');
		},

		destroyComposer: function() {
			this.removeView('.mailComposeView', true);
			app.global.unbind('deal.flow.compose.update', _.bind(this.updateComposer, this));
			app.global.unbind('deal.flow.compose.close', _.bind(this.handleCloseTabCall, this));
			this.mailComposeView = null;
			this.closed = true;
		}
	}
);
