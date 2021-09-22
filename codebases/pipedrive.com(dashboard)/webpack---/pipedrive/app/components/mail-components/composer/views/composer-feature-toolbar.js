'use strict';

const Pipedrive = require('pipedrive');
const _ = require('lodash');
const $ = require('jquery');
const webappComponentLoader = require('webapp-component-loader');
const template = require('../templates/composer-feature-toolbar.html');
const MailConnections = require('collections/mail/global-singletons/mail-connections');
const scheduleButtonTemplate = require('../templates/schedule-button.html');
const EmailTemplates = require('../../email-templates-2/index');
const SchedulePicker = require('../../../scheduler-2/schedule-picker/index');
const PDMetrics = require('utils/pd-metrics');

module.exports = Pipedrive.View.extend({
	template: _.template(template),

	initialize: function(options) {
		this.options = options || {};
		this.bodyEditor = options.bodyEditor;
		this.subjectEditor = options.subjectEditor;
		this.saveDraft = this.options.saveDraft;
		this.container = this.options.container;
		this.toggleFieldsPicker = this.toggleFieldsPicker.bind(this);
		this.isSubjectInFocus = false;
		this.componentsReady = Pipedrive.Ready(['templates', 'scheduler']);
	},

	setComponentReady(component) {
		this.componentsReady.set(component);
	},

	getTemplateHelpers: function() {
		return {
			showSignature: !!this.options.showSignature,
			showTemplate: !!this.options.showTemplate,
			fontPickersEnabled: this.options.fontPickersEnabled
		};
	},

	onLoad: function() {
		this.render();
		MailConnections.onReady(this.sendComposerMetrics.bind(this));
	},

	addTooltips: function() {
		this.$('.email-components-templates').tooltip({
			tip: _.gettext('Templates'),
			position: 'top'
		});

		this.$('.toolbarSignature').tooltip({
			tip: _.gettext('Signature'),
			position: 'top'
		});

		this.$('.email-components-field-picker').tooltip({
			tip: _.gettext('Fields'),
			position: 'top'
		});

		this.$('.schedule-service-schedule-picker').tooltip({
			tip: _.gettext('Propose times'),
			position: 'top'
		});
	},

	removeTooltips: function() {
		this.$('.email-components-templates').disableTooltip();
		this.$('.toolbarSignature').disableTooltip();
		this.$('.email-components-field-picker').disableTooltip();
		this.$('.schedule-service-schedule-picker').disableTooltip();
	},

	checkIfCompact() {
		if (!(this.container && this.container.length)) {
			return true;
		}

		if (!this.buttonsWidth) {
			// width in the full size mode. it is not changed after all the components are loaded
			this.buttonsWidth =
				this.container.find('.editorButtons').width() +
				this.container.find('.rightSideContent').width();
		}

		return this.container.width() <= this.buttonsWidth;
	},

	applyCompactView() {
		if (this.checkIfCompact()) {
			this.container.addClass('compact');
			this.addTooltips();
		} else {
			this.container.removeClass('compact');
			this.removeTooltips();
		}
	},

	onAttachedToDOM: function() {
		this.bindEventListeners();
	},

	isComponentFullyRendered: function(elements) {
		return elements.every((element) => this.container.find(element).width() !== 0);
	},

	waitForComponentReady: function(elements, component) {
		requestAnimationFrame(() => {
			if (this.isComponentFullyRendered(elements)) {
				this.setComponentReady(component);
			} else {
				this.waitForComponentReady(elements, component);
			}
		});
	},

	afterRender: function() {
		this.initEmailTemplatesComponent();
		this.initScheduler();
		this.componentsReady.onReady(() => {
			requestAnimationFrame(() => this.applyCompactView());
		});
	},

	bindEventListeners: function() {
		$(window).on(
			'resize.composerFeatureToolbar',
			_.debounce(this.applyCompactView.bind(this), 200, {
				leading: false,
				trailing: true
			})
		);
		this.$('a.toolbarSignature').on('click', this.openSignatureModal.bind(this));
	},

	openSignatureModal: async function(ev) {
		ev.preventDefault();

		const modals = await webappComponentLoader.load('froot:modals');
		const params = {
			onSuccess: this.options.onUpdate.bind(this)
		};

		// this func is used only with old wysiwyg
		PDMetrics.trackUsage(null, 'email_composer', 'interacted', {
			interaction: 'signature_accessed',
			wysiwyg_formatting: false
		});

		modals.open('webapp:modal', { modal: 'mail/mail-signature/mail-signature', params });
	},

	initEmailTemplatesComponent: function() {
		const editors = {
			body: this.bodyEditor,
			subject: this.subjectEditor
		};

		this.emailTemplatesView = new EmailTemplates({
			labelClass: 'email-templates-label',
			editors,
			activeEditorName: function() {
				return this.isSubjectInFocus ? 'subject' : 'body';
			}.bind(this),
			saveDraft: this.saveDraft,
			getComposerData: this.options.getComposerData.bind(this),
			setSubject: this.options.setSubject,
			draftModel: this.options.draftModel,
			fieldPickerEl: this.$('.email-components-field-picker').get(0),
			hideDealFields: this.options.relatedModel && this.options.relatedModel.type !== 'deal',
			hideLeadFields: this.options.relatedModel && this.options.relatedModel.type !== 'lead',
			onError: () => this.setComponentReady('templates')
		});

		this.emailTemplatesView.ready.onReady(() =>
			this.waitForComponentReady(
				['.email-components-templates', '.email-components-field-picker'],
				'templates'
			)
		);

		this.addView({ '.email-components-templates': this.emailTemplatesView });
	},

	initScheduler: function() {
		const popoverButtonTemplate = _.template(scheduleButtonTemplate);

		this.schedulePicker = new SchedulePicker({
			popoverPlacement: this.options.fontPickersEnabled ? 'bottom-start' : 'top',
			type: 'popover',
			connectedToEmail: true,
			entryPointName: 'emailComposer',
			popoverButtonTemplate,
			onLinkInsert: function(linkHTML, position) {
				this.bodyEditor.insertHTMLAtPosition(linkHTML, position);
			}.bind(this),
			onError: () => this.setComponentReady('scheduler'),
			fontPickersEnabled: this.options.fontPickersEnabled
		});

		this.schedulePicker.ready.onReady(() => {
			this.waitForComponentReady(['.schedule-service-schedule-picker'], 'scheduler');
		});

		this.addView({ '.schedule-service-schedule-picker': this.schedulePicker });
	},

	toggleFieldsPicker: function(isSubjectInFocus) {
		this.isSubjectInFocus = isSubjectInFocus;
	},

	sendPageActionMetrics: function(action) {
		PDMetrics.trackUsage(null, 'mail_view', 'action_taken', {
			'mail-v2.feature': 'mail-templates',
			'mail-v2.action': action
		});
	},

	sendComposerMetrics: function() {
		PDMetrics.trackUsage(null, 'email_composer', 'opened', {
			mail_connected: !!MailConnections.getConnectedNylasConnection()
		});
	},

	onUnload: function() {
		$(window).off('resize.composerFeatureToolbar');
		this.$('a.toolbarSignature').off();
	}
});
