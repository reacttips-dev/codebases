const ServiceLoader = require('components/service-loader/index');
const _ = require('lodash');
const WebappApi = require('webapp-api/index');
const template = require('./index.html');

module.exports = ServiceLoader.extend({
	serviceName: 'Scheduler service',
	component: 'scheduler-service-assets:schedule-picker',
	template: _.template(template),

	initialize: function(options) {
		this.options = options || {};
		this.popoverButtonTemplate = options.popoverButtonTemplate;
		this.popoverPlacement = options.popoverPlacement;
		this.onLinkInsert = options.onLinkInsert;
		this.connectedToEmail = options.connectedToEmail;
		this.entryPointName = options.entryPointName;
		this.openOnLoad = options.openOnLoad;
		this.hideAdhocOptions = options.hideAdhocOptions;
		// 'modal' or 'popover'
		this.type = options.type;
		this.fontPickersEnabled = options.fontPickersEnabled;

		ServiceLoader.prototype.initialize.apply(this, this.options);
	},

	renderPage: function({ schedulePickerRenderer }) {
		this.schedulePicker = schedulePickerRenderer({
			el: this.$el.get(0),
			popoverButtonHTML: this.popoverButtonTemplate({
				fontPickersEnabled: this.fontPickersEnabled
			}),
			popoverPlacement: this.popoverPlacement,
			api: new WebappApi(),
			onLinkInsert: this.onLinkInsert,
			connectedToEmail: this.connectedToEmail,
			entryPointName: this.entryPointName,
			type: this.type,
			openOnLoad: this.openOnLoad,
			hideAdhocOptions: this.hideAdhocOptions
		});
	},

	rerender: function() {
		if (this.schedulePicker) {
			this.schedulePicker.render();
		}
	},

	onUnload: function() {
		if (this.schedulePicker) {
			this.schedulePicker.destroy();
		}
	},

	afterRender() {
		if (this.error && _.isFunction(this.options.onError)) {
			this.options.onError();
		}
	},

	getMicroFEProps() {
		return {
			popoverButtonHTML: this.popoverButtonTemplate({
				fontPickersEnabled: this.fontPickersEnabled
			}),
			popoverPlacement: this.popoverPlacement,
			onLinkInsert: this.onLinkInsert,
			connectedToEmail: this.connectedToEmail,
			entryPointName: this.entryPointName,
			type: this.type,
			openOnLoad: this.openOnLoad,
			hideAdhocOptions: this.hideAdhocOptions
		};
	}
});
