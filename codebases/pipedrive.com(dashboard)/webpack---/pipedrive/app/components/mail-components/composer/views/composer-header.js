'use strict';

const Pipedrive = require('pipedrive');
const _ = require('lodash');
const template = require('../templates/header.html');
const MailConnections = require('collections/mail/global-singletons/mail-connections');
const DropMenu = require('views/ui/dropmenu');
const { MergeFieldsPlugin } = require('@pipedrive/pd-wysiwyg');
const $ = require('jquery');
const SENDMODE_ACTIONS = {
	reply: {
		text: _.gettext('Reply'),
		mode: 'reply',
		actionIcon: 'reply',
		dropDownClass: 'reply'
	},
	reply_all: {
		text: _.gettext('Reply all'),
		mode: 'reply_all',
		actionIcon: 'replyall',
		dropDownClass: 'replyAll'
	},
	forward: {
		text: _.gettext('Forward'),
		mode: 'forward',
		actionIcon: 'forward',
		dropDownClass: 'forward'
	}
};

require('jquery.ui');

/**
 * This component holds the shared functionality of mail composers headers.
 * @class  components/composer/views/composer-header
 *
 * @param {Object} opts      Initial options
 * @extends {module:Pipedrive.View}
 */
module.exports = Pipedrive.View.extend({
	template: _.template(template),
	sendmode: null,
	dropMenu: null,

	draftModel: null,
	relatedMessage: null,

	initialize: function(opts) {
		this.options = opts;
		this.draftModel = opts.draftModel;
		this.saveDraft = opts.saveDraft;
		this.relatedMessage = opts.relatedMessage;
		this.sendmode = this.draftModel.getSendmode();
		this.ready = Pipedrive.Ready(['view']);
		this.listenTo(this.draftModel, 'sync', this.checkInvalidEmail);
		this.listenTo(this.draftModel, 'contextualSidebar.updated:recipient', this.onLoad);
	},

	initSubjectEditor: function() {
		const ComposerHeader2 = require('components/mail-components/composer/views/composer-header-2/index');
		const params = {
			onBlur: this.saveDraft.bind(this),
			onFocus: this.triggerFocus.bind(this),
			subjectValue: this.getDraftSubject.call(this),
			placeholder: _.gettext('Subject')
		};

		this.composerHeader2 = new ComposerHeader2(params);

		this.composerHeader2.ready.onReady(() => {
			this.subjectEditor = this.composerHeader2.subjectEditor;
			this.ready.set('view');
		});

		this.addView({
			'.subject-field-new': this.composerHeader2
		});
	},

	onLoad: function() {
		this.render();
	},

	updateMailTo: function(recipientData) {
		const recipients = this.draftModel.getRecipientsField('to');

		if (_.find(recipients, { email_address: recipientData.email_address })) {
			return;
		}

		this.draftModel.addRecipients('to', [recipientData]);
		this.draftModel.setRecentlyAddedRecipients({ id: recipientData.email_address });
		this.initRecipientSearch(recipientData);
	},

	getRelatedSubject: function() {
		return this.relatedMessage ? this.relatedMessage.get('subject') : '';
	},

	addPretextToSubject: function(subject, pretext) {
		let subjectWithPretext;

		pretext = pretext || '';

		// If subject already has pretext
		if (subject.substr(0, pretext.length) === pretext) {
			subjectWithPretext = subject;
		} else {
			subjectWithPretext = `${pretext} ${subject}`;
		}

		return subjectWithPretext;
	},

	getPretext: function(sendmode) {
		let pretext = '';

		if (sendmode === 'forward') {
			pretext = 'Fw:';
		} else if (sendmode === 'reply') {
			pretext = 'Re:';
		}

		return pretext;
	},

	prepareMessageSubject: function(subject, mode) {
		const sendmode = mode || this.sendmode;
		const pretext = this.getPretext(sendmode);
		const newSubject = this.addPretextToSubject(subject, pretext);

		return newSubject;
	},

	getDraftSubject: function() {
		return this.draftModel.isNew()
			? this.prepareMessageSubject(this.getRelatedSubject())
			: this.draftModel.get('subject');
	},

	getTemplateHelpers: function() {
		return {
			isRplFwDraft: this.isRplFwDraft(),
			subject: this.getDraftSubject(),
			sendmodeData: SENDMODE_ACTIONS[this.sendmode],
			detailsButtonArrowUp: this.allCollapsibleFieldsVisible(),
			getEmailPickerData: _.bind(this.getEmailPickerData, this),
			onValueChange: _.bind(this.onSelect2RecipientsUpdate, this),
			onToggleDetailsClick: this.onToggleDetailsClick.bind(this)
		};
	},

	isRplFwDraft: function() {
		return this.sendmode !== 'new';
	},

	/**
	 * Checks whether all collapsible fields in the composer's header are expanded. In case of draft-only threads the
	 * subject is not collapsible.
	 *
	 * @return {Boolean}
	 */
	allCollapsibleFieldsVisible: function() {
		const isDraftOnlyThread = this.sendmode === 'new';

		return (
			isDraftOnlyThread &&
			this.getEmailPickerData('cc').length &&
			this.getEmailPickerData('bcc').length
		);
	},

	onToggleDetailsClick: function(ev) {
		ev.preventDefault();
		const isExpanding = this.$('.toggle-details:not(.hidden)').hasClass('show-details');

		this.toggleDetails(isExpanding);
	},

	onAttachedToDOM: function() {
		this.initInvalidRecipientsTooltips();
		this.initSortableRecipients();
		this.bindEventListeners();
	},

	initSortableRecipients: function() {
		if (this.noActiveConnection) {
			return;
		}

		const $recipientInputs = this.$('.recipients-field input.emailPicker');

		_.forEach($recipientInputs, (input) => {
			$(input)
				.select2('container')
				.find('ul.select2-choices')
				.sortable({
					containment: 'document',
					items: '> .select2-search-choice',
					connectWith: 'ul.select2-choices',
					zIndex: 9999,
					scroll: false,
					receive: this.onRecipientMoved.bind(this),
					start: function(ev, sortable) {
						sortable.item.tooltip().close();
						sortable.item.disableTooltip();
						$recipientInputs.select2('onSortStart');
					},
					update: function() {
						$recipientInputs.select2('onSortEnd');
					},
					stop: function() {
						$recipientInputs.select2('onSortEnd');
					}
				});
		});
	},

	initInvalidRecipientsTooltips: function() {
		const $elementsWithTooltips = this.$('.select2-search-choice.notValid');

		$elementsWithTooltips.each(function() {
			$(this).tooltip({
				tipHtml:
					`<p style="font-weight:bold;">${_.gettext('Invalid address')}</p>` +
					`<p>${_.gettext('Verify the email address before sending.')}</p>`,
				position: 'top',
				clickCloses: true
			});
		});
	},

	resetShowHideDetailsTooltip: function() {
		const $toggleButton = this.$('.composer .toggle-details');

		$toggleButton.tooltip().close();
		$toggleButton.tooltip({
			tip: $toggleButton.data('tooltip'),
			position: 'top'
		});
	},

	/**
	 * Focuses specific composer field
	 * @param  {string} field field that should be focused (like 'cc', or 'body')
	 * @void
	 */
	focusField: function(field) {
		const $composerField = this.$(`input[name=${field}]`);

		if ($composerField.hasClass('emailPicker')) {
			$composerField.select2('focus');
		} else {
			$composerField.focus();
		}
	},

	/**
	 * Hack to close #select2-drop-mask when just clicking on email recipients inputs
	 * By default when clicking on select2-container-multi input it tries to open drop down and puts overlay on the app
	 * @param  {Object} ev
	 * @void
	 */
	closeSelect2DropMask: function(ev) {
		$(ev.currentTarget).select2('close');
	},

	getEmailPickerData: function(recipientType) {
		const emailPickerData = [];

		_.map(this.draftModel.getRecipientsField(recipientType), (recipient) => {
			emailPickerData.push({
				name: recipient.name,
				address: recipient.email_address,
				valid: recipient.valid_flag
			});
		});

		return emailPickerData;
	},

	getSelect2FieldData: function(recipientType) {
		const data = [];

		_.map(this.draftModel.getRecipientsField(recipientType), (recipient) => {
			data.push({
				id: recipient.email_address,
				text: recipient.name
					? `${recipient.name} (${recipient.email_address})`
					: recipient.email_address,
				valid: recipient.valid_flag
			});
		});

		return data;
	},

	onRecipientMoved: function(ev, sortable) {
		const email = sortable.item.data('id');
		const originalField = sortable.sender.parents('.recipients-field');
		const origFieldName = originalField.find('input.emailPicker').attr('name');
		const origFieldContainsDuplicate =
			originalField.find(`li.select2-search-choice[data-id="${email}"]`).length > 1;
		const destinationField = sortable.item.parents('.recipients-field');
		const destFieldName = destinationField.find('input.emailPicker').attr('name');

		this.draftModel.moveRecipient(
			email,
			origFieldName,
			destFieldName,
			origFieldContainsDuplicate
		);

		originalField
			.find('input.emailPicker')
			.select2('data', this.getSelect2FieldData(origFieldName));
		destinationField
			.find('input.emailPicker')
			.select2('data', this.getSelect2FieldData(destFieldName));

		const invalidRecipients = this.draftModel.getInvalidRecipients();

		if (invalidRecipients.length) {
			this.setInvalidEmailClass(invalidRecipients);
		}

		this.triggerChange(ev);
	},

	/**
	 * select2 recipients update event
	 */
	onSelect2RecipientsUpdate: function(ev) {
		const fieldName = ev.target.name;

		let recipientData = {};

		if (!ev.added && !ev.removed) {
			return;
		}

		if (ev.added) {
			const personModel = ev.added.personModel;

			recipientData = {
				email_address: ev.added.id,
				name: personModel ? personModel.get('name') : null,
				linked_person_id: personModel ? personModel.get('id') : null
			};

			this.draftModel.addRecipients(fieldName, [recipientData]);
			this.draftModel.setRecentlyAddedRecipients(ev.added);

			if (recipientData.name === null) {
				const toInput = this.$(`input[name=${fieldName}]`);
				const updateRecipient = function(searchResult) {
					const result = _.get(searchResult, 'resultsData.results');

					if (result.length === 1 && result[0].personModel) {
						const recipientData = {
							email_address: result[0].id,
							name: result[0].personModel.attributes.name,
							linked_person_id: result[0].personModel.attributes.id
						};

						this.draftModel.addRecipients(fieldName, [recipientData]);
						this.render();
					}
				}.bind(this);

				toInput.on('select2:searchResults', updateRecipient);
			}
		}

		if (ev.removed) {
			this.draftModel.removeRecipient(fieldName, ev.removed.id);
			this.$(`.select2-search-choice[data-id="${ev.removed.id}"]`)
				.tooltip()
				.close();
		}

		this.triggerChange(ev);
	},

	/**
	 * We show / hide the composer header's fields based on the following criteria:
	 * "to"				- Always visible.
	 * "cc" and "bcc"	- Hide if collapsing the fields and is empty. Always visible if filled.
	 * "subject"		- Always visible if in draft-only thread. Otherwise show / hide even if filled.
	 *
	 * @param  {Boolean} toExpand 	Whether to show or hide the empty fields (and subject in case of reply-forward thread)
	 * @void
	 */
	toggleDetails: function(toExpand) {
		const selector = '.subject-field-new';

		this.$(selector).toggle(this.sendmode === 'new' || toExpand);

		this.toggleRecipients(toExpand);
		this.toggleShowDetailsButtonUpDown(toExpand);
		this.trigger('toggledDetails');
	},

	/**
	 * Toggles "cc"/"bcc" fields and triggers "show" if details is being opened (needed so that emailPicker
	 * re-calculates its paddings)
	 * @void
	 */
	toggleRecipients: function(toExpand) {
		const $ccField = this.$('[data-recipients-field="cc"]');
		const $bccField = this.$('[data-recipients-field="bcc"]');

		$ccField.toggle(!!this.getEmailPickerData('cc').length || toExpand);
		$bccField.toggle(!!this.getEmailPickerData('bcc').length || toExpand);

		if (toExpand) {
			$ccField.find('input.emailPicker').trigger('show');
			$bccField.find('input.emailPicker').trigger('show');
		}
	},

	searchRecipient: function(email) {
		const toInput = this.$('input[name=to]');
		const $toField = this.$('[data-recipients-field="to"]');
		const listenToSearchResults = _.once((ev) => {
			const results = _.get(ev, 'resultsData.results');
			const insertedEmailFields = $toField.find('.select2-search-choice');
			const isValueAlreadyInserted = insertedEmailFields
				.map((i, el) =>
					$(el)
						.text()
						.trim()
				)
				.get()
				.includes(email);

			// if only one result - then select it automatically
			if (_.size(results) === 1 && !isValueAlreadyInserted) {
				toInput.data('select2').onSelect(results[0]);
			}
		});

		toInput.on('select2:searchResults', listenToSearchResults);
		toInput.select2('search', email);
	},

	initRecipientSearch: function(recipientData) {
		const recipients = this.getSelect2FieldData('to');

		setTimeout(() => {
			const toInput = this.$('input[name=to]');

			if (recipientData && !recipientData.linked_person_id) {
				this.searchRecipient(recipientData.email_address);
			} else if (recipients.length) {
				// if the draft recipient has linked person id or it was saved before
				if (
					_.has(this.draftModel.getRecipientsField('to'), '[0].linked_person_id') ||
					this.draftModel.threadModel.get('id')
				) {
					toInput.select2('data', recipients);
				} else {
					// if it is the first load then search for an existing email (id is email)
					this.searchRecipient(recipients[0].id);
				}
			}
		}, 0);
	},

	afterRender: function() {
		if (this.sendmode !== 'new' && this.relatedMessage) {
			this.initSendmodeDropMenu();
		}

		if (!this.composerHeader2) {
			this.initSubjectEditor();
		}

		this.initRecipientSearch();
	},

	disableSendmodeButton: function() {
		this.$('.action--sendmode a').addClass('disabled');
	},

	getDropMenuData: function() {
		const recipientsWithoutUserSelf = this.relatedMessage.getRecipientsWithoutUserSelf();
		const actions = [SENDMODE_ACTIONS.reply, SENDMODE_ACTIONS.forward];
		const dropMenuData = [];

		if (recipientsWithoutUserSelf.length > 1) {
			actions.splice(1, 0, SENDMODE_ACTIONS.reply_all);
		}

		_.forEach(actions, (action) => {
			const iconKey = action.mode === 'reply_all' ? 'replyall' : action.mode;

			dropMenuData.push({
				className: 'hasIcon',
				titleHtml: `<span class="icon">${_.icon(iconKey, 'small')}</span>${action.text}`,
				click: this.onSendmodeClick.bind(this, action.mode)
			});
		});

		return dropMenuData;
	},

	/**
	 * @param  {string} sendmode
	 * @return {void}
	 */
	onSendmodeClick: function(sendmode) {
		this.trigger('sendmodeSelected', sendmode);
	},

	changeSendmode: function(sendmode) {
		const subject = this.prepareMessageSubject(this.getRelatedSubject(), sendmode);

		this.draftModel.setSendmode(sendmode);
		this.draftModel.setRecipientsBySendmode(true);
		this.sendmode = sendmode;

		this.$('input[name=to]').select2('data', this.convertRecipientsData.call(this, 'to'));
		this.$('input[name=cc]').select2('data', this.convertRecipientsData.call(this, 'cc'));
		this.$('input[name=bcc]').select2('data', this.convertRecipientsData.call(this, 'bcc'));

		if (sendmode === 'reply_all' && !!this.getEmailPickerData('cc').length) {
			// needed so that emailPicker re-calculates its paddings
			this.toggleRecipients(true);
			this.$('[data-recipients-field="cc"]').show();
		}

		this.updateSendmodeButton();
		this.setSubject(subject);
	},

	setSubject(subject) {
		return this.subjectEditor.insertReplaceHtmlContent({ html: subject, clearBefore: true });
	},

	convertRecipientsData: function(recipientsFieldType) {
		const recipientsFieldData = this.draftModel.getRecipientsField(recipientsFieldType);
		const recipientsDisplayFormat = _.map(recipientsFieldData, (partyData) => {
			const partyName = partyData.linked_person_name || partyData.name;

			return {
				id: partyData.email_address,
				text: partyName
					? `${partyName} (${partyData.email_address})`
					: partyData.email_address
			};
		});

		return recipientsDisplayFormat;
	},

	updateSendmodeButton: function() {
		const sendmodeData = SENDMODE_ACTIONS[this.sendmode];
		const newSendmode = `<input class="text"" type="hidden" name="sendmode" value="<%- sendmodeData.mode %>" />${_.form.button(
			{
				text: sendmodeData.text,
				icon: sendmodeData.actionIcon,
				size: 's',
				rightIcon: 'triangle-down'
			}
		)}`;

		this.$('.action--sendmode').html(newSendmode);
	},

	/**
	 * Initializes the dropmenu
	 * @return {void}
	 */
	initSendmodeDropMenu: function() {
		if (!MailConnections.hasActiveNylasConnection()) {
			this.disableSendmodeButton();

			return;
		}

		const dropMenuData = this.getDropMenuData();

		this.dropMenu = new DropMenu({
			data: dropMenuData,
			className: 'mailActions',
			ui: 'arrowDropmenu',
			target: this.$('.action--sendmode'),
			alignRight: true,
			activeOnClick: false
		});
	},

	/**
	 * Whether arrow in the button should show up or down.
	 * @param  {Boolean} setArrowUp
	 * @void
	 */
	toggleShowDetailsButtonUpDown: function(setArrowUp) {
		this.$('.toggle-details.show-details').toggleClass('hidden', setArrowUp);

		this.$('.toggle-details.hide-details').toggleClass('hidden', !setArrowUp);

		this.resetShowHideDetailsTooltip();
	},

	getSubjectValue: function(keepFieldSyntax) {
		return this.subjectEditor
			? _.unescape(
					this.subjectEditor.getParsedContent({
						[MergeFieldsPlugin.name]: { keepFieldSyntax }
					})
			  )
			: '';
	},

	/**
	 * Disable input, textarea & editable elements
	 */
	disableInputs: function() {
		this.$('input').prop('disabled', true);
	},

	/**
	 * Enable input, textarea & editable elements
	 */
	enableInputs: function() {
		this.$('input').prop('disabled', false);
	},

	bindEventListeners: function() {
		this.$('.select2-container').on('click', this.closeSelect2DropMask.bind(this));
	},

	triggerChange: function(ev) {
		this.trigger('changed', ev);
	},

	triggerFocus: function(ev) {
		this.trigger('subjectFocus', ev);
	},

	checkInvalidEmail: function() {
		if (!_.isEmpty(this.draftModel.getRecentlyAddedRecipients())) {
			const invalidRecipients = this.draftModel.getInvalidAddedRecipients();

			if (invalidRecipients.length) {
				this.setInvalidEmailClass(invalidRecipients);
			}

			this.draftModel.clearRecentlyAddedRecipients();
		}
	},

	setInvalidEmailClass: function(recipients) {
		_.forEach(
			recipients,
			_.bind(function(recipient) {
				this.$(`.select2-search-choice[data-id="${recipient.email_address}"]`).addClass(
					'notValid'
				);
			}, this)
		);

		this.initInvalidRecipientsTooltips();
	}
});
