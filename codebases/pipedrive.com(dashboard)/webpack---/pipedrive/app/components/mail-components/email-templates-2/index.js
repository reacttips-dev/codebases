const ServiceLoader = require('components/service-loader/index');
const WebappApi = require('webapp-api/index');
const { default: getDragDropContext } = require('utils/react-dnd-context');
const MailConnections = require('collections/mail/global-singletons/mail-connections');
const _ = require('lodash');
const Template = require('./index.html');

module.exports = ServiceLoader.extend({
	component: 'email-components:templates',
	serviceName: 'email-components-templates',
	template: _.template(Template),

	initialize: function(options) {
		this.options = options || {};
		this.editors = options.editors;
		this.activeEditorName = options.activeEditorName;
		this.saveDraft = options.saveDraft;
		this.getComposerData = options.getComposerData;
		this.draftModel = options.draftModel;
		this.setSubject = options.setSubject;
		this.fieldPickerEl = options.fieldPickerEl;
		this.hideDealFields = options.hideDealFields;
		this.hideLeadFields = options.hideLeadFields;
		this.labelClass = options.labelClass;

		ServiceLoader.prototype.initialize.apply(this, this.options);
	},

	renderPage: async function(servicePage, element) {
		this.servicePage = await servicePage({
			mailCollections: MailConnections,
			templatePickerEl: element,
			fieldPickerEl: this.fieldPickerEl,
			api: new WebappApi(),
			viewPath: window.location.pathname,
			editors: this.editors,
			activeEditorName: this.activeEditorName,
			saveDraft: this.saveDraft,
			draftModel: this.draftModel,
			getComposerData: this.getComposerData,
			setSubject: this.setSubject,
			hideDealFields: this.hideDealFields,
			hideLeadFields: this.hideLeadFields,
			labelClass: this.labelClass,
			getDragDropContext,
			// Try to see if the there is a parent modal. If so then provide it as popoverPortalTo
			popoverPortalTo: this.$el.closest('.cui4-modal').get(0)
		});

		app.router.on('route', () => {
			const newPath = window.location.pathname;

			this.servicePage.route(newPath);
		});
	},

	onUnload: function() {
		if (this.servicePage) {
			this.servicePage.unmount();
		}
	},

	afterRender() {
		if (this.error && this.options.onError) {
			this.options.onError();
		}
	},

	getErrorMessage: function() {
		return _.gettext('Composer templates module temporarily unavailable');
	}
});
